import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import axiosInstance from "./axiosConfig";
import axios from "axios";
import { toast } from "sonner";

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl?: string } = { baseUrl: "" },
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
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
          status: 500,
          data: "An unexpected error occurred",
        },
      };
    }
  };

export default axiosBaseQuery;
