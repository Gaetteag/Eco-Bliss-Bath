function login(username, password) {
  cy.visit(Cypress.config('baseUrl'));
  cy.getBySel('nav-link-login').click();
  cy.url().should('equal', `${Cypress.config('baseUrl')}/login`);
  cy.getBySel('login-input-username').type(username);
  cy.getBySel('login-input-password').type(password);
  cy.getBySel('login-submit').click();
}

export { login };