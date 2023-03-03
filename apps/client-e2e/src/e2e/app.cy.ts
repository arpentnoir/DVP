describe('client app', () => {

  ///Placeholder
  it('should open to login page', () => {
    cy.visit('/issue');
    cy.get('label').contains('Username');
    cy.get('label').contains('Password');
  });
});
