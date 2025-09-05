<script lang="ts" setup>
interface OtherInfoDataProps {
  otherInfoData: {};
}

const { otherInfoData } = defineProps<OtherInfoDataProps>();

const otherInfoDatas = ref(otherInfoData as OtherInfoDataProps);
</script>

<template>
  <UiTabs
    default-value="otherInformation"
    class="space-y-0 p-4 shadow-xl border-0 bg-secondary text-popover-foreground w-[900px] z-50 fixed right-0"
  >
    <UiTabsList
      class="w-full bg-white flex justify-start py-7 px-0 border-[1px]"
    >
      <UiTabsTrigger
        value="otherInformation"
        class="md:text-lg py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
      >
        Other Information
      </UiTabsTrigger>
      <UiTabsTrigger
        value="jsonData"
        class="md:text-lg py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"
      >
        JSON Data
      </UiTabsTrigger>
    </UiTabsList>

    <UiTabsContent
      value="otherInformation"
      class="space-y-4 py-7 text-sm border-[0px] h-[300px] overflow-scroll bg-popover px-3"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7">
        <div
          class="flex flex-col gap-1"
          v-for="(value, key) in otherInfoDatas"
          :key="key"
        >
          <h1 class="font-medium text-muted-foreground">
            {{ key }}
          </h1>
          <p class="text-secondary-foreground">{{ value }}</p>
        </div>
      </div>
    </UiTabsContent>

    <UiTabsContent value="jsonData" class="space-y-4 p-4">
      <div class="flex flex-col space-y-4">
        <code>{{ otherInfoData }}</code>
      </div>
    </UiTabsContent>
  </UiTabs>
</template>

<style lang="css" scoped></style>
