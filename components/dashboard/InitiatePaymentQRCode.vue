<script lang="ts" setup>
import { useForm } from "vee-validate";
import { useRouter } from "vue-router"; // Import useRouter
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { initiatePaymentFormSchema } from "~/validations/initiatePaymentFormSchema.js";
import { Toast, ToastAction, useToast } from "~/components/ui/toast";
import type { Transaction } from "~/types";

const router = useRouter(); // Initialize the router
const isLoading = ref(false);
const paymentResponse = ref<Transaction | null>(null);
const { generateQRCode } = usePayment();
const { toast } = useToast();

const form = useForm({
  validationSchema: initiatePaymentFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  isLoading.value = true;
  try {
    const data = await generateQRCode(values);
    paymentResponse.value = data;
    router.push({
      name: "initTransactionDetail", // Replace with your route name
      query: {
        merchantTransactionId: data.merchantTransactionId,
        merchantAccountNumber: data.merchantAccountNumber,
        paymentReference: data.paymentReference || "Merchant trxn",
        amount: data.amount,
        qrEncodedData: data.qrEncodedData,
        dynamicId: data.dynamicId,
        paymentStatus: data.paymentStatus
      },
    });
    toast({
        title: "QR Code generated successfully.",
        variant: "default",
      });
  } catch (error) {
    console.error("Login error: ", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <form class="w-full" @submit="onSubmit">
    <div class="grid gap-4">
      <FormField v-slot="{ componentField }" name="amount">
        <FormItem>
          <FormLabel> Amount</FormLabel>
          <FormControl>
            <UiInput
              type="number"
              step="0.001"
              min="0.001"
              max="300000"
              class="h-10 placeholder:text-muted-foreground"
              placeholder="Enter Amount"
              v-bind="componentField"
              :disabled="isLoading"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="paymentReference">
        <FormItem>
          <FormLabel> Remark</FormLabel>
          <FormControl>
            <UiInput
              type="text"
              class="h-10 placeholder:text-muted-foreground"
              placeholder="Enter Remark"
              v-bind="componentField"
              :disabled="isLoading"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <UiButton
        class="hover:bg-fuchsia-700 font-medium w-full text-sm xl:text-base mt-2 lg:mt-0"
        :disabled="isLoading"
      >
        <Icon
          name="svg-spinners:8-dots-rotate"
          v-if="isLoading"
          class="h-4 w-4 animate-spin"
        ></Icon>

        Intiate payment
      </UiButton>
    </div>
  </form>
</template>
