<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { completeOtpPaymentFormSchema } from "~/validations/completeOtpPaymentFormSchema.js";
import { defineProps } from "vue";
import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import type { UserInputForOtp } from "~/types";

const isLoading = ref(false);
const { completePaymentOtp } = usePayment();
const { toast } = useToast();

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: completeOtpPaymentFormSchema,
});

// Define props
const props = defineProps(["merchantTransactionId"]);

const onSubmit = handleSubmit(async (values: any) => {
  isLoading.value = true;
  const transactionData: UserInputForOtp = {
    merchantTransactionId: props.merchantTransactionId,
    customerOtp: values.customerOtp.join(""),
  };

  try {
    const data = await completePaymentOtp(transactionData);
    if (data) {
      toast({
        title: "Payment paid successfully.",
        description: data,
        variant: "default",
      });
      navigateTo(`/transactions/mine`, { replace: true });
    }
  } catch (error) {
    console.error("Otp payment error: ", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <UiCard :class="['w-full h-full p-6', $props.class].join(' ')">
    <form @submit="onSubmit">
      <div class="flex flex-col justify-betwee h-full gap-4 md:gap-6">
        <div class="md:space-y-6 space-y-4">
          <p class="font-semibold text-xl text-center">Complete OTP Payment</p>
          <FormField v-slot="{ componentField, value }" name="customerOtp">
            <FormItem>
              <FormLabel class="text-center"> OTP</FormLabel>
              <FormControl class="w-full flex justify-center">
                <UiPinInput id="pin-input" :model-value="value" placeholder="○" class="flex gap-2 items-center mt-1 " otp
                  type="number" :name="componentField.name" @update:model-value="(arrStr) => {
                    setFieldValue('customerOtp', arrStr)
                  }">
                  <UiPinInputGroup class="gap-4">
                    <UiPinInputSlot class="text-xl border bg-muted" v-for="(id, index) in 6" :key="id" :index="index" />
                  </UiPinInputGroup>
                </UiPinInput>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <UiButton class="hover:bg-fuchsia-800 text-base font-medium w-full" :disabled="isLoading">
          <Icon name="svg-spinners:8-dots-rotate" v-if="isLoading" class="mr-2 h-4 w-4 animate-spin"></Icon>
          Complete Payment
        </UiButton>
      </div>
    </form>
  </UiCard>
</template>
