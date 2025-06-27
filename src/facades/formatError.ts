import { AxiosError } from "axios";

export const formatErrorMessage = (err: AxiosError) => {
  if (err.message === "Network Error") {
    return "Network error, verify your internet connection";
  }

  if (Array.isArray(err?.response?.data?.error)) {
    return err.response.data.error[0];
  }

  if (err?.response?.data?.errorCode) {
    return err?.response?.data?.errorCode;
  }
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }

  return "Internal error";
};
