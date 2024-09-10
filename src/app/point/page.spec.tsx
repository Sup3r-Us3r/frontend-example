import type { MouseEvent } from 'react';

import {
  render,
  screen,
  fireEvent,
} from '../../__test__/utils/testing-library';
import PointPage from './page';

describe('Point Page tests', () => {
  it('should be able render point page correctly', () => {
    render(<PointPage />);

    expect(screen).toBeDefined();
  });

  it('should be able create a new points when click on screen', () => {
    render(<PointPage />);

    const pointsContainer: HTMLDivElement =
      screen.getByTestId('points-container');

    fireEvent.mouseUp(pointsContainer, {
      clientX: 10,
      clientY: 10,
    } as MouseEvent<HTMLDivElement>);
    fireEvent.mouseUp(pointsContainer, {
      clientX: 20,
      clientY: 20,
    } as MouseEvent<HTMLDivElement>);
    fireEvent.mouseUp(pointsContainer, {
      clientX: 30,
      clientY: 30,
    } as MouseEvent<HTMLDivElement>);

    const point1: HTMLDivElement = screen.getByTestId('point-1');
    const point2: HTMLDivElement = screen.getByTestId('point-2');
    const point3: HTMLDivElement = screen.getByTestId('point-3');

    expect(pointsContainer).toContainElement(point1);
    expect(pointsContainer).toContainElement(point2);
    expect(pointsContainer).toContainElement(point3);
  });

  it('should be able to reset all points created when clicking reset button', () => {
    render(<PointPage />);

    const pointsContainer: HTMLDivElement =
      screen.getByTestId('points-container');

    const resetButton: HTMLButtonElement = screen.getByText('Reset');

    fireEvent.mouseUp(pointsContainer, {
      clientX: 10,
      clientY: 10,
    } as MouseEvent<HTMLDivElement>);
    fireEvent.click(resetButton);

    const point1: HTMLDivElement | null = screen.queryByTestId('point-1');

    expect(pointsContainer).not.toContainElement(point1);
  });

  it('should be able to undo the last point created', () => {
    render(<PointPage />);

    const pointsContainer: HTMLDivElement =
      screen.getByTestId('points-container');

    const undoPointButton: HTMLButtonElement = screen.getByTestId('undo-point');

    fireEvent.mouseUp(pointsContainer, {
      clientX: 10,
      clientY: 10,
    } as MouseEvent<HTMLDivElement>);
    fireEvent.mouseUp(pointsContainer, {
      clientX: 20,
      clientY: 20,
    } as MouseEvent<HTMLDivElement>);
    fireEvent.click(undoPointButton);

    const point1: HTMLDivElement | null = screen.queryByTestId('point-1');
    const point2: HTMLDivElement | null = screen.queryByTestId('point-2');

    expect(pointsContainer).toContainElement(point1);
    expect(pointsContainer).not.toContainElement(point2);
  });

  it('should be able to undo the last point created when using control + z combination', () => {
    render(<PointPage />);

    const pointsContainer: HTMLDivElement =
      screen.getByTestId('points-container');

    fireEvent.mouseUp(pointsContainer, {
      clientX: 10,
      clientY: 10,
    } as MouseEvent<HTMLDivElement>);
    fireEvent.mouseUp(pointsContainer, {
      clientX: 20,
      clientY: 20,
    } as MouseEvent<HTMLDivElement>);
    fireEvent.keyDown(window, {
      ctrlKey: true,
      key: 'z',
    } as globalThis.KeyboardEvent);

    const point1: HTMLDivElement | null = screen.queryByTestId('point-1');
    const point2: HTMLDivElement | null = screen.queryByTestId('point-2');

    expect(pointsContainer).toContainElement(point1);
    expect(pointsContainer).not.toContainElement(point2);
  });

  it('should be able to redo the last point removed', () => {
    render(<PointPage />);

    const pointsContainer: HTMLDivElement =
      screen.getByTestId('points-container');

    const undoPointButton: HTMLButtonElement = screen.getByTestId('undo-point');
    const redoPointButton: HTMLButtonElement = screen.getByTestId('redo-point');

    // point-1
    fireEvent.mouseUp(pointsContainer, {
      clientX: 10,
      clientY: 10,
    } as MouseEvent<HTMLDivElement>);

    // point-2
    fireEvent.mouseUp(pointsContainer, {
      clientX: 20,
      clientY: 20,
    } as MouseEvent<HTMLDivElement>);

    // point-3
    fireEvent.mouseUp(pointsContainer, {
      clientX: 30,
      clientY: 30,
    } as MouseEvent<HTMLDivElement>);

    // Remove third and second point created
    fireEvent.click(undoPointButton);
    fireEvent.click(undoPointButton);

    const point1: HTMLDivElement | null = screen.queryByTestId('point-1');
    const point2: HTMLDivElement | null = screen.queryByTestId('point-2');
    const point3: HTMLDivElement | null = screen.queryByTestId('point-3');

    expect(pointsContainer).toContainElement(point1);
    expect(pointsContainer).not.toContainElement(point2);
    expect(pointsContainer).not.toContainElement(point3);

    // Restore removed third and second point
    fireEvent.click(redoPointButton);
    fireEvent.click(redoPointButton);

    expect(pointsContainer).toContainElement(screen.queryByTestId('point-3'));
    expect(pointsContainer).toContainElement(screen.queryByTestId('point-2'));
  });

  it('should be to return the original state of points when there are no points to be redone.', () => {
    render(<PointPage />);

    const pointsContainer: HTMLDivElement =
      screen.getByTestId('points-container');

    const redoPointButton: HTMLButtonElement = screen.getByTestId('redo-point');

    fireEvent.click(redoPointButton);

    expect(pointsContainer.children.length).toBe(0);
  });
});
