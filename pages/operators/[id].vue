<script lang="ts" setup>
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { newMerchantOperatorFormSchema } from "~/validations/newMerchantOperatorFormSchem";
import { ref } from "vue";
import { toast } from "~/components/ui/toast";
import { PermissionConstants } from "~/constants/permissions";
import type { Branch, Operator, OperatorRole } from "~/types";
import { getIdFromPath } from "~/lib/utils";
import ErrorMessage from "~/components/ui/errorMessage/ErrorMessage.vue";
const openItems = ref(["branchDetails"]);

const { getMerchantOperatorById, updateMerchantOperator, getMerchantOperatorRoles } =
  await useOperators();
const { getBranches } = useBranches()

const route = useRoute();
const isError = ref(false);
const isMerchantError = ref(false);
const isRolesError  = ref(false);

const loading = ref(false);
const rolesLoading = ref(false);
const merchantLoading = ref(false);
const data = ref<Operator>();
const branchesData = ref<Branch[]>([]);
const merchantRolesData = ref<OperatorRole[]>([]);
const operatorId = ref<string>("");
const isSubmitting = ref(false);
const activeTab = route.query.activeTab as string;
openItems.value = activeTab || "operatorDetails";

operatorId.value = getIdFromPath()

const form = useForm({
  validationSchema: newMerchantOperatorFormSchema,
});

const fetchOperatorData = async () => {
  try {
    isError.value = false
    loading.value = true;
    data.value = await getMerchantOperatorById(
      operatorId.value
    );

    if (data.value) {
      form.setValues({
        ...data.value,
      });
    }
  } catch (err) {
    console.error("Error fetching operator", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

const fetchOperatorRolesData = async () => {
  try {
    isRolesError.value = false
    rolesLoading.value = true;
    const response = await getMerchantOperatorRoles();
    merchantRolesData.value = response
    console.log(merchantRolesData.value)
  } catch (err) {
    console.error("Error fetching operator", err);
    isRolesError.value = true;
  } finally {
    rolesLoading.value = false;
  }
};


const fetchMerchantsData = async () => {
  try {
    isMerchantError.value = false
    merchantLoading.value = true;
    const response = await getBranches(
      0, 1000
    )
    branchesData.value = response
  } catch (err) {
    console.error("Error fetching branches", err);
    isMerchantError.value = true;
  } finally {
    merchantLoading.value = false;
  }
};

onMounted(async () => {
  await fetchMerchantsData()
  await fetchOperatorRolesData()
  await fetchOperatorData();
  console.log("openItems",openItems.value)
console.log("data",data.value)
console.log("isError",isError.value)
console.log("loading",loading.value)
console.log("isRolesError",isRolesError.value)
console.log("isMerchantError",isMerchantError.value)
console.log("rolesLoading",rolesLoading.value)
console.log("merchantLoading",merchantLoading.value)
});

const refetch = async () => {
  isError.value = false
  await fetchMerchantsData()
  await fetchOperatorRolesData()
  await fetchOperatorData();
};

const onSubmit = form.handleSubmit(async (values: any) => {
  try {
    isSubmitting.value = true;
    loading.value = true;
    const updatedData = {
      ...data.value,
      ...values,
    };
    data.value = await updateMerchantOperator(
      operatorId.value,
      updatedData
    );
    form.setValues({
      ...data.value,
    });
    toast({
      title: "Operator Updated",
      description: "Merchant operator updated successfully",
    });
  } catch (err: any) {
    console.error("Error updating operator:", err);
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
    <div v-if="loading" class="py-10 flex justify-center items-center">
      <UiLoading />
    </div>
    <UiTabs v-model="openItems" class="w-full space-y-0">
      <UiTabsList class="w-full h-full overflow-x-scroll flex justify-start gap-2 px-0">
        <UiPermissionGuard :permission="PermissionConstants.READ_MERCHANT_OPERATOR">
          <UiTabsTrigger value="operatorDetails" @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'operatorDetails',
              },
            })
            "
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none">
            Operator Details
          </UiTabsTrigger>
        </UiPermissionGuard>
        <UiPermissionGuard :permission="PermissionConstants.READ_MERCHANT_OPERATOR_TRANSACTION">
          <UiTabsTrigger value="operatorTransactions" @click="
            navigateTo({
              path: route.path,
              query: {
                activeTab: 'operatorTransactions',
              },
            })
            "
            class="text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted-foreground data-[state=inactive]:text-muted rounded-t-lg rounded-b-none">
            Operator Transactions
          </UiTabsTrigger>
        </UiPermissionGuard>
      </UiTabsList>
      <UiPermissionGuard :permission="PermissionConstants.READ_MERCHANT_OPERATOR">
        <UiTabsContent  value="operatorDetails" class="text-base bg-background p-6 rounded-lg border">
          <UiCard v-if="data && !isError"  class="w-full flex border-[1px] rounded-lg h-full">
            <div class="text-sm md:text-base p-6 basis-full">
              <form @submit="onSubmit">
                <div class="grid grid-cols-2 gap-6">
                  <FormField v-slot="{ componentField }" name="merchantOperatorId">
                    <FormItem>
                      <FormLabel>Operator Id </FormLabel>
                      <FormControl>
                        <UiInput type="text" disabled placeholder="Enter Operator Id	" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="firstName">
                    <FormItem class="w-full">
                      <FormLabel> First Name </FormLabel>
                      <FormControl>
                        <UiInput type="text" placeholder="Enter first name" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="middleName">
                    <FormItem class="w-full">
                      <FormLabel> Middle Name </FormLabel>
                      <FormControl>
                        <UiInput type="text" placeholder="Enter middle name" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="lastName">
                    <FormItem class="w-full">
                      <FormLabel> Last Name </FormLabel>
                      <FormControl>
                        <UiInput type="text" placeholder="Enter last name" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="operatorCode">
                    <FormItem class="w-full">
                      <FormLabel>Operator Code</FormLabel>
                      <FormControl>
                        <UiInput type="text" disabled placeholder="Enter operator code" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ value, handleChange }" name="active">
                    <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4 w-full">
                      <FormLabel class="text-base"> Is Active</FormLabel>
                      <FormControl>
                        <UiSwitch :checked="value" @update:checked="handleChange" />
                      </FormControl>
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="operatorRoleId">
                    <FormItem class="w-full">
                      <FormLabel>Operator Role</FormLabel>
                      <UiSelect v-bind="componentField">
                        <FormControl>
                          <UiSelectTrigger>
                            <UiSelectValue placeholder="Select an operator Role" />
                          </UiSelectTrigger>
                        </FormControl>
                        <UiSelectContent>
                          <UiSelectGroup>
                            <UiSelectItem v-for="item in merchantRolesData" :value="item.name">
                              {{ item.name }}
                            </UiSelectItem>
                          </UiSelectGroup>
                        </UiSelectContent>
                      </UiSelect>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="merchantBranchId">
                    <FormItem class="w-full">
                      <FormLabel>Merchant Branch </FormLabel>
                      <UiSelect v-bind="componentField">
                        <FormControl>
                          <UiSelectTrigger>
                            <UiSelectValue placeholder="Select a merchant branch	" />
                          </UiSelectTrigger>
                        </FormControl>
                        <UiSelectContent>
                          <UiSelectGroup v-if="branchesData.length > 0">
                            <UiSelectItem v-for="item in branchesData" :value="item.merchantBranchId">
                              {{ item.branchName }}
                            </UiSelectItem>
                          </UiSelectGroup>
                          <UiSelectGroup v-else>
                            <UiSelectItem value="No branches found">
                              No branches found
                            </UiSelectItem>
                          </UiSelectGroup>
                        </UiSelectContent>
                      </UiSelect>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <UiPermissionGuard :permission="PermissionConstants.UPDATE_MERCHANT_OPERATOR">
                    <div class="col-span-full w-full py-4 flex justify-between">
                      <UiButton :disabled="isSubmitting" variant="outline" type="button" @click="$router.go(-1)">
                        Cancel
                      </UiButton>
                      <UiButton :disabled="isSubmitting" type="submit">
                        <Icon name="svg-spinners:8-dots-rotate" v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin">
                        </Icon>

                        Update
                      </UiButton>
                    </div>
                  </UiPermissionGuard>
                </div>
              </form>
            </div>
          </UiCard>
              <div v-else-if="isError || data == null || data == undefined">
      <ErrorMessage :retry="refetch" title="Something went wrong." />
    </div>
        </UiTabsContent>
    
      </UiPermissionGuard>
      <UiPermissionGuard :permission="PermissionConstants.READ_MERCHANT_OPERATOR_TRANSACTION">
        <UiTabsContent value="operatorTransactions" class="text-base bg-background border p-6 h-full rounded-lg">
          <OperatorsTransactions />
        </UiTabsContent>
      </UiPermissionGuard>
    </UiTabs>
    <!-- <div v-else-if="data == null || data == undefined">
      <UiNoResultFound title="Sorry, No application found." />
    </div> -->
    <!-- <div v-else-if="isError || data == null || data == undefined">
      <ErrorMessage :retry="refetch" title="Something went wrong." />
    </div> -->
  </div>
</template>
