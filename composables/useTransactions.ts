import { useAuthStore } from "~/stores/auth";
import { useTransactionFilterStore } from "~/stores/transactionStore";
import { usePagination } from "./usePagination";
import { handleApiError, type ApiResult } from "~/types/api";
import type { Transaction } from "~/types";
import { ref, watch, computed } from "vue";
import { useApi } from "./useApi";
import { useRuntimeConfig } from "#app";

export const useTransactions = (options: {
  autoFetch?: boolean;
  mode?: "all" | "mine" | "operator" | "branch";
  operatorId?: string;
  branchId?: string;
  ignoreStore?: boolean;
} = {}) => {
  const { autoFetch = true, mode = "all", ignoreStore = false } = options;
  const runtimeConfig = useRuntimeConfig();
  const store = useAuthStore();
  const transactionFilterStore = useTransactionFilterStore();
  const { fetch } = useApi();
  const isLoading = ref<boolean>(false);

  // Determine endpoint based on mode
  const endpoint = computed(() => {
    if (mode === "mine") return `/api/v1/merchants2/transactions/mine`;
    if (mode === "operator" && options.operatorId)
      return `/api/v1/merchants2/transactions/operator/${options.operatorId}`;
    if (mode === "branch" && options.branchId)
      return `/api/v1/merchants2/transactions/branch/${options.branchId}`;
    return `/api/v1/merchants2/transactions`;
  });

  // Use Pagination Composable
  const {
    page,
    size,
    sort,
    data,
    total,
    loading: paginationLoading,
    error,
    fetchData: fetchPagination,
    onPageChange,
    onSizeChange,
    onSortChange,
    filters,
    onFiltersChange,
  } = usePagination<Transaction>({
    endpoint: endpoint,
    options: {
      autoFetch: false,
    },
  });

  const getFilters = () => {
    const tf = transactionFilterStore;
    const f: Record<string, any> = {};

    if (tf.paymentStatus && tf.paymentStatus !== "NONE" && tf.paymentStatus.trim() !== "") {
      f["paymentStatus.equals"] = tf.paymentStatus;
    }
    if (tf.transactionInitiator && tf.transactionInitiator !== "NONE" && tf.transactionInitiator.trim() !== "") {
      f["transactionInitiator.equals"] = tf.transactionInitiator;
    }
    if (tf.amountGreaterThanOrEqual) {
      f["amount.greaterThanOrEqual"] = tf.amountGreaterThanOrEqual;
    }
    if (tf.amountLessThanOrEqual) {
      f["amount.lessThanOrEqual"] = tf.amountLessThanOrEqual;
    }
    if (tf.payerName) f["payerName.contains"] = tf.payerName;
    if (tf.payerPhone) f["payerPhone.contains"] = tf.payerPhone;
    if (tf.payerAccountNumber) f["payerAccountNumber.in"] = tf.payerAccountNumber;
    if (tf.payerId) f["payerId.contains"] = tf.payerId;
    if (tf.paymentReference) f["paymentReference.contains"] = tf.paymentReference;
    if (tf.dynamicId) f["dynamicId.contains"] = tf.dynamicId;
    if (tf.mbTransactionId) f["mbTransactionId.contains"] = tf.mbTransactionId;
    if (tf.coreTransactionId) f["coreTransactionId.contains"] = tf.coreTransactionId;
    if (tf.merchantAccountNumber)
      f["merchantAccountNumber.contains"] = tf.merchantAccountNumber;
    if (tf.merchantBranchId) f["merchantBranchId.equals"] = tf.merchantBranchId;
    if (tf.merchantOperatorId)
      f["merchantOperatorId.equals"] = tf.merchantOperatorId;
    if (tf.initiatedDate)
      f["initiatedDate.greaterThanOrEqual"] = tf.initiatedDate;
    if (tf.completedDate)
      f["completedDate.greaterThanOrEqual"] = tf.completedDate;
    if (tf.expirationDate)
      f["expirationDate.greaterThanOrEqual"] = tf.expirationDate;

    return f;
  };

  const fetchData = async () => {
    if (!ignoreStore) {
      filters.value = getFilters();
    }
    await fetchPagination();
  };

  watch(
    [page, size, sort, endpoint],
    () => {
      fetchData();
    },
    { immediate: autoFetch }
  );
  
  // Also watch store changes to trigger refetch if using reactive mode
  // Using a watcher on store.$state or specific fields might be expensive, 
  // but usually filter bar triggers an action. 
  // We'll leave it to the UI to trigger refetch() if needed or watch explicitly.

  // --- Legacy Methods for Backward Compatibility ---

  const getMyTransactions: (
    paymentStatus?: string,
    pageNumber?: string,
    pageSize?: string,
    sortBy?: string,
    expirationDate?: string,
    transactionInitiator?: string,
    amountGreaterThanOrEqual?: number,
    amountLessThanOrEqual?: number,
    payerName?: string,
    payerPhone?: string,
    payerAccountNumber?: number,
    payerId?: string,
    paymentReference?: string,
    dynamicId?: string,
    mbTransactionId?: string,
    coreTransactionId?: string,
    merchantAccountNumber?: number,
    merchantBranchId?: string,
    merchantOperatorId?: string,
    initiatedDate?: string,
    completedDate?: string
  ) => ApiResult<Transaction[]> = async (
    paymentStatus = undefined,
    pageNumber = undefined,
    pageSize = undefined,
    sortBy = undefined,
    expirationDate = undefined,
    transactionInitiator = undefined,
    amountGreaterThanOrEqual = undefined,
    amountLessThanOrEqual = undefined,
    payerName = undefined,
    payerPhone = undefined,
    payerAccountNumber = undefined,
    payerId = undefined,
    paymentReference = undefined,
    dynamicId = undefined,
    mbTransactionId = undefined,
    coreTransactionId = undefined,
    merchantAccountNumber = undefined,
    merchantBranchId = undefined,
    merchantOperatorId = undefined,
    initiatedDate = undefined,
    completedDate = undefined
  ) => {
    try {
      const { data, pending, error, status } = await fetch<Transaction[]>(
        `/api/v1/merchants2/transactions/mine`,
        {
          method: "GET",
          params: {
            ...((paymentStatus === " " ? undefined : paymentStatus) ||
            transactionFilterStore.paymentStatus
              ? {
                  "paymentStatus.equals":
                    (paymentStatus === " " ? undefined : paymentStatus) ??
                    (transactionFilterStore.paymentStatus === "NONE"
                      ? ""
                      : transactionFilterStore.paymentStatus),
                }
              : {}),
            page: pageNumber ?? transactionFilterStore.pageNumber,
            size: pageSize ?? transactionFilterStore.pageSize,
            sort: `${sortBy ?? transactionFilterStore.sortBy}`,
            ...(transactionInitiator ||
            (transactionFilterStore.transactionInitiator !== "NONE" &&
              transactionFilterStore.transactionInitiator !== "")
              ? {
                  "transactionInitiator.equals":
                    transactionInitiator ??
                    transactionFilterStore.transactionInitiator,
                }
              : {}),
            ...(amountGreaterThanOrEqual ||
            transactionFilterStore.amountGreaterThanOrEqual
              ? {
                  "amount.greaterThanOrEqual":
                    amountGreaterThanOrEqual ??
                    transactionFilterStore.amountGreaterThanOrEqual,
                }
              : {}),
            ...(amountLessThanOrEqual ||
            transactionFilterStore.amountLessThanOrEqual
              ? {
                  "amount.lessThanOrEqual":
                    amountLessThanOrEqual ??
                    transactionFilterStore.amountLessThanOrEqual,
                }
              : {}),
            ...(payerName || transactionFilterStore.payerName
              ? {
                  "payerName.contains":
                    payerName ?? transactionFilterStore.payerName,
                }
              : {}),
            ...(payerPhone || transactionFilterStore.payerPhone
              ? {
                  "payerPhone.contains":
                    payerPhone ?? transactionFilterStore.payerPhone,
                }
              : {}),
            ...(payerAccountNumber || transactionFilterStore.payerAccountNumber
              ? {
                  "payerAccountNumber.in":
                    payerAccountNumber ??
                    transactionFilterStore.payerAccountNumber,
                }
              : {}),
            ...(payerId || transactionFilterStore.payerId
              ? {
                  "payerId.contains": payerId ?? transactionFilterStore.payerId,
                }
              : {}),
            ...(paymentReference || transactionFilterStore.paymentReference
              ? {
                  "paymentReference.contains":
                    paymentReference ?? transactionFilterStore.paymentReference,
                }
              : {}),
            ...(dynamicId || transactionFilterStore.dynamicId
              ? {
                  "dynamicId.contains":
                    dynamicId ?? transactionFilterStore.dynamicId,
                }
              : {}),
            ...(mbTransactionId || transactionFilterStore.mbTransactionId
              ? {
                  "mbTransactionId.contains":
                    mbTransactionId ?? transactionFilterStore.mbTransactionId,
                }
              : {}),
            ...(coreTransactionId || transactionFilterStore.coreTransactionId
              ? {
                  "coreTransactionId.contains":
                    coreTransactionId ??
                    transactionFilterStore.coreTransactionId,
                }
              : {}),
            ...(merchantAccountNumber ||
            transactionFilterStore.merchantAccountNumber
              ? {
                  "merchantAccountNumber.contains":
                    merchantAccountNumber ??
                    transactionFilterStore.merchantAccountNumber,
                }
              : {}),
            ...(merchantBranchId || transactionFilterStore.merchantBranchId
              ? {
                  "merchantBranchId.equals":
                    merchantBranchId ?? transactionFilterStore.merchantBranchId,
                }
              : {}),
            ...(merchantOperatorId || transactionFilterStore.merchantOperatorId
              ? {
                  "merchantOperatorId.equals":
                    merchantOperatorId ??
                    transactionFilterStore.merchantOperatorId,
                }
              : {}),
            ...(initiatedDate || transactionFilterStore.initiatedDate
              ? {
                  "initiatedDate.greaterThanOrEqual":
                    initiatedDate ?? transactionFilterStore.initiatedDate,
                }
              : {}),
            ...(completedDate || transactionFilterStore.completedDate
              ? {
                  "completedDate.greaterThanOrEqual":
                    completedDate ?? transactionFilterStore.completedDate,
                }
              : {}),
            ...(expirationDate || transactionFilterStore.expirationDate
              ? {
                  "expirationDate.greaterThanOrEqual":
                    expirationDate ?? transactionFilterStore.expirationDate,
                }
              : {}),
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Transaction[]) : null;
    } catch (err) {
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const getAllTransactions: (
    paymentStatus?: string,
    pageNumber?: string,
    pageSize?: string,
    sortBy?: string,
    expirationDate?: string,
    transactionInitiator?: string,
    amountGreaterThanOrEqual?: number,
    amountLessThanOrEqual?: number,
    payerName?: string,
    payerPhone?: string,
    payerAccountNumber?: number,
    payerId?: string,
    paymentReference?: string,
    dynamicId?: string,
    mbTransactionId?: string,
    coreTransactionId?: string,
    merchantAccountNumber?: number,
    merchantBranchId?: string,
    merchantOperatorId?: string,
    initiatedDate?: string,
    completedDate?: string
  ) => ApiResult<Transaction[]> = async (
    paymentStatus = undefined,
    pageNumber = undefined,
    pageSize = undefined,
    sortBy = undefined,
    expirationDate = undefined,
    transactionInitiator = undefined,
    amountGreaterThanOrEqual = undefined,
    amountLessThanOrEqual = undefined,
    payerName = undefined,
    payerPhone = undefined,
    payerAccountNumber = undefined,
    payerId = undefined,
    paymentReference = undefined,
    dynamicId = undefined,
    mbTransactionId = undefined,
    coreTransactionId = undefined,
    merchantAccountNumber = undefined,
    merchantBranchId = undefined,
    merchantOperatorId = undefined,
    initiatedDate = undefined,
    completedDate = undefined
  ) => {
    try {
      const { data, pending, error, status } = await fetch<Transaction[]>(
        `/api/v1/merchants2/transactions`,
        {
          method: "GET",
          params: {
            ...((paymentStatus === " " ? undefined : paymentStatus) ||
            transactionFilterStore.paymentStatus
              ? {
                  "paymentStatus.equals":
                    (paymentStatus === " " ? undefined : paymentStatus) ??
                    (transactionFilterStore.paymentStatus === "NONE"
                      ? ""
                      : transactionFilterStore.paymentStatus),
                }
              : {}),
            page: pageNumber ?? transactionFilterStore.pageNumber,
            size: pageSize ?? transactionFilterStore.pageSize,
            sort: `${sortBy ?? transactionFilterStore.sortBy}`,
            ...(transactionInitiator ||
            (transactionFilterStore.transactionInitiator !== "NONE" &&
              transactionFilterStore.transactionInitiator !== "")
              ? {
                  "transactionInitiator.equals":
                    transactionInitiator ??
                    transactionFilterStore.transactionInitiator,
                }
              : {}),
            ...(amountGreaterThanOrEqual ||
            transactionFilterStore.amountGreaterThanOrEqual
              ? {
                  "amount.greaterThanOrEqual":
                    amountGreaterThanOrEqual ??
                    transactionFilterStore.amountGreaterThanOrEqual,
                }
              : {}),
            ...(amountLessThanOrEqual ||
            transactionFilterStore.amountLessThanOrEqual
              ? {
                  "amount.lessThanOrEqual":
                    amountLessThanOrEqual ??
                    transactionFilterStore.amountLessThanOrEqual,
                }
              : {}),
            ...(payerName || transactionFilterStore.payerName
              ? {
                  "payerName.contains":
                    payerName ?? transactionFilterStore.payerName,
                }
              : {}),
            ...(payerPhone || transactionFilterStore.payerPhone
              ? {
                  "payerPhone.contains":
                    payerPhone ?? transactionFilterStore.payerPhone,
                }
              : {}),
            ...(payerAccountNumber || transactionFilterStore.payerAccountNumber
              ? {
                  "payerAccountNumber.in":
                    payerAccountNumber ??
                    transactionFilterStore.payerAccountNumber,
                }
              : {}),
            ...(payerId || transactionFilterStore.payerId
              ? {
                  "payerId.contains": payerId ?? transactionFilterStore.payerId,
                }
              : {}),
            ...(paymentReference || transactionFilterStore.paymentReference
              ? {
                  "paymentReference.contains":
                    paymentReference ?? transactionFilterStore.paymentReference,
                }
              : {}),
            ...(dynamicId || transactionFilterStore.dynamicId
              ? {
                  "dynamicId.contains":
                    dynamicId ?? transactionFilterStore.dynamicId,
                }
              : {}),
            ...(mbTransactionId || transactionFilterStore.mbTransactionId
              ? {
                  "mbTransactionId.contains":
                    mbTransactionId ?? transactionFilterStore.mbTransactionId,
                }
              : {}),
            ...(coreTransactionId || transactionFilterStore.coreTransactionId
              ? {
                  "coreTransactionId.contains":
                    coreTransactionId ??
                    transactionFilterStore.coreTransactionId,
                }
              : {}),
            ...(merchantAccountNumber ||
            transactionFilterStore.merchantAccountNumber
              ? {
                  "merchantAccountNumber.contains":
                    merchantAccountNumber ??
                    transactionFilterStore.merchantAccountNumber,
                }
              : {}),
            ...(merchantBranchId || transactionFilterStore.merchantBranchId
              ? {
                  "merchantBranchId.equals":
                    merchantBranchId ?? transactionFilterStore.merchantBranchId,
                }
              : {}),
            ...(merchantOperatorId || transactionFilterStore.merchantOperatorId
              ? {
                  "merchantOperatorId.equals":
                    merchantOperatorId ??
                    transactionFilterStore.merchantOperatorId,
                }
              : {}),
            ...(initiatedDate || transactionFilterStore.initiatedDate
              ? {
                  "initiatedDate.greaterThanOrEqual":
                    initiatedDate ?? transactionFilterStore.initiatedDate,
                }
              : {}),
            ...(completedDate || transactionFilterStore.completedDate
              ? {
                  "completedDate.greaterThanOrEqual":
                    completedDate ?? transactionFilterStore.completedDate,
                }
              : {}),
            ...(expirationDate || transactionFilterStore.expirationDate
              ? {
                  "expirationDate.greaterThanOrEqual":
                    expirationDate ?? transactionFilterStore.expirationDate,
                }
              : {}),
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Transaction[]) : null;
    } catch (err) {
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const getMyTransactionById: (id: string) => ApiResult<Transaction> = async (
    id
  ) => {
    try {
      const { data, pending, error, status } = await fetch<Transaction>(
        `/api/v1/merchants2/transactions/mine/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Transaction) : null;
    } catch (err) {
      return null;
    }
  };

  const getTransactionById: (id: string) => ApiResult<Transaction> = async (
    id
  ) => {
    try {
      const { data, pending, error, status } = await fetch<Transaction>(
        `/api/v1/merchants2/transactions/${id}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Transaction) : null;
    } catch (err) {
      return null;
    }
  };

  const getTransactionsByOperatorId: (
    operatorId: string,
    paymentStatus?: string,
    pageNumber?: string,
    pageSize?: string,
    sortBy?: string,
    expirationDate?: string,
    transactionInitiator?: string,
    amountGreaterThanOrEqual?: number,
    amountLessThanOrEqual?: number,
    payerName?: string,
    payerPhone?: string,
    payerAccountNumber?: number,
    payerId?: string,
    paymentReference?: string,
    dynamicId?: string,
    mbTransactionId?: string,
    coreTransactionId?: string,
    merchantAccountNumber?: number,
    merchantBranchId?: string,
    merchantOperatorId?: string,
    initiatedDate?: string,
    completedDate?: string
  ) => ApiResult<Transaction[]> = async (
    operatorId,
    paymentStatus = undefined,
    pageNumber = undefined,
    pageSize = undefined,
    sortBy = undefined,
    expirationDate = undefined,
    transactionInitiator = undefined,
    amountGreaterThanOrEqual = undefined,
    amountLessThanOrEqual = undefined,
    payerName = undefined,
    payerPhone = undefined,
    payerAccountNumber = undefined,
    payerId = undefined,
    paymentReference = undefined,
    dynamicId = undefined,
    mbTransactionId = undefined,
    coreTransactionId = undefined,
    merchantAccountNumber = undefined,
    merchantBranchId = undefined,
    merchantOperatorId = undefined,
    initiatedDate = undefined,
    completedDate = undefined
  ) => {
    try {
      const { data, pending, error, status } = await fetch<Transaction[]>(
        `/api/v1/merchants2/transactions/operator/${operatorId}`,
        {
          method: "GET",
          params: {
            ...((paymentStatus === " " ? undefined : paymentStatus) ||
            transactionFilterStore.paymentStatus
              ? {
                  "paymentStatus.equals":
                    (paymentStatus === " " ? undefined : paymentStatus) ??
                    (transactionFilterStore.paymentStatus === "NONE"
                      ? ""
                      : transactionFilterStore.paymentStatus),
                }
              : {}),
            page: pageNumber ?? transactionFilterStore.pageNumber,
            size: pageSize ?? transactionFilterStore.pageSize,
            sort: `${sortBy ?? transactionFilterStore.sortBy}`,
            ...(transactionInitiator ||
            (transactionFilterStore.transactionInitiator !== "NONE" &&
              transactionFilterStore.transactionInitiator !== "")
              ? {
                  "transactionInitiator.equals":
                    transactionInitiator ??
                    transactionFilterStore.transactionInitiator,
                }
              : {}),
            ...(amountGreaterThanOrEqual ||
            transactionFilterStore.amountGreaterThanOrEqual
              ? {
                  "amount.greaterThanOrEqual":
                    amountGreaterThanOrEqual ??
                    transactionFilterStore.amountGreaterThanOrEqual,
                }
              : {}),
            ...(amountLessThanOrEqual ||
            transactionFilterStore.amountLessThanOrEqual
              ? {
                  "amount.lessThanOrEqual":
                    amountLessThanOrEqual ??
                    transactionFilterStore.amountLessThanOrEqual,
                }
              : {}),
            ...(payerName || transactionFilterStore.payerName
              ? {
                  "payerName.contains":
                    payerName ?? transactionFilterStore.payerName,
                }
              : {}),
            ...(payerPhone || transactionFilterStore.payerPhone
              ? {
                  "payerPhone.contains":
                    payerPhone ?? transactionFilterStore.payerPhone,
                }
              : {}),
            ...(payerAccountNumber || transactionFilterStore.payerAccountNumber
              ? {
                  "payerAccountNumber.in":
                    payerAccountNumber ??
                    transactionFilterStore.payerAccountNumber,
                }
              : {}),
            ...(payerId || transactionFilterStore.payerId
              ? {
                  "payerId.contains": payerId ?? transactionFilterStore.payerId,
                }
              : {}),
            ...(paymentReference || transactionFilterStore.paymentReference
              ? {
                  "paymentReference.contains":
                    paymentReference ?? transactionFilterStore.paymentReference,
                }
              : {}),
            ...(dynamicId || transactionFilterStore.dynamicId
              ? {
                  "dynamicId.contains":
                    dynamicId ?? transactionFilterStore.dynamicId,
                }
              : {}),
            ...(mbTransactionId || transactionFilterStore.mbTransactionId
              ? {
                  "mbTransactionId.contains":
                    mbTransactionId ?? transactionFilterStore.mbTransactionId,
                }
              : {}),
            ...(coreTransactionId || transactionFilterStore.coreTransactionId
              ? {
                  "coreTransactionId.contains":
                    coreTransactionId ??
                    transactionFilterStore.coreTransactionId,
                }
              : {}),
            ...(merchantAccountNumber ||
            transactionFilterStore.merchantAccountNumber
              ? {
                  "merchantAccountNumber.contains":
                    merchantAccountNumber ??
                    transactionFilterStore.merchantAccountNumber,
                }
              : {}),
            ...(merchantBranchId || transactionFilterStore.merchantBranchId
              ? {
                  "merchantBranchId.equals":
                    merchantBranchId ?? transactionFilterStore.merchantBranchId,
                }
              : {}),
            ...(merchantOperatorId || transactionFilterStore.merchantOperatorId
              ? {
                  "merchantOperatorId.equals":
                    merchantOperatorId ??
                    transactionFilterStore.merchantOperatorId,
                }
              : {}),
            ...(initiatedDate || transactionFilterStore.initiatedDate
              ? {
                  "initiatedDate.greaterThanOrEqual":
                    initiatedDate ?? transactionFilterStore.initiatedDate,
                }
              : {}),
            ...(completedDate || transactionFilterStore.completedDate
              ? {
                  "completedDate.greaterThanOrEqual":
                    completedDate ?? transactionFilterStore.completedDate,
                }
              : {}),
            ...(expirationDate || transactionFilterStore.expirationDate
              ? {
                  "expirationDate.greaterThanOrEqual":
                    expirationDate ?? transactionFilterStore.expirationDate,
                }
              : {}),
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Transaction[]) : null;
    } catch (err) {
      return null;
    }
  };

  const getOperatorTransactionsById: (
    operatorId: string,
    transactionId: string
  ) => ApiResult<Transaction[]> = async (operatorId, transactionId) => {
    try {
      const { data, pending, error, status } = await fetch<Transaction[]>(
        `/api/v1/merchants2/transactions/operators/${operatorId}/${transactionId}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Transaction[]) : null;
    } catch (err) {
      return null;
    }
  };

  const getTransactionsByBranchId: (
    branchId: string,
    paymentStatus?: string,
    pageNumber?: string,
    pageSize?: string,
    sortBy?: string,
    expirationDate?: string,
    transactionInitiator?: string,
    amountGreaterThanOrEqual?: number,
    amountLessThanOrEqual?: number,
    payerName?: string,
    payerPhone?: string,
    payerAccountNumber?: number,
    payerId?: string,
    paymentReference?: string,
    dynamicId?: string,
    mbTransactionId?: string,
    coreTransactionId?: string,
    merchantAccountNumber?: number,
    merchantBranchId?: string,
    merchantOperatorId?: string,
    initiatedDate?: string,
    completedDate?: string
  ) => ApiResult<Transaction[]> = async (
    branchId,
    paymentStatus = undefined,
    pageNumber = undefined,
    pageSize = undefined,
    sortBy = undefined,
    expirationDate = undefined,
    transactionInitiator = undefined,
    amountGreaterThanOrEqual = undefined,
    amountLessThanOrEqual = undefined,
    payerName = undefined,
    payerPhone = undefined,
    payerAccountNumber = undefined,
    payerId = undefined,
    paymentReference = undefined,
    dynamicId = undefined,
    mbTransactionId = undefined,
    coreTransactionId = undefined,
    merchantAccountNumber = undefined,
    merchantBranchId = undefined,
    merchantOperatorId = undefined,
    initiatedDate = undefined,
    completedDate = undefined
  ) => {
    try {
      const { data, pending, error, status } = await fetch<Transaction[]>(
        `/api/v1/merchants2/transactions/branch/${branchId}`,
        {
          method: "GET",
          params: {
            ...((paymentStatus === " " ? undefined : paymentStatus) ||
            transactionFilterStore.paymentStatus
              ? {
                  "paymentStatus.equals":
                    (paymentStatus === " " ? undefined : paymentStatus) ??
                    (transactionFilterStore.paymentStatus === "NONE"
                      ? ""
                      : transactionFilterStore.paymentStatus),
                }
              : {}),
            page: pageNumber ?? transactionFilterStore.pageNumber,
            size: pageSize ?? transactionFilterStore.pageSize,
            sort: `${sortBy ?? transactionFilterStore.sortBy}`,
            ...(transactionInitiator ||
            (transactionFilterStore.transactionInitiator !== "NONE" &&
              transactionFilterStore.transactionInitiator !== "")
              ? {
                  "transactionInitiator.equals":
                    transactionInitiator ??
                    transactionFilterStore.transactionInitiator,
                }
              : {}),
            ...(amountGreaterThanOrEqual ||
            transactionFilterStore.amountGreaterThanOrEqual
              ? {
                  "amount.greaterThanOrEqual":
                    amountGreaterThanOrEqual ??
                    transactionFilterStore.amountGreaterThanOrEqual,
                }
              : {}),
            ...(amountLessThanOrEqual ||
            transactionFilterStore.amountLessThanOrEqual
              ? {
                  "amount.lessThanOrEqual":
                    amountLessThanOrEqual ??
                    transactionFilterStore.amountLessThanOrEqual,
                }
              : {}),
            ...(payerName || transactionFilterStore.payerName
              ? {
                  "payerName.contains":
                    payerName ?? transactionFilterStore.payerName,
                }
              : {}),
            ...(payerPhone || transactionFilterStore.payerPhone
              ? {
                  "payerPhone.contains":
                    payerPhone ?? transactionFilterStore.payerPhone,
                }
              : {}),
            ...(payerAccountNumber || transactionFilterStore.payerAccountNumber
              ? {
                  "payerAccountNumber.in":
                    payerAccountNumber ??
                    transactionFilterStore.payerAccountNumber,
                }
              : {}),
            ...(payerId || transactionFilterStore.payerId
              ? {
                  "payerId.contains": payerId ?? transactionFilterStore.payerId,
                }
              : {}),
            ...(paymentReference || transactionFilterStore.paymentReference
              ? {
                  "paymentReference.contains":
                    paymentReference ?? transactionFilterStore.paymentReference,
                }
              : {}),
            ...(dynamicId || transactionFilterStore.dynamicId
              ? {
                  "dynamicId.contains":
                    dynamicId ?? transactionFilterStore.dynamicId,
                }
              : {}),
            ...(mbTransactionId || transactionFilterStore.mbTransactionId
              ? {
                  "mbTransactionId.contains":
                    mbTransactionId ?? transactionFilterStore.mbTransactionId,
                }
              : {}),
            ...(coreTransactionId || transactionFilterStore.coreTransactionId
              ? {
                  "coreTransactionId.contains":
                    coreTransactionId ??
                    transactionFilterStore.coreTransactionId,
                }
              : {}),
            ...(merchantAccountNumber ||
            transactionFilterStore.merchantAccountNumber
              ? {
                  "merchantAccountNumber.contains":
                    merchantAccountNumber ??
                    transactionFilterStore.merchantAccountNumber,
                }
              : {}),
            ...(merchantBranchId || transactionFilterStore.merchantBranchId
              ? {
                  "merchantBranchId.equals":
                    merchantBranchId ?? transactionFilterStore.merchantBranchId,
                }
              : {}),
            ...(merchantOperatorId || transactionFilterStore.merchantOperatorId
              ? {
                  "merchantOperatorId.equals":
                    merchantOperatorId ??
                    transactionFilterStore.merchantOperatorId,
                }
              : {}),
            ...(initiatedDate || transactionFilterStore.initiatedDate
              ? {
                  "initiatedDate.greaterThanOrEqual":
                    initiatedDate ?? transactionFilterStore.initiatedDate,
                }
              : {}),
            ...(completedDate || transactionFilterStore.completedDate
              ? {
                  "completedDate.greaterThanOrEqual":
                    completedDate ?? transactionFilterStore.completedDate,
                }
              : {}),
            ...(expirationDate || transactionFilterStore.expirationDate
              ? {
                  "expirationDate.greaterThanOrEqual":
                    expirationDate ?? transactionFilterStore.expirationDate,
                }
              : {}),
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Transaction[]) : null;
    } catch (err) {
      return null;
    }
  };

  const getBranchTransactionsById: (
    branchId: string,
    transactionId: string
  ) => ApiResult<Transaction[]> = async (branchId, transactionId) => {
    try {
      const { data, pending, error, status } = await fetch<Transaction[]>(
        `/api/v1/merchants2/transactions/branch/${branchId}/${transactionId}`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Transaction[]) : null;
    } catch (err) {
      return null;
    }
  };

  return {
    transactions: data,
    page,
    size,
    sort,
    total,
    loading: paginationLoading,
    error,
    fetchTransactions: fetchData,
    onPageChange,
    onSizeChange,
    onSortChange,
    filters,
    onFiltersChange,

    getMyTransactions,
    getTransactionById,
    getTransactionsByOperatorId,
    getTransactionsByBranchId,
    getAllTransactions,
    getMyTransactionById,
    getOperatorTransactionsById,
    getBranchTransactionsById,
  };
};