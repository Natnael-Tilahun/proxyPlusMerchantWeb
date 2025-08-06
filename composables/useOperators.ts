import { useApi } from "./useApi";
import type { Operator, OperatorRole } from "~/types";
import type { ApiResult } from "~/types/api";
import { handleApiError } from "~/types/api";

export const useOperators = () => {
  const isLoading = ref<boolean>(false);
  const isSubmitting = ref<boolean>(false);
  const { fetch } = useApi();

  const getMerchantOperators: (page?: number, size?: number) => ApiResult<Operator[]> = async (page, size) => {
    try {
      const { data, pending, error, status } = await fetch<Operator[]>(
        `/api/v1/merchants/operators`,
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

  const getMerchantOperatorById: (merchantId: string, id: string) => ApiResult<Operator> = async (merchantId, id) => {
    try {
      const { data, pending, error, status } = await fetch<Operator>(
        `/api/v1/merchants/${merchantId}/operators/${id}`
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

  const createNeweMerchantOperator: (merchantId: string, operatorData: any) => ApiResult<Operator> = async ( merchantId, operatorData) => {
    try {
      const { data, pending, error, status } = await fetch<Operator>(
        `/api/v1/merchants/${merchantId}/operators`,
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

  const resetMerchantOperatorPassword: (merchantId: string, operatorId: string, operatorData: any) => ApiResult<any> = async ( merchantId, operatorId, operatorData) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/merchants/${merchantId}/operators/${operatorId}/password-reset`,
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

  const updateMerchantOperator: (merchantId: string, operatorId: string, operatorData: any) => ApiResult<Operator> = async (merchantId, operatorId, operatorData) => {
    try {
      const { data, pending, error, status } = await fetch<Operator>(
        `/api/v1/merchants/${merchantId}/operators/${operatorId}`,
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

  const deleteMerchantOperator: (merchantId: string, id: string) => ApiResult<any> = async (merchantId, id) => {
    try {
      const { data, pending, error, status } = await fetch<any>(
        `/api/v1/merchants/${merchantId}/operators/${id}`,
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

  const sendMerchantOperatorInvite: ( operatorId: string, operatorData: any) => ApiResult<Operator> = async (operatorId, operatorData) => {
    try {
      const { data, pending, error, status } = await fetch<Operator>(
        `/api/v1/merchants/${operatorId}/operators/invite`,
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

  const activateMerchantOperator: ( currentOperatorId: string, operatorId: string) => ApiResult<Operator> = async (currentOperatorId, operatorId) => {
    try {
      const { data, pending, error, status } = await fetch<Operator>(
        `/api/v1/merchants/${currentOperatorId}/operators/${operatorId}/activate`,
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
        '/api/v1/internal/merchants/operator-roles'
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
    getMerchantOperatorRoles
  };
};