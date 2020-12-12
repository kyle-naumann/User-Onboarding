describe("Testing form inputs", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001");
  });

  it("Adds text to inputs and submits form", () => {
    // name input
    cy.get("[data-cy=name]")
        .type("Kyle")
        .should("have.value", "Kyle");
    // email input
    cy.get("[data-cy=email]")
        .type("test@gmail.com")
        .should("have.value", "test@gmail.com");
    // password input
    cy.get("[data-cy=password]")
        .type("password")
        .should("have.value", "password");
    // terms checkbox
    cy.get("[data-cy=terms]")
        .check()
        .should("be.checked");
    // submit
    cy.get('[data-cy=submit]').click();
  });
});
