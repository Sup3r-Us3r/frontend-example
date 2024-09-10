import { fireEvent, render, screen } from '../__test__/utils/testing-library';
import { Button } from './Button';

describe('Button component', () => {
  it('should be able to render button component with default props', () => {
    render(<Button>Button test</Button>);

    const button: HTMLButtonElement = screen.getByText('Button test');

    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle({
      backgroundColor: 'purple',
    });
  });

  it('should be able to render button component with loading state and show loading message', () => {
    render(<Button isLoading>Button test</Button>);

    const button: HTMLButtonElement = screen.getByRole('button');

    expect(button.textContent).toBe('Loading...');
  });

  it('should be able to render button component with color="blue"', () => {
    render(<Button color="blue">Button test</Button>);

    const button: HTMLButtonElement = screen.getByText('Button test');

    expect(button).toHaveStyle({
      backgroundColor: 'blue',
    });
  });

  it('should be able to call any function when button click', () => {
    const buttonFunction = jest.fn();

    render(<Button onClick={buttonFunction}>Button test</Button>);

    const button: HTMLButtonElement = screen.getByText('Button test');

    fireEvent.click(button);

    expect(buttonFunction).toHaveBeenCalled();
  });
});
