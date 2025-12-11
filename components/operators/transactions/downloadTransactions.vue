<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { jsPDF } from "jspdf";
import { useTransactions } from "~/composables/useTransactions";
import { format } from "date-fns";
import { cn, getIdFromPath } from "~/lib/utils";
import { Calendar as CalendarIcon } from "lucide-vue-next";
import { Icons } from "~/components/icons";
import type { Transaction } from "~/types";

const transactionData = ref<Transaction[]>([]);
const isLoading = ref(true);
const isError = ref(false);
const { getTransactionsByOperatorId } = useTransactions();
const startDate = ref<Date>();
const endDate = ref<Date>();
const selectedAccount = ref<string>();
const operatorId = ref<string>("");
operatorId.value = getIdFromPath();

// Fetch transaction data based on the account ID or other parameters
async function fetchTransactionData() {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    isLoading.value = true;
    const response = await getTransactionsByOperatorId(operatorId.value);
    transactionData.value = response
      ?.slice()
      ?.sort(
        (a, b) =>
          new Date(b.expirationDate).getTime() -
          new Date(a.expirationDate).getTime()
      );
    selectedAccount.value = transactionData.value[0]?.merchantAccountNumber;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
}

fetchTransactionData();

onMounted(() => {
  fetchTransactionData();
});

function downloadStatement() {
  let component: HTMLElement = <HTMLElement>document.getElementById("facture");

  let componentWidth = component.offsetWidth;
  let screenHeight = window.screen.height;
  let screenWidth = window.screen.width;
  let doc: any = "";

  if (screenWidth <= 1200) {
    component.style.width = "1500px";
    doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [1200, screenHeight],
      compress: true,
    });
  } else {
    doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [componentWidth, screenHeight],
      compress: true,
    });
  }

  doc.html(component, {
    margin: [10, 0, 50, 0],
    callback: function (doc: any) {
      doc.save(`Merchant Transaction Statement.pdf`);
      component.style.width = "";
    },
    x: 0,
    y: 0,
    autoPaging: "text",
  });
}
</script>

<template>
  <div class="space-y-12 py-6">
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4"
    >
      <div class="flex flex-col md:items-start gap-2">
        <h1 class="text-foreground text-base">Select Statement Duration:</h1>
        <div class="flex flex-col md:flex-row gap-8">
          <UiPopover>
            <UiPopoverTrigger as-child>
              <UiButton
                :variant="'outline'"
                :class="
                  cn(
                    'md:w-fit w-full rounded-lg justify-start text-left font-medium text-base',
                    !startDate && 'text-secondary-foreground'
                  )
                "
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                <span>{{
                  startDate ? format(startDate, "PPP") : "DD/MM/YYYY"
                }}</span>
                <Icons.arrowDown class="ml-4 h-4 w-4" />
              </UiButton>
            </UiPopoverTrigger>
            <UiPopoverContent class="w-auto p-0">
              <UiCalendar v-model="startDate" />
            </UiPopoverContent>
          </UiPopover>
          <UiPopover>
            <UiPopoverTrigger as-child>
              <UiButton
                :variant="'outline'"
                :class="
                  cn(
                    'md:w-fit w-full rounded-lg justify-start text-left font-medium text-base mr-auto',
                    !endDate && 'text-secondary-foreground'
                  )
                "
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                <span>{{
                  endDate ? format(endDate, "PPP") : "DD/MM/YYYY"
                }}</span>
                <Icons.arrowDown class="ml-4 h-4 w-4" />
              </UiButton>
            </UiPopoverTrigger>
            <UiPopoverContent class="w-auto p-0">
              <UiCalendar v-model="endDate" />
            </UiPopoverContent>
          </UiPopover>
        </div>
      </div>
      <UiButton class="px-8" @click="downloadStatement"
        >Download Pdf
        <Icons.download class="ml-4 h-4 w-4" />
      </UiButton>
    </div>
    <div
      id="facture"
      class="bg-[#FCFCFC] dark:bg-secondary md:space-y-2 w-full py-4 md:px-7 px-4 border rounded-md"
    >
      <div class="gap-2 justify-between grid grid-cols-1 md:grid-cols-3">
        <img src="/logo1.png" class="md:w-fit h-fit" alt="Logo" />
        <div class="md:space-y-2 space-y-0 flex flex-col lg:items-center">
          <h1 class="lg:text-xl md:text-lg text-sm">
            Operator <span> </span> Transaction <span> </span> Statement
          </h1>
          <div
            class="flex items-center text-primary text-xs md:text-sm lg:text-base gap-4 tracking-wider"
          >
            <p class="">
              {{ startDate ? startDate?.toLocaleDateString() : "" }}
            </p>
            <span class="text-accent-foreground">
              {{ startDate ? "-" : "" }}</span
            >
            <p class="">
              {{ endDate ? endDate?.toLocaleDateString() : "" }}
            </p>
          </div>
        </div>
        <p class="md:text-base text-xs text-right w-full">
          Date: {{ new Date().toLocaleDateString() }}
        </p>
      </div>

      <div
        class="space-y-2 py-6 xl:w-1/3 text-xs md:text-sm md:w-2/3 lg:w-1/2 w-full max-w-full"
      >
        <div class="grid grid-cols-2 w-full gap-4">
          <p class="font-bold">Merchant Name:</p>
          <p>{{ transactionData[0]?.merchantName }}</p>
        </div>
        <div class="grid grid-cols-2 w-full gap-4">
          <p class="font-bold">Account Number:</p>
          <p>{{ transactionData[0]?.merchantAccountNumber }}</p>
        </div>
        <div class="grid grid-cols-2 w-full gap-4">
          <p class="font-bold">Account Type:</p>
          <p>Merchant Account</p>
        </div>
        <div class="grid grid-cols-2 w-full gap-4">
          <p class="font-bold">Account Currency:</p>
          <p>{{ transactionData[0]?.currencyCode }}</p>
        </div>
      </div>

      <UiTable class="border-t-[1px]">
        <UiTableHeader>
          <UiTableRow>
            <UiTableHead class="w-[100px]"> # </UiTableHead>
            <UiTableHead class="uppercase font-semibold text-xs md:text-sm"
              >Transaction ID</UiTableHead
            >
            <UiTableHead
              class="uppercase text-left font-semibold md:text-sm text-xs"
              >Payment Reference</UiTableHead
            >
            <UiTableHead
              class="text-left uppercase font-semibold md:text-sm text-xs"
            >
              Transaction Initiator
            </UiTableHead>
            <UiTableHead
              class="text-left uppercase font-semibold md:text-sm text-xs"
            >
              Amount
            </UiTableHead>
            <UiTableHead
              class="text-right uppercase font-semibold md:text-sm text-xs"
            >
              Expiration Date
            </UiTableHead>
          </UiTableRow>
        </UiTableHeader>
        <UiTableBody class="md:text-sm text-xs">
          <UiTableRow
            v-for="(transaction, index) in transactionData"
            :key="index"
          >
            <UiTableCell class="font-medium md:text-sm text-xs">
              {{ index }}
            </UiTableCell>
            <UiTableCell class="font-medium md:text-sm text-xs uppercase">
              <div>
                <p class="">{{ transaction.merchantTransactionId }}</p>
                <p class="text-xs text-[#2DD683] capitalize">Deposit</p>
              </div>
            </UiTableCell>
            <UiTableCell>{{ transaction.paymentReference }}</UiTableCell>
            <UiTableCell class="text-left">
              {{ transaction.transactionInitiator }}
            </UiTableCell>
            <UiTableCell class="text-left">
              <p class="text-[#2DD683]">+ {{ transaction?.amount }}</p>
            </UiTableCell>
            <UiTableCell class="text-right">
              {{ format(new Date(transaction.expirationDate), "MM/dd/yyyy") }}
            </UiTableCell>
          </UiTableRow>
        </UiTableBody>
      </UiTable>
    </div>
  </div>
</template>
