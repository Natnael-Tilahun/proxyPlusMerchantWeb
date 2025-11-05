<script lang="ts" setup>
import { useRoute } from "vue-router";
import { Icons } from "@/components/icons.jsx";
import { useSocket } from '~/composables/useSocket';
import { formatAccountNumber } from "~/lib/formatAccountNumber";
import { downloadQrCode } from "~/lib/downloadQrCode";
import { shareQrCode } from "~/lib/shareQrCode";

const route = useRoute();
const paymentResponse = ref<any>(route.query);
const showFullAccountId = ref(false);
const transactionId = ref<string | null>(null);
const openConfirmationModal = ref(false);
const qrImgRef = ref<HTMLImageElement | null>(null); // 1. Create the ref
const isOtpSent = computed(() => route.query.sendOtp === 'true')

const setOpenConfirmationModal = (value: boolean) => {
  openConfirmationModal.value = value;
};

const closeConfirmationModal = () => {
  openConfirmationModal.value = false;
  navigateTo("/");
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString();
};

transactionId.value = paymentResponse.value.merchantTransactionId as string;
const { connect, disconnect, receivedMessages, state } = useSocket();

onMounted(() => {
  if (paymentResponse.value.paymentStatus == "PENDING") {
    connect(transactionId.value || "");
  }
});

function toggleAccountIdVisibility() {
  showFullAccountId.value = !showFullAccountId.value;
}

onUnmounted(() => {
  disconnect();
})


watch(receivedMessages, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    paymentResponse.value = {
      ...paymentResponse.value,
      ...newVal.transactionDTO,
      paymentStatus: newVal.status,
      completedDate: newVal.time,
    };
    setOpenConfirmationModal(true);
  }
});
</script>

<template>
  <div class="flex flex-col md:flex-row w-full gap-4 md:gap-8 justify-center h-full">
    <UiCard class="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 h-fit relative bg-gray-700">
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
                    showFullAccountId ? typeof paymentResponse?.merchantAccountNumber === "string"
                      ? paymentResponse.merchantAccountNumber
                      : "-" : formatAccountNumber(
                        typeof paymentResponse?.merchantAccountNumber === "string"
                          ? paymentResponse.merchantAccountNumber
                          : "-"
                      )
                  }}
                </p>
                <Icons.hide v-if="showFullAccountId" class="md:w-6 md:h-6 w-5 h-5 fill-white"
                  @click="toggleAccountIdVisibility" />
                <Icons.view v-else class="md:w-6 md:h-6 w-5 h-5 fill-white" @click="toggleAccountIdVisibility" />
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
                :src="`https://api.qrserver.com/v1/create-qr-code/?data=${paymentResponse.qrEncodedData}`"
                alt="QR Code" />
            </UiCard>
            <div class="flex w-full justify-center col-span-full">
              <div class="flex flex-col items-center gap-2">
                <Icon v-if="paymentResponse.paymentStatus == 'PENDING'" name="svg-spinners:8-dots-rotate"
                  class="h-6 w-6 animate-spin text-green-500"></Icon>
                <p>{{ paymentResponse.paymentStatus }}</p>
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
    <div class="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 min-h-max gap-4 flex flex-col">
        <DashboardInitiatePaymentPushUssd class="w-full h-fit"
          :merchantTransactionId="paymentResponse?.merchantTransactionId" :customerPhone="paymentResponse.customerPhone"   />
        <DashboardCompleteOtpPayment class="w-full h-fit" v-if="isOtpSent"
          :merchantTransactionId="paymentResponse?.merchantTransactionId" :customerPhone="paymentResponse.customerPhone" />
    </div>

  </div>
  <UiDialog :open="openConfirmationModal" :onOpenChange="setOpenConfirmationModal">
    <UiDialogContent class="max-w-md w-full rounded-xl overflow-y-scroll shadow-lg bg-white dark:bg-zinc-900 p-0">
      <div class="flex flex-col items-center py-8 px-6">
        <!-- Success Icon -->
        <div class="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Icon name="heroicons:check-circle" class="h-12 w-12 text-green-500" />
        </div>
        <!-- Title -->
        <UiDialogTitle class="text-2xl font-bold text-green-700 mb-2 text-center">
          Transaction Completed
        </UiDialogTitle>
        <!-- Divider -->
        <div class="w-12 border-b-2 border-green-200 mb-4"></div>
        <!-- Summary -->
        <UiDialogDescription class="text-base text-center text-zinc-700 dark:text-zinc-200 mb-4">
          <span class="font-semibold text-lg text-green-700">
            {{ paymentResponse?.currencyCode }} {{ paymentResponse?.amount }}
          </span>
          <span> has been paid from </span>
          <span class="font-semibold">{{ paymentResponse?.payerName }}</span>
          <span> ({{ paymentResponse?.currencyCode }}-{{ paymentResponse?.payerAccountNumber?.slice(-4) }}) for </span>
          <span class="font-semibold">{{ paymentResponse?.merchantName || '-' }}</span>
          <span> ({{ paymentResponse?.currencyCode }}-{{ paymentResponse?.merchantAccountNumber?.slice(-4) }})</span>
        </UiDialogDescription>
        <!-- Details -->
        <div class="w-full text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 mb-4">
          <div class="flex justify-between mb-2">
            <span class="font-medium">Payer Name:</span>
            <span>{{ paymentResponse?.payerName }}</span>
          </div>
          <!-- <div class="flex justify-between mb-2">
            <span class="font-medium">Operator Name:</span>
            <span>{{ paymentResponse?.operatorName || 'N/A' }}</span>
          </div> -->
          <div class="flex justify-between mb-2">
            <span class="font-medium">Payment Reference:</span>
            <span>{{ paymentResponse?.paymentReference }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="font-medium">Date:</span>
            <span>{{ formatDate(paymentResponse?.time || paymentResponse?.completedDate) }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="font-medium">Transaction ID:</span>
            <span>{{ paymentResponse?.coreTransactionId }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="font-medium">Tip Amount:</span>
            <span>{{ paymentResponse?.currencyCode }} {{ paymentResponse?.tipAmount }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">Status:</span>
            <span class="text-green-600 font-semibold">{{ paymentResponse?.paymentStatus }}</span>
          </div>
        </div>
        <!-- Close Button -->
        <UiDialogFooter class="w-full flex justify-center">
          <UiDialogClose as-child>
            <UiButton variant="default"
              class="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-2 rounded-lg shadow"
              @click="closeConfirmationModal()">
              Close
            </UiButton>
          </UiDialogClose>
        </UiDialogFooter>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
