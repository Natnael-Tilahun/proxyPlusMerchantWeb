<script setup lang="ts">
import { ref, onMounted, computed, provide } from "vue";
import { columns as tableColumns } from "~/components/branches/operators/columns";
import { PermissionConstants } from "~/constants/permissions";
import { getIdFromPath } from "~/lib/utils";
import ServerPagination from "~/components/ui/ServerPagination.vue";

const branchId = getIdFromPath();

const {
  operators: data,
  loading: isLoading,
  error: isError,
  fetchOperators,
  page,
  size,
  total,
  onPageChange,
  onSizeChange,
} = useOperators({
  mode: "branch",
  branchId: branchId,
  autoFetch: true,
});

// Provide the refetch function
provide("refetchMerchantOperators", fetchOperators); // Renamed to match but fetchOperators is cleaner

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(fetchOperators));
</script>

<!-- Render DataTable only if data is available -->
<template>
  <div class="w-full flex flex-col gap-8">
    <div class="flex justify-between items-center w-full">
      <div class="w-full">
        <h1 class="md:text-2xl text-lg font-medium">Operators</h1>
        <p class="text-sm text-muted-foreground">View and manage operators</p>
      </div>
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
    </div>
    <div v-if="isLoading" class="py-10 flex justify-center w-full">
      <UiLoading />
    </div>
    <div v-if="isError">
      <UiErrorMessage :retry="fetchOperators" title="Something went wrong." />
    </div>
    <div
      v-else-if="data && !isError && !isLoading"
      class="py-5 flex flex-col space-y-10"
    >
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
    <!-- <div v-else-if="data && !isError && data?.length <= 0">
    <UiNoResultFound title="Sorry, No customer found." />
  </div> -->
  </div>
</template>
