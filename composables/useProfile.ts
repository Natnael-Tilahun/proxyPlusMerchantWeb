import { Toast, ToastAction, toast, useToast } from "~/components/ui/toast";
import type { Merchant, Profile } from "~/types";
import { handleApiError, type ApiResult } from "~/types/api";

export const useProfile = () => {
    const runtimeConfig = useRuntimeConfig();
    const isLoading = ref<boolean>(false);
    const isSubmitting = ref<boolean>(false);
    const store = useAuthStore();
    const { fetch } = useApi();

    const getProfile: () => ApiResult<Profile> = async () => {
        try {
            const { data, pending, error, status } = await fetch<Profile>(
              `/api/v1/merchants2/operators/me`,
              {
                method: "GET",
              }
            );
      
            isLoading.value = pending.value;
      
            if (status.value === "error") {
             navigateTo("/login");
              handleApiError(error);
            }
      
            return data.value as unknown as Profile;
          } catch (err) {
            handleApiError(err);
            navigateTo("/login");
            return null;
          } finally {
            isLoading.value = false;
          }
    };



    const updateProfile: (merchantData: any) => ApiResult<Merchant> = async (merchantData) => {
        
        try {
            const { data, pending, error, status } = await fetch<Merchant>(
              `/api/v1/merchants/update`,
              {
                method: "POST",
                body: merchantData,
              }
            );
      
            isLoading.value = pending.value;
      
            if (status.value === "error") {
              handleApiError(error);
            }
      
            return data.value ? (data.value as unknown as Merchant) : null;
          } catch (err) {
            // handleApiError(err);
            return null;
          }
    };

    return {
        isLoading,
        getProfile,
        updateProfile,
        isSubmitting
    };
};
