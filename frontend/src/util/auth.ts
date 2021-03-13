import { History, LocationState } from 'history';

import store from 'store';
import { logIn, logOut, setJwtAccessToken } from 'actions/auth';
import { AuthResponse, UserState } from 'types';
import { API_ROOT } from 'index';
import { setUserData } from 'actions/user';
import { initialUserState } from 'reducers/user';

export interface LoginData {
  email: string;
  password: string;
}

export const logInUser = async (loginData: LoginData): Promise<void> => {
  let res;
  try {
    res = await fetch(`${API_ROOT}/users/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
  } catch (err) {
    throw new ConnectionError();
  }

  if (res.status === 200) {
    // Get access token from response
    const resBody: AuthResponse = await res.json();

    // Set login data across stores
    localStorage.setItem('isUserLoggedIn', JSON.stringify(true));
    store.dispatch(logIn());
    store.dispatch(setJwtAccessToken(resBody.token));

    // Retrieve user data and save to Redux store
    await refreshUserData();
  } else if (res.status === 401 || res.status === 400) {
    throw new InvalidCredentialsError();
  } else {
    throw new AuthenticationError();
  }
};

/**
 * Logs a user out by removing the refresh token, user data, and other relevant
 * user data from the browser.
 */
export const logOutUser = async (): Promise<void> => {
  let res;
  try {
    res = await fetch(`${API_ROOT}/users/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (err) {
    throw new ConnectionError();
  }

  if (res.status === 200) {
    localStorage.setItem('isUserLoggedIn', JSON.stringify(false));
    store.dispatch(logOut());
    store.dispatch(setJwtAccessToken(null));
    store.dispatch(setUserData(initialUserState));
  } else {
    throw new AuthenticationError();
  }
};

/**
 * Refreshes the user's access token using their refresh token and saves the new
 * access token in the Redux store.
 */
export const refreshAccessToken = async (history: History<LocationState>): Promise<void> => {
  let res;
  try {
    res = await fetch(`${API_ROOT}/users/refreshAccessToken`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (err) {
    throw new ConnectionError();
  }

  if (res.status === 200) {
    // Get token from response body and save in Redux store
    const resBody: AuthResponse = await res.json();
    store.dispatch(setJwtAccessToken(resBody.token));
  } else if (res.status === 401) {
    history.push('/');
    throw new TokenExpiredError();
  } else {
    throw new AuthenticationError();
  }
};

/**
 * Refreshes the user's data from the server and saves it in the Redux store.
 */
export const refreshUserData = async (): Promise<void> => {
  const state = store.getState();
  const accessToken = state.auth.jwtAccessToken;

  let res;
  try {
    res = await fetch(`${API_ROOT}/users/data`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    throw new ConnectionError();
  }

  if (res.status === 200) {
    // Get user data from response body and save in Redux store
    const resBody: UserState = await res.json();
    store.dispatch(setUserData(resBody));
  } else if (res.status === 401) {
    throw new TokenExpiredError();
  } else {
    throw new AuthenticationError();
  }
};

/**
 * Thrown when the server could not be reached.
 */
class ConnectionError extends Error {
  constructor() {
    super();
    this.name = 'ConnectionError';
    this.message = 'An error occurred while connecting to the server. Please check your Internet connection and try again.';
  }
}

/**
 * Thrown when any method of authentication fails.
 */
class AuthenticationError extends Error {
  constructor() {
    super();
    this.name = 'AuthenticationError';
    this.message = 'An error occurred while trying to authenticate your account. Please refresh the page or log out and in and try again.';
  }
}

/**
 * Thrown when the user's credentials were not accepted by the server.
 */
class InvalidCredentialsError extends Error {
  constructor() {
    super();
    this.name = 'InvalidCredentialsError';
    this.message = 'The email or password you entered is incorrect. Please try again.';
  }
}

/**
 * Thrown when an access token or a refresh token has expired.
 */
class TokenExpiredError extends Error {
  constructor() {
    super();
    this.name = 'TokenExpiredError';
    this.message = 'Your token has expired. Please log in again.';
  }
}