import { en } from '../../src/locales/en';
import { createUser, cleanUpUser } from '../common';

const dateString = new Date().toISOString();
const testUser = 'testArticleUser';
const testArticle = 'testArticle' + dateString;
const editArticle = 'editArticle' + dateString;
const testArticleTag = 'testTag' + dateString;
const testArticleBarcode = 'testBarcode' + dateString;

const sessionUserName = testUser + dateString;

describe('article', () => {
  it('create article works', () => {
    cy.visit('#!/articles/active');
    cy.findByTitle(en.ARTICLE_ADD_LINK).click();

    // add article
    cy.findByLabelText(en.ARTICLE_ADD_FORM_NAME_LABEL).type(testArticle);
    cy.findByLabelText(en.ARTICLE_ADD_FORM_AMOUNT_LABEL).type('500');
    cy.findByTitle(en.ARTICLE_ADD_FROM_ACCEPT).click();
    cy.wait(100);

    // add tag
    cy.findByText(en.ARTICLE_FORM_ADD_TAG).click();
    cy.findByPlaceholderText(en.ADD_TAG_PLACEHOLDER)
      .type(testArticleTag)
      .type('{enter}');

    // add barcode
    cy.findByText(en.ARTICLE_FORM_ADD_BARCODE).click();
    cy.findByPlaceholderText(en.ARTICLE_FORM_ADD_BARCODE)
      .type(testArticleBarcode)
      .type('{enter}');
  });

  it('lets user buy article', () => {
    // create user without transactions
    cy.visit('/');
    createUser(sessionUserName);
    cy.findByTitle(en.BALANCE_TITLE).contains('€0.00');

    // buy article via form
    cy.findByText(en.USER_ARTICLE_LINK).click();
    cy.findByPlaceholderText(en.BUY_ARTICLE_PLACEHOLDER).type(testArticle);
    cy.findByText(`${testArticle} | €5.00`).click();
    cy.wait(100);
    cy.findByTitle(en.BALANCE_TITLE).contains('€5.00');
    cy.queryByText('You have no transactions yet :,(').should('not.be.visible');

    // undo transaction
    cy.findByText(en.USER_TRANSACTION_UNDO).click();
    cy.findByTitle(en.BALANCE_TITLE).contains('€0.00');

    // buy article by scanner
    cy.get('body').type(`${testArticleBarcode}{enter}`);
    // scanning nonsense doesnt trigger a transaction
    cy.get('body').type(`sdlfhsdfkjhsdkfhsdkjh{enter}`);
    cy.findByTitle(en.BALANCE_TITLE).contains('€5.00');

    cleanUpUser(sessionUserName);
  });

  it('finds article by tag and deletes tag barcode and article', () => {
    cy.visit('#!/articles/active');
    cy.findByText(testArticleTag).click();
    cy.wait(100);
    cy.findByText(`${testArticle}`).click();

    // edit article works
    cy.findByLabelText(en.ARTICLE_ADD_FORM_NAME_LABEL).type(editArticle);
    cy.findByLabelText(en.ARTICLE_ADD_FORM_AMOUNT_LABEL).clear().type('800');
    cy.findByTitle(en.ARTICLE_ADD_FROM_ACCEPT).click();

    // edited article still has tags and barcode
    cy.findByText(en.ARTICLE_ADD_FORM_DETAILS);
    cy.queryAllByTitle(en.DELETE_ITEM).click({ multiple: true });
    cy.findByText(en.DELETE_ARTICLE_LABEL).click();
  });
});
