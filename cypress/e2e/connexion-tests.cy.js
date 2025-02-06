import { userData } from '../support/config';
import { login } from './connexion-fonction';

describe("Tests de connexion", () => {
  it("Connexion réussie avec des identifiants valides", () => { 
    login(userData.userEmail, userData.userPassword);
    cy.url().should('equal', `${Cypress.config('baseUrl')}/`);
    cy.contains('Mon panier').should('be.visible');
  });

  it("Vérifie que la connexion échoue avec un mauvais mot de passe", () => {   
    login(userData.userEmail, userData.userPasswordFalse);
    cy.contains('Identifiants incorrects').should('be.visible');
  });
});