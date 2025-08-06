<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { profileFormSchema } from "~/validations/profileFormSchema";
import { toast } from "~/components/ui/toast";
import { format } from "date-fns";
import type { Profile } from "~/types";

const { getProfile, updateProfile } = useProfile();
const authStore = useAuthStore();
const isError = ref(false);
const data = ref<Profile>();
const isSubmitting = ref(false);
const isLoading = ref(false);

const form = useForm({
  validationSchema: profileFormSchema,
});

// Function to format date to YYYY-MM-DD
const formatDate = (date: string | Date): string => {
  return format(new Date(date), "yyyy-MM-dd");
};

try {
  isLoading.value = true;
  data.value = await getProfile(); // Call your API function to fetch profile
  if (data.value) {
    authStore.setProfile(data.value)
    form.setValues({
      ...data.value,
    });
    form.setFieldValue("businessName", data.value.merchant.businessName);
    form.setFieldValue("branchName", data.value.merchantBranch.branchName);
    form.setFieldValue(
      "businessPhoneNumber",
      data.value.merchantBranch.businessPhoneNumber
    );
    form.setFieldValue("branchCode", data.value.merchantBranch.branchCode);
    form.setFieldValue(
      "paymentReceivingAccountNumber",
      data.value.merchantBranch.paymentReceivingAccountNumber
    );
  }
} catch (error) {
  toast({
    title: "Uh oh! Something went wrong.",
    description: `There was a problem with your request: ${error}`,
    variant: "destructive",
  });
} finally {
  isLoading.value = false;
}

// const onSubmit = form.handleSubmit(async (values: any) => {
//   const merchantData = {
//     ...values,
//     tradeLicenseIssueDate: new Date(values.tradeLicenseIssueDate).toISOString(),
//     tradeLicenseExpiryDate: new Date(
//       values.tradeLicenseExpiryDate
//     ).toISOString(),
//     taxPayerIssueDate: new Date(values.taxPayerIssueDate).toISOString(),
//     taxPayerExpiryDate: new Date(values.taxPayerExpiryDate).toISOString(),
//   };

//   try {
//     isSubmitting.value = true;
//     data.value = await updateProfile(merchantData); // Call your API function to fetch profile
//     console.log("New Merchant data; ", data.value);
//     toast({
//       title: "Merchant Updated",
//       description: "Merchant profile updated successfully",
//     });
//   } catch (err: any) {
//     console.error("Error updating merchant profile:", err.message);
//     toast({
//       title: "Merchant Update Error",
//       variant: "destructive",
//       description: err.message,
//     });
//     isError.value = true;
//   } finally {
//     isSubmitting.value = false;
//   }
// });
</script>

<template>
  <div class="w-full flex flex-col gap-8">
    <div class="pt-4">
      <h1 class="md:text-2xl text-lg font-medium">Profile</h1>
    </div>

    <!-- Loading Indicator -->
    <UiCard class="p-6 space-y-8" v-if="isLoading">
      <div class="grid grid-cols-2 gap-8">
        <UiSkeleton class="h-16 w-full" />
        <UiSkeleton class="h-16 w-full" />
        <UiSkeleton class="h-16 w-full" />
        <UiSkeleton class="h-16 w-full" />
        <UiSkeleton class="h-16 w-full" />
        <UiSkeleton class="h-16 w-full" />
        <UiSkeleton class="h-16 w-full" />
        <UiSkeleton class="h-16 w-full" />
      </div>
    </UiCard>

    <UiCard v-else class="p-6">
      <form @submit="">
        <div class="grid md:grid-cols-2 gap-6">
          <FormField v-slot="{ componentField }" name="merchantOperatorId">
            <FormItem>
              <FormLabel>Merchant Operator Id </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  disabled
                  placeholder="Enter operator id"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="fullName">
            <FormItem>
              <FormLabel> Full Name </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter full name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="operatorCode">
            <FormItem>
              <FormLabel>Operator Code </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter operator code"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="operatorRole">
            <FormItem>
              <FormLabel>Operator Role </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter operator role"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="businessName">
            <FormItem>
              <FormLabel> Business Name </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter business name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="branchName">
            <FormItem>
              <FormLabel> Branch Name </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter branch name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="branchCode">
            <FormItem>
              <FormLabel>Branch Code </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter branch code"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="businessPhoneNumber">
            <FormItem>
              <FormLabel> Branch Business Phone Number </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter business phone number"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="paymentReceivingAccountNumber"
          >
            <FormItem>
              <FormLabel> Branch Payment Receiving Account Number </FormLabel>
              <FormControl>
                <UiInput
                  type="text"
                  placeholder="Enter payment receiving account number"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- <div class="col-span-full w-full py-4 flex justify-between">
            <UiButton
              :disabled="isSubmitting"
              variant="outline"
              type="button"
              @click="$router.go(-1)"
            >
              Cancel
            </UiButton>
            <UiButton :disabled="isSubmitting" type="submit">
              <Icon
                name="svg-spinners:8-dots-rotate"
                v-if="isSubmitting"
                class="mr-2 h-4 w-4 animate-spin"
              ></Icon>

              Submit
            </UiButton>
          </div> -->
        </div>
      </form>
    </UiCard>
  </div>
</template>
