<script setup lang="ts">
import { type Table } from "@tanstack/vue-table";
import { CalendarIcon } from "lucide-vue-next";
import DataTableViewOptions from "~/components/ui/dataTable/ViewOptions.vue";
// import { type Task } from "../data/schema";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const props = defineProps<
  DataTableToolbarProps<any> & { refetch: () => void }
>();
const showOtherFilteration = ref(false);
const transactionFilterStore = useTransactionFilterStore();
// const branchesStore = useBranchesStore();
// const operatorsStore = useOperatorsStore();
const paymentStatusOptions = computed(() => [
  "NONE",
  "PENDING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
  "EXPIRED",
]);

const paymentInitiatorOptions = computed(() => [
  "NONE",
  "MERCHANT_INITIATED",
  "MERCHANT_OPERATOR_INITIATED",
  "PAYER_INITIATED",
]);

const clearFilter = () => {
  transactionFilterStore.$reset();
  props.refetch();
};
// const isFiltered = computed(
//   () => props.table.getState().columnFilters.length > 0
// );
</script>

<template>
  <UiPopover
    class="flex pt-10 gap-6 w-full mb-8 h-full overflow-y-scroll border-8 border-primary justify-between space-y-4"
  >
    <div class="flex items-center flex-wra self-start gap-4">
      <UiInput
        placeholder="Filter by payer name and enter to search"
        v-model="transactionFilterStore.payerName"
        class="h-10 min-w-[150px] md:min-w-[200px] lg:min-w-[350px] w-fit rounded-full px-4"
        @keydown.enter="refetch"
      />
      <UiPopoverTrigger as-child>
        <UiButton
          variant="outline"
          class="text-base text-primary cursor-pointer flex items-center gap-2 font-medium border border-primary rounded-full px-2 py-1"
        >
          <Icon
            name="material-symbols:filter-list"
            class="h-6 w-6 text-primary"
          ></Icon>
          Advanced Filter
        </UiButton>
      </UiPopoverTrigger>

      <DataTableViewOptions :table="table" />
    </div>

    <UiPopoverContent class="space-y-5 rounded-xl w-full lg:p-6">
      <h1 class="lg:text-3xl md:text-2xl text-xl text-left font-medium">
        Advanced Filter
      </h1>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full flex-wrap gap-x-6 gap-y-4"
      >
        <div class="space-y-1">
          <label for="payerAccountNumber" class="text-sm"
            >Payer Account Number</label
          >
          <UiInput
            placeholder="Filter by payer account number"
            v-model="transactionFilterStore.payerAccountNumber"
            class="h-10 min-w-[250px] w-full"
            @keydown.enter="refetch"
          />
        </div>

        <div class="space-y-1">
          <label for="payerPhone" class="text-sm">Payer Phone Number</label>
          <UiInput
            placeholder="Filter by payer phone number"
            v-model="transactionFilterStore.payerPhone"
            class="h-10 min-w-[250px] w-full"
            @keydown.enter="refetch"
          />
        </div>

        <div class="space-y-1">
          <label for="payerId" class="text-sm">Payer ID</label>
          <UiInput
            placeholder="Filter by payer id"
            v-model="transactionFilterStore.payerId"
            class="h-10 min-w-[250px] w-full"
            @keydown.enter="refetch"
          />
        </div>

        <div class="space-y-1">
          <label for="amountGreaterThanOrEqual" class="text-sm"
            >Amount Greater Than Or Equal</label
          >
          <UiInput
            placeholder="Filter by amount greater than or equal"
            v-model="transactionFilterStore.amountGreaterThanOrEqual"
            class="h-10 min-w-[250px] w-full"
            @keydown.enter="refetch"
          />
        </div>

        <div class="space-y-1">
          <label for="amountLessThanOrEqual" class="text-sm"
            >Amount Less Than Or Equal</label
          >
          <UiInput
            placeholder="Filter by amount less than or equal"
            v-model="transactionFilterStore.amountLessThanOrEqual"
            class="h-10 min-w-[250px] w-full"
            @keydown.enter="refetch"
          />
        </div>

        <div class="space-y-1">
          <label for="paymentReference" class="text-sm"
            >Payment Reference</label
          >
          <UiInput
            placeholder="Filter by payment reference"
            v-model="transactionFilterStore.paymentReference"
            class="h-10 min-w-[250px] w-full"
            @keydown.enter="refetch"
          />
        </div>

        <div class="space-y-1">
          <label for="dynamicId" class="text-sm">Dynamic ID</label>
          <UiInput
            placeholder="Filter by dynamic id"
            v-model="transactionFilterStore.dynamicId"
            class="h-10 min-w-[250px] w-full"
            @keydown.enter="refetch"
          />
        </div>

        <div class="space-y-1">
          <label for="mbTransactionId" class="text-sm"
            >Mobile Banking Transaction ID</label
          >
          <UiInput
            placeholder="Filter by mobile banking transaction id"
            v-model="transactionFilterStore.mbTransactionId"
            class="h-10 min-w-[250px] w-full"
            @keydown.enter="refetch"
          />
        </div>

        <div class="space-y-1">
          <label for="coreTransactionId" class="text-sm"
            >Core Transaction ID</label
          >
          <UiInput
            placeholder="Filter by core transaction id"
            v-model="transactionFilterStore.coreTransactionId"
            class="h-10 min-w-[250px] w-full"
            @keydown.enter="refetch"
          />
        </div>

        <div class="space-y-1">
          <label for="merchantAccountNumber" class="text-sm"
            >Merchant Account Number</label
          >
          <UiInput
            placeholder="Filter by merchant account number"
            v-model="transactionFilterStore.merchantAccountNumber"
            class="h-10 min-w-[250px] w-full"
            @keydown.enter="refetch"
          />
        </div>

        <div class="space-y-1">
          <label for="paymentStatus" class="text-sm">Payment Status</label>
          <UiSelect
            name="paymentStatus"
            v-model="transactionFilterStore.paymentStatus"
            @update:model-value="() => refetch()"
          >
            <UiSelectTrigger class="h-10 min-w-[150px] w-full">
              <UiSelectValue placeholder="Filter by payment status" />
            </UiSelectTrigger>
            <UiSelectContent side="bottom">
              <UiSelectItem
                v-for="status in paymentStatusOptions"
                :key="status"
                :value="status"
              >
                {{ status }}
              </UiSelectItem>
            </UiSelectContent>
          </UiSelect>
        </div>

        <!-- <div class="space-y-1">
          <label for="paymentInitiator" class="text-sm"
            >Payment Initiator</label
          >
          <UiSelect
            name="paymentInitiator"
            v-model="transactionFilterStore.transactionInitiator"
            @update:model-value="() => refetch()"
          >
            <UiSelectTrigger class="h-10 w-full min-w-[150px]">
              <UiSelectValue placeholder="Filter by payment initiator" />
            </UiSelectTrigger>
            <UiSelectContent side="bottom">
              <UiSelectItem
                v-for="initiator in paymentInitiatorOptions"
                :key="initiator"
                :value="initiator"
              >
                {{ initiator }}
              </UiSelectItem>
            </UiSelectContent>
          </UiSelect>
        </div> -->
        <!-- 
        <div class="space-y-1">
          <label for="branch" class="text-sm">{{ $t("branch") }}</label>
          <UiSelect
            name="branch"
            v-model="transactionFilterStore.merchantBranchId"
            @update:model-value="() => refetch()"
          >
            <UiSelectTrigger class="h-10 min-w-[150px] w-full">
              <UiSelectValue :placeholder="$t('filter_by_branch')" />
            </UiSelectTrigger>
            <UiSelectContent side="bottom">
              <UiSelectItem
                v-for="branch in branchesStore.branches"
                :key="branch.merchantBranchId"
                :value="branch.merchantBranchId"
              >
                {{ branch.branchName }}
              </UiSelectItem>
            </UiSelectContent>
          </UiSelect>
        </div> -->

        <!-- <div class="space-y-1">
          <label for="operator" class="text-sm">{{ $t("operator") }}</label>
          <UiSelect
            name="operator"
            v-model="transactionFilterStore.merchantOperatorId"
            @update:model-value="() => refetch()"
          >
            <UiSelectTrigger class="h-10 min-w-[150px] w-full">
              <UiSelectValue :placeholder="$t('filter_by_operator')" />
            </UiSelectTrigger>
            <UiSelectContent side="bottom">
              <UiSelectItem
                v-for="operator in operatorsStore.operators"
                :key="operator.merchantOperatorId"
                :value="operator.merchantOperatorId"
              >
                {{ operator.fullName }}
              </UiSelectItem>
            </UiSelectContent>
          </UiSelect>
        </div> -->

        <!-- <div class="space-y-1">
          <label for="initiatedDate" class="text-sm">Initiated Date</label>
          <UiPopover>
            <UiPopoverTrigger asChild>
              <UiButton
                variant="outline"
                class="h-10 min-w-[150px] w-full text-left font-normal flex items-center gap-2 justify-between"
              >
                {{
                  transactionFilterStore.initiatedDate
                    ? new Date(
                        transactionFilterStore.initiatedDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Pick a date"
                }}
                <CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
              </UiButton>
            </UiPopoverTrigger>
            <UiPopoverContent className="w-auto p-0">
              <UiCalendar
                mode="single"
                v-model="transactionFilterStore.initiatedDate"
                @update:model-value="(value: string) => { transactionFilterStore.initiatedDate = new Date(value).toISOString(); refetch(); }"
                className="rounded-md border"
              />
            </UiPopoverContent>
          </UiPopover>
        </div> -->

        <div class="space-y-1">
          <label for="completedDate" class="text-sm">Completed Date</label>
          <UiPopover>
            <UiPopoverTrigger asChild>
              <UiButton
                variant="outline"
                class="h-10 min-w-[150px] w-full text-left font-normal flex items-center gap-2 justify-between"
              >
                {{
                  transactionFilterStore.completedDate
                    ? new Date(
                        transactionFilterStore.completedDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Pick a date"
                }}
                <CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
              </UiButton>
            </UiPopoverTrigger>
            <UiPopoverContent className="w-auto p-0">
              <UiCalendar
                mode="single"
                v-model="transactionFilterStore.completedDate"
                @update:model-value="(value: string) => { transactionFilterStore.completedDate = new Date(value).toISOString(); refetch(); }"
                className="rounded-md border"
              />
            </UiPopoverContent>
          </UiPopover>
        </div>

        <div class="space-y-1">
          <label for="expirationDate" class="text-sm">Expiration Date</label>
          <UiPopover>
            <UiPopoverTrigger asChild>
              <UiButton
                variant="outline"
                class="h-10 min-w-[150px] w-full text-left font-normal flex items-center gap-2 justify-between"
              >
                {{
                  transactionFilterStore.expirationDate
                    ? new Date(
                        transactionFilterStore.expirationDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Pick a date"
                }}
                <CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
              </UiButton>
            </UiPopoverTrigger>
            <UiPopoverContent className="w-auto p-0">
              <UiCalendar
                mode="single"
                v-model="transactionFilterStore.expirationDate"
                @update:model-value="(value: string) => { transactionFilterStore.expirationDate = new Date(value).toISOString(); refetch(); }"
                className="rounded-md border"
              />
            </UiPopoverContent>
          </UiPopover>
        </div>

        <div class="flex items-center gap-6 w-full justify-end col-span-full">
          <UiButton variant="outline" @click="clearFilter">clear</UiButton>
          <UiButton @click="refetch">apply</UiButton>
        </div>
      </div>
    </UiPopoverContent>
  </UiPopover>
</template>
