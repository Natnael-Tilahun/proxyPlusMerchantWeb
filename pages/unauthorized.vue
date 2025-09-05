<script lang="ts" setup>
definePageMeta({
  layout: false,
});
const router = useRouter();
</script>

<template>
  <div
    class="w-full h-screen border-8 bg-no-repeat bg-center p-5 lg:p-10 md:gap-4 gap-8 lg:gap-8 grid md:grid-cols-2 place-items-center place-content-around"
    style="background-image: url('/bg-design.png')"
  >
    <div class="h-fit flex flex-col gap-5 order-2 md:order-1">
      <div class="space-y-2">
        <h1 class="text-3xl font-extrabold">Access Denied!</h1>
        <h1 class="text">you don't have permission to access this page.</h1>
      </div>

      <UiButton @click="router.push('/login')" class="w-full h-fit"> Go to login</UiButton>
    </div>

    <img
      src="/access-denied.png"
      alt="Access denied image"
      class="w-full order-1 md:order-2"
    />
  </div>
</template>

<style lang="postcss" scoped></style>
