<script lang="ts" setup>
import { Icons } from "@/components/icons.jsx";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import type { Transaction } from "~/types";
import { useSocket } from '~/composables/useSocket';
import { formatAccountNumber } from "~/lib/formatAccountNumber";
import { toast } from "~/components/ui/toast";
import { shareQrCode } from "~/lib/shareQrCode";
import { downloadQrCode } from "~/lib/downloadQrCode";


const showFullAccountId = ref(false);
const paymentResponse = ref<Transaction | null>(null);
const qrImgRef = ref<HTMLImageElement | null>(null); // 1. Create the ref
const route = useRoute()
const isOtpSent = computed(() => route.query.sendOtp === 'true')

// Define props
const props = defineProps(["transactionDetails"]);
if (props) {
  paymentResponse.value = props.transactionDetails;
}

const { connect, disconnect, receivedMessages, state } = useSocket();


function toggleAccountIdVisibility() {
  showFullAccountId.value = !showFullAccountId.value;
}


if (paymentResponse.value?.merchantTransactionId && paymentResponse.value.paymentStatus == "PENDING") {
  connect(paymentResponse.value?.merchantTransactionId);
}

onUnmounted(() => {
  disconnect();
})

watch(receivedMessages, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    console.log("newVal", newVal);
    paymentResponse.value = {
      ...paymentResponse.value,
      ...newVal.transactionDTO,
      paymentStatus: newVal.status,
      completedDate: newVal.time,
    };
  }
});

</script>

<template>
  <div class="flex flex-col md:flex-row lg:flex-col gap-4 md:gap-8 justify-center h-full">
    <UiCard class="w-full h-fit relative bg-gray-700">
      <UiCardContent class="">
        <img src="/backgroundMap.png" alt="background" class="opacity-30 absolute top-0 left-0 w-full h-full z-0" />
        <UiCardHeader class="relative z-10">
          <UiCardTitle>
            <img src="/cbe-logo.png" alt="logo" class="h-fit w-full" />
          </UiCardTitle>
          <UiCardDescription class="grid gap-4 grid-cols-2 content-between py-6 text-white">
            <div>
              <p class="font-light text-gray-200 text-base">Account:</p>
              <div class="items-center flex gap-4">
                <p class="text-lg font-medium">
                  {{
                    paymentResponse?.merchantAccountNumber && (showFullAccountId ? typeof
                      paymentResponse?.merchantAccountNumber === "string"
                      ? paymentResponse.merchantAccountNumber
                      : "-" : formatAccountNumber(
                        typeof paymentResponse?.merchantAccountNumber === "string"
                          ? paymentResponse.merchantAccountNumber
                          : "-"
                      ))
                  }}
                </p>
                <Icons.hide v-if="showFullAccountId && paymentResponse?.merchantAccountNumber"
                  class="md:min-w-6 md:min-h-6 min-w-5 min-h-5 fill-white" @click="toggleAccountIdVisibility" />
                <Icons.view v-if="!showFullAccountId && paymentResponse?.merchantAccountNumber"
                  class="md:min-w-6 md:min-h-6 min-w-5 min-h-5 fill-white" @click="toggleAccountIdVisibility" />
              </div>
            </div>

            <div class="text-right">
              <p class="font-light text-gray-200 text-base">
                Payment Reference:
              </p>
              <p class="text-lg font-medium">
                {{ paymentResponse?.paymentReference }}
              </p>
            </div>

            <div>
              <p class="font-light text-gray-200 text-base">Amount:</p>
              <p class="text-lg font-medium">
                {{ paymentResponse?.amount }} Br.
              </p>
            </div>

            <div class="text-right">
              <p class="font-light text-gray-200 text-base">Dynamic Id:</p>
              <p class="text-lg font-medium">
                {{ paymentResponse?.dynamicId }}
              </p>
            </div>

            <UiCard
              class="w-fit flex justify-center items-center p-6 col-span-full place-self-center mt-4 bg-gray-50 dark:bg-white"
              v-if="paymentResponse">
              <img ref="qrImgRef"
                :src="`https://api.qrserver.com/v1/create-qr-code/?data=${paymentResponse?.qrEncodedData}`"
                alt="QR Code" />
            </UiCard>
            <div class="flex w-full flex-col items-center gap-2 justify-center col-span-full">
              <Icon v-if="paymentResponse?.paymentStatus == 'PENDING'" name="svg-spinners:8-dots-rotate"
                class="h-6 w-6 animate-spin text-yellow-500"></Icon>
              <div :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium flex flex-col items-center gap-2',
                {
                  'bg-green-600 text-white font-bold w-fit':
                    String(paymentResponse?.paymentStatus).toLowerCase() ===
                    'completed',
                  'bg-yellow-500 text-black font-bold w-fit':
                    String(paymentResponse?.paymentStatus).toLowerCase() ===
                    'pending',
                  'bg-red-600 text-white font-bold w-fit':
                    String(paymentResponse?.paymentStatus).toLowerCase() ===
                    'failed' ||
                    String(paymentResponse?.paymentStatus).toLowerCase() ===
                    'expired',
                },
              ]">
                <p>{{ paymentResponse?.paymentStatus }}</p>
              </div>
            </div>
          </UiCardDescription>
        </UiCardHeader>
        <div class="flex justify-end gap-4">
          <Icon @click="() => downloadQrCode(qrImgRef)" name="radix-icons:download"
            class="h-6 w-6 z-50 text-white cursor-pointer"></Icon>
          <Icon @click="() => shareQrCode(qrImgRef)" name="heroicons:share"
            class="h-6 w-6 z-50 text-white cursor-pointer"></Icon>
        </div>
      </UiCardContent>
    </UiCard>
    {{ }}
    <DashboardInitiatePaymentPushUssd v-if="String(paymentResponse?.paymentStatus).toLowerCase() === 'pending'"
      class="w-full min-h-max" :merchantTransactionId="paymentResponse?.merchantTransactionId" />
    <DashboardCompleteOtpPayment class="w-full h-fit" v-if="isOtpSent"
      :merchantTransactionId="paymentResponse?.merchantTransactionId" :customerPhone="paymentResponse?.customerPhone" />
  </div>
</template>
