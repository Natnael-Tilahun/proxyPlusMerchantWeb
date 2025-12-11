import { isTokenExpired } from "~/utils/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  const api = useApi();

  const publicRoutes = ["/login", "/invalid-2fa", "/forgotPassword", "/activateNewUser", "/merchantLogin"];
  if (publicRoutes.includes(to.path)) {
    return;
  }

  if (!authStore.isAuthenticated || !authStore.accessToken) {
    authStore.$reset();
    return navigateTo("/login", { replace: true });
  }

  if (isTokenExpired(authStore.accessTokenExpiresIn)) {
    if (authStore.refreshToken && isTokenExpired(authStore.refreshTokenExpiresIn)) {
      try {
        const { data, error } = await api.fetch(
          "/api/v1/internal/auth/refresh-token",
          {
            method: "POST",
            body: {
              refreshToken: authStore.refreshToken,
            },
            includeAuth: false, // No need to send expired access token
          }
        );

        if (error.value || !data.value) {
          throw new Error("Error refreshing token");
        }
        console.log("refresh token data.value", data.value);
        const expiresIn = data.value.accessTokenExpiresIn;
        const refreshTokenExpiresIn = data.value.refreshTokenExpiresIn;
        const absoluteExpiry =
          typeof expiresIn === "number" && expiresIn > 0
            ? expiresIn > 1e10
              ? expiresIn
              : Date.now() + expiresIn * 1000
            : 0;
        const absoluteRefreshTokenExpiry =
          typeof refreshTokenExpiresIn === "number" && refreshTokenExpiresIn > 0
            ? refreshTokenExpiresIn > 1e10
              ? refreshTokenExpiresIn
              : Date.now() + refreshTokenExpiresIn * 1000
            : 0;
        authStore.$patch({
          refreshToken: data.value.refreshToken,
          accessToken: data.value.accessToken,
          accessTokenExpiresIn: absoluteExpiry,
          refreshTokenExpiresIn: absoluteRefreshTokenExpiry,
        });
      } catch (error) {
        console.error("Token refresh failed:", error);
        authStore.$reset();
        return navigateTo("/login");
      }
    } else {
      authStore.$reset();
      return navigateTo("/login");
    }
  }
});