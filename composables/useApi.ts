import { useAuthStore } from "~/stores/auth";
import { toast } from "~/components/ui/toast";

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
    } = {},
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
      const response = await $fetch.raw<T>(url, {
        method,
        body,
        headers: getHeaders(includeAuth),
      });

      // const requestId = response.headers?.get && response.headers.get("x-srm-request-id");
      // console.log("reuquest id: ", requestId)

      // if (requestId) {
      //   toast({
      //     title: "Request Submitted for Approval",
      //     description: `Your request with ID: ${requestId} has been submitted for approval.`,
      //   });
      // }

      return {
        data: ref((response as any)._data as T),
        headers: (response as any).headers as Headers,
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
