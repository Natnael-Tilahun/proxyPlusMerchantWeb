```vue
<script setup lang="ts">
import { Skeleton } from "~/components/ui/skeleton";
import { Icons } from "~/components/icons";
import type { Transaction } from "~/types";
import { PermissionConstants } from "~/constants/permissions";

// --- Recent Sales (List) ---
const {
  transactions: recentTransactionsRaw,
  loading: recentLoading,
  size: recentSize,
  fetchTransactions: fetchRecent,
} = useTransactions({
  mode: "mine",
  ignoreStore: true,
  autoFetch: false, // Prevent double fetch
  sortValue: "initiatedDate,desc"
});

const recentTransactions = computed(() => recentTransactionsRaw.value || []);

// --- Sales Stats (Overview & Totals) ---
// We fetch a larger dataset (e.g. Current Year) once, and filter locally for Daily/Weekly
// Use numeric autoFetch: false to manually control trigger
const {
  transactions: statsTransactionsRaw,
  loading: statsLoading,
  fetchTransactions: fetchStats,
  filters: statsFilters,
  size: statsSize,
} = useTransactions({
  mode: "mine",
  ignoreStore: true,
  autoFetch: false,
  sortValue: "initiatedDate,desc"
});

const statsTransactions = computed(() => statsTransactionsRaw.value || []);

const showFullAvailableBalance = ref(false);
const showFullCurrentBalance = ref(false);
const currentPaymentSummaryOption = ref("Daily");
const paymentSummaryOptions = computed(() => [
  "Daily",
  "Weekly",
  "Monthly",
  "Yearly",
]);

// --- Initialization ---
onMounted(() => {
  // 1. Fetch Recent Sales
  recentSize.value = 20;
  // sortValue: "initiatedDate,desc" 
  // recentSort.value = "expirationDate,DESC";
  fetchRecent();

  // 2. Fetch Stats Data (One big fetch for the Year)
  initStatsFetch();
});

function initStatsFetch() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);

  statsFilters.value = {
    "expirationDate.greaterThanOrEqual": startOfYear.toISOString(),
    "paymentStatus.equals": "COMPLETED",
  };

  statsSize.value = 1000; // Limit to 1000 for performance, ideally backend handles aggregation
  fetchStats();
}

// --- Computed Stats (Local Filtering) ---
// This runs instantly when 'currentPaymentSummaryOption' changes
const filteredStatsTransactions = computed(() => {
  const transactions = statsTransactions.value;
  if (!transactions.length) return [];

  const today = new Date();
  let startOfPeriod = new Date();
  let endOfPeriod = new Date();
  // Determine start/end based on selection
  // Note: API already filtered >= Start of Year, so we just narrow it down further

  switch (currentPaymentSummaryOption.value) {
    case "Daily":
      startOfPeriod.setHours(0, 0, 0, 0);
      endOfPeriod.setHours(23, 59, 59, 999);
      break;
    case "Weekly":
      startOfPeriod.setDate(today.getDate() - today.getDay());
      startOfPeriod.setHours(0, 0, 0, 0);
      endOfPeriod = new Date(startOfPeriod);
      endOfPeriod.setDate(startOfPeriod.getDate() + 6);
      endOfPeriod.setHours(23, 59, 59, 999);
      break;
    case "Monthly":
      startOfPeriod.setDate(1); // 1st of current month
      startOfPeriod.setHours(0, 0, 0, 0);
      endOfPeriod = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      break;
    case "Yearly":
      startOfPeriod.setMonth(0, 1);
      startOfPeriod.setHours(0, 0, 0, 0);
      endOfPeriod = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
  }

  return transactions.filter((t) => {
    const tDate = new Date(t.expirationDate);
    return tDate >= startOfPeriod && tDate <= endOfPeriod;
  });
});

const totalTransactionAmount = computed(() => {
  return filteredStatsTransactions.value.reduce(
    (sum, transaction) => sum + (transaction.amount || 0),
    0
  );
});

const transactionsNumber = computed(
  () => filteredStatsTransactions.value.length
);

// --- Helpers ---
function formatAvailableBalance(
  balance: string | number,
  showFullBalance: boolean,
  type: string
) {
  const balanceStr = balance.toString();
  if (showFullBalance) {
    return balanceStr;
  } else {
    if (type == "balance") {
      return "*".repeat(balanceStr.length);
    } else {
      const firstFourDigits = balanceStr.substring(0, 4);
      const lastTwoDigits = balanceStr.substring(balanceStr.length - 2);
      const asterisks = "*".repeat(
        balanceStr.length - 6 > 0 ? balanceStr.length - 6 : 4
      );
      return `${firstFourDigits}${asterisks}${lastTwoDigits}`;
    }
  }
}

function toggleAvailableBalanceVisibility(type: string) {
  if (type == "showFullAvailableBalance") {
    showFullAvailableBalance.value = !showFullAvailableBalance.value;
  } else {
    showFullCurrentBalance.value = !showFullCurrentBalance.value;
  }
}
</script>

<template>
  <div class="md:space-y-8 space-y-6">
    <!-- Main Content Grid -->
    <div
      class="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-7 xl:grid-cols-9"
    >
      <!-- Account list and total balance -->
      <UiCard
        class="col-span-1 lg:col-span-4 xl:col-span-5 max-h-[300px] shadow-md rounded-3xl flex flex-col justify-between relative"
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
            >My {{ currentPaymentSummaryOption }} Sales
          </UiCardTitle>

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
          <!-- Internal Skeleton Loader for Stats -->
          <div v-if="statsLoading" class="flex flex-col gap-4">
            <div class="flex gap-4 items-center">
              <UiSkeleton class="h-8 w-40 bg-slate-300/50" />
              <UiSkeleton class="h-8 w-8 rounded-full bg-slate-300/50" />
            </div>
            <UiSkeleton class="h-6 w-60 bg-slate-300/50" />
            <UiSkeleton class="h-4 w-32 bg-slate-300/50" />
          </div>

          <template v-else>
            <div class="flex items-center gap-6">
              <p class="text-2xl font-bold">
                {{
                  totalTransactionAmount
                    ? formatAvailableBalance(
                        totalTransactionAmount.toFixed(2),
                        showFullAvailableBalance,
                        "balance"
                      )
                    : "0.00"
                }}
                {{ statsTransactions?.[0]?.currencyCode || "ETB" }}
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
                `Merchant AC - ${
                  statsTransactions?.[0]?.merchantAccountNumber
                    ? formatAvailableBalance(
                        statsTransactions?.[0]?.merchantAccountNumber,
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
          </template>
        </UiCardContent>
        <div class="bg-primary w-full mt-auto rounded-b-3xl p-6">
          <p class="text-lg text-primary-foreground">
            Total Sales Count: {{ transactionsNumber }}
          </p>
        </div>
      </UiCard>

      <!-- Initiate Payment (Always Visible) -->
      <UiPermissionGuard
        :permission="PermissionConstants.INIT_MERCHANT_TRANSACTION"
      >
        <UiCard
          class="col-span-1 lg:col-span-3 max-h-min min-h-64 xl:col-span-4 p-6 space-y-4 w-full"
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
      <UiCard
        class="col-span-1 lg:col-span-4 max-h-[450px] xl:col-span-5 shadow-md rounded-xl"
      >
        <UiCardHeader>
          <UiCardTitle>Overview</UiCardTitle>
        </UiCardHeader>
        <UiCardContent class="pl-2">
          <!-- Uses statsTransactions (Yearly data) so chart is always populated -->
          <DashboardOverview :transactionData="statsTransactions" />
        </UiCardContent>
      </UiCard>

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
          <div v-if="recentLoading" class="space-y-2">
            <UiSkeleton class="h-12 w-full" />
            <UiSkeleton class="h-12 w-full" />
            <UiSkeleton class="h-12 w-full" />
            <UiSkeleton class="h-12 w-full" />
          </div>
          <DashboardRecentSales v-else :transactionData="recentTransactions" />
        </UiCardContent>
      </UiCard>
    </div>
  </div>
</template>
```
