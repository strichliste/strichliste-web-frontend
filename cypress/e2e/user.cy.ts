import { en } from '../../src/locales/en';
import {
  createUser,
  cleanUpUser,
  selectUserByModal,
  goToUserBySearch,
} from '../common';

const testUser = 'testUser';
const sendToUser = 'sendToUser';
const splitMoneyUser = 'splitMoneyUser';
const editedUser = 'sendToUserEdited';
const dateString = new Date().toISOString();
const sessionUserName = testUser + dateString;
const sendToUserName = sendToUser + dateString;
const editedUserName = editedUser + dateString;
const splitMoneyUserName = splitMoneyUser + dateString;

describe('user', () => {
  it('basic user flow works', () => {
    cy.visit('/');

    // create user and navigate to detail page on success
    createUser(sessionUserName);
    cy.wait(100);

    cy.findByText((content) => content.startsWith(testUser));
    cy.findByText(en.TRANSACTION_EMPTY_STATE);
    cy.findByTitle(en.BALANCE_TITLE).contains('€0.00');

    // create transaction buttons do work
    cy.findByText('+€1.00').click();
    cy.findByTitle(en.BALANCE_TITLE).contains('+€1.00');
    cy.findByText('-€1.00').click();
    cy.findByTitle(en.BALANCE_TITLE).contains('€0.00');

    // go to transaction is displayed
    cy.findByText(en.USER_TRANSACTIONS_LINK).should('be.visible');

    // custom transaction form is working
    cy.findByTitle(en.BALANCE_DEPOSIT).should('be.disabled');
    cy.findByTitle(en.BALANCE_DISPENSE).should('be.disabled');
    cy.findByPlaceholderText(en.BALANCE_PLACEHOLDER).type('500');
    cy.findByTitle(en.BALANCE_DEPOSIT).should('not.be.disabled');
    cy.findByTitle(en.BALANCE_DISPENSE).should('not.be.disabled');
    cy.findByTitle(en.BALANCE_DEPOSIT).click();
    cy.findByTitle(en.BALANCE_TITLE).contains('+€5.00');
    cy.findByPlaceholderText(en.BALANCE_PLACEHOLDER).type('500');
    cy.findByTitle(en.BALANCE_DISPENSE).click();
    cy.findByTitle(en.BALANCE_TITLE).contains('€0.00');
  });

  it('search works', () => {
    goToUserBySearch(sessionUserName);
  });

  it('send money works', () => {
    cy.visit('/');
    createUser(sendToUserName);
    cy.findByText(en.USER_TRANSACTION_CREATE_LINK).click();
    cy.findByTitle(en.USER_TRANSACTION_CREATE_SUBMIT_TITLE).should(
      'be.disabled'
    );
    cy.findByPlaceholderText(en.USER_TRANSACTION_FROM_AMOUNT_LABEL).type('500');

    cy.findByText(en.CREATE_USER_TO_USER_TRANSACTION_USER).click();
    cy.wait(10);
    selectUserByModal(sessionUserName);

    cy.findByPlaceholderText(en.CREATE_USER_TO_USER_TRANSACTION_COMMENT).type(
      'a test comment'
    );
    cy.findByTitle(en.USER_TRANSACTION_CREATE_SUBMIT_TITLE).click();
    cy.findByText(/You sent User/).should('be.visible');
  });

  it('edit user works', () => {
    const editMail = 'test@test.de';
    goToUserBySearch(sessionUserName);
    cy.findByText(en.USER_EDIT_LINK).click();
    cy.findByPlaceholderText(en.USER_EDIT_NAME_LABEL)
      .clear()
      .type(editedUserName);
    cy.findByPlaceholderText(en.USER_EDIT_MAIL_LABEL).type(editMail);
    cy.findByTitle(en.USER_EDIT_TRIGGER).click();
    cy.visit('/');
    cy.wait(100);
    goToUserBySearch(editedUserName);
    cy.findByText(en.USER_EDIT_LINK).click();
    cy.findByDisplayValue(editMail).should('be.visible');
  });

  it('split money works', () => {
    cy.visit('/');
    createUser(splitMoneyUserName);
    cy.findByText(en.SPLIT_INVOICE_LINK).click();
    cy.findByPlaceholderText('amount').type('900');
    cy.findByText('select recipient').click();
    selectUserByModal(splitMoneyUserName);
    cy.findByPlaceholderText('comment').type('test');
    cy.findByText('add participant').click();
    selectUserByModal(editedUserName);
    cy.findByText(editedUserName).click();
    cy.findByText('add participant').click();
    selectUserByModal(sendToUserName);

    cy.findByText('3 participants split +€9.00').should('be.visible');
    cy.findByText((content) =>
      content.startsWith('everybody has to pay +€3.00 to')
    ).should('be.visible');
    cy.findByTitle(en.SPLIT_INVOICE_SUBMIT).click();
  });

  it('disables test users', () => {
    cleanUpUser(editedUserName);
    cleanUpUser(sendToUserName);
    cleanUpUser(splitMoneyUserName);
  });
});
