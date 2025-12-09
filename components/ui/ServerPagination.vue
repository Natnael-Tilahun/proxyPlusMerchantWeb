<template>
  <div class="flex md:items-center justify-between px-2">
    <div class="flex-1 text-sm text-muted-foreground">{{ total }} results.</div>
    <div
      class="flex flex-col md:flex-row items-center space-x-6 lg:space-x-8 gap-2 md:gap-0"
    >
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">Rows per page</p>
        <UiSelect
          :model-value="`${size}`"
          @update:model-value="handleSizeChange"
        >
          <UiSelectTrigger class="h-8 w-[70px]">
            <UiSelectValue :placeholder="`${size}`" />
          </UiSelectTrigger>
          <UiSelectContent side="top" class="h-fit overflow-y-auto">
            <UiSelectItem
              v-for="pageSize in [10, 20, 30, 40, 50]"
              :key="pageSize"
              :value="`${pageSize}`"
            >
              {{ pageSize }}
            </UiSelectItem>
          </UiSelectContent>
        </UiSelect>
      </div>
      <div
        class="flex w-[100px] items-center justify-center text-sm font-medium whitespace-nowrap"
      >
        Page {{ page }} of {{ totalPages }}
      </div>
      <div class="flex items-center space-x-2">
        <UiButton
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="page <= 1"
          @click="handlePageChange(1)"
        >
          <span class="sr-only">Go to first page</span>
          <ChevronsLeft name="radix-icons:double-arrow-left" class="h-4 w-4" />
        </UiButton>
        <UiButton
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="page <= 1"
          @click="handlePageChange(page - 1)"
        >
          <span class="sr-only">Go to previous page</span>
          <ChevronLeft name="radix-icons:chevron-left" class="h-4 w-4" />
        </UiButton>
        <UiButton
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="page >= totalPages"
          @click="handlePageChange(page + 1)"
        >
          <span class="sr-only">Go to next page</span>
          <ChevronRight name="radix-icons:chevron-right" class="h-4 w-4" />
        </UiButton>
        <UiButton
          variant="outline"
          class="h-8 w-8 p-0"
          :disabled="page >= totalPages"
          @click="handlePageChange(totalPages)"
        >
          <span class="sr-only">Go to last page</span>
          <ChevronsRight
            name="radix-icons:double-arrow-right"
            class="h-4 w-4"
          />
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps<{
  page: number;
  size: number;
  total: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
}>();

const totalPages = computed(() => Math.ceil(props.total / props.size));

const handlePageChange = (newPage: number) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    props.onPageChange(newPage);
  }
};

const handleSizeChange = (newSize: string) => {
  props.onSizeChange(Number(newSize));
};
</script>
