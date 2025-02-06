import { userData } from '../support/config';

describe("API Tests", () => {
    let authToken = '';

    before(() => {
        cy.request({
            method: 'POST', 
            url: `${Cypress.config('apiUrl')}/login`,
            body: {
                username: userData.userEmail,
                password: userData.userPassword
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            authToken = response.body.token;
        });
    });

    ///////////////////////////// Données confidentielles //////////////////////////////
    describe("Données confidentielles avant connexion", () => {
            it('Requête sur les données confidentielles avant connexion', () => {
            cy.request({
                method: 'GET',
                url: `${Cypress.config('apiUrl')}/orders`,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(403);
            });
        });
    });

    ////////////////////////////// Panier //////////////////////////////
    describe("Panier", () => {
        beforeEach(() => {
            cy.request({
                method: 'GET',
                url: `${Cypress.config('apiUrl')}/orders`,
                headers: { Authorization: `Bearer ${authToken}` }
            }).then((response) => {
                expect(response.status).to.eq(200);
                const productsInCart = response.body.orderLines;
                if (productsInCart.length > 0) {
                    productsInCart.forEach((product) => {
                        cy.request({
                            method: 'DELETE',
                            url: `${Cypress.config('apiUrl')}/orders/${product.id}/delete`,
                            headers: { Authorization: `Bearer ${authToken}` }
                        }).then((deleteResponse) => {
                            expect(deleteResponse.status).to.eq(200);
                        });
                    });
                }
            });
        });

        it("Ajoute un produit disponible au panier", () => {
            cy.request({
              method: 'POST',
              url: `${Cypress.config('apiUrl')}/orders/add`,
              headers: { Authorization: `Bearer ${authToken}` },
              body: {
                product: 5,
                quantity: 1
              },
              failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('orderLines').that.is.an("array"); 
                const orderLine = response.body.orderLines[0];
                const product = orderLine.product;
                const quantity = orderLine.quantity;
                expect(product).to.have.property('name');
                expect(orderLine).to.have.property('quantity');
                cy.log(`Produit : ${product.name} (Quantité: ${quantity})`);
            });
        });

        it("Ajoute un produit en rupture de stock au panier", () => {
            cy.request({
              method: 'POST',
              url: `${Cypress.config('apiUrl')}/orders/add`,
              headers: { Authorization: `Bearer ${authToken}` },
              body: {
                product: 3,
                quantity: 1
              },
              failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('orderLines'); 
                const orderLine = response.body.orderLines[0];
                const product = orderLine.product;
                const quantity = orderLine.quantity;
                expect(product).to.have.property('name');
                expect(orderLine).to.have.property('quantity');
                cy.log(`Produit : ${product.name} (Quantité: ${quantity})`);
            });
        });
    });

    ////////////////////////////// Fiche produit //////////////////////////////
    describe("Fiche produit", () => {
        it("Récupère toutes les fiches des produits", () => {
            cy.request({
                method: "GET",
                url: `${Cypress.config('apiUrl')}/products`
            }).then((response) => {
                expect(response.status).to.eq(200);
                response.body.forEach((product) => {
                    cy.request({
                        method: "GET",
                        url: `${Cypress.config('apiUrl')}/products/${product.id}`
                    }).then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body).to.have.property("id", product.id).that.is.a('number');
                        expect(response.body).to.have.property("name").that.is.a('string');
                        expect(response.body).to.have.property("availableStock").that.is.a('number');
                        expect(response.body).to.have.property("skin").that.is.a('string');
                        expect(response.body).to.have.property("aromas").that.is.a('string');
                        expect(response.body).to.have.property("ingredients").that.is.a('string');
                        expect(response.body).to.have.property("description").that.is.a('string');
                        expect(response.body).to.have.property("price").that.is.a('number');
                        expect(response.body).to.have.property("picture").that.is.a('string');
                        expect(response.body).to.have.property("varieties").that.is.a('number');
        
                        cy.log(`id : ${response.body.id}`);
                        cy.log(`name : ${response.body.name}`);
                        cy.log(`availableStock : ${response.body.availableStock}`);
                        cy.log(`skin : ${response.body.skin}`);
                        cy.log(`aromas : ${response.body.aromas}`);
                        cy.log(`ingredients : ${response.body.ingredients}`);
                        cy.log(`description : ${response.body.description}`);
                        cy.log(`price : ${response.body.price}€`);
                        cy.log(`picture : ${response.body.picture}`);
                        cy.log(`varieties : ${response.body.varieties}`);
                    });
                });
            });
        });
    });

    ////////////////////////////// Login //////////////////////////////
    describe("Login", () => {
        it("Connexion réussie avec des identifiants valides", () => {
            cy.request({
                method: 'POST', 
                url: `${Cypress.config('apiUrl')}/login`,
                body: {
                    username: userData.userEmail,
                    password: userData.userPassword
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('token');
            });
        });

        it("Echec de connexion avec un JSON invalide", () => {
            cy.request({
                method: 'POST',
                url: `${Cypress.config('apiUrl')}/login`,
                body: "invalid json",
                headers: { 'Content-Type': 'application/json' },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(400);
            });
        });
        
        it("Echec de connexion avec un mauvais mot de passe", () => {
            cy.request({
                method: 'POST',
                url: `${Cypress.config('apiUrl')}/login`,
                body: {
                    username: userData.userEmail,
                    password: userData.userPasswordFalse
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(401);
            });
        });
    });
});