<script setup lang="ts">
import { ref, computed } from "vue";
import { columns } from "~/components/operators/transactions/columns";
import { useTransactions } from "~/composables/useTransactions";
import { useRouter } from "vue-router";
import type { Transaction } from "~/types";
import { getIdFromPath } from "~/lib/utils";
import ServerPagination from "~/components/ui/ServerPagination.vue";

const operatorId = getIdFromPath();

// Use the main hook with operator mode
const {
  transactions: data,
  total,
  page,
  size,
  loading: isLoading,
  error: isError,
  fetchTransactions: refetch, // Renaming for compatibility if needed, or use directly
  onPageChange,
  onSizeChange,
} = useTransactions({
  mode: "operator",
  operatorId: operatorId,
  autoFetch: true, // Auto fetch on mount
  ignoreStore: false, // Keep using global filters as per previous behavior
});

const router = useRouter();

// Provide the refetch function if needed by columns or children
// The previous code didn't provide it, but passed it to Filterbar

const navigateToPrintTransactions = () => {
  router.push({
    path: `/operators/${operatorId}`,
    query: {
      activeTab: "downloadTransactions",
    },
  });
};
</script>

<template>
  <div class="w-full flex flex-col gap-8">
    <div class="flex justify-between items-center w-full">
      <div>
        <h1 class="md:text-2xl text-lg font-medium">Transactions</h1>
        <p class="text-sm text-muted-foreground">
          View and manage operator transactions
        </p>
      </div>
      <div v-if="data && !isError" class="flex flex-col md:flex-row gap-4">
        <UiButton
          class="w-fit self-end px-5"
          @click="navigateToPrintTransactions"
          ><Icon name="material-symbols:download" size="24" class="mr-2"></Icon
          >Download Transactions</UiButton
        >
      </div>
    </div>
    <div
      v-if="isLoading"
      class="py-10 border-2 h-96 rounded-md flex items-center justify-center w-full"
    >
      <UiLoading />
    </div>

    <UiCard v-else-if="data && !isError" class="p-6">
      <UiDataTable :columns="columns" :data="data || []">
        <template v-slot:toolbar="{ table }">
          <TransactionsDataTableFilterbar :refetch="refetch" :table="table" />
        </template>
      </UiDataTable>
      <div class="py-4">
        <ServerPagination
          :page="page"
          :size="size"
          :total="total"
          :on-page-change="onPageChange"
          :on-size-change="onSizeChange"
        />
      </div>
    </UiCard>

    <div v-else-if="isError || data == null || data == undefined">
      <UiErrorMessage :retry="refetch" title="Something went wrong." />
    </div>
  </div>
</template>
