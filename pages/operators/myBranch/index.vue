<script setup lang="ts">
import { ref, onMounted, computed, provide } from "vue";
import type { Operator } from "~/types";
import { columns as tableColumns } from "~/components/operators/mine/columns";
import { PermissionConstants } from "~/constants/permissions";
import ServerPagination from "~/components/ui/ServerPagination.vue";

const store = useAuthStore();
const myBranchId = store.profile?.merchantBranch?.merchantBranchId;

const {
  operators: data,
  loading,
  error,
  fetchOperators: fetchMerchantOperators,
  page,
  size,
  total,
  onPageChange,
  onSizeChange,
} = useOperators({
  mode: "branch",
  branchId: myBranchId,
  autoFetch: true,
});

// Provide refetch for children (renaming to match what children might expect or keep generic)
// The original code provided 'refetchMerchantOperators', so we keep that.
provide("refetchMerchantOperators", fetchMerchantOperators);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(fetchMerchantOperators));
</script>

<!-- Render DataTable only if data is available -->
<template>
  <div
    v-if="loading && (!data || data.length === 0)"
    class="py-10 flex justify-center w-full"
  >
    <UiLoading />
  </div>
  <div v-else-if="!error" class="py-5 flex flex-col space-y-10 mx-auto">
    <UiPermissionGuard
      :permission="PermissionConstants.CREATE_MERCHANT_OPERATOR"
    >
      <div class="w-full flex justify-end gap-4">
        <NuxtLink to="/operators/myBranch/invite" class="w-fit self-end">
          <UiButton class="w-fit self-end px-5"
            ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>
            Invite Operator</UiButton
          >
        </NuxtLink>
        <NuxtLink to="/operators/myBranch/new" class="w-fit self-end">
          <UiButton class="w-fit self-end px-5"
            ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon
            >Create New Operator</UiButton
          >
        </NuxtLink>
      </div>
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
  <!-- <div v-else-if="data && !isError && data?.length <= 0">
    <UiNoResultFound title="Sorry, No customer found." />
  </div> -->
  <div v-if="error">
    <UiErrorMessage
      :retry="fetchMerchantOperators"
      title="Something went wrong."
    />
  </div>
</template>
