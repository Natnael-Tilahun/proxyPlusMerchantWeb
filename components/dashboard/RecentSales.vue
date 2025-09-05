<script setup lang="ts">
import { useRouter } from "vue-router";
import { Icons } from "@/components/icons.jsx";
import type { Transaction } from "~/types";

const router = useRouter();

const props = defineProps<{
  transactionData: Transaction[];
}>();

const data = computed(() => {
  return props.transactionData
    .slice() // Create a shallow copy to avoid mutating the original array
    .sort(
      (a, b) =>
        new Date(b.expirationDate).getTime() -
        new Date(a.expirationDate).getTime()
    )
    .slice(0, 20);
});

const isLoading = ref(false);
const isError = ref(false);

const navigateToTransactionDetail = (id: string) => {
  router.push(`/transactions/${id}`);
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
</script>

<template>
  <div class="space-y-3 overflow-y-scroll max-h-[350px]">
    <div class="grid gap-8" v-if="isLoading">
      <div
        class="h-16 flex justify-between items-center shadow-md rounded-xl p-4 "
      >
        <div class="flex gap-4 items-center">
          <UiSkeleton class="h-10 w-10 rounded-full bg-slate-300" />
          <div class="flex flex-col gap-2">
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
          </div>
        </div>
        <UiSkeleton class="h-4 w-20 bg-slate-300" />
      </div>
      <div
        class="h-16 flex justify-between items-center shadow-md rounded-xl p-4"
      >
        <div class="flex gap-4 items-center">
          <UiSkeleton class="h-10 w-10 rounded-full bg-slate-300" />
          <div class="flex flex-col gap-2">
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
          </div>
        </div>
        <UiSkeleton class="h-4 w-20 bg-slate-300" />
      </div>
      <div
        class="h-16 flex justify-between items-center shadow-md rounded-xl p-4"
      >
        <div class="flex gap-4 items-center">
          <UiSkeleton class="h-10 w-10 rounded-full bg-slate-300" />
          <div class="flex flex-col gap-2">
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
          </div>
        </div>
        <UiSkeleton class="h-4 w-20 bg-slate-300" />
      </div>
      <div
        class="h-16 flex justify-between items-center shadow-md rounded-xl p-4"
      >
        <div class="flex gap-4 items-center">
          <UiSkeleton class="h-10 w-10 rounded-full bg-slate-300" />
          <div class="flex flex-col gap-2">
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
          </div>
        </div>
        <UiSkeleton class="h-4 w-20 bg-slate-300" />
      </div>
      <div
        class="h-16 flex justify-between items-center shadow-md rounded-xl p-4"
      >
        <div class="flex gap-4 items-center">
          <UiSkeleton class="h-10 w-10 rounded-full bg-slate-300" />
          <div class="flex flex-col gap-2">
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
            <UiSkeleton class="h-4 w-32 bg-slate-300" />
          </div>
        </div>
        <UiSkeleton class="h-4 w-20 bg-slate-300" />
      </div>
    </div>

    <UiError v-if="isError" />
    <UiCard
      v-else
      v-for="item in data"
      :key="item.merchantTransactionId"
      class="flex items-center cursor-pointer p-2 rounded-xl hover:rounded-2xl shadow-md shadow-accent dark:bg-accent dark:hover:bg-accent/50 hover:bg-accent/40 hover:shadow-md hover:scale-[1.01] border-[0.5px] border-accent hover:border-accent/20 transition-all duration-300 ease-in-out"
      @click="navigateToTransactionDetail(item.merchantTransactionId)"
    >
      <Icons.deposit class="stroke-none" :fill="item.paymentStatus === 'COMPLETED' ? '#2DD683' : item.paymentStatus === 'PENDING' ? '#FFA500' : '#FF0000'" />

      <div class="ml-4 space-y-1">
        <p class="text-sm font-medium leading-none">
          {{ item.payerName || "Payer Name" }}
        </p>
        <p class="text-sm text-muted-foreground">
          {{ item.paymentStatus || "Payment Status" }}
        </p>
      </div>
      <div class="space-y-1 ml-auto">
        <div :class="item.paymentStatus === 'COMPLETED' ? 'text-[#2DD683]' : item.paymentStatus === 'PENDING' ? 'text-yellow-500' : 'text-red-500'"  class="font-medium whitespace-nowrap text-sm">
          + {{ item.amount.toFixed(2) + " " + item.currencyCode }}
        </div>
        <p class="text-xs text-muted-foreground text-right">
          {{ new Date(item.expirationDate).toLocaleString() }}
        </p>
      </div>
    </UiCard>
  </div>
</template>
