<script setup lang="ts">
import { ref, onMounted, computed, provide } from "vue";
import type { Operator } from "~/types";
import { columns as tableColumns } from "~/components/operators/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";
import ServerPagination from "~/components/ui/ServerPagination.vue";

const {
  operators: data,
  loading,
  error,
  fetchOperators,
  page,
  size,
  total,
  onPageChange,
  onSizeChange,
} = useOperators();

// Provide the refetch function
provide("refetchMerchantOperators", fetchOperators);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(fetchOperators));

onMounted(() => {
  fetchOperators();
});
</script>

<!-- Render DataTable only if data is available -->
<template>
  <div v-if="loading && !data.length" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <div v-else-if="!error" class="py-5 flex flex-col space-y-10 mx-auto">
    <UiPermissionGuard
      :permission="PermissionConstants.CREATE_MERCHANT_OPERATOR"
    >
      <div class="w-full flex justify-end gap-4">
        <NuxtLink to="/operators/invite" class="w-fit self-end">
          <UiButton class="w-fit self-end px-5"
            ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>
            Invite Operator</UiButton
          >
        </NuxtLink>
        <NuxtLink to="/operators/new" class="w-fit self-end">
          <UiButton class="w-fit self-end px-5"
            ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
            >Create New Operator</UiButton
          >
        </NuxtLink>
      </div>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data || []">
      <template v-slot:toolbar="{ table }"> </template>
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
  </div>

  <div v-else-if="error">
    <UiErrorMessage :retry="fetchOperators" title="Something went wrong." />
  </div>
</template>
