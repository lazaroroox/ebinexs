import type { FC, ReactNode } from "react";
import { createContext, useEffect, useReducer } from "react";
import axios from "../lib/axios";
import type { User, UserRequest } from "../types/user";
// import { verify, JWT_SECRET } from '../utils/jwt';
import { Cookies, useCookies } from "react-cookie";
import { saveAccountId } from "src/services/db";
import { Account } from "src/types";
import { checkActiveAccountActive } from "src/utils";
import { apiPost } from "../services/apiService";

type LoginRequest = {
  email: string;
  password: string;
  code2fa?: string;
  keepLoggedIn?: boolean;
  captchaCode?: string;
};
interface AuthContextValue extends State {
  platform: "JWT";
  login: ({
    email,
    password,
    code2fa,
    keepLoggedIn,
    captchaCode,
  }: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  initialize: () => Promise<void>;
  switchAccount: (account: Account) => Promise<void>;
  verifyEmailCode: (username: string, code: string) => Promise<void>;
  verifyPasswordCode: (email: string, code: string) => Promise<void>;
  resendCode: (username: string) => Promise<void>;
  passwordRecovery: (email: string) => Promise<void>;
  passwordResetVerify: (
    userEmail: string,
    code: string,
    requestId: string
  ) => Promise<void>;
  passwordReset: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

type FilterType = {
  label: string;
  value: string;
};

type AccountType = {
  id: string;
  label: string;
  environment: string;
  walletAddresses: null | {
    apecoin: string;
    bitcoin: string;
    bitcoincash: string;
    dai: string;
    dogecoin: string;
    ethereum: string;
    litecoin: string;
    polygon: string;
    pusdc: string;
    pweth: string;
    shibainu: string;
    tether: string;
    usdc: string;
    USDT: string;
  };
  defaultCoinBalance: number;
};

type SetIsInitializedAction = {
  type: "SET_IS_INITIALIZED";
  payload: {
    isInitialized: boolean;
  };
};

type InitializeAction = {
  type: "INITIALIZE";
  payload: {
    isAuthenticated: boolean;
  };
};

type LoginAction = {
  type: "LOGIN";
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: "LOGOUT";
};

type RegisterAction = {
  type: "REGISTER";
  payload: {
    userRequest: UserRequest;
  };
};

type VerifyEmailCodeAction = {
  type: "VERIFY_CODE";
};

type ResendCodeAction = {
  type: "RESEND_CODE";
};
type PasswordRecoveryAction = {
  type: "PASSWORD_RECOVERY";
};

type PasswordResetAction = {
  type: "PASSWORD_RESET";
};

type RegisterRequest = {
  name?: string;
  email: string;
  phonePrefix?: string;
  phone?: string;
  password: string;
  linkId?: string;
};

type Action =
  | SetIsInitializedAction
  | InitializeAction
  | LoginAction
  | LogoutAction
  | RegisterAction
  | VerifyEmailCodeAction
  | ResendCodeAction
  | PasswordRecoveryAction
  | PasswordResetAction;

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  userRequest: UserRequest | null;
  operationDirections: FilterType[] | [];
  statuses: FilterType[] | [];
  pairs: FilterType[] | [];
}

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  userRequest: null,
  operationDirections: [],
  statuses: [],
  pairs: [],
};

const setSession = (accessToken: string | null): void => {
  const authCookies = new Cookies(null, {
    domain: import.meta.env.VITE_DOMAIN_AUTH,
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });
  if (accessToken) {
    authCookies.set("ebinex:accessToken", accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    authCookies.remove("ebinex:accessToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

// const setAccountId = (data: string | null): void => {
//   if (data) {
//     localStorage.setItem("accountId", data);
//     axios.defaults.headers.common.accountId = data;
//   } else {
//     localStorage.removeItem("accountId");
//   }
// };

const handlers: Record<string, (state: State, action: Action) => State> = {
  SET_IS_INITIALIZED: (state: State, action: SetIsInitializedAction): State => {
    const { isInitialized } = action.payload;
    return {
      ...state,
      isInitialized,
    };
  },
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated } = action.payload;

    return {
      ...state,
      isAuthenticated,
    };
  },
  LOGIN: (state: State, action: LoginAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
    };
  },
  LOGOUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
  }),
  REGISTER: (state: State, action: RegisterAction): State => {
    const { userRequest } = action.payload;
    return {
      ...state,
      isAuthenticated: false,
      userRequest,
    };
  },
  //
  VERIFY_CODE: (state: State): State => ({ ...state }),
  RESEND_CODE: (state: State): State => ({ ...state }),
  PASSWORD_RECOVERY: (state: State): State => ({ ...state }),
  PASSWORD_RESET: (state: State): State => ({ ...state }),
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  platform: "JWT",
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  initialize: () => Promise.resolve(),
  switchAccount: () => Promise.resolve(),
  verifyEmailCode: () => Promise.resolve(),
  verifyPasswordCode: () => Promise.resolve(),
  resendCode: () => Promise.resolve(),
  passwordRecovery: () => Promise.resolve(),
  passwordReset: () => Promise.resolve(),
  passwordResetVerify: () => Promise.resolve(),
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [cookies, setCookie, removeCookie] = useCookies();

  const initialize = async (): Promise<void> => {
    try {
      const accessToken = cookies["ebinex:accessToken"];

      if (accessToken) {
        setSession(accessToken);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: true,
          },
        });
      } else {
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
          },
        });
      }
    } catch (err) {
      console.error(err);
      logout();
      dispatch({
        type: "INITIALIZE",
        payload: {
          isAuthenticated: false,
        },
      });
    }

    dispatch({
      type: "SET_IS_INITIALIZED",
      payload: {
        isInitialized: true,
      },
    });
  };

  useEffect(() => {
    initialize();
  }, []);

  const login = async ({
    email,
    password,
    code2fa,
    keepLoggedIn,
    captchaCode,
  }: LoginRequest): Promise<void> => {
    const response = await apiPost("/auth/login", {
      email,
      password,
      code2fa,
      keepLoggedIn,
      captchaCode,
    });

    const { token, accounts } = response;

    const spotAccount = accounts.find(
      (account) => account.environment === "SPOT"
    );

    if (spotAccount) {
      console.log("SPOT ID", spotAccount);
      saveAccountId("ebinex:accountSpotId", spotAccount?.id);
    }

    if (accounts.find((a) => a.userRole === "REGULAR")) {
      setSession(token);
      const { accountId } = checkActiveAccountActive(accounts);
      console.log("save accountId", accountId);
      saveAccountId("ebinex:accountId", accountId);
      window.location.href = "/traderoom";
    } else {
      throw "Não existe uma conta de trader para esse email. Por favor, criar uma conta";
    }
  };

  const logout = async (): Promise<void> => {
    setSession(null);
    removeCookie("ebinex:accountId");

    removeCookie("ebinex:accountSpotId");
    window.localStorage.removeItem("firstAccess");
    window.localStorage.removeItem("userStorage");
    window.localStorage.removeItem("environment");
    window.localStorage.removeItem("parametersStorage");
    window.localStorage.removeItem("accountsStorage");
    dispatch({ type: "LOGOUT" });
  };

  const register = async ({
    name,
    email,
    password,
    phone,
    phonePrefix,
    linkId,
  }: RegisterRequest): Promise<void> => {
    const userRequest = await apiPost<UserRequest>(
      "/users/user-requests",
      {
        name,
        email,
        phonePrefix,
        phone,
        password,
      },
      { linkId }
    );

    // @todo, entender o dispatch
    await window.localStorage.setItem(
      "userRequest",
      JSON.stringify(userRequest)
    );

    dispatch({
      type: "REGISTER",
      payload: {
        userRequest,
      },
    });
  };

  const switchAccount = async (account: Account, reloadPage = false) => {
    const { id, environment } = account;
    dispatch({
      type: "SET_IS_INITIALIZED",
      payload: {
        isInitialized: true,
      },
    });

    saveAccountId("ebinex:accountId", id, "switchAccount", reloadPage);
    localStorage.setItem("environment", environment);
  };

  const verifyEmailCode = async (
    username: string,
    code: string
  ): Promise<void> => {
    await apiPost<{ success: boolean }>("/users/user-requests/submit", {
      id: username,
      code,
    });
    dispatch({
      type: "VERIFY_CODE",
    });
  };

  const verifyPasswordCode = async (
    email: string,
    code: string
  ): Promise<void> => {
    await apiPost<{ success: boolean }>("/users/password-recovery/verify", {
      userEmail: email,
      code,
    });
  };

  const resendCode = async (username: string): Promise<void> => {
    const response = await apiPost<{ userRequest: UserRequest }>(
      "/users/user-requests/renovate",
      {
        id: username,
      }
    );
    dispatch({
      type: "RESEND_CODE",
    });
  };

  const passwordRecovery = async (email: string): Promise<void> => {
    const response = await apiPost("users/password-recovery", {
      userEmail: email,
    });

    dispatch({
      type: "PASSWORD_RECOVERY",
    });

    return response;
  };

  const passwordReset = async (
    email: string,
    code: string,
    newPassword: string
  ): Promise<void> => {
    const response = await apiPost("/users/password-recovery/submit", {
      userEmail: email,
      code,
      newPassword,
    });

    dispatch({
      type: "PASSWORD_RESET",
    });

    return response;
  };

  const passwordResetVerify = async (
    userEmail: string,
    code: string,
    requestId: string
  ): Promise<void> => {
    const { passwordRecoveryRequest } = await apiPost(
      "/users/password-recovery/verify",
      {
        userEmail,
        requestId,
        code,
      }
    );

    return passwordRecoveryRequest;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: "JWT",
        login,
        logout,
        register,
        initialize,
        switchAccount,
        verifyEmailCode,
        verifyPasswordCode,
        resendCode,
        passwordRecovery,
        passwordReset,
        passwordResetVerify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
