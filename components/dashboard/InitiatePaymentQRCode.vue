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
const { generateQRCode, sendPushUssd, initiatePaymentOtp } = usePayment();
const { toast } = useToast();

const form = useForm({
  validationSchema: initiatePaymentFormSchema,
});

const sendPushUssdHandler = async (merchantTransactionId: string, customerPhone: string) => {
  // isLoading.value = true;
  const transactionData = {
    merchantTransactionId: merchantTransactionId,
    customerPhone: customerPhone,
  };

  try {
    const data = await sendPushUssd(transactionData);
    if (data) {
      toast({
        title: "Push USSD sent successfully.",
        description: data,
        variant: "default",
      });
      navigateTo(`/transactions/mine/${merchantTransactionId}`, { replace: true });
    }
  } catch (error) {
    console.error("Push ussd error: ", error);
  }
};

const sendOtpHandler = async (merchantTransactionId: string, customerPhone: string) => {
  // isLoading.value = true;
  const transactionData = {
    merchantTransactionId: merchantTransactionId,
    customerPhone: customerPhone,
  };

  try {
    const data = await initiatePaymentOtp(transactionData);
    if (data) {
      toast({
        title: "OTP sent successfully.",
        description: data?.message,
        variant: "default",
      });
      navigateTo(`/transactions/mine/${merchantTransactionId}`, { replace: true });
    }
  } catch (error) {
    console.error("OTP error: ", error);
  }
};

const onSubmit = form.handleSubmit(async (values: any) => {
  isLoading.value = true;
  try {
    const data = await generateQRCode(values);
    paymentResponse.value = data;
    if (data && values.customerPhone && data.merchantTransactionId && values.sendPushUssd) {
      await sendPushUssdHandler(data?.merchantTransactionId, values.customerPhone)
      router.push({
        name: "initTransactionDetail", // Replace with your route name
        query: {
          merchantTransactionId: data.merchantTransactionId,
          merchantAccountNumber: data.merchantAccountNumber,
          paymentReference: data.paymentReference || "Merchant trxn",
          amount: data.amount,
          qrEncodedData: data.qrEncodedData,
          dynamicId: data.dynamicId,
          paymentStatus: data.paymentStatus,
          customerPhone: values.customerPhone,
          sendPushUssd: values.sendPushUssd,
          sendOtp: values.sendOtp
        },
      });
    }
    if (data && values.customerPhone && data.merchantTransactionId && values.sendOtp) {
      await sendOtpHandler(data?.merchantTransactionId, values.customerPhone)
      router.push({
        name: "initTransactionDetail", // Replace with your route name
        query: {
          merchantTransactionId: data.merchantTransactionId,
          merchantAccountNumber: data.merchantAccountNumber,
          paymentReference: data.paymentReference || "Merchant trxn",
          amount: data.amount,
          qrEncodedData: data.qrEncodedData,
          dynamicId: data.dynamicId,
          paymentStatus: data.paymentStatus,
          customerPhone: values.customerPhone,
          sendPushUssd: values.sendPushUssd,
          sendOtp: values.sendOtp
        },
      });
    }
    else {
      router.push({
        name: "initTransactionDetail", // Replace with your route name
        query: {
          merchantTransactionId: data.merchantTransactionId,
          merchantAccountNumber: data.merchantAccountNumber,
          paymentReference: data.paymentReference || "Merchant trxn",
          amount: data.amount,
          qrEncodedData: data.qrEncodedData,
          dynamicId: data.dynamicId,
          paymentStatus: data.paymentStatus,
          customerPhone: values.customerPhone,
          sendPushUssd: values.sendPushUssd,
          sendOtp: values.sendOtp
        },
      });
      toast({
        title: "QR Code generated successfully.",
        variant: "default",
      });
    }
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
            <UiInput type="number" step="0.001" min="0.001" max="300000" class="h-10 placeholder:text-muted-foreground"
              placeholder="Enter Amount" v-bind="componentField" :disabled="isLoading" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <div class="grid md:grid-cols-2 w-full col-span-full gap-4">
        <FormField class="" v-slot="{ componentField }" name="customerPhone">
          <FormItem class="w-full">
            <FormLabel> Phone</FormLabel>
            <FormControl>
              <UiInput class="h-10 placeholder:text-muted-foreground wf"
                placeholder="Enter phone number to send push ussd" v-bind="componentField" :disabled="isLoading" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="paymentReference">
          <FormItem>
            <FormLabel> Remark</FormLabel>
            <FormControl>
              <UiInput type="text" class="h-10 w-full placeholder:text-muted-foreground" placeholder="Enter Remark"
                v-bind="componentField" :disabled="isLoading" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
      <div class="grid md:grid-cols-2 gap-4" v-if="form.values.customerPhone">
        <FormField v-slot="{ value, handleChange }" name="sendPushUssd">
          <FormItem class="flex flex-row items-end justify-between rounded-lg border px-4 pb-2 w-full">
            <FormLabel class="text-base"> Send Push USSD </FormLabel>
            <FormControl>
              <UiSwitch :checked="value" @update:checked="handleChange" />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField v-slot="{ value, handleChange }" name="sendOtp">
          <FormItem class="flex flex-row items-end justify-between rounded-lg border px-4 pb-2 w-full">
            <FormLabel class="text-base"> Send OTP </FormLabel>
            <FormControl>
              <UiSwitch :checked="value" @update:checked="handleChange" />
            </FormControl>
          </FormItem>
        </FormField>
      </div>
      <UiButton class="hover:bg-fuchsia-700 font-medium w-full text-sm xl:text-base mt-2 lg:mt-0" :disabled="isLoading">
        <Icon name="svg-spinners:8-dots-rotate" v-if="isLoading" class="h-4 w-4 animate-spin"></Icon>

        Initiate Payment
      </UiButton>
    </div>
  </form>
</template>
