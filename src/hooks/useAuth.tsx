import { useContext } from 'react';

import { AuthContext, IAuthContextData } from '../contexts/AuthContext';

function useAuth(): IAuthContextData {
  return useContext(AuthContext);
}

export { useAuth };
