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

const { getMerchantOperatorById, updateMerchantOperator, getMerchantOperatorRoles } =
  await useOperators();
const {getBranches} = useBranches()

const isError = ref(false);
const loading = ref(false);
const data = ref<Operator>();
const branchesData = ref<Branch[]>([]);
const merchantRolesData = ref<OperatorRole[]>([]);

const operatorId = ref<string>("");
const merchantId = ref<string>("");
const route = useRoute();

const authStore = useAuthStore();
merchantId.value = authStore.profile?.merchantOperatorId

operatorId.value = route.query.operatorId;

const isSubmitting = ref(false);

const form = useForm({
  validationSchema: newMerchantOperatorFormSchema,
});

const fetchOperatorData = async () => {
  try {
    isError.value = false
    loading.value = true;
    data.value = await getMerchantOperatorById(
      merchantId.value,
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
    isError.value = false
    loading.value = true;
   const response = await getMerchantOperatorRoles();
    merchantRolesData.value = response
    console.log(merchantRolesData.value)
  } catch (err) {
    console.error("Error fetching operator", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};


const fetchMerchantsData = async () => {
  try {
    isError.value = false
    loading.value = true;
    const response = await getBranches(
      merchantId.value,0,1000
    )
    branchesData.value = response
  } catch (err) {
    console.error("Error fetching branches", err);
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchMerchantsData()
  await fetchOperatorRolesData()
  await fetchOperatorData();
});

const refetch = async () => {
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
      merchantId.value,
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
            <FormField v-slot="{ componentField }" name="merchantOperatorId">
                <FormItem>
                  <FormLabel>Operator Id	 </FormLabel>
                  <FormControl>
                    <UiInput
                      type="text"
                      disabled
                      placeholder="Enter Operator Id	"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            <FormField v-slot="{ componentField }" name="firstName">
              <FormItem class="w-full">
                <FormLabel> First Name	</FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter first name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="middleName">
              <FormItem class="w-full">
                <FormLabel> Middle Name	</FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter middle name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="lastName">
              <FormItem class="w-full">
                <FormLabel> Last Name	</FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    placeholder="Enter last name"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="operatorCode">
              <FormItem class="w-full">
                <FormLabel>Operator Code</FormLabel>
                <FormControl>
                  <UiInput
                    type="text"
                    disabled
                    placeholder="Enter operator code"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ value, handleChange }" name="active">
              <FormItem
                class="flex flex-row items-center justify-between rounded-lg border p-4 w-full"
              >
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
                      <UiSelectItem
                        v-for="item in merchantRolesData"
                        :value="item.name"
                      >
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
                      <UiSelectItem
                        v-for="item in branchesData"
                        :value="item.merchantBranchId"
                      >
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

            <UiPermissionGuard :permission="PermissionConstants.UPDATE_APPLICATION_VERSION" >
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
