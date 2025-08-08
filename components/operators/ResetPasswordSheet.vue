<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { merchantOperatorResetPasswordFormSchema } from "~/validations/merchantOperatorResetPasswordFormSchema";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import type {
  Operator,
} from "~/types";

const { resetMerchantOperatorPassword, isLoading } = useOperators();

const isError = ref(false);
const loading = ref(false);
const data = ref<Operator>();
const merchantOperatorId = ref("");
const openEditTeminationModal = ref(false);

const setOpenEditTerminationModal = (value: boolean) => {
  openEditTeminationModal.value = value;
};

const props = defineProps<{
  merchantOperatorIdProps?: string | null;
}>();

const emit = defineEmits(["close"]);

if (props.merchantOperatorIdProps) {
  merchantOperatorId.value = props.merchantOperatorIdProps;
}

const isSubmitting = ref(false);

const form = useForm({
  validationSchema: merchantOperatorResetPasswordFormSchema,
});

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    loading.value = true;
    const updatedData = {
      newPassword: values.newPassword,
    };
    data.value = await resetMerchantOperatorPassword(
      merchantOperatorId.value,
      updatedData
    );
    emit("close");
    toast({
      title: "Operator Password Reset",
      description: "Merchant operator password reset successfully",
    });
  } catch (err: any) {
    console.error("Error resetting operator password:", err);
    isError.value = true;
  } finally {
    loading.value = false;
    isSubmitting.value = false;
  }
});
</script>

<template>
  <UiSheet class="flex flex-col gap-6 items-center">
    <UiSheetHeader>
      <UiSheetTitle class="border-b-2"
        >Reset Merchant Operator Password</UiSheetTitle
      >
      <UiSheetDescription class="py-4 space-y-4">
        <UiCard class="w-full flex border-[1px] rounded-lg h-full">
          <div class="text-sm md:text-base p-6 basis-full">
            <form @submit="onSubmit">
              <div class="grid grid-cols-2 gap-6">
                <FormField v-slot="{ componentField }" name="newPassword">
                  <FormItem class="w-full">
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <UiInput
                        placeholder="Enter new password"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="confirmPassword">
                  <FormItem class="w-full">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <UiInput
                        placeholder="Enter confirm password"
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <div class="col-span-full w-full py-4 flex justify-between">
                  <UiButton
                    :disabled="isSubmitting"
                    variant="outline"
                    type="button"
                    @click="emit('close')"
                  >
                    Cancel
                  </UiButton>
                  <UiButton :disabled="isSubmitting" type="submit">
                    <Icon
                      name="svg-spinners:8-dots-rotate"
                      v-if="isSubmitting"
                      class="mr-2 h-4 w-4 animate-spin"
                    ></Icon>

                    Update
                  </UiButton>
                </div>
              </div>
            </form>
          </div>
        </UiCard>
      </UiSheetDescription>
    </UiSheetHeader>
  </UiSheet>

  <UiAlertDialog
    :open="openEditTeminationModal"
    :onOpenChange="setOpenEditTerminationModal"
  >
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>Are you absolutely sure?</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          This action cannot be undone. This will permanently reset the merchant
          operator password and remove your data from our servers.
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel @click="setOpenEditTerminationModal(false)">
          Cancel
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="onSubmit">
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
