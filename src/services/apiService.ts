import axios, { AxiosError, AxiosResponse, Method } from "axios";
import { Cookies } from "react-cookie";
import { appConfig } from "../config";
import { formatErrorMessage } from "../facades/formatError";

const makeApi = () => {
  if (typeof window !== "undefined") {
    const authCookies = new Cookies(null, {
      domain: import.meta.env.VITE_DOMAIN_AUTH,
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });

    const token = authCookies.get("ebinex:accessToken") ?? null;

    const headers = token
      ? {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
          // "Context-Id": appConfig.exchange_id,
        }
      : {
          "Content-type": "application/json",
          // "Context-Id": appConfig.exchange_id,
        };

    return axios.create({
      baseURL: appConfig.api_url,
      headers,
      timeout: 30000,
    });
  }

  return null;
};

async function request<T = any>(
  url: string,
  method: Method,
  params: any,
  headers?: any,
  needSpotAccountId?: boolean
): Promise<AxiosResponse<T>["data"]> {
  const authCookies = new Cookies(null, {
    domain: import.meta.env.VITE_DOMAIN_AUTH,
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });
  try {
    let accountId = "";

    if (needSpotAccountId) {
      accountId = authCookies.get("ebinex:accountSpotId");
    } else {
      accountId = authCookies.get("ebinex:accountId");
    }

    const response = await makeApi().request({
      url,
      method,
      params: method === "get" ? params : null,
      data: method !== "get" ? params : null,
      headers: {
        accountId: accountId?.replaceAll('"', ""),
        ...headers,
      },
    });

    return response.data;
  } catch (err) {
    const error: AxiosError = err;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      error.response?.data?.message !== "Invalid2faCodeException" &&
      url !== "/parameters"
    ) {
      if (authCookies.get("ebinex:accessToken")) {
        authCookies.remove("ebinex:accessToken");
        window.location.href = "/login";
      }
    }
    throw formatErrorMessage(err);
  }
}
export function apiGet<T = any>(
  url: string,
  params?: any,
  needSpotAccountId?: boolean
) {
  return request<T>(url, "get", params, undefined, needSpotAccountId);
}

export function apiPost<T = any>(
  url: string,
  body: any,
  headers?: any,
  needSpotAccountId?: boolean
) {
  return request<T>(url, "post", body, headers, needSpotAccountId);
}

export function apiPut<T = any>(url: string, body: any) {
  return request<T>(url, "put", body);
}

export function apiDelete<T = any>(url: string, body: any) {
  return request<T>(url, "delete", body);
}
