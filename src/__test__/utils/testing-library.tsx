/* eslint-disable import/export */

import type { ReactNode, ReactElement } from 'react';

import { render, RenderOptions } from '@testing-library/react';

import { AuthContextProvider } from '../../contexts/AuthContext';

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return <AuthContextProvider>{children}</AuthContextProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
