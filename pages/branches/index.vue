<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Branch } from "~/types";
import { columns as tableColumns } from "~/components/branches/columns"; // Renamed to avoid conflict
import { PermissionConstants } from "~/constants/permissions";

const { getBranches } = useBranches();
const isLoading = ref(false);
const isError = ref(false);
const data = ref<Branch[]>([]);

const fetchMerchantBranchesData = async () => {
  try {
    isLoading.value = true;
    const merchantBranches = await getBranches(
      0,
      10000
    );
    // Sort integrations by name alphabetically
    data.value = merchantBranches?.sort(
      (a: Branch, b: Branch) => {
        if (a?.branchName && b?.branchName) {
          return a?.branchName
            .toLowerCase()
            .localeCompare(b?.branchName.toLowerCase());
        }
        return 0; // Return 0 if either firstname is missing
      }
    ) || [];
  } catch (err: any) {
    console.error("Error fetching merchant branches:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const refetch = async () => {
  await fetchMerchantBranchesData();
};

onMounted(() => {
  fetchMerchantBranchesData();
});

// Provide the refetch function
provide("refetchMerchantBranches", refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));
</script>

<!-- Render DataTable only if data is available -->
<template>
  <div v-if="isLoading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <div v-else-if="data && !isError" class="py-5 flex flex-col space-y-10 mx-auto">
    <UiPermissionGuard :permission="PermissionConstants.CREATE_MERCHANT_BRANCH">
      <NuxtLink :to="`/branches/new`" class="w-fit self-end">
        <UiButton class="w-fit self-end px-5">
          <Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Create New Branch
        </UiButton>
      </NuxtLink>
    </UiPermissionGuard>
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }"> </template>
    </UiDataTable>
  </div>
  <!-- <div v-else-if="data && !isError && data?.length <= 0">
    <UiNoResultFound title="Sorry, No customer found." />
  </div> -->
  <div v-if="isError">
    <UiErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
