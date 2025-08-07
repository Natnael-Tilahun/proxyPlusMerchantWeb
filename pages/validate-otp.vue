<template>
  <div
    class="container relative h-[800px] md:h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
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

    <!-- Content Section -->
    <div
      class="md:p-8 p-5 shadow-md rounded-md border-[0.5px] lg:border-none lg:shadow-none"
    >
      <div
        class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
      >
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">Enter Verification Code</h1>
          <p class="text-sm text-muted-foreground">
            Please enter the verification code sent to your device
          </p>
          <p class="text-sm text-muted-foreground">
            Code expires in: {{ formatTime(expirationTimer) }}
          </p>
        </div>

        <!-- OTP Input Form -->
        <form @submit.prevent="validateOTP" class="space-y-4 w-full flex flex-col">
            <div class="flex gap-4 justify-center  w-full">
              <input
                v-for="(digit, index) in 4"
                :key="index"
                v-model="otpDigits[index]"
                type="text"
                maxlength="1"
                class="w-10 h-12 text-center text-lg border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                :class="{ 'border-red-500': isError }"
                @input="handleOtpInput($event, index)"
                @keydown="handleKeyDown($event, index)"
                ref="otpInputs"
              />
            </div>

          <!-- Submit Button -->
          <UiButton
            type="submit"
            :disabled="loading || !isOtpComplete"
            class="w-full"
            :class="{ 'opacity-75 cursor-not-allowed': loading || !isOtpComplete }"
          >
            <Icon
              name="svg-spinners:8-dots-rotate"
              v-if="loading"
              class="mr-2 h-4 w-4 animate-spin"
            />
            {{ loading ? "Verifying..." : "Verify Code" }}
          </UiButton>
          <p v-if="isError" class="text-sm text-red-500 text-right">
              Invalid verification code. Please try again.
            </p>
        </form>

        <!-- Resend Code Link -->
        <div class="text-center">
          <UiButton
            @click="resendCode"
            variant="outline"
            :disabled="loading || resendTimer > 0"
            class="text-sm text-primary hover:text-primary/80 disabled:opacity-50 disabled:bg-muted disabled:cursor-not-allowed border-2"
          >
            {{ resendTimer > 0 ? `Resend code in ${formatTime(resendTimer)}` : "Resend code" }}
          </UiButton>
        </div>

        <!-- Back to Login Link -->
        <UiButton variant="outline" class="w-full">
          <NuxtLink
            to="/login"
            class="flex items-center justify-center space-x-2"
          >
            <svg
              class="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Login</span>
          </NuxtLink>
        </UiButton>

        <UiCopyright />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useToast } from "~/components/ui/toast";
import type { OtpDTO } from "~/types";
import { handleApiError } from "~/types/api";

// Page Meta Configuration
definePageMeta({
  layout: false,
});

const { validateTwoFactorAuth, requestTwoFactorAuth, getAuthorities } = useAuth();
// const {getProfile} = useMerchants()
const {getProfile} = useProfile()
const { toast } = useToast();

const loading = ref(false);
const isError = ref(false);
const otpDigits = ref(Array(4).fill(""));
const resendTimer = ref(0);
const expirationTimer = ref(600); // 10 minutes in seconds
const otpInputs = ref<HTMLInputElement[]>([]);

const isOtpComplete = computed(() => {
  return otpDigits.value.every((digit) => digit.length === 1);
});

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const handleOtpInput = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement;
  const value = input.value;

  // Only allow numbers
  if (!/^\d*$/.test(value)) {
    otpDigits.value[index] = "";
    return;
  }

  // Move to next input if current input is filled
  if (value.length === 1 && index < 5) {
    otpInputs.value[index + 1]?.focus();
  }
};

const handleKeyDown = (event: KeyboardEvent, index: number) => {
  // Handle backspace
  if (event.key === "Backspace" && !otpDigits.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus();
  }
};

const validateOTP = async () => {
  if (!isOtpComplete.value) return;

  try {
    loading.value = true;
    isError.value = false;

    const otpCode = otpDigits.value.join("");
    const response = await validateTwoFactorAuth(otpCode);

    if (response) {
      // First show success message for OTP validation
      toast({
        title: "Success",
        description: "OTP verification successful",
      });

      // navigateTo("/");

      // try {
      //     const { data, pending, error, status } = await fetch<Merchant>(
      //       '/api/v1/merchants',
      //       {
      //         method: "GET",
      //         // body: user,
      //         // includeAuth: false
      //       }
      //     );
          
    
      //     if (status.value === "error") {
      //       handleApiError(error);
      //     }

      //     if (status.value == 'success') {
      //       navigateTo("/", { replace: true });
      //     }

      //     if (status.value === "error" && error.value?.data?.detail == "404 NOT_FOUND") {
      //       navigateTo("/register", { replace: true });
      //     }
      //   } catch (error) {
      //     // handleApiError(error);
      //     console.error("Getting profile error: ", error);
      //     if ((error as any).value?.data?.detail == "404 NOT_FOUND") {
      //       navigateTo("/register", { replace: true });
      //     }
      //   }
      //   return data.value;


      try {
        // Try to get user authorities
        const profileResponse =  await getProfile();       
        if(profileResponse?.merchantOperatorId){

        const authoritiesResponse =  await getAuthorities(profileResponse?.merchantOperatorId);        
        if (authoritiesResponse) {
          toast({
            title: "Success",
            description: "Operator profile fetched successfully",
          });
          navigateTo("/");
        }
      } 
      } catch (authoritiesError: any) {
        console.error("Error getting operator:", authoritiesError);
        handleApiError(authoritiesError);
        navigateTo("/login");
      }
    }
  } catch (erra: any) {
    console.error("Error validating OTP:", erra);
    isError.value = true;
    // handleApiError(err);
  } finally {
    loading.value = false;
  }
};

const startResendTimer = () => {
  resendTimer.value = 180; // 3 minutes in seconds
  const timer = setInterval(() => {
    resendTimer.value--;
    if (resendTimer.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

const startExpirationTimer = () => {
  expirationTimer.value = 600; // 10 minutes
  const timer = setInterval(() => {
    expirationTimer.value--;
    if (expirationTimer.value <= 0) {
      clearInterval(timer);
      // Redirect to invalid-2fa page when OTP expires
      navigateTo("/invalid-2fa");
    }
  }, 1000);
};

const resendCode = async () => {
  if (resendTimer.value > 0) return;

  try {
    loading.value = true;
    const response = await requestTwoFactorAuth("sms");
    
    if (response) {
      toast({
        title: "Success",
        description: "New verification code sent successfully",
      });
      startResendTimer();
    }
  } catch (err: any) {
    console.error("Error resending code:", err);
    toast({
      title: "Error",
      description: "Failed to resend code. Please try again.",
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
};

// Start timers on component mount
onMounted(() => {
  startResendTimer();
  startExpirationTimer();
});
</script> 