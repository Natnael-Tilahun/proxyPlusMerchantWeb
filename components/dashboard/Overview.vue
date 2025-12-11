<script setup lang="ts">
import { computed } from "vue";
import { BarChart } from "~/components/ui/chart-bar";

interface Transaction {
  expirationDate: string;
  amount: number;
  paymentStatus: string;
}

interface MonthlyData {
  name: string;
  completed: number;
  Pending: number;
  Failed: number;
}

const props = withDefaults(
  defineProps<{
    transactionData?: Transaction[];
  }>(),
  {
    transactionData: () => [],
  }
);

const data = computed<MonthlyData[]>(() => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyData = monthNames.map((name) => ({
    name,
    completed: 0,
    Pending: 0,
    Failed: 0,
  }));

  if (props.transactionData && props.transactionData.length > 0) {
    props.transactionData.forEach((transaction) => {
      if (
        transaction &&
        transaction.expirationDate &&
        transaction.paymentStatus &&
        transaction.amount
      ) {
        const date = new Date(transaction.expirationDate);
        const monthIndex = date.getMonth();
        if (monthIndex >= 0 && monthIndex < 12) {
          const status = transaction.paymentStatus.toLowerCase();
          if (status === "completed") {
            monthlyData[monthIndex].completed += transaction.amount;
          } else if (status === "pending") {
            monthlyData[monthIndex].Pending += transaction.amount;
          } else if (
            status === "failed" ||
            status === "expired" ||
            status === "cancelled"
          ) {
            monthlyData[monthIndex].Failed += transaction.amount;
          }
        }
      }
    });
  }

  return monthlyData;
});

const maxValue = computed(() =>
  Math.max(...data.value.flatMap((d) => [d.completed, d.Pending, d.Failed]))
);
</script>

<template>
  <BarChart
    class="max-h-[350px]"
    index="name"
    :data="data"
    :categories="['completed', 'Pending', 'Failed']"
    :y-formatter="
      (tick: number | Date, i: number, ticks: number[] | Date[]) => {
        return typeof tick === 'number'
          ? `ETB ${new Intl.NumberFormat('us').format(tick).toString()}`
          : '';
      }
    "
    :rounded-corners="4"
  />
</template>
