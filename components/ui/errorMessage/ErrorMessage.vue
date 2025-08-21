<script lang="ts" setup>
import { defineProps, ref } from "vue";
import { cn } from "~/lib/utils";
const loading = ref(false);

// Define props for title and description
const props = defineProps({
  title: String,
  description: String,
  retry: Function, // Define retry prop as Function
});
</script>

<template>
  <div
    class="{`w-full h-60 md:h-[500px] p-10 bg-[#f8dff3] shadow-none border-none dark:bg-[#4b1217] rounded-xl border-[1px] max-h-screen flex flex-col gap-2 justify-center items-center ${className}`}"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      class="w-32 pb-4 text-red-600"
    >
      <path
        fill="currentColor"
        d="M12 17q.425 0 .713-.288Q13 16.425 13 16t-.287-.713Q12.425 15 12 15t-.712.287Q11 15.575 11 16t.288.712Q11.575 17 12 17Zm0-4q.425 0 .713-.288Q13 12.425 13 12V8q0-.425-.287-.713Q12.425 7 12 7t-.712.287Q11 7.575 11 8v4q0 .425.288.712q.287.288.712.288Zm0 9q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Zm0-2q3.35 0 5.675-2.325Q20 15.35 20 12q0-3.35-2.325-5.675Q15.35 4 12 4Q8.65 4 6.325 6.325Q4 8.65 4 12q0 3.35 2.325 5.675Q8.65 20 12 20Zm0-8Z"
      />
    </svg>
    <h1 class="font-medium lg:text-xl dark:text-thm_dark_primary_color">
      {{ props.title ? props.title : "Something went wrong." }}
    </h1>
    <p
      class="text-thm_secondary_color lg:text-base text-sm dark:text-thm_dark_secondary_color"
    >
      {{ props.description ? props.description : "Please, Try again." }}
    </p>
    <Icon
      name="material-symbols:directory-sync-rounded"
      :class="cn('h-8 w-8 cursor-pointer ', loading && 'animate-spin')"
      @click="
        () => {
          loading = true;
          props.retry && props.retry();
          loading = false;
        }
      "
    ></Icon>
  </div>
</template>

<style lang="postcss" scoped></style>
