import { userData } from '../support/config';
import { login } from './connexion-fonction';

// Fonction pour extraire le nombre du stock
function extractNumber (stock) {
  const stockNumber = stock.match(/-?\d+/);
  return stockNumber ? parseInt(stockNumber[0], 10) : null;
};

// Variable pour stocker la quantité d'un produit en stock
let initialStock;

// Fonction pour naviguer jusqu'à la page des produits
function navigateToProductsPage() {
  cy.url().should('equal', `${Cypress.config('baseUrl')}/`);
  cy.getBySel('nav-link-products').click();
  cy.url().should('equal', `${Cypress.config('baseUrl')}/products`);
  cy.getBySel('product-link').should('be.visible');
};

// Fonction pour trouver un produit en stock ou non
function findProduct(stockType, minStock = 1, currentIndex = 0) {
  const stockCondition = stockType === 'withStock' 
    ? (stock) => stock >= minStock
    : (stock) => stock < 1 ; 

    return cy.getBySel('product-link')
    .eq(currentIndex)
    .click()
    .then(() => {
      return cy.getBySel('detail-product-stock')
        .should('not.have.text', ' en stock')
        .invoke('text')
        .then((text) => {
          const stock = extractNumber(text);
          if (stockCondition(stock)) {
            return currentIndex; // Produit trouvé
          } else {
            cy.go('back'); // Revenir à la liste des produits
            return cy.getBySel('product-link')
              .its('length')
              .then((length) => {
                if (currentIndex + 1 < length) {
                  return findProduct(stockType, minStock, currentIndex + 1);
                } else {
                  return 'Aucun produit correspondant trouvé';
                }
              });
          }
        });
    });
}


describe("Panier", () => {
  beforeEach(() => {
    login(userData.userEmail, userData.userPassword);
  });

  it("Ajoute un produit disponible au panier et vérifie que le stock ne bouge pas", () => {
    navigateToProductsPage();

    // Trouve un produit avec du stock
    findProduct('withStock').then(() => {
      cy.getBySel('detail-product-stock')
        .should('not.have.text', 'en stock')
        .invoke('text')
        .then((text) => {
          initialStock = extractNumber(text);
        }).then(() => {
          expect(initialStock).to.be.greaterThan(0);
        });

      cy.getBySel('detail-product-add').click();
      cy.url().should('equal', `${Cypress.config('baseUrl')}/cart`);

      cy.go('back');

      cy.getBySel('detail-product-stock')
        .should('not.have.text', ' en stock')
        .invoke('text')
        .then((text) => {
          // Extrait le stock actuel
          const currentStock = extractNumber(text);
          // Vérifie que le stock n'a pas changé
          expect(currentStock).to.equal(initialStock);
        });
    });
  });

  it("Ne permet pas d'ajouter une quantité négative au panier", () => {
    navigateToProductsPage();

    findProduct('withStock').then(() => {
      cy.getBySel('detail-product-quantity')
        .clear()
        .type('-1');
      cy.getBySel('detail-product-form')
        .should('have.class', 'ng-invalid');
    });
  });

    it("Ne permet pas d'ajouter une quantité nulle au panier", () => {
      navigateToProductsPage('withStock');

    findProduct('withStock').then(() => {
      cy.getBySel('detail-product-quantity')
        .clear()
        .type('0');
      cy.getBySel('detail-product-form')
        .should('have.class', 'ng-invalid');
    });
  });
});
