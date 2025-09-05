import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import { useAuthUser } from "./useAuthUser";
import type { AuthResponse, OperatorRole, OtpDTO, TFAAccessTokenDTO, UserInput } from "~/types";
import { handleApiError, type ApiResult } from "~/types/api";

export const useAuth = () => {
  const authUser = useAuthUser();
  const userAdmin = useState<boolean>("userAdmin", () => false);
  const isLoading = ref<boolean>(false);
  const store = useAuthStore();
  const { toast } = useToast();
  const {getProfile} = useProfile()
  const { fetch } = useApi();

  const login = async (user: UserInput) => {
    try {
      const { data, pending, error, status } = await fetch<AuthResponse>(
        "/api/v1/merchants2/operators/sign-in",
        {
          method: "POST",
          body: user,
          includeAuth: false,
        }
      );

      if (status.value === "error") {
        handleApiError(error);
      }

      if (status.value === "success") {
        store.setAuth({
          ...user,
          ...data?.value?.tokenDTO,
          isAuthenticated: data?.value?.tokenDTO?.accessToken ? true : false,
        });
        // const profileResponse =  await getProfile();   
        // if(profileResponse){
          store.setProfile(data.value?.operatorDTO)
        // }    
        if(data.value?.operatorDTO?.merchantOperatorId){
          const authoritiesResponse =  await getAuthorities(data.value?.operatorDTO?.merchantOperatorId); 
        } 
    
        // if(authoritiesResponse){
        //   store.setProfile(profileResponse)
        // }
        // await getProfile();
        // navigateTo("/");
      }

      return data;
    } catch (error) {
      // handleApiError(error);
      return null;
    } finally {
      // Ensure to stop loading state whether login is successful or not
      isLoading.value = false;
    }
  }

  const userLoggedIn = async () => {
    if (!authUser.value) {


      try {
        const { data, pending, error, status } = await fetch<any>(
          "/api/v1/internal/auth/status",
          {
            method: "POST",
            header: useRequestHeaders(["cookie"]),
          }
        );
  
        isLoading.value = pending.value;
  
        if (status.value === "error") {
          handleApiError(error);
        }
  
        return data.value ? (data.value as unknown as any) : null;
      } catch (err) {
        // handleApiError(err);
        return null;
      }

    }
  };

  const logout = async () => {
        // Get the session management functions from the plugin
        const { $releaseSession, $notifyLogout } = useNuxtApp();

        // Release the session
        $releaseSession();
    
        // Notify other tabs about the logout
        $notifyLogout();
    
        store.$reset();
        return navigateTo("/login", { replace: true });
  };

  const requestTwoFactorAuth: (
    deliveryMethod?: string
  ) => ApiResult<OtpDTO> = async (deliveryMethod) => {
    try {
      const { data, pending, error, status } = await fetch<OtpDTO>(
        `/api/v1/internal/auth/two-factor/request-token?deliveryMethod=${deliveryMethod}`,
        {
          method: "POST",
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        handleApiError(error);
      }

      const response = data.value as OtpDTO;
      if (status.value === "success" && response?.verificationId) {
        store.$patch({
          verificationId: response.verificationId,
        });
      }

      return response;
    } catch (err) {
      throw err
    }
  };

  const validateTwoFactorAuth: (
    otp: string
  ) => ApiResult<TFAAccessTokenDTO> = async (otp) => {
    try {
      const { data, pending, error, status } = await fetch<TFAAccessTokenDTO>(
        `/api/v1/internal/auth/two-factor/validate`,
        {
          method: "POST",
          body: {
            verificationId: store.verificationId,
            otp: otp,
          },
        }
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        await handleApiError(error);
      }

      const response = data.value as TFAAccessTokenDTO;
      if (status.value === "success" && response?.token) {
        store.$patch({
          twoFactorToken: response.token,
        });
      }
      return response;
    } catch (err) {
      // handleApiError(err);
      return null;
    }
  };

  // const getAuthorities = async () => {
  //   try {
  //     const { data, pending, error, status } = await fetch<OperatorRole[]>(
  //       `/api/v1/internal/auth/roles`,
  //       {
  //         method: "GET",
  //       }
  //     );

  //     isLoading.value = pending.value;

  //     if (status.value === "error") {
  //       handleApiError(error);
  //     }

  //     if (status.value === "success") {
  //       console.log("permissions: ", data.value.permissions)
  //       store.$patch({
  //         permissions: data?.value && data?.value?.permissions,
  //       });
  //       // store.setPermissions({
  //       //   permissions: data?.value && data?.value?.permissions,
  //       // });

  //       navigateTo("/");
  //     }

  //     return data.value ? (data.value as unknown as any) : null;
  //   } catch (err) {
  //     // handleApiError(err);
  //     return null;
  //   } finally {
  //     isLoading.value = false;
  //   }
  // };


  const getAuthorities: (currentOperatorId:string) => ApiResult<string[]> = async (currentOperatorId) => {
    try {
      const { data, pending, error, status } = await fetch<AuthResponse>(
        `/api/v1/merchants2/operators/permissions/mine`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        navigateTo("/login");
        await handleApiError(error);
      }

      const response = data.value as string[];



      if (status.value == "success" && response) {
        console.log("response: ", response)
        store.$patch({
          permissions: response,
        });
      await getAuthoritiesRole(currentOperatorId)
      }

      return response;
    } catch (err) {
      handleApiError(err);
      navigateTo("/login");
      return null;
    }
  };

  const getAuthoritiesRole: (currentOperatorId:string) => ApiResult<string[]> = async (currentOperatorId) => {
    try {
      const { data, pending, error, status } = await fetch<AuthResponse>(
        `/api/v1/merchants2/operators/role/mine`
      );

      isLoading.value = pending.value;

      if (status.value === "error") {
        navigateTo("/login");
        await handleApiError(error);
      }

      const response = data.value as string[];

      if (status.value == "success" && response) {
        console.log("response: ", response)
        store.$patch({
          role: response,
        });
      }

      return response;
    } catch (err) {
      handleApiError(err);
      navigateTo("/login");
      return null;
    }
  };


  return {
    login,
    userLoggedIn,
    userAdmin,
    Error,
    logout,
    authUser,
    // getRefreshToken,
    requestTwoFactorAuth,
    validateTwoFactorAuth,
    getAuthorities
  };
};
