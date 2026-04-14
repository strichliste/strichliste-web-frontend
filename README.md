# Strichliste Web Frontend [![Build Status](https://travis-ci.org/strichliste/strichliste-web-frontend.svg?branch=master)](https://travis-ci.org/strichliste/strichliste-web-frontend)

SPA Frontend for the [Strichliste](http://v2.strichliste.org/) project

## Getting Started

This project is build with [typescript](https://www.typescriptlang.org/), [react](https://reactjs.org/), [redux](https://redux.js.org/), [emotion](https://emotion.sh/) and [create-react-app](https://github.com/facebook/create-react-app).

### Prerequisites

You have to use [yarn](https://yarnpkg.com/lang/en/) to build this project.

### Installing

Fetch all dependencies by

```
yarn install
```

Start the development server by

```
yarn start
```

Build the project by

```
yarn build
```

the output will be copied to the dist folder.

## Contributing / FAQ

### Commit Messages

please follow the [angular commit message guidlines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines)

### Ui Component Framework

all basic components are found inside the `src/bricks` folder. (Lego pun intended)

## Testing

### Unit Tests

Run unit tests with Jest:

```bash
yarn test             # Watch mode
yarn test --coverage  # Single run with coverage
```

### End-to-End Tests

E2E tests use [Playwright](https://playwright.dev/) and are located in the `e2e/` directory.

```bash
# Run all E2E tests (starts dev server automatically)
yarn test:e2e

# Run with Playwright UI for debugging
yarn test:e2e:ui

# Run specific test file
npx playwright test user.spec.ts

# Run specific test by name
npx playwright test --grep "create user"
```

**Prerequisites:** The backend API must be running on `http://localhost:8080`:
```bash
cd ../strichliste-backend
php -S 0.0.0.0:8080 -t public
```

**Test structure:**
- `e2e/user.spec.ts` - User management flows
- `e2e/article.spec.ts` - Article/product management
- `e2e/transaction.spec.ts` - Transaction and payment flows
- `e2e/fixtures/test-helpers.ts` - Shared test utilities
