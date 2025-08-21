<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useColorMode } from "@vueuse/core";
import Sidebar from "~/components/layout/sidebar/Sidebar.vue";
import OpenSidebarIcon from "~/components/layout/sidebar/OpenSidebarIcon.vue";
import CloseSidebarIcon from "~/components/layout/sidebar/CloseSidebarIcon.vue";


const LOCAL_STORAGE_THEME_KEY = "theme";

const route = useRoute();
const fullPath = ref(route.path);
const pathSegments = ref([]);
pathSegments.value = splitPath(fullPath.value);

console.log("route.meta.hideBreadcrumb: ", route.meta.hideBreadcrumb)


watch(
  () => route.path,
  (newVal) => {
    fullPath.value = newVal;
    pathSegments.value = splitPath(fullPath.value);
  }
);

function splitPath(path: any) {
  return path.split("/").filter(Boolean);
}

function capitalizeRouteName(route: any) {
  return route.charAt(0).toUpperCase() + route.slice(1);
}

function generateLink(index: any) {
  const linkSegments = pathSegments.value.slice(0, index + 1);
  const path = linkSegments.join("/");
  return path === "/" ? path : `/${path}`;
}

const colorMode = useColorMode();

// Use system preference if no theme is set
onMounted(() => {
  const storedTheme = process.client
    ? localStorage.getItem(LOCAL_STORAGE_THEME_KEY)
    : null;
  if (!storedTheme) {
    colorMode.value = "auto";
  }
});

const setTheme = (newTheme: "light" | "dark" | "auto") => {
  colorMode.value = newTheme;
  if (process.client) {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
  }
};

const toggleTheme = () => {
  const newTheme = colorMode.value === "dark" ? "light" : "dark";
  setTheme(newTheme);
};

const isSidebarCollapsed = useSidebarCollapsed();

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const closeMenuNav = () => {
  isSidebarCollapsed.value = false;
};
</script>

<template>
  <div
    class="w-full h-screen overflow-hidden bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 grid grid-cols-12 lg:grid-cols-9 xl:grid-cols-7"
    :class="[
      {
        ' relative h-screen  w-full': !isSidebarCollapsed,
      },
      {
        ' static  w-full': isSidebarCollapsed,
      },
    ]"
  >
    <!-- Page Sidebar -->
    <Sidebar
      class="md:col-span-3 col-span-12 md:static fixed h-screen lg:col-span-2 xl:col-span-1"
      :class="[
        {
          'hidden col-span-12  md:block xl:col-span-1  md:col-span-3':
            !isSidebarCollapsed,
        },
        {
          'col-span-12 absolute w-2/3 md:hidden shadow-lg z-50':
            isSidebarCollapsed,
        },
      ]"
      @closeMenuNav="closeMenuNav"
    />

    <div
      class="col-span-full overflow-scroll md:col-span-9 lg:col-span-7 xl:col-span-6 md:flex"
      :class="[
        {
          'w-full   h-full top-0 left-0   flex-col md:flex':
            !isSidebarCollapsed,
        },
        {
          ' absolute  w-full h-full flex-col flex': isSidebarCollapsed,
        },
      ]"
    >
      <!-- Page Header -->
      <div class="flex flex-col py-6 gap-4 md:px-8 p-5">
        <div class="flex h-10 items-center justify-between">
          <div class="flex items-center gap-3 md:gap-8">
            <OpenSidebarIcon
              v-if="!isSidebarCollapsed"
              @click="toggleSidebar"
              class="md"
            />
            <CloseSidebarIcon
              class=""
              v-if="isSidebarCollapsed"
              @click="toggleSidebar"
            />

            <!-- <DashboardSearch class="hidden md:block" /> -->
          </div>

          <div class="ml-auto flex items-center space-x-2 md:space-x-5">
            <UiButton
              variant="ghost"
              size="icon"
              @click="toggleTheme"
              class="bg-primary text-primary-foreground hover:bg-gray-300 dark:bg-gray-500 dark:text-white hover:dark:bg-gray-700 rounded-full"
            >
              <Icon
                v-if="colorMode === 'dark'"
                fill="currentColor"
                name="lucide:sun"
                class="h-[1.2rem] w-[1.2rem] transition-all"
              />
              <Icon
                v-else
                name="lucide:moon"
                fill="currentColor"
                class="h-[1.2rem] w-[1.2rem] transition-all"
              />
              <span class="sr-only">Toggle theme</span>
            </UiButton>
            <DashboardUserNav />
          </div>
        </div>

        <UiCard
          v-if="!route.meta.hideBreadcrumb"
          class="h-16 shadow-sm bg-white flex gap-14 px-5 items-center w-full"
        >
          <!-- <div class="w-0 h-14 rounded-xl -left-2 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 32 32"
              @click="toggleSidebar"
              v-if="!isSidebarCollapsed"
              class="md:absolute w-16 h-16 hidden md:block left-[35%] top-[8%] z-50 text-primary"
            >
              <path
                fill="currentColor"
                d="M16.5 14.8V9.2q0-.35-.3-.475t-.55.125L13.2 11.3q-.3.3-.3.7t.3.7l2.45 2.45q.25.25.55.125t.3-.475M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm5-2h9V5h-9z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 32 32"
              @click="toggleSidebar"
              v-if="isSidebarCollapsed"
              class="md:absolute w-16 h-16 hidden md:block left-[35%] top-[5%] z-50 text-primary"
            >
              <path
                fill="currentColor"
                d="M12.5 9.2v5.6q0 .35.3.475t.55-.125l2.45-2.45q.3-.3.3-.7t-.3-.7l-2.45-2.45q-.25-.25-.55-.125t-.3.475M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm5-2h9V5h-9z"
              />
            </svg>
          </div> -->

          <h1 class="text-sm md:text-lg md:block space-x-2">
            <template v-if="pathSegments.length == 0">
              <router-link to="/" class="font-bold">Dashboard</router-link>
            </template>

            <template v-if="pathSegments.length > 0">
              <span v-for="(segment, index) in pathSegments" :key="index">
                <template v-if="index !== 0">
                  <Icon name="mdi:chevron-double-right" class=""></Icon>
                </template>

                <template v-if="segment">
                  <NuxtLink class="font-light" :to="generateLink(index)">
                    {{ capitalizeRouteName(segment) }}
                  </NuxtLink>
                </template>
              </span>
            </template>
          </h1>
        </UiCard>
      </div>

      <!-- Page Main Content -->
      <div class="md:px-8 px-5 pb-5">
        <slot />
      </div>
    </div>
  </div>
</template>
<style scoped>
.router-link-active {
  @apply font-semibold text-primary ml-1;
}
</style>
