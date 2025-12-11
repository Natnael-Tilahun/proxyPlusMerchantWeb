import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import type { Branch } from "~/types";
import { handleApiError, type ApiResult } from "~/types/api";
import { usePagination } from "./usePagination";
import { watch, computed } from "vue";

// Update export to accept options
export const useBranches = (options: {
  mode?: "all" | "mine";
  autoFetch?: boolean;
} = {}) => {
  const { mode = "all", autoFetch = false } = options;
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const store = useAuthStore();
  const { fetch } = useApi();

  // Determine endpoint based on mode
  const endpoint = computed(() => {
    if (mode === "mine") {
       const myBranchId = store.profile?.merchantBranch?.merchantBranchId;
       if (myBranchId) {
           return `/api/v1/merchants/branches2/${myBranchId}`;
       }
       return null; // or some fallback
    }
    return "/api/v1/merchants/branches2";
  });

  // --- Pagination & State for Main List ---
  const {
    data: branches,
    total,
    page,
    size,
    loading,
    error,
    fetchData: fetchBranches,
    onPageChange,
    onSizeChange,
    filters,
    onFiltersChange
  } = usePagination<Branch>({
    endpoint: endpoint,
    options: {
        autoFetch: false 
    }
  });

  // Watch for pagination changes to auto-refetch
  watch([page, size], async () => {
    await fetchBranches();
  });

  // Watch endpoint changes if in mine mode (e.g. login happens later)
  watch(endpoint, async (newVal) => {
      if (newVal && (autoFetch || mode === 'mine')) {
          await fetchBranches();
      }
  }, { immediate: autoFetch });

  const getBranches = async (p?: number, s?: number) => {
     if (p !== undefined) page.value = p + 1;
     if (s !== undefined) size.value = s;
     await fetchBranches();
     return branches.value;
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
    branches,
    total,
    page,
    size,
    loading,
    error,
    fetchBranches,
    onPageChange,
    onSizeChange,
    filters,
    onFiltersChange,
    isLoading, // keep for other actions
    getBranchById,
    createNeweMerchantBranch,
    deleteMerchantBranch,
    updateMerchantBranch
  };
};
