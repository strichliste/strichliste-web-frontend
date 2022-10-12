import { en } from '../src/locales/en';

export const createUser = (name: string) => {
  cy.findByTitle(en.USER_CREATE_NAME_LABEL).click();
  cy.findByPlaceholderText(en.USER_CREATE_NAME_LABEL).type(`${name}{enter}`);
};

export function selectUserByModal(name: string) {
  cy.findByPlaceholderText(en.SEARCH).type(name);
  cy.findByText(name).click();
}

export function cleanUpUser(name: string) {
  goToUserBySearch(name);
  cy.findByText(en.USER_EDIT_LINK).click();
  cy.findByLabelText(en.USER_EDIT_ACTIVE_LABEL).click();
  cy.findByText(en.USER_EDIT_ACTIVE_WARNING).should('be.visible');
  cy.findByTitle(en.USER_EDIT_TRIGGER).click();
}

export function goToUserBySearch(name: string) {
  cy.visit('/');
  cy.findByText(en.SEARCH).click();
  cy.findByPlaceholderText(en.SEARCH).type(name);
  cy.findByText(name).click();
}
