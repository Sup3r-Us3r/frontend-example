/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-ignore
describe('Point page E2E', () => {
  beforeEach(() => {
    cy.visit('/point');
  });

  it('should be able to create a new point', () => {
    const pointCoordinateYCompensation = 78;

    const points: Array<{ x: number; y: number }> = [
      { x: 80, y: 175 + pointCoordinateYCompensation },
      { x: 170, y: 75 + pointCoordinateYCompensation },
      { x: 80, y: 75 + pointCoordinateYCompensation },
      { x: 100, y: 185 + pointCoordinateYCompensation },
      { x: 125, y: 190 + pointCoordinateYCompensation },
      { x: 150, y: 185 + pointCoordinateYCompensation },
      { x: 170, y: 165 + pointCoordinateYCompensation },
    ];

    points.forEach((point, index) => {
      cy.get('[data-testid="points-container"]')
        .trigger('mouseup', {
          clientX: point.x,
          clientY: point.y,
          force: true,
        })
        .children()
        .should('have.length', index + 1);
    });
  });

  it('should be able to undo last point', () => {
    cy.get('[data-testid="points-container"]').trigger('mouseup', {
      clientX: 80,
      clientY: 230,
      force: true,
    });

    cy.get('[data-testid="point-1"]').should('exist');
    cy.get('[data-testid="undo-point"]').focus().click({ force: true });
    cy.get('[data-testid="points-container"]')
      .children()
      .should('have.length', 0);
  });

  it('should be able to redo last point', () => {
    cy.get('[data-testid="points-container"]').trigger('mouseup', {
      clientX: 80,
      clientY: 230,
      force: true,
    });

    cy.get('[data-testid="point-1"]').should('exist');
    cy.get('[data-testid="undo-point"]').focus().click({ force: true });
    cy.get('[data-testid="point-1"]').should('not.exist');
    cy.get('[data-testid="points-container"]')
      .children()
      .should('have.length', 0);

    cy.get('[data-testid="redo-point"]').focus().click({ force: true });
    cy.get('[data-testid="point-1"]').should('exist');
    cy.get('[data-testid="points-container"]')
      .children()
      .should('have.length', 1);
  });

  it('should be able to remove all points on screen', () => {
    cy.get('[data-testid="points-container"]').trigger('mouseup', {
      clientX: 80,
      clientY: 230,
      force: true,
    });
    cy.get('[data-testid="points-container"]').trigger('mouseup', {
      clientX: 170,
      clientY: 75,
      force: true,
    });

    cy.get('[data-testid="points-container"]')
      .children()
      .should('have.length', 2);

    cy.get('[data-testid="reset-button"]').focus().click({ force: true });

    cy.get('[data-testid="points-container"]')
      .children()
      .should('have.length', 0);
  });
});
