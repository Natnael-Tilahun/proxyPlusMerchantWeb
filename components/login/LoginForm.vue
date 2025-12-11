<script setup lang="ts">
import { ref } from "vue";
import { cn } from "@/lib/utils";
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { operatorLoginFormSchema } from "~/validations/operatorLoginFormSchema";
import type { UserInput } from "~/types";
const isLoading = ref<boolean>(false);
const { login } = useAuth();
let showPassword = ref(false);

const form = useForm({
  validationSchema: operatorLoginFormSchema,
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const onSubmit = form.handleSubmit(async (values: UserInput) => {
  isLoading.value = true;
  const userCredentials = {
    merchantShortCode: values.merchantShortCode,
    password: values.password,
    operatorCode: values.operatorCode,
  };

  try {
    await login(userCredentials);
        // Get the session management functions from the plugin
        const { $claimSession, $notifyLogin } = useNuxtApp();

// Claim the session for this tab
const sessionId = $claimSession();

// Notify other tabs about the login
$notifyLogin(sessionId);
console.log("sessionId", sessionId);
navigateTo("/", { replace: true });
  } catch (error) {
    console.error("Login error: ", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <div class="grid gap-3">
        <FormField v-slot="{ componentField }" name="merchantShortCode">
          <FormItem>
            <FormLabel> Merchant Short Code</FormLabel>
            <FormControl>
              <UiInput
                type="text"
                placeholder="merchant short code"
                v-bind="componentField"
                :disabled="isLoading"
                aria-autocomplete="merchantShortCode"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="operatorCode">
          <FormItem>
            <FormLabel> Operator Code</FormLabel>
            <FormControl>
              <UiInput
                type="text"
                placeholder="operator code"
                v-bind="componentField"
                :disabled="isLoading"
                aria-autocomplete="operatorCode"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>PIN</FormLabel>
            <FormControl>
              <div
                className="relative flex items-center bg-input rounded-lg pl- focus-within:ring-1 focus-within:ring-primary"
              >
                <UiInput
                  :type="[showPassword ? 'text' : 'password']"
                  placeholder="******"
                  v-bind="componentField"
                  :disabled="isLoading"
                  aria-autocomplete="password"
                />
                <Icon
                v-if="showPassword"
                  name="material-symbols:visibility-rounded"
                  class="absolute flex right-0 pr-3 items-center w-8 h-8"
                  @Click="togglePasswordVisibility"
                ></Icon>
                <Icon
                v-else
                  name="material-symbols:visibility-off-rounded"
                  class="absolute flex right-0 pr-3 items-center w-8 h-8"
                  @Click="togglePasswordVisibility"
                ></Icon>
         
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- <NuxtLink
          to="/forgotPassword"
          class="text-primary text-right text-sm pb-3"
        >
          Forgot Password?
        </NuxtLink> -->
        <UiButton :disabled="isLoading" class="mt-3">
          <Icon
            v-if="isLoading"
            name="svg-spinners:8-dots-rotate"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>

          Sign In
        </UiButton>
      </div>
    </form>
  </div>
</template>
