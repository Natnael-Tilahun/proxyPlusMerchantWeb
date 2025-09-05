<!-- pages/transactions/[id].vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { formatAccountNumber } from "~/lib/formatAccountNumber";
import type { Transaction } from "~/types";

const route = useRoute();
const { getTransactionById } = useTransactions();
const isLoading = ref(false);
const transactionData = ref<Transaction | null>(null);
const transactionId = ref<string | null>(null);
definePageMeta({
   hideBreadcrumb: true,
});

const { connect, disconnect, receivedMessages, state } = useSocket();
const openConfirmationModal = ref(false);
const setOpenConfirmationModal = (value: boolean) => {
  openConfirmationModal.value = value;
};

try {
  isLoading.value = true;
  const id = route.query.transactionId as string;
  transactionData.value = await getTransactionById(id);
  transactionId.value = transactionData.value?.merchantTransactionId;
  if (transactionData.value?.paymentStatus == "PENDING" && transactionData.value?.merchantTransactionId) {
    connect(transactionId.value || "");
  }
} catch (error) {
  console.error("Error fetching transaction details:", error);
} finally {
  isLoading.value = false;
}

watch(receivedMessages, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    transactionData.value = {
      ...transactionData.value,
      ...newVal.transactionDTO,
      paymentStatus: newVal.status,
      completedDate: newVal.time,
    };
    setOpenConfirmationModal(true);
  }
});

onUnmounted(() => {
  disconnect();
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleString();
};

const closeConfirmationModal = () => {
  setOpenConfirmationModal(false)
  navigateTo("/");
};

</script>

<template>
  <div class="w-full flex flex-col gap-8">
    <div class="pt-4">
      <h1 class="md:text-2xl text-lg font-medium">Transaction Details</h1>
      <p class="text-sm text-muted-foreground">View transaction information</p>
    </div>

    <UiCard v-if="isLoading" class="p-6 ">
      <div class="grid md:grid-cols-2 gap-6 ">
        <UiSkeleton v-for="n in 8" :key="n" class="h-16 w-full" />
      </div>
    </UiCard>

    <UiCard v-else-if="transactionData" class="p-6 grid lg:grid-cols-5 gap-8 w-full">
      <div class="w-full   lg:col-span-2">
        <DashboardTransactionDetail :transactionDetails="transactionData" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 md:col-span-2 lg:col-span-3  gap-6 w-full">
        <TransactionsTransactionDetailItem label="Merchant Transaction Id"
          :value="transactionData?.merchantTransactionId" />
        <TransactionsTransactionDetailItem label="Merchant Id" :value="transactionData?.merchantId" />
        <TransactionsTransactionDetailItem label="Merchant Name" :value="transactionData?.merchantName" />
        <TransactionsTransactionDetailItem label="Merchant City" :value="transactionData?.merchantCity" />
        <TransactionsTransactionDetailItem label="Merchant Branch Id" :value="transactionData?.merchantBranchId" />
        <TransactionsTransactionDetailItem label="Merchant Branch Name" :value="transactionData?.merchantBranchName" />
        <TransactionsTransactionDetailItem label="Operator Id" :value="transactionData?.operatorId" />
        <TransactionsTransactionDetailItem label="Operator Name" :value="transactionData?.operatorName" />

        <TransactionsTransactionDetailItem label="Amount"
          :value="transactionData.amount + ' ' + transactionData.currencyCode" />
        <TransactionsTransactionDetailItem label="Currency Code" :value="transactionData?.currencyCode" />
        <TransactionsTransactionDetailItem label="PaymentReference" :value="transactionData?.paymentReference" />
        <TransactionsTransactionDetailItem label="Tip Amount" :value="transactionData?.tipAmount" />
        <TransactionsTransactionDetailItem label="Dynamic Id" :value="transactionData?.dynamicId" />

        <TransactionsTransactionDetailItem label="Transaction Status" :value="transactionData?.paymentStatus"
          :status="true" />
        <TransactionsTransactionDetailItem label="Transaction Completed Date"
          :value="formatDate(transactionData.completedDate)" />
        <TransactionsTransactionDetailItem label="Expiration Date"
          :value="formatDate(transactionData.expirationDate)" />
        <TransactionsTransactionDetailItem label="Transaction Initiator"
          :value="transactionData.transactionInitiator" />
        <TransactionsTransactionDetailItem label="MbTransaction Id" :value="transactionData?.mbTransactionId" />
        <TransactionsTransactionDetailItem label="Core Transaction Id" :value="transactionData?.coreTransactionId" />
        <TransactionsTransactionDetailItem label="Merchant Account Number"
          :value="transactionData?.merchantAccountNumber  && formatAccountNumber(typeof transactionData.merchantAccountNumber === 'string' ? transactionData.merchantAccountNumber: '-')" />
        <TransactionsTransactionDetailItem label="Payer AccountNumber" :value="transactionData?.payerAccountNumber?.length && formatAccountNumber(typeof transactionData.payerAccountNumber === 'string' ? transactionData.payerAccountNumber: '-')" />
        <TransactionsTransactionDetailItem label="Payer Id" :value="transactionData?.payerId" />
        <TransactionsTransactionDetailItem label="Payer Name" :value="transactionData?.payerName" />
        <TransactionsTransactionDetailItem label="Payer Phone" :value="transactionData?.payerPhone" />
      </div>
    </UiCard>

    <UiCard v-else class="p-6">
      <p class="text-center text-muted-foreground">Transaction not found.</p>
    </UiCard>
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
            {{ transactionData?.currencyCode }} {{ transactionData?.amount }}
          </span>
          <span> has been paid from </span>
          <span class="font-semibold">{{ transactionData?.payerName }}</span>
          <span> ({{ transactionData?.currencyCode }}-{{ transactionData?.payerAccountNumber?.slice(-4) }}) for </span>
          <span class="font-semibold">{{ transactionData?.merchantName || '-' }}</span>
            <span> ({{ transactionData?.currencyCode }}-{{ transactionData?.merchantAccountNumber?.slice(-4) }})</span>
          </UiDialogDescription>
        <!-- Details -->
        <div class="w-full text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 mb-4">
          <div class="flex justify-between mb-2">
            <span class="font-medium">Payer Name:</span>
            <span>{{ transactionData?.payerName }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="font-medium">Operator Name:</span>
            <span>{{ transactionData?.operatorName || 'N/A' }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="font-medium">Payment Reference:</span>
            <span>{{ transactionData?.paymentReference }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="font-medium">Date:</span>
            <span>{{ formatDate(transactionData?.time || transactionData?.completedDate) }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="font-medium">Transaction ID:</span>
            <span>{{ transactionData?.coreTransactionId }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="font-medium">Tip Amount:</span>
            <span>{{ transactionData?.currencyCode }} {{ transactionData?.tipAmount }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">Status:</span>
            <span class="text-green-600 font-semibold">{{ transactionData?.paymentStatus }}</span>
          </div>
        </div>
        <!-- Close Button -->
        <UiDialogFooter class="w-full flex justify-center">
          <UiDialogClose as-child>
            <UiButton
              variant="solid"
              class="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-2 rounded-lg shadow"
              @click="closeConfirmationModal()"
            >
              Close
            </UiButton>
          </UiDialogClose>
        </UiDialogFooter>
      </div>
    </UiDialogContent>
  </UiDialog>
  
</template>
