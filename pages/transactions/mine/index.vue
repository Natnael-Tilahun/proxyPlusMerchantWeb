<script setup lang="ts">
import { ref, computed } from "vue";
import { columns } from "~/components/myTransactions/columns";
import { useTransactions } from "~/composables/useTransactions";
import { useRouter } from "vue-router"; // {{ edit_1 }}
import type { Transaction } from "~/types";

const { getMyTransactions } = useTransactions();
const data = ref<Transaction[]>([]);
const isLoading = ref(true);
const isError = ref(false);
const router = useRouter(); // {{ edit_2 }}
const transactionFilterStore = useTransactionFilterStore();

definePageMeta({
   hideBreadcrumb: true,
});

try {
  const response = await getMyTransactions(" ",
    "0",
    "10000000",
    "DESC");
    data.value = response?.slice()?.sort((a, b) => new Date(b.expirationDate).getTime() - new Date(a.expirationDate).getTime());
} catch (error) {
  console.error("Error fetching transactions:", error);
  isError.value = true;
} finally {
  isLoading.value = false;
}

const refetch = async () => {
  try {
    isLoading.value = true;
   const response = await getMyTransactions(" ",
    "",
    "",
    "DESC");
    data.value = response?.slice()?.sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime());
  } catch (error) {
    console.error("Error fetching transactions:", error);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const navigateToPrintTransactions = () => {
  router.push({
    path: "/transactions/print-transactions",
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
    </UiCard>

    <div v-else-if="isError">
      <UiErrorMessage :retry="refetch" title="Something went wrong." />
    </div>
  </div>
</template>
