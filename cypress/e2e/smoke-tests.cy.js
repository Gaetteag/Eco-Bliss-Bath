import { userData } from '../support/config';
import { login } from './connexion-fonction';

function productDetails() {
  cy.request("GET", `${Cypress.config('apiUrl')}/products`).then((response) => {
    expect(response.status).to.eq(200);
    response.body.forEach((product) => {
      const productUrl = `${Cypress.config('baseUrl')}/products/${product.id}`;
      cy.visit(productUrl);
      cy.getBySel('detail-product-name')
        .should('be.visible')
        .should('contain', product.name);
    });
  });
};

describe('Smoke tests', () => {
  it("Vérifie la présence des champs et boutons de connexion", () => {      
    cy.visit(`${Cypress.config('baseUrl')}/login`);
    cy.getBySel('login-input-username').should('be.visible');
    cy.getBySel('login-input-password').should('be.visible');
    cy.getBySel('login-submit').should('be.visible');
  }); 

  
  it("Vérifie la présence des boutons d'ajout au panier après connexion pour tous les produits", () => {
    login(userData.userEmail, userData.userPassword);
    productDetails()
    cy.getBySel('detail-product-add').should('be.visible');
  });

  it("Vérifie la présence du champ de disponibilité du produit pour tous les produits", () => { 
    productDetails()
    cy.getBySel('detail-product-stock').should('be.visible');       
  });

  it("Vérifie la présence des champs et boutons d'inscription", () => {
    cy.visit(`${Cypress.config('baseUrl')}/register`);
    cy.getBySel('register-input-lastname').should('be.visible');
    cy.getBySel('register-input-firstname').should('be.visible');
    cy.getBySel('register-input-email').should('be.visible');
    cy.getBySel('register-input-password').should('be.visible');
    cy.getBySel('register-input-password-confirm').should('be.visible');
    cy.getBySel('register-submit').should('be.visible');
  }); 
});