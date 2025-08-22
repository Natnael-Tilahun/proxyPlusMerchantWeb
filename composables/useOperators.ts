import { useApi } from "./useApi";
import type { Operator, OperatorRole } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useOperators = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getMerchantOperators: (page?: number, size?: number) => ApiResult<Operator[]> = async ( page, size) => {
    try {
      const { data, pending, error, status } = await fetch<Operator[]>(
        `/api/v1/merchants2/operators`,
        {
          params: { page, size }
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Operator[]) : null;
    } catch (err) {
      throw err
    }
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