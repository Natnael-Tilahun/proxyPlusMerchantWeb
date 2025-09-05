<template>
  <NuxtScrollbar tag="aside"
    class="md:bg-primary bg-white dark:bg-card flex z-40 flex-col text-sm py-4 md:text-secondary dark:text-gray-300 md:w-full overflow-hidden font-medium space-y-6">
    <div class="flex w-full h-24 md:items-center justify-between px-3">
      <!-- <h1
        class="lg:text-2xl text-xl font-bold px-4 md:px-10 backdrop-blur-md self-center shadow-sm"
      >
        Project X
      </h1> -->
      <img src="/logo.png" class="lg:w-24 lg:h-24 w-14 h-14  mx-auto rounded-full" alt="CBE Logo" />

      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" @click="closeMenuNav"
        class="md:hidden md:w-0 w-10 h-10 text-secondary-foreground border-accent rounded-md border-2">
        <path fill="currentColor"
          d="m8.382 17.025l-1.407-1.4L10.593 12L6.975 8.4L8.382 7L12 10.615L15.593 7L17 8.4L13.382 12L17 15.625l-1.407 1.4L12 13.41z" />
      </svg>
    </div>

    <hr class="md:border-secondary/30" />

    <ul class="flex flex-col gap-4 pl-5">
      <template v-for="(link, index) in mainLinks" :key="index">
        <UiCollapsible v-if="link.dropdown && hasVisibleDropdownItems(link)"
          class="w-full rounded-l-lg hover:bg-popover hover:text-secondary-foreground px-0 shadow-none group"
          type="single" v-model:open="isOpen[index]">
          <UiCollapsibleTrigger class="py-3 shadow-none w-full hover:text-primary">
            <NuxtLink :to="link.link"
              class="flex gap-3 items-center px-2 rounded-l-full w-full py-0 rounded- transition text-left"
              >
              <span>
                <Icon :name="link.icon" :size="link.size"></Icon>
              </span>
              <p class="mr-auto">{{ link.title }}</p>

              <Icon name="material-symbols:keyboard-arrow-down-rounded" size="22"></Icon>
            </NuxtLink>
          </UiCollapsibleTrigger>

          <!-- Check if the link has a dropdown -->
          <UiCollapsibleContent>
            <ul class="dropdown-menu rounded-none flex flex-col gap-0 py-2 pl-7">
              <template v-for="(item, dropdownIndex) in link.dropdown" :key="dropdownIndex">
                <UiPermissionGuard :permission="item?.permission">
                  <NuxtLink :key="dropdownIndex" :to="item.link"
                    @click="closeMenuNav"
                    class="w-full border-l-2 my-1 hover:rounded-r-lg group-hover:border-primary hover:bg-accent px-4 py-3 rounded-none hover:text-primary"
                    :class="{
                      'bg-[#8C2A7C]/15 rounded-lg font-bold':
                        isRouteActive(item.link),
                    }"
                    >
                    {{ item.title }}
                  </NuxtLink>
                </UiPermissionGuard>
              </template>
            </ul>
          </UiCollapsibleContent>
        </UiCollapsible>

        <UiPermissionGuard v-if="!link?.dropdown" :permission="link?.permission">
          <NuxtLink v-if="!link.dropdown" :to="link.link" @click="closeMenuNav"
            class="flex gap-3 py-3 rounded-l-full px-3 hover:bg-popover hover:text-primary transition"
            :class="{
              'text-primary-foreground bg-primaryd font-bold': isRouteActive(
                link?.link ?? ''
              ),
            }"
            >
            <span>
              <Icon :name="link.icon" :size="link.size"></Icon>
            </span>
            <p>{{ link.title }}</p>
          </NuxtLink>
        </UiPermissionGuard>
      </template>
    </ul>
    <div class="w-full flex absolute bottom-7 justify-center items-center">
      <UiButton @click="logoutHandler" variant="outline"
        class="shadow-xl text-lg font-bold text-primary flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20" class="w-6 fill-primary">
          <g fill="" fill-rule="evenodd" clip-rule="evenodd">
            <path
              d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75z" />
            <path
              d="M6 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H6.75A.75.75 0 0 1 6 10" />
          </g>
        </svg>

        Logout
      </UiButton>
    </div>
  </NuxtScrollbar>
</template>

<script lang="ts" setup>
import { mainLinks as allMainLinks } from "~/constants/mainLinks";
import type { MenuItem } from "~/types";
const { logout } = useAuth();
const authStore = useAuthStore();
const route = useRoute();

const mainLinks = computed(() => {
  const isForAllBranch = authStore.role?.effectiveToAllBranch;
  const store = useAuthStore()
  const myBranchId = store.profile?.merchantBranch?.merchantBranchId

  return allMainLinks.map((link) => {
    if (link.dropdown) {
      const newLink = { ...link };
      newLink.dropdown = newLink.dropdown.filter((item) => {
        const itemAny = item as any;
        if (itemAny.effectiveToAllBranch && !isForAllBranch) {
          return false;
        }
        if (itemAny.requiresMyBranchId && !myBranchId) {
          return false;
        }
        return true;
      });
      return newLink;
    }
    return link;
  });
});

const logoutHandler = async () => {
  logout().then((data) => {
    console.log("User logged out successfully!");

    // Get the session management functions from the plugin
    const { $releaseSession, $notifyLogout } = useNuxtApp();

    // Release the session
    $releaseSession();

    // Notify other tabs about the logout
    $notifyLogout();
  });
};

// Initialize isOpen array with the same length as mainLinks and set all to false
const isOpen = ref(new Array(allMainLinks.length).fill(false));

const emits = defineEmits(["closeMenuNav"]); // Define custom event

const closeMenuNav = () => {
  emits("closeMenuNav"); // Emit the toggleTheme event to the parent
};

const hasVisibleDropdownItems = (link: MenuItem) => {
  return link.dropdown?.some((item) => useHasPermissions(item.permission ?? ""));
};

function isRouteActive(path: string) {
  if (path === "/") {
    // For dashboard, only return true if we're exactly at the root
    return route.path === "/";
  }
  // For other routes, keep the existing behavior
  return route.path.startsWith(path);
}
</script>

<style scoped>
.router-link-active {
  @apply font-bold text-white md:text-primary bg-primary md:bg-popover rounded-l-full group-hover:rounded-l-lg border-l-2 p-3;
}
</style>
