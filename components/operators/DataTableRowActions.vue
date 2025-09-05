<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { toast } from "~/components/ui/toast";
import { PermissionConstants } from "~/constants/permissions";
const { deleteMerchantOperator, isLoading } = useOperators();
const loading = ref(isLoading.value);
const isError = ref(false);
const openEditModal = ref(false);
const openSheet = ref(false);



const setOpenEditModal = (value: boolean) => {
  openEditModal.value = value;
};

const setOpenSheet = (value: boolean) => {
  openSheet.value = value;
};

const closeSheet = () => {
  openSheet.value = false;
};

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

const props = defineProps<{
  row: Row<any>;
  refetch: () => Promise<void>;
}>();
const emit = defineEmits(["merchantOperatorsDeleted", "editMerchantOperators"]); // Added 'languageDeleted'

function viewMerchantOperatorDetail(id: string) {
  navigateTo(`/operators/${id}`);
}

async function deleteMerchantOperators(id: string) {
  try {
    isLoading.value = true;
    loading.value = true;
    await deleteMerchantOperator(id); // Call your API function to fetch roles
    console.log("Merchant operator deleted successfully");
    toast({
      title: "Merchant operator deleted successfully",
    });
    // Reload the window after deleting the role
    await props.refetch(); // Call refetch after successful deletion
  } catch (err) {
    console.error("Error deleting merchant operator:", err);
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
    <UiDropdownMenuContent align="end" class="w-[200px]">
      <UiPermissionGuard :permission="PermissionConstants.READ_MERCHANT_OPERATOR">
        <UiDropdownMenuItem
          @click="viewMerchantOperatorDetail(row.original.merchantOperatorId)"
          >View and Edit
        </UiDropdownMenuItem>
        <UiDropdownMenuSeparator />
      </UiPermissionGuard>
      <UiPermissionGuard :permission="PermissionConstants.RESET_MERCHANT_OPERATOR_PASSWORD">
        <!-- <UiDropdownMenuItem 
        > -->
        <UiSheet :open="openSheet" :onOpenChange="setOpenSheet">
          <UiSheetTrigger
            @click="setOpenSheet(true)"
            class="cursor-pointer text-sm text-left px-2  whitespace-nowrap"
          >
            Reset Operator Passwordd
          </UiSheetTrigger>
          <UiSheetContent
          class="md:min-w-[75%] sm:min-w-full flex flex-col h-full overflow-y-auto"
          >
            <OperatorsResetPasswordSheet
              @close="closeSheet"
              :merchantOperatorIdProps="row.original.merchantOperatorId"
            />
          </UiSheetContent>
        </UiSheet>
        <!-- </UiDropdownMenuItem
        > -->
        <UiDropdownMenuSeparator />
      </UiPermissionGuard>
      <UiPermissionGuard :permission="PermissionConstants.DELETE_MERCHANT_OPERATOR">
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
          merchant operator and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction
          @click="deleteMerchantOperators(row.original.merchantOperatorId)"
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
