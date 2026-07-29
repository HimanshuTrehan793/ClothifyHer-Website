import { type BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { Mutex } from "async-mutex";
import axiosInstance from "./axiosConfig";
import { setCredentials, logout } from "@/features/auth/authSlice";
import { toast } from "sonner";

const mutex = new Mutex();

export const axiosBaseQueryWithReauth: BaseQueryFn<
  {
    url: string;
    method: AxiosRequestConfig["method"];
    data?: AxiosRequestConfig["data"];
    params?: AxiosRequestConfig["params"];
    headers?: AxiosRequestConfig["headers"];
    responseType?: AxiosRequestConfig["responseType"];
  },
  unknown,
  {
    status?: number;
    data?: unknown;
  }
> = async (args, api) => {
  await mutex.waitForUnlock();

  const headers = {
    ...args.headers,
    ...(localStorage.getItem("accessToken")
      ? { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      : undefined),
  };

  let result;
  try {
    result = await axiosInstance({
      url: args.url,
      method: args.method,
      data: args.data,
      params: args.params,
      headers,
      responseType: args.responseType,
    });

    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError as AxiosError;
    const status = err.response?.status;

    if (status === 401) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();

        try {
          const refreshResult = await axiosInstance.post("/auth/refresh");
          if (refreshResult.data && refreshResult.data.success) {
            const { access_token } = refreshResult.data.data;
            api.dispatch(setCredentials({ access_token }));

            const headers = {
              ...args.headers,
              ...(localStorage.getItem("accessToken")
                ? {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                  }
                : undefined),
            };

            const retryResult = await axiosInstance({
              url: args.url,
              method: args.method,
              data: args.data,
              params: args.params,
              headers: headers,
              responseType: args.responseType,
            });

            return { data: retryResult.data };
          } else {
            api.dispatch(logout());
            toast.error("Session expired. Please login again.");
            return {
              error: {
                status: 401,
                data: { message: "Session expired. Please login again." },
              },
            };
          }
        } catch {
          if (localStorage.getItem("accessToken")) {
            toast.error("Session expired. Please login again.");
          }
          api.dispatch(logout());

          return {
            error: {
              status: 401,
              data: { message: "Session expired. Please login again." },
            },
          };
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();
        try {
          const headers = {
            ...args.headers,
            ...(localStorage.getItem("accessToken")
              ? {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                }
              : undefined),
          };

          const retryResult = await axiosInstance({
            url: args.url,
            method: args.method,
            data: args.data,
            params: args.params,
            headers,
            responseType: args.responseType,
          });

          return { data: retryResult.data };
        } catch (retryError) {
          const retryErr = retryError as AxiosError;
          return {
            error: {
              status: retryErr.response?.status,
              data: retryErr.response?.data || retryErr.message,
            },
          };
        }
      }
    }

    if (axios.isAxiosError(axiosError)) {
      const errorData = axiosError.response?.data;
      if (errorData && typeof errorData.message === "string") {
        toast.error(errorData.message);
      }

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }

    toast.error("An unexpected error occurred");
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};
