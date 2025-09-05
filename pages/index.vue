<script setup lang="ts">
import { Skeleton } from "~/components/ui/skeleton";
import { Icons } from "~/components/icons";
import type { Transaction } from "~/types";
import { PermissionConstants } from "~/constants/permissions";

const { getAllTransactions, getMyTransactions } = useTransactions();
const isLoading = ref(true);
const transactionData = ref<Transaction[]>([]);
const todaysTransactions = ref<Transaction[]>([]);
const showFullAvailableBalance = ref(false);
const showFullCurrentBalance = ref(false);
const currentPaymentSummaryOption = ref("Daily");
const transactionsNumber = ref();


const paymentSummaryOptions = computed(() => [
  "Daily",
  "Weekly",
  "Monthly",
  "Yearly",
]);

function formatAvailableBalance(
  balance: string,
  showFullBalance: any,
  type: string
) {
  if (showFullBalance) {
    return balance;
  } else {
    if (type == "balance") {
      return "*".repeat(balance.length);
    } else {
      const firstFourDigits = balance.substring(0, 4);
      const lastTwoDigits = balance.substring(balance.length - 2);
      const asterisks = "*".repeat(balance.length - 6);
      return `${firstFourDigits}${asterisks}${lastTwoDigits}`;
    }
  }
}

function toggleAvailableBalanceVisibility(showFullBalance: string) {
  if (showFullBalance == "showFullAvailableBalance") {
    showFullAvailableBalance.value = !showFullAvailableBalance.value;
  } else {
    showFullCurrentBalance.value = !showFullCurrentBalance.value;
  }
}

const totalTransactionAmount = computed(() => {
  const today = new Date();
  let startOfPeriod = new Date();
  let endOfPeriod = new Date();

  switch (currentPaymentSummaryOption.value) {
    case "Daily":
      transactionsNumber.value = todaysTransactions.value.length;
      return todaysTransactions.value.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );
    case "Weekly":
      // Set to start of week (Sunday)
      startOfPeriod.setDate(today.getDate() - today.getDay());
      startOfPeriod.setHours(0, 0, 0, 0);
      // Set to end of week (Saturday 23:59:59)
      endOfPeriod = new Date(startOfPeriod);
      endOfPeriod.setDate(startOfPeriod.getDate() + 6);
      endOfPeriod.setHours(23, 59, 59, 999);
      break;
    case "Monthly":
      // Start of month
      startOfPeriod = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
      // End of month
      endOfPeriod = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    case "Yearly":
      // Start of year
      startOfPeriod = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
      // End of year
      endOfPeriod = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    default:
      return 0; // Fallback
  }
  // Filter transactions based on the selected period
  const filteredTransactions = transactionData.value.filter((transaction) => {
    const transactionDate = new Date(transaction.expirationDate);
    return transactionDate >= startOfPeriod && transactionDate <= endOfPeriod;
  });
  transactionsNumber.value = filteredTransactions.length;
  return filteredTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );
});

try {
  // Get yesterday's date in ISO string format
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  // transactionData.value = await getAllTransactions(
  //   " ",
  //   "0",
  //   "100000000000",
  //   "DESC",
  //   // `${yesterday.toISOString()}`
  // ) || [];
   const response = await getMyTransactions(" ",
    "0",
    "1000000000",
    "DESC");
    transactionData.value = response?.slice()?.sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime());
    todaysTransactions.value = transactionData.value.filter((transaction) => {
    const transactionDate = new Date(transaction.expirationDate); // Assuming 'date' is the field for transaction date
    const today = new Date();
    return (
      transactionDate.getDate() === today.getDate() &&
      transactionDate.getMonth() === today.getMonth() &&
      transactionDate.getFullYear() === today.getFullYear()
    );
  });
  transactionsNumber.value = todaysTransactions.value.length;
} catch (error) {
  console.error("Error fetching data:", error);
} finally {
  isLoading.value = false;
}

watch(
  transactionData,
  (newData) => {
    // console.log("Transaction Data in index.vue:", newData);
  },
  { immediate: true }
);
</script>

<template>
  <div class="md:space-y-8 space-y-6 ">
    <!-- Loading Indicator Skeleton -->
    <div
      class="grid gap-4 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      v-if="isLoading"
    >
      <div class="h-32 flex flex-col gap-4 shadow-md rounded-3xl p-8">
        <UiSkeleton class="h-32 w-20 bg-slate-300" />
        <UiSkeleton class="h-32 w-10 bg-slate-300" />
        <UiSkeleton class="h-32 w-20 bg-slate-300" />
      </div>
      <div class="h-32 flex flex-col gap-4 shadow-md rounded-3xl p-8">
        <UiSkeleton class="h-32 w-20 bg-slate-300" />
        <UiSkeleton class="h-32 w-10 bg-slate-300" />
        <UiSkeleton class="h-32 w-20 bg-slate-300" />
      </div>
      <div class="h-32 flex flex-col gap-4 shadow-md rounded-3xl p-8">
        <UiSkeleton class="h-32 w-20 bg-slate-300" />
        <UiSkeleton class="h-32 w-10 bg-slate-300" />
        <UiSkeleton class="h-32 w-20 bg-slate-300" />
      </div>
    </div>

    <div
      v-else
      class="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-7 xl:grid-cols-9"
    >
      <!-- Account list and total balance -->
      <UiCard
        class="col-span-1 lg:col-span-4 xl:col-span-5 max-h-min shadow-md rounded-3xl flex flex-col justify-between relative"
      >
        <img
          src="/backgroundMap.png"
          alt="background"
          class="opacity-90 dark:opacity-50 absolute top-0 left-0 w-full h-full z-0"
        />
        <UiCardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10"
        >
          <UiCardTitle class="font-semibold text-primary text-xl"
            >My {{ currentPaymentSummaryOption }} Sales</UiCardTitle
          >

          <UiSelect name="paymentStatus" v-model="currentPaymentSummaryOption">
            <UiSelectTrigger
              class="h-8 w-[100px] z-10 border border-muted-foreground/30"
            >
              <UiSelectValue :placeholder="`${currentPaymentSummaryOption}`" />
            </UiSelectTrigger>
            <UiSelectContent side="bottom">
              <UiSelectItem
                v-for="option in paymentSummaryOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </UiSelectItem>
            </UiSelectContent>
          </UiSelect>
        </UiCardHeader>
        <UiCardContent
          class="h-full flex justify-center flex-col gap-1 relative z-10"
        >
          <div class="flex items-center gap-6">
            <p class="text-2xl font-bold">
              {{
                isLoading
                  ? "Loading..."
                  : `${
                      totalTransactionAmount
                        ? formatAvailableBalance(
                            totalTransactionAmount.toFixed(2),
                            showFullAvailableBalance,
                            "balance"
                          )
                        : "----"
                    } `
              }}
              {{ todaysTransactions?.[0]?.currencyCode }}
            </p>
            <Icons.hide
              v-if="showFullAvailableBalance"
              class="md:w-7 md:h-7 w-5 h-5 fill-muted-foreground"
              @click="
                toggleAvailableBalanceVisibility('showFullAvailableBalance')
              "
            />
            <Icons.view
              v-else
              class="md:w-7 md:h-7 w-5 h-5 dark:fill-white"
              @click="
                toggleAvailableBalanceVisibility('showFullAvailableBalance')
              "
            />
          </div>
          <p class="text-base text-[#CDA352]">
            {{
              isLoading
                ? "Loading..."
                : `Merchant AC - ${
                    transactionData?.[0]?.merchantAccountNumber
                      ? formatAvailableBalance(
                          transactionData?.[0]?.merchantAccountNumber,
                          showFullAvailableBalance,
                          "merchantAccountNumber"
                        )
                      : "N/A"
                  }`
            }}
          </p>
          <p class="text-sm text-muted-foreground">
            {{ new Date().toLocaleString() }}
          </p>
        </UiCardContent>
        <div class="bg-primary w-full mt-auto rounded-b-3xl p-6">
          <p class="text-lg text-primary-foreground">
            Total Sales Count: {{ transactionsNumber }}
          </p>
        </div>
      </UiCard>

      <!-- Initiate payment -->
    <UiPermissionGuard :permission="PermissionConstants.INIT_MERCHANT_TRANSACTION">
      <UiCard
        class="col-span-1 lg:col-span-3  max-h-min xl:col-span-4 p-6 space-y-4 w-full"
      >
        <h1 class="font-semibold text-xl col-span-full flex-1 w-full block">
          Initiate Payment
        </h1>
        <DashboardInitiatePaymentQRCode />
      </UiCard>
      </UiPermissionGuard>
    </div>

    <div
      class="grid gap-4 md:gap-8 max-h-[400px] grid-cols-1 md:grid-cols-2 lg:grid-cols-7 xl:grid-cols-9"
    >
      <!-- Account Overview -->
      <!-- <UiPermissionGuard :permission="PermissionConstants.READ_MERCHANT_OPERATOR_TRANSACTION"> -->
      <UiCard
        class="col-span-1 lg:col-span-4 max-h-[450px] xl:col-span-5 shadow-md rounded-xl"
      >
        <UiCardHeader>
          <UiCardTitle>Overview</UiCardTitle>
        </UiCardHeader>
        <UiCardContent class="pl-2">
          <DashboardOverview :transactionData="transactionData" />
        </UiCardContent>
      </UiCard>
      <!-- </UiPermissionGuard> -->

    <!-- <UiPermissionGuard :permission="PermissionConstants.READ_MERCHANT_OPERATOR_TRANSACTION"> -->
      <!-- Recent Transactions -->
      <UiCard
        class="col-span-1 lg:col-span-3 max-h-[450px] xl:col-span-4 shadow-md rounded-xl"
      >
        <UiCardHeader>
          <div class="flex justify-between w-full items-center">
            <div class="space-y-1">
              <UiCardTitle>Recent Sales</UiCardTitle>
              <UiCardDescription class="text-xs">
                Your recent 20 transactions.
              </UiCardDescription>
            </div>
            <NuxtLink class="text-primary text-sm" to="/transactions">
              View All
            </NuxtLink>
          </div>
        </UiCardHeader>
        <UiCardContent>
          <DashboardRecentSales :transactionData="transactionData" />
        </UiCardContent>
      </UiCard>
      <!-- </UiPermissionGuard> -->
    </div>
  </div>
</template>
