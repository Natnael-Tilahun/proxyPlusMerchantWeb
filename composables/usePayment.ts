import type { Transaction, UserInput, UserInputForOtp, UserInputForPushUssd } from "~/types";
import { handleApiError, type ApiResult } from "~/types/api";

export const usePayment = () => {
  const runtimeConfig = useRuntimeConfig();
  const isLoading = ref<boolean>(false);
  const store = useAuthStore();
  const { fetch } = useApi();



  const generateQRCode: (user: UserInput) => ApiResult<Transaction> = async (user: UserInput) => {
    try {
      const { data, pending, error, status } = await fetch<Transaction>(
        "/api/v1/operators/transactions/init",
        {
          method: "POST",
          body: user,
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      // toast({
      //   title: "QR Code generated successfully.",
      //   variant: "default",
      // });
      return data.value ? (data.value as unknown as Transaction) : null;
    } catch (err) {
      // handleApiError(err);
      return null;
    }

    // try {
    //   const { data, error, status } = await useAsyncData<Transaction>(`initPayment`, () =>
    //     $fetch(`${runtimeConfig.public.API_BASE_URL}/api/v1/operators/transactions/init`,
    //       {
    //         method: "POST",
    //         headers: {
    //           Authorization: `Bearer ${store.accessToken}`,
    //         },
    //         body: JSON.stringify(user)
    //       })
    //   );

    //   if (status.value === "error") {
    //     toast({
    //       title: (error as any)?.value?.data?.title,
    //       description: (error as any)?.value?.data?.detail || (error as any)?.value?.data?.message,
    //       variant: "destructive",
    //     });
    //     throw new Error("Init payment error: " + error.value);
    //   }

    //   if (!data.value) {
    //     throw new Error("No transactions data received");
    //   }

    //   navigateTo("/", { replace: true });
    //   toast({
    //     title: "QR Code generated successfully.",
    //     variant: 'default'
    //   });
    //   return data.value;

    // } catch (error) {
    //   console.error("Init payment error: ", error);
    //   throw error;
    // } finally {
    //   isLoading.value = false;
    // }
  }

  const sendPushUssd: (user: UserInputForPushUssd) => ApiResult<Transaction> = async (user: UserInputForPushUssd) => {
    try {
      const { data, pending, error, status } = await fetch<Transaction>(
        `/api/v1/operators/transactions/push-ussd/${user.merchantTransactionId}?customerPhone=${user.customerPhone}`,
        {
          method: "POST",
        }
      );

      isLoading.value = pending.value;

      console.log("staus<", status.value)
      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Transaction) : null;
    } catch (err) {
      // handleApiError(err);
      return null;
    }

  }

  const initiatePaymentOtp: (user: UserInputForOtp) => ApiResult<Transaction> = async (user: UserInputForOtp) => {
    try {
      const { data, pending, error, status } = await fetch<Transaction>(
        `/api/v1/merchants2/transactions/push-otp/${user.merchantTransactionId}?customerPhone=${user.customerPhone}`,
        {
          method: "POST",
        }
      );

      isLoading.value = pending.value;

      console.log("staus<", status.value)
      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Transaction) : null;
    } catch (err) {
      // handleApiError(err);
      return null;
    }

  }

  const completePaymentOtp: (user: UserInputForOtp) => ApiResult<Transaction> = async (user: UserInputForOtp) => {
    try {
      const { data, pending, error, status } = await fetch<Transaction>(
        `/api/v1/merchants2/transactions/complete-push-otp/${user.merchantTransactionId}`,
        {
          method: "POST",
          body: { customerOtp: user.customerOtp }

        }
      );

      isLoading.value = pending.value;

      console.log("staus<", status.value)
      if (status.value === "error") {
        handleApiError(error);
      }

      return data.value ? (data.value as unknown as Transaction) : null;
    } catch (err) {
      // handleApiError(err);
      return null;
    }

  }

  return {
    generateQRCode,
    Error,
    sendPushUssd,
    initiatePaymentOtp,
    completePaymentOtp
  };
};
