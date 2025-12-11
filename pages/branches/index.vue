<script setup lang="ts">
import { ref, onMounted, computed, provide } from "vue";
import type { Branch } from "~/types";
import { columns as tableColumns } from "~/components/branches/columns";
import { PermissionConstants } from "~/constants/permissions";
import ServerPagination from "~/components/ui/ServerPagination.vue";

const {
  branches: data,
  loading: isLoading,
  error: isError,
  fetchBranches,
  page,
  size,
  total,
  onPageChange,
  onSizeChange,
} = useBranches();

// Provide refetch for children
provide("refetchBranches", fetchBranches);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(fetchBranches));

onMounted(() => {
  fetchBranches();
});
</script>

<!-- Render DataTable only if data is available -->
<template>
  <div
    v-if="isLoading && !data.length"
    class="py-10 flex justify-center w-full"
  >
    <UiLoading />
  </div>

  <div v-else-if="!isError" class="py-5 flex flex-col space-y-10 mx-auto">
    <UiPermissionGuard :permission="PermissionConstants.CREATE_MERCHANT_BRANCH">
      <NuxtLink :to="`/branches/new`" class="w-fit self-end">
        <UiButton class="w-fit self-end px-5">
          <Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Create
          New Branch
        </UiButton>
      </NuxtLink>
    </UiPermissionGuard>

    <UiCard class="p-6">
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
    </UiCard>
  </div>

  <div v-else-if="isError">
    <UiErrorMessage :retry="fetchBranches" title="Something went wrong." />
  </div>
</template>
