<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Operator } from "~/types";
import { columns as tableColumns } from "~/components/operators/columns"; // Renamed to avoid conflict

const {getMerchantOperators} = useOperators()
const isLoading = ref(false);
const isError = ref(false);
const data = ref<Operator[]>([]);


const fetchMerchantOperatorsData = async () => {
  try {
    isLoading.value = true;
    const merchantOperators = await getMerchantOperators(0,10000);
    // Sort integrations by name alphabetically
    data.value = merchantOperators?.sort((a:Operator, b:Operator) => {
      if (a?.fullName && b?.fullName) {
        return a?.fullName.toLowerCase().localeCompare(b?.fullName.toLowerCase());
      }
      return 0; // Return 0 if either firstname is missing
    });
  } catch (err: any) {
    console.error("Error fetching merchant operators:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const refetch = async () => {
  await fetchMerchantOperatorsData();
};

onMounted(() => {
    fetchMerchantOperatorsData();
});

// Provide the refetch function
provide('refetchMerchantOperators', refetch);

// Generate columns by passing the refetch function
const columns = computed(() => tableColumns(refetch));

</script>

<!-- Render DataTable only if data is available -->
<template>
  <div v-if="isLoading" class="py-10 flex justify-center w-full">
    <UiLoading />
  </div>
  <div
    v-else-if="data && !isError"
    class="py-5 flex flex-col space-y-10 mx-auto"
  >
    <!-- <UiPermissionGuard :permission="PermissionConstants.CREATE_STAFF_ASSIGNMENT" > -->
      <div class="w-full flex justify-end gap-4">

      <NuxtLink to="/operators/invite" class="w-fit self-end">
      <UiButton class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>
        Invite Operator</UiButton
      >
    </NuxtLink>
    <NuxtLink to="/operators/new" class="w-fit self-end">
      <UiButton class="w-fit self-end px-5"
        ><Icon name="material-symbols:add" size="24" class="mr-2"></Icon>Create
        New Operator</UiButton
      >
    </NuxtLink>
  </div>

    <!-- </UiPermissionGuard> -->
    <UiDataTable :columns="columns" :data="data">
      <template v-slot:toolbar="{ table }">
      </template>
    </UiDataTable>
  </div>
  <!-- <div v-else-if="data && !isError && data?.length <= 0">
    <UiNoResultFound title="Sorry, No customer found." />
  </div> -->
  <div v-if="isError">
    <UiErrorMessage :retry="refetch" title="Something went wrong." />
  </div>
</template>
