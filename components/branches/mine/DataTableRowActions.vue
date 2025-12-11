<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { toast } from "~/components/ui/toast";
import { PermissionConstants } from "~/constants/permissions";
const { deleteMerchantBranch, isLoading } = useBranches();
const loading = ref(isLoading.value);
const isError = ref(false);
const openEditModal = ref(false);



const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

const props = defineProps<{
  row: Row<any>;
  refetch: () => Promise<void>;
}>();
const emit = defineEmits(["merchantBranchesDeleted", "editMerchantBranches"]); // Added 'languageDeleted'

function viewMerchantBranchDetail(id: string) {
  navigateTo(`/branches/mine/${id}`);
}

async function deleteMerchantBranches(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    await deleteMerchantBranch(id); // Call your API function to fetch roles
    console.log("Merchant branch deleted successfully");
    toast({
      title: "Merchant branch deleted successfully",
    });
    // Reload the window after deleting the role
    await props.refetch(); // Call refetch after successful deletion
  } catch (err) {
    console.error("Error deleting merchant branch:", err);
    isError.value = true;
  } finally {
    isLoading.value = false;
    loading.value = false;
    setOpenEditModal(false);
  }
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
      <UiPermissionGuard :permission="PermissionConstants.READ_MERCHANT_BRANCH">
        <UiDropdownMenuItem
          @click="viewMerchantBranchDetail(row.original.merchantBranchId)"
          >View and Edit
        </UiDropdownMenuItem>
        <UiDropdownMenuSeparator />
      </UiPermissionGuard>
      <UiPermissionGuard :permission="PermissionConstants.DELETE_MERCHANT_BRANCH">
        <UiDropdownMenuItem
          @click="setOpenEditModal(true)"
          class="text-red-600"
        >
          Delete
          <UiDropdownMenuShortcut>⌘⌫</UiDropdownMenuShortcut>
        </UiDropdownMenuItem>
      </UiPermissionGuard>
    </UiDropdownMenuContent>
  </UiDropdownMenu>

  <UiAlertDialog :open="openEditModal" :onOpenChange="setOpenEditModal">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This action cannot be undone. This will permanently delete the
          merchant branch and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction
          @click="deleteMerchantBranches(row.original.merchantBranchId)"
        >
          <Icon
            name="svg-spinners:8-dots-rotate"
            v-if="isLoading"
            :disabled="isLoading"
            class="mr-2 h-4 w-4 animate-spin"
          ></Icon>
          Continue
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>
