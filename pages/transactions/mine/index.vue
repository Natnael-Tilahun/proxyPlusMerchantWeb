<script setup lang="ts">
import { ref, computed } from "vue";
import { columns } from "~/components/myTransactions/columns";
import { useTransactions } from "~/composables/useTransactions";
import { useRouter } from "vue-router"; // {{ edit_1 }}
import type { Transaction } from "~/types";
import ServerPagination from "~/components/ui/ServerPagination.vue";

const router = useRouter(); // {{ edit_2 }}

definePageMeta({
  hideBreadcrumb: true,
});

// try {
//   const response = await getMyTransactions(" ",
//     "0",
//     "1000000000",
//     "DESC");
//     data.value = response?.slice()?.sort((a, b) => new Date(b.expirationDate).getTime() - new Date(a.expirationDate).getTime());
//   } catch (error) {
//   console.error("Error fetching transactions:", error);
//   isError.value = true;
// } finally {
//   isLoading.value = false;
// }

const {
  transactions: data,
  total,
  page,
  size,
  loading: isLoading,
  error: isError,
  fetchTransactions: refetch,
  onPageChange,
  onSizeChange,
} = useTransactions({ mode: "mine" });

const navigateToPrintTransactions = () => {
  router.push({
    path: "/transactions/mine/print-transactions",
  });
};
</script>

<template>
  <div class="w-full flex flex-col gap-8">
    <div class="flex justify-between pt-4">
      <div>
        <h1 class="md:text-2xl text-lg font-medium">My Transactions</h1>
        <p class="text-sm text-muted-foreground">
          View and manage transactions
        </p>
      </div>
      <div class="flex flex-col md:flex-row gap-4">
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
      <UiDataTable :columns="columns" :data="data">
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

    <div v-else-if="isError">
      <UiErrorMessage :retry="refetch" title="Something went wrong." />
    </div>
  </div>
</template>
