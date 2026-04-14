import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const BACKEND_URL = process.env.REACT_APP_API || 'http://localhost:8000/api/';
const BACKEND_HEALTH_ENDPOINT = `${BACKEND_URL}settings`;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

// Path to backend database
const BACKEND_DB_PATH = path.resolve(__dirname, '../../strichliste-backend/var/data.db');

function resetDatabase(): void {
  if (!fs.existsSync(BACKEND_DB_PATH)) {
    console.log('⚠️ Database file not found, skipping reset');
    return;
  }

  try {
    console.log('🗑️  Cleaning up test data from database...');

    // Write SQL to a temp file to avoid shell escaping issues
    const sqlContent = `
-- Delete transactions for test users
DELETE FROM transactions WHERE user_id IN (SELECT id FROM user WHERE name LIKE 'e2e%' OR name LIKE 'articleUser%' OR name LIKE 'edited%' OR name LIKE 'sendTo%' OR name LIKE 'testuser%');
-- Delete test users
DELETE FROM user WHERE name LIKE 'e2e%' OR name LIKE 'articleUser%' OR name LIKE 'edited%' OR name LIKE 'sendTo%' OR name LIKE 'testuser%';
-- Delete test articles
DELETE FROM article WHERE name LIKE 'e2e%' OR name LIKE 'edited%';
`;

    const sqlFilePath = path.join(__dirname, '.cleanup.sql');
    fs.writeFileSync(sqlFilePath, sqlContent);

    execSync(`sqlite3 "${BACKEND_DB_PATH}" < "${sqlFilePath}"`, { stdio: 'inherit' });

    // Clean up temp file
    fs.unlinkSync(sqlFilePath);

    // Get remaining counts
    const userCount = execSync(`sqlite3 "${BACKEND_DB_PATH}" "SELECT COUNT(*) FROM user;"`, { encoding: 'utf-8' }).trim();
    console.log(`✅ Database cleaned. Remaining users: ${userCount}`);
  } catch (error) {
    console.warn('⚠️ Database cleanup failed:', error instanceof Error ? error.message : error);
  }
}

async function checkBackendHealth(retries = MAX_RETRIES): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(BACKEND_HEALTH_ENDPOINT, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend API is available');
        console.log(`   API URL: ${BACKEND_URL}`);
        console.log(`   Settings loaded: ${data ? 'yes' : 'no'}`);
        return true;
      }

      console.log(`⚠️ Backend returned status ${response.status}, retrying...`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`⚠️ Backend connection attempt ${i + 1}/${retries} failed: ${errorMessage}`);
    }

    if (i < retries - 1) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
  return false;
}

async function checkTransactionCapability(): Promise<{ working: boolean; error?: string }> {
  const testUserName = `e2eSetupTest${Date.now()}`;

  try {
    // Create a test user
    const userResponse = await fetch(`${BACKEND_URL}user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name: testUserName }),
    });

    if (!userResponse.ok) {
      return { working: false, error: `Failed to create test user: ${userResponse.status}` };
    }

    const userData = await userResponse.json();
    const userId = userData.user?.id;

    if (!userId) {
      return { working: false, error: 'User creation response missing user ID' };
    }

    // Try to create a transaction
    const txResponse = await fetch(`${BACKEND_URL}user/${userId}/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ amount: 100 }),
    });

    // Backend may output PHP warnings/deprecation notices before JSON
    // Try to extract JSON from the response
    const txText = await txResponse.text();
    let txData;
    try {
      // Try to find JSON in the response (may have HTML warnings before it)
      const jsonMatch = txText.match(/\{[\s\S]*\}$/);
      if (jsonMatch) {
        txData = JSON.parse(jsonMatch[0]);
      } else {
        txData = JSON.parse(txText);
      }
    } catch (parseError) {
      return { working: false, error: `Failed to parse transaction response: ${txText.slice(0, 200)}` };
    }

    if (!txResponse.ok || txData.error) {
      const errorMsg = txData.error?.message || txData.error?.class || `HTTP ${txResponse.status}`;
      // Clean up: disable the test user
      await fetch(`${BACKEND_URL}user/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ isDisabled: true }),
      }).catch(() => {});
      return { working: false, error: `Transaction API error: ${errorMsg}` };
    }

    // Clean up: undo transaction and disable user
    const txId = txData.transaction?.id;
    if (txId) {
      await fetch(`${BACKEND_URL}user/${userId}/transaction/${txId}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
      }).catch(() => {});
    }

    await fetch(`${BACKEND_URL}user/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ isDisabled: true }),
    }).catch(() => {});

    return { working: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { working: false, error: `Transaction check failed: ${errorMessage}` };
  }
}

async function globalSetup(config: FullConfig): Promise<void> {
  console.log('\n🔍 Running E2E test setup...\n');

  // Clean up test data from previous runs
  resetDatabase();

  console.log('🔍 Checking backend availability...\n');
  const isBackendAvailable = await checkBackendHealth();

  if (!isBackendAvailable) {
    console.error('\n' + '='.repeat(70));
    console.error('❌ BACKEND API IS NOT AVAILABLE');
    console.error('='.repeat(70));
    console.error(`\nCould not connect to backend at: ${BACKEND_URL}`);
    console.error('\nPlease ensure the backend server is running:');
    console.error('  cd ../strichliste-backend');
    console.error('  /opt/homebrew/opt/php@8.1/bin/php -S localhost:8000 -t public');
    console.error('\nOr check if the API URL is configured correctly in .env.development');
    console.error('='.repeat(70) + '\n');

    // Exit with error to stop all tests
    process.exit(1);
  }

  // Verify transactions work (fail fast if backend is misconfigured)
  console.log('🔍 Verifying transaction API capability...');
  const txStatus = await checkTransactionCapability();

  if (txStatus.working) {
    console.log('✅ Transaction API is working');
  } else {
    console.error('\n' + '='.repeat(70));
    console.error('❌ TRANSACTION API IS NOT WORKING');
    console.error('='.repeat(70));
    console.error(`Error: ${txStatus.error}`);
    console.error('\nCheck backend configuration (strichliste.yaml) for transaction limits.');
    console.error('='.repeat(70) + '\n');
    process.exit(1);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Backend check passed - proceeding with E2E tests');
  console.log('='.repeat(50) + '\n');
}

export default globalSetup;
