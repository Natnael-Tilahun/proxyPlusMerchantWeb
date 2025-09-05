import { useAuthStore } from "~/stores/auth";

export const useApi = () => {
  const store = useAuthStore();

  const getHeaders = (includeAuth = true) => {
    const headers: Record<string, string> = {
      "X-App-ID": __X_APP_ID__,
      "X-App-Version": __X_APP_VERSION__,
      "X-2FA-Token": store.twoFactorToken ? store.twoFactorToken : "",
      "X-Current-Operator-Id": store.profile?.merchantOperatorId ? store.profile?.merchantOperatorId : ""
    };

    if (includeAuth && store.accessToken) {
      headers.Authorization = `Bearer ${store.accessToken}`;
    }

    return headers;
  };

  const fetch = async <T>(
    endpoint: string,
    options: {
      method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
      body?: any;
      params?: Record<string, any>;
      baseUrl?: string;
      includeAuth?: boolean;
    } = {}
  ) => {
    const {
      method = "GET",
      body,
      params,
      baseUrl = __API_BASE_URL__,
      includeAuth = true,
    } = options;

    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    const url = `${baseUrl}${endpoint}${queryString}`;

    try {
      const response = await $fetch(url, {
        method,
        body,
        headers: getHeaders(includeAuth),
      });

      return {
        data: ref(response),
        pending: ref(false),
        error: ref(null),
        status: ref("success"),
      };
    } catch (err) {
      return {
        data: ref(null),
        pending: ref(false),
        error: ref(err),
        status: ref("error"),
      };
    }
  };

  return {
    fetch,
    getHeaders,
  };
};
