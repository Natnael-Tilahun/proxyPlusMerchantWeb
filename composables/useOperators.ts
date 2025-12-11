import { ref, watch, computed } from "vue";
import { useApi } from "./useApi";
import type { Operator, OperatorRole } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";
import { usePagination } from "./usePagination";

// Update export to accept options
export const useOperators = (options: {
  mode?: "all" | "branch";
  branchId?: string;
  autoFetch?: boolean; // Add autoFetch here to control immediate fetch
} = {}) => {
  const { mode = "all", autoFetch = false } = options; // Default autoFetch false to match previous behavior if not specified
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  // Determine endpoint based on mode
  const endpoint = computed(() => {
    if (mode === "branch" && options.branchId) {
      return `/api/v1/merchants2/operators/by-branch/${options.branchId}`;
    }
    return "/api/v1/merchants2/operators";
  });

  // --- Pagination & State for Main List ---
  const {
    data: operators,
    total,
    page,
    size,
    loading,
    error,
    fetchData: fetchOperators,
    onPageChange,
    onSizeChange,
    filters,
    onFiltersChange
  } = usePagination<Operator>({
    endpoint: endpoint,
    sortValue: "firstName,ASC",
    options: {
      autoFetch: false // We control fetch via watcher or manual call
    }
  });

  // Watch for pagination changes to auto-refetch
  watch([page, size], async () => {
    await fetchOperators();
  });
  
  // Watch endpoint changes if in branch mode to refetch when ID changes
  watch(endpoint, async () => {
      await fetchOperators();
  }, { immediate: autoFetch }); // Fetch immediately if autoFetch is true

  // Keep compatibility for manual calls if needed, though mostly replaced by fetchOperators
  const getMerchantOperators = async (p?: number, s?: number) => {
     if (p !== undefined) page.value = p + 1; 
     if (s !== undefined) size.value = s; 
     // Fetch will be triggered by watchers if values changed, but if they didn't change 
     // (e.g. force refresh on same page), we might need manual fetch.
     // However, for strict compatibility:
     await fetchOperators();
     return operators.value;
  };

  const getMerchantOperatorById: (id: string) => ApiResult<Operator> = async ( id) => {
    try {
      const { data, pending, error, status } = await fetch<Operator>(
        `/api/v1/merchants2/operators/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Operator) : null;
    } catch (err) {
      throw err
    }
  };

  const getMerchantOperatorsByBranchId: (branchId: string) => ApiResult<Operator> = async ( branchId) => {
    try {
      const { data, pending, error, status } = await fetch<Operator>(
        `/api/v1/merchants2/operators/by-branch/${branchId}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Operator) : null;
    } catch (err) {
      throw err
    }
  };

  const createNeweMerchantOperator: (operatorData: any) => ApiResult<Operator> = async (  operatorData) => {
    try {
      const { data, pending, error, status } = await fetch<Operator>(
        `/api/v1/merchants2/operators`,
        {
          method: "POST",
          body: operatorData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Operator) : null;
    } catch (err) {
      throw err
    }
  };

  const resetMerchantOperatorPassword: (operatorId: string, operatorData: any) => ApiResult<any> = async (operatorId, operatorData) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/merchants2/operators/${operatorId}/reset-password`,
        {
          method: "POST",
          body: operatorData
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value) : null;
    } catch (err) {
      throw err
    }
  };

  const updateMerchantOperator: (operatorId: string, operatorData: any) => ApiResult<Operator> = async ( operatorId, operatorData) => {
    try {
      const { data, pending, error, status } = await fetch<Operator>(
        `/api/v1/merchants2/operators/${operatorId}`,
        {
          method: "PATCH",
          body: operatorData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Operator) : null;
    } catch (err) {
      throw err
    }
  };

  const deleteMerchantOperator: (id: string) => ApiResult<any> = async ( id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/merchants2/operators/${id}`,
        { method: "DELETE" }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value;
    } catch (err) {
      throw err
    }
  };

  const sendMerchantOperatorInvite: (  operatorData: any) => ApiResult<Operator> = async ( operatorData) => {
    try {
      const { data, pending, error, status } = await fetch<Operator>(
        `/api/v1/merchants2/operators/invite`,
        {
          method: "POST",
          body: operatorData
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Operator) : null;
    } catch (err) {
      throw err
    }
  };

  const activateMerchantOperator: ( operatorId: string) => ApiResult<Operator> = async ( operatorId) => {
    try {
      const { data, pending, error, status } = await fetch<Operator>(
        `/api/v1/merchants2/operators/${operatorId}/activate`,
        {
          method: "PATCH",
        }
      );

      isSubmitting.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Operator) : null;
    } catch (err) {
      throw err
    }
  };

  const getMerchantOperatorRoles: () => ApiResult<OperatorRole[]> = async () => {
    try {
      const { data, pending, error, status } = await fetch<OperatorRole[]>(
        '/api/v1/merchants2/operators/roles'
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as OperatorRole[]) : null;
    } catch (err) {
      throw err
    }
  };

  return {
    isLoading,
    // Pagination
    operators,
    total,
    page,
    size,
    loading, // This replaces the local isLoading for the list
    error,
    fetchOperators,
    onPageChange,
    onSizeChange,
    filters,
    onFiltersChange,

    // Legacy / Specific
    getMerchantOperators,
    getMerchantOperatorById,
    createNeweMerchantOperator,
    deleteMerchantOperator,
    updateMerchantOperator,
    resetMerchantOperatorPassword,
    isSubmitting,
    sendMerchantOperatorInvite,
    activateMerchantOperator,
    getMerchantOperatorRoles,
    getMerchantOperatorsByBranchId
  };
};