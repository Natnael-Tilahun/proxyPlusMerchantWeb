import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import type { Branch } from "~/types";
import { handleApiError, type ApiResult } from "~/types/api";

export const useBranches = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const store = useAuthStore();
  const { fetch } = useApi();

    const getBranches: (
      page?: number,
      size?: number
    ) => ApiResult<Branch[]> = async ( page, size) => {
      try {
        const { data, pending, error, status } = await fetch<Branch[]>(
          `/api/v1/merchants/branches2`,
          {
            params: { page, size },
          }
        );
  
        isLoading.value = pending.value;
  
        if (status.value === "error") {
          handleApiError(error);
        }
  
        return data.value ? (data.value as unknown as Branch[]) : null;
      } catch (err) {
        
        throw err;
      }
    };

  const getBranchById: (id: string) => ApiResult<Branch> = async ( id) => {
    try {
      const { data, pending, error, status } = await fetch<Branch>(
        `/api/v1/merchants/branches2/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Branch) : null;
    } catch (err) {
      // handleApiError(err);
      throw err
    }


    // try {
    //     const { data, error, status } = await useFetch<Branch>(
    //         `${runtimeConfig.public.API_BASE_URL}/api/v1/merchants/branches/${id}`,
    //         {
    //             method: "GET",
    //             headers: {
    //                 Authorization: `Bearer ${store.accessToken}`,
    //             },
    //         }
    //     );

    //     if (status.value === "error") {
    //         toast({
    //             title: error.value?.data?.type || "Something went wrong!",
    //             description: error.value?.data?.detail || error.value?.data?.message,
    //             variant: "destructive"
    //         })
    //         throw new Error(error.value?.data?.detail || error.value?.data?.message);
    //     }

    //     if (!data.value) {
    //         throw new Error("No merchants data received");
    //     }
    //     return data.value;
    // } catch (err) {
    //     throw err;
    // }
  };


  const createNeweMerchantBranch: (
    merchantData: any
  ) => ApiResult<Branch> = async ( merchantData) => {
    try {
      const { data, pending, error, status } = await fetch<Branch>(
        `/api/v1/merchants/branches2`,
        {
          method: "POST",
          body: merchantData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Branch) : null;
    } catch (err) {
      throw err;
    }
  };

  const updateMerchantBranch: (
    branchId: string,
    branchData: any
  ) => ApiResult<Branch> = async ( branchId, branchData) => {
    try {
      const { data, pending, error, status } = await fetch<Branch>(
        `/api/v1/merchants/branches2/${branchId}`,
        {
          method: "PUT",
          body: branchData,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Branch) : null;
    } catch (err) {
      throw err;
    }
  };

  const deleteMerchantBranch: (branchId: string) => ApiResult<any> = async ( branchId) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/merchants/branches2/${branchId}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value;
    } catch (err) {
      throw err;
    }
  };



  return {
    getBranches,
    isLoading,
    getBranchById,
    createNeweMerchantBranch,
    deleteMerchantBranch,
    updateMerchantBranch
  };
};
