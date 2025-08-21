<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}
const props = defineProps<DataTableRowActionsProps<any>>();

function viewTransactionDetail(id: string) {
  console.log("viewTransactionDetail", id);
  navigateTo(`/transactions/transactionDetails/${id}`);
}
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <UiButton
        variant="ghost"
        class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
      >
        <Icon name="majesticons:dots-horizontal" class="h-4 w-4"></Icon>
        <span class="sr-only">Open menu</span>
      </UiButton>
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent align="end" class="w-[160px]">
      <UiDropdownMenuItem
        @click="viewTransactionDetail(row.original.merchantTransactionId)"
        >View</UiDropdownMenuItem
      >
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
