describe('Login page E2E', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should be able to access login page', () => {
    cy.get('#username-input')
      .type('kminchelle')
      .should('have.value', 'kminchelle');
    cy.get('#password-input').type('0lelplR').should('have.value', '0lelplR');
    cy.get('button').click();
    cy.url().should('eq', 'http://localhost:3000/');
  });
});
