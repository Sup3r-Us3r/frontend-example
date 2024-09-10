import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  color?: 'purple' | 'blue';
}

const Button = ({
  children,
  isLoading = false,
  color = 'purple',
  ...props
}: IButtonProps) => {
  return (
    <button style={{ backgroundColor: color }} {...props}>
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export { Button };
