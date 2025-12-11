<script setup lang="ts">
import LoginForm from "~/components/login/LoginForm.vue";

// Page Meta Configuration
definePageMeta({
  layout: false,
});

// Handle error messages from URL parameters
const route = useRoute();
const errorMessage = computed(() => {
  const error = route.query.error as string;
  switch (error) {
    case "multiple_sessions":
      return "Another session is already active. Please close other tabs or log out from the other session.";
    case "session_terminated":
      return "Your session was terminated by another login. Please log in again.";
    default:
      return "";
  }
});

// Function to clear stale sessions
const clearStaleSessions = () => {
  const sessionManager = useSessionManager();
  const cleared = sessionManager.clearStaleSessions();
  if (cleared) {
    // Refresh the page to clear the error
    window.location.href = "/login";
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30 p-4">
    <!-- Login Card -->
    <div
      class="w-full max-w-md space-y-8 bg-background rounded-xl shadow-lg border p-8"
    >
      <div class="flex flex-col space-y-2 text-center">
        <h1 class="text-3xl font-bold text-primary tracking-tight">Proxy+</h1>
        <p class="text-sm text-muted-foreground">Proxy+ Merchant Web</p>
      </div>

      <!-- Error Message Display -->
      <div
        v-if="errorMessage"
        class="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-center"
      >
        <p class="text-sm text-destructive font-medium">{{ errorMessage }}</p>
        <button
          @click="clearStaleSessions"
          class="mt-2 text-xs text-primary hover:underline font-medium"
        >
          Clear stale sessions and try again
        </button>
      </div>

      <div class="space-y-6">
        <div class="flex flex-col space-y-2 text-center">
          <h2 class="text-xl font-semibold tracking-tight">Login</h2>
          <p class="text-sm text-muted-foreground">
            Enter your credentials to access the system
          </p>
        </div>

        <LoginForm />
      </div>

      <div class="pt-4 border-t">
        <UiCopyright />
      </div>
    </div>
  </div>
</template>
