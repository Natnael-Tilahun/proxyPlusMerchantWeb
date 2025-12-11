<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { initiatePaymentPushUssdFormSchema } from "~/validations/initiatePaymentPushUssdFormSchema.js";
import { defineProps } from "vue";
import { Toast, ToastAction, useToast } from "~/components/ui/toast";

const isLoading = ref(false);
const { sendPushUssd, initiatePaymentOtp } = usePayment();
const { toast } = useToast();
const router = useRouter()
const route = useRoute()
const paymentResponse = ref<any>(route.query);
const isOtpSent = computed(() => route.query.sendOtp === 'true')


const form = useForm({
  validationSchema: initiatePaymentPushUssdFormSchema,
});

// Define props
const props = defineProps(["merchantTransactionId", "customerPhone"]);

const onSubmit = form.handleSubmit(async (values: any) => {
  isLoading.value = true;
  const transactionData = {
    merchantTransactionId: props.merchantTransactionId,
    customerPhone: values.customerPhone,
  };

  try {
    const data = await sendPushUssd(transactionData);
    if (data) {
      toast({
        title: "Push USSD sent successfully.",
        description: data,
        variant: "default",
      });
      navigateTo(`/transactions/mine/${props.merchantTransactionId}`, { replace: true });
    }
  } catch (error) {
    console.error("Login error: ", error);
  } finally {
    isLoading.value = false;
  }
});

const sendOtpHandler = async () => {
  // isLoading.value = true;
  const transactionData = {
    merchantTransactionId: props.merchantTransactionId,
    customerPhone: props.customerPhone || form.values.customerPhone,
  };

  if(!transactionData.customerPhone){
    toast({
      title: "Please insert phone number first",
      description: "You need to insert a phone number to send an OTP.",
      variant: "destructive"
    })
    form.setErrors({customerPhone: "Phone number is required."})
    return
  }

  try {
    const data = await initiatePaymentOtp(transactionData);
    if (data) {
      toast({
        title: "OTP sent successfully.",
        description: data?.message,
        variant: "default",
      });
      router.push({
        name: route.name, // Use the current route's name
        query: {
          ...paymentResponse.value,
          customerPhone: transactionData.customerPhone,
          sendOtp: true
        },
        replace: true
      });
      // navigateTo(`/transactions/mine/${merchantTransactionId}`, { replace: true });
    }
  } catch (error) {
    console.error("OTP error: ", error);
  }
};

</script>

<template>
  <UiCard :class="['w-full h-full p-6', $props.class].join(' ')">
    <form @submit="onSubmit">
      <div class="flex flex-col justify-betwee h-full gap-4 md:gap-6">
        <div class="md:space-y-6 space-y-4">
          <p class="font-semibold text-xl text-center">Send Push USSD</p>
          <FormField v-slot="{ componentField }" name="customerPhone">
            <FormItem>
              <FormLabel> Phone No.</FormLabel>
              <FormControl>
                <UiInput type="text" class="h-10" placeholder="Enter phone number" v-bind="componentField"
                  :disabled="isLoading" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <UiButton class="hover:bg-fuchsia-800 text-base font-medium w-full" :disabled="isLoading">
          <Icon name="svg-spinners:8-dots-rotate" v-if="isLoading" class="mr-2 h-4 w-4 animate-spin"></Icon>

          Send Push USSD
        </UiButton>
      </div>
      <div class="flex justify-end" v-if="!isOtpSent" >
        <UiButton type="button" @click="sendOtpHandler" variant="link">Send OTP</UiButton>
      </div>
    </form>
  </UiCard>
</template>
