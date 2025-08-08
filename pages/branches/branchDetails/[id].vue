<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { newMerchantBranchFormSchema } from "~/validations/newMerchantBranchFormSchema";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { PermissionConstants } from "~/constants/permissions";
import type { Account, Branch } from "~/types";

const { getBranchById, updateMerchantBranch } = useBranches();
const isError = ref(false);
const loading = ref(false);
const data = ref<Branch>();
const merchantId = ref<string>("");
const branchId = ref<string>("");
const isSubmitting = ref(false);
const route = useRoute();
const authStore = useAuthStore();
merchantId.value = authStore.profile?.merchantOperatorId

branchId.value = route.params.id as string;
const accountsData = ref<Account[]>([]);

const props = defineProps<{
  accountsData: Account[];
}>();

if (props.accountsData) {
  accountsData.value = props.accountsData;
}

const form = useForm({
  validationSchema: newMerchantBranchFormSchema,
});

const fetchBranchData = async () => {
  try {
    isError.value = false;
    loading.value = true;
    data.value = await getBranchById(merchantId.value, branchId.value);
    if (data.value) {
      form.setValues({
        ...data.value,
        city: data.value?.address?.city || null,
        businessEmail: data.value?.address?.businessEmail || null,
        postalNumber: data.value?.address?.postalNumber || null,
      });
    }
  } catch (err) {
    console.error("Error fetching branch", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchBranchData();
});

const refetch = async () => {
  await fetchBranchData();
};

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    loading.value = true;
    const updatedData = {
      ...values,
      address: {
        city: values?.city || null,
        businessEmail: values?.businessEmail || null,
        postalNumber: values?.postalNumber || null,
      },
    };
    data.value = await updateMerchantBranch(merchantId.value, branchId.value, updatedData);
    form.setValues({
      ...data.value,
      city: data.value?.address?.city || null,
      businessEmail: data.value?.address?.businessEmail || null,
      postalNumber: data.value?.address?.postalNumber || null,
    });
    toast({
      title: "Branch Updated",
      description: "Merchant branch updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating branch:", err);
    isError.value = true;
  } finally {
    loading.value = false;
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div class="w-full flex flex-col gap-8">
    <div v-if="loading" class="py-10 flex justify-center items-center">
      <UiLoading />
    </div>
    <UiCard
      v-else-if="data && !isError"
      class="w-full flex border-[1px] rounded-lg h-full"
    >
      <div class="text-sm md:text-base p-6 basis-full">
        <form @submit="onSubmit">
          <div class="grid grid-cols-2 gap-6">
            <FormField v-slot="{ componentField }" name="branchName">
              <FormItem class="w-full">
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
              <FormItem class="w-full">
                <FormLabel> Branch Code</FormLabel>
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
              <FormItem class="w-full">
                <FormLabel> Business Phone Number </FormLabel>
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
            <!-- <FormField
              v-slot="{ componentField }"
              name="paymentReceivingAccountNumber"
            >
              <FormItem class="w-full">
                <FormLabel>Payment Receiving Account Number</FormLabel>
                <FormControl>
                  <UiInput
                    placeholder="Enter payment receiving account number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField> -->
            <FormField v-slot="{ componentField }" name="paymentReceivingAccountNumber">
              <FormItem class="w-full">
                <FormLabel>Payment Receiving Account Number</FormLabel>
                <UiSelect v-bind="componentField">
                  <FormControl>
                    <UiSelectTrigger>
                      <UiSelectValue placeholder="Select a payment receiving account number" />
                    </UiSelectTrigger>
                  </FormControl>
                  <UiSelectContent>
                    <UiSelectGroup v-if="accountsData.length > 0">
                      <UiSelectItem
                        v-for="item in accountsData"
                        :value="item.accountNumber"
                      >
                        {{ item.accountNumber }}
                      </UiSelectItem>
                    </UiSelectGroup>
                    <UiSelectGroup v-else>
                      <UiSelectItem value="No accounts found">
                        No accounts found
                      </UiSelectItem>
                    </UiSelectGroup>
                  </UiSelectContent>
                </UiSelect>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="faxNumber">
              <FormItem class="w-full">
                <FormLabel>Fax Number</FormLabel>
                <FormControl>
                  <UiInput
                    placeholder="Enter fax number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="city">
              <FormItem>
                <FormLabel>City </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter city"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="businessEmail">
              <FormItem>
                <FormLabel>Business Email </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter business email"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="postalNumber">
              <FormItem>
                <FormLabel>Postal Number </FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter postal number"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <UiPermissionGuard
              :permission="PermissionConstants.UPDATE_MERCHANT_BRANCH"
            >
              <div class="col-span-full w-full py-4 flex justify-between">
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

                  Update
                </UiButton>
              </div>
            </UiPermissionGuard>
          </div>
        </form>
      </div>
    </UiCard>
    <div v-else-if="data == null || data == undefined">
      <UiNoResultFound title="Sorry, No application found." />
    </div>
    <div v-else-if="isError">
      <ErrorMessage :retry="refetch" title="Something went wrong." />
    </div>
  </div>
</template>
