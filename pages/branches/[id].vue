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
import { getIdFromPath } from "~/lib/utils";
const openItems = ref("branchDetails");

definePageMeta({
   hideBreadcrumb: true,
});

const { getBranchById, updateMerchantBranch } = useBranches();
const route = useRoute();

const isError = ref(false);
const loading = ref(false);
const data = ref<Branch>();
const branchId = ref<string>("");
const isSubmitting = ref(false);
const activeTab = route.query.activeTab as string;
openItems.value = activeTab || "branchDetails";

branchId.value = getIdFromPath()
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
    data.value = await getBranchById(branchId.value);
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
    data.value = await updateMerchantBranch(branchId.value, updatedData);
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

// Watch for changes in the route's query parameters
watch(
  () => route.query.activeTab,
  (newActiveTab) => {
    refetch();
    if (newActiveTab) {
      openItems.value = newActiveTab as string; // Update the active tab when the query param
    }
  }
);
</script>

<template>
  <div class="w-full flex flex-col gap-8">
      <UiTabs v-model="openItems" class="w-full space-y-2">
      <UiTabsList
        class="w-full h-full overflow-x-scroll flex justify-start gap-2 p-2  bg-card"
      >
  <UiPermissionGuard :permission="PermissionConstants.READ_MERCHANT_BRANCH" >
        <UiTabsTrigger
          value="branchDetails"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'branchDetails',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground border rounded-t-lg rounded-b-none"
        >
          Branch Details
        </UiTabsTrigger>
        </UiPermissionGuard>
  <UiPermissionGuard :permission="PermissionConstants.READ_MERCHANT_BRANCH_TRANSACTION" >
        <UiTabsTrigger
          value="branchTransactions"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'branchTransactions',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground border rounded-t-lg rounded-b-none"
        >
          Branch Transactions
        </UiTabsTrigger>
        <UiTabsTrigger value="transactionDetails" @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'transactionDetails',
              },
            })
            "
            :disabled="openItems != 'transactionDetails'"
            class="text-lg data-[state=active]:bg-primary  data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground border  rounded-t-lg rounded-b-none data-[state=inactive]:hidden">
            Transactions Details
          </UiTabsTrigger>
          <UiTabsTrigger value="downloadTransactions" @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'downloadTransactions',
              },
            })
            "
            :disabled="openItems != 'downloadTransactions'"
            class="text-lg data-[state=active]:bg-primary  data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground border  rounded-t-lg rounded-b-none data-[state=inactive]:hidden"
            >
            Download Transactions
          </UiTabsTrigger>
        </UiPermissionGuard>
  <UiPermissionGuard :permission="PermissionConstants.READ_MERCHANT_OPERATOR" >
        <UiTabsTrigger
          value="branchOperators"
          @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'branchOperators',
              },
            })
          "
          class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground border rounded-t-lg rounded-b-none"
        >
          Branch Operators
        </UiTabsTrigger>
        <UiTabsTrigger value="operatorDetails" @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'operatorDetails',
              },
            })
            "
            :disabled="openItems != 'operatorDetails'"
            class="text-lg data-[state=active]:bg-primary  data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground border  rounded-t-lg rounded-b-none data-[state=inactive]:hidden">
            Operator Details
          </UiTabsTrigger>
        </UiPermissionGuard>
      </UiTabsList>
      <UiPermissionGuard :permission="PermissionConstants.READ_MERCHANT_BRANCH" >
      <UiTabsContent
        value="branchDetails"
        class="text-base bg-background p-6 rounded-lg border"
      >
      <div v-if="loading" class="py-10 flex justify-center items-center">
      <UiLoading />
    </div>
      <UiCard v-else-if="data && !isError"
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
    <div v-else-if="isError || data == null || data == undefined">
      <ErrorMessage :retry="refetch" title="Something went wrong." />
    </div>
      </UiTabsContent>
      </UiPermissionGuard>
      <UiPermissionGuard :permission="PermissionConstants.READ_MERCHANT_BRANCH_TRANSACTION" >
      <UiTabsContent
        value="branchTransactions"
        class="text-base bg-background border p-6 h-full rounded-lg"
      >
        <BranchesTransactions/>
      </UiTabsContent>
      <UiTabsContent value="transactionDetails" class="text-base bg-background border p-6 h-full rounded-lg">
          <BranchesTransactionsDetails />
        </UiTabsContent>
        <UiTabsContent value="downloadTransactions" class="text-base bg-background border p-6 h-full rounded-lg">
          <BranchesTransactionsDownloadTransactions />
        </UiTabsContent>
      </UiPermissionGuard>
      <UiPermissionGuard :permission="PermissionConstants.READ_MERCHANT_OPERATOR" >
      <UiTabsContent
        value="branchOperators"
        class="text-base bg-background border p-6 h-full rounded-lg"
      >
        <BranchesOperators />
      </UiTabsContent>
      <UiTabsContent value="operatorDetails" class="text-base bg-background border p-6 h-full rounded-lg">
          <BranchesOperatorsDetails />
        </UiTabsContent>
      </UiPermissionGuard>
</UiTabs>
  </div>
</template>
