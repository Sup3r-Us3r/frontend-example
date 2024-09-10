import axios from 'axios';
import {
  useState,
  useEffect,
  createContext,
  useCallback,
  type PropsWithChildren,
} from 'react';

import { AppError } from '../errors/AppError';

interface IUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

interface IAuthContextData {
  userData: IUser;
  userLogged: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void | AppError>;
}

const AuthContext = createContext({} as IAuthContextData);

const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [userData, setUserData] = useState<IUser>({} as IUser);
  const [loading, setLoading] = useState<boolean>(false);

  const login = useCallback(
    async (username: string, password: string): Promise<void | AppError> => {
      setLoading(true);

      try {
        const response = await axios.post<IUser>(
          'https://dummyjson.com/auth/login',
          {
            username,
            password,
          },
        );

        window.localStorage.setItem(
          '@learning/userData',
          String(response.data.id),
        );

        setUserData(response.data);
      } catch (error) {
        window.localStorage.removeItem('@learning/userData');

        if (axios.isAxiosError(error) && error.response?.data) {
          return new AppError(error.response.data.message, error.status);
        }

        return new AppError(
          'There was an error logging in, please try again',
          500,
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const userAlreadyLogged = window.localStorage.getItem('@learning/userData');

    if (userAlreadyLogged) {
      setUserData({
        id: 1,
        username: 'user1',
        email: 'user1@mail.com',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'male',
        image: 'https://robohash.org/autquiaut.png?size=50x50&set=set1',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsInVzZXJuYW1lIjoia21pbmNoZWxsZSIsImVtYWlsIjoia21pbmNoZWxsZUBxcS5jb20iLCJmaXJzdE5hbWUiOiJKZWFubmUiLCJsYXN0TmFtZSI6IkhhbHZvcnNvbiIsImdlbmRlciI6ImZlbWFsZSIsImltYWdlIjoiaHR0cHM6Ly9yb2JvaGFzaC5vcmcvYXV0cXVpYXV0LnBuZz9zaXplPTUweDUwJnNldD1zZXQxIiwiaWF0IjoxNjM1NzczOTYyLCJleHAiOjE2MzU3Nzc1NjJ9.n9PQX8w8ocKo0dMCw3g8bKhjB8Wo7f7IONFBDqfxKhs',
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userData,
        userLogged: Boolean(userData.id),
        loading,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { type IAuthContextData, AuthContext, AuthContextProvider };
