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
  <div
    class="container bg-gradient-body rounded-l-3xl relative h-[800px] md:h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
  >
    <!-- Background Image Section -->
    <div
      class="relative hidden h-screen flex-col bg-muted p-0 text-white dark:border-r lg:flex"
    >
      <div
        class="w-full h-full bg-cover bg-center contrast-75"
        style="background-image: url('/Ethiopia_Commercial-Bank_building.jpeg')"
      ></div>
      <div class="absolute bottom-0 z-20 p-5 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg text-secondary/80 contrast-200">
            &ldquo;The Bank You Can Always Rely On&rdquo;
          </p>
          <footer class="text-sm">Commercial bank of Ethiopia</footer>
        </blockquote>
      </div>
    </div>

    <!-- Login Form Section -->
    <div
      class="md:p-8 p-5 shadow-md rounded-md border-[0.5px] lg:border-none lg:shadow-none"
    >
      <div
        class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] bg-background/50 p-16 shadow-none rounded-md"
      >
        <div class="flex flex-col justify-center items-center space-y-2 text-center">
          <img src="/logo.png" alt="CBE Logo" class="w-20 h-20">

           <div class="flex items-center" >
           <h1 class="w-full text-3xl text-primary font-bold">CBE Merchant App</h1>
          </div>

          <h1 class="text-xl font-semibold tracking-tight text-left">Login</h1>
          <!-- <p class="text-sm text-muted-foreground">
            Enter your email(username) and password below to login
          </p> -->
        </div>
              <!-- Error Message Display -->
              <div
          v-if="errorMessage"
          class="p-3 bg-destructive/10 border border-destructive/20 rounded-md"
        >
          <p class="text-sm text-destructive">{{ errorMessage }}</p>
          <button
            @click="clearStaleSessions"
            class="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Clear stale sessions and try again
          </button>
        </div>
        
        <LoginForm />
        <p class="px-8 text-center font-light text-sm text-muted-foreground">
          By clicking continue, you agree to our
          <a
            href="/terms"
            class="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>
          and
          <a
            href="/privacy"
            class="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
          .
        </p>
        <UiCopyright />
      </div>
    </div>
  </div>
</template>
