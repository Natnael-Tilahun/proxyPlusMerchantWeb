<script setup lang="ts">
const { profile } = useAuthStore();
const { logout } = useAuth();

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
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <div class="relative flex flex-col w-fit">
        <UiButton variant="ghost" class="h-8 w-fit space-x-2 rounded-full">
          <UiAvatar class="h-8 w-8">
            <UiAvatarImage src="avatars/01.png" alt="@shadcn" />
            <UiAvatarFallback>SC</UiAvatarFallback>
          </UiAvatar>
          <p
            class="text-sm hidden md:block font-medium leading-none text-secondary-foreground"
          >
            {{ profile?.fullName }}
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            class="text-gray-400 w-6 hidden md:block"
          >
            <path
              fill="currentColor"
              d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z"
            />
          </svg>
        </UiButton>
        <!-- <UiBadge class="bg-primary mr-5 w-fit self-end block">Merchant</UiBadge> -->
      </div>
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent class="w-56 p-4" align="end">
      <UiDropdownMenuLabel class="font-normal flex md:hidden">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">
            {{ profile?.fullName }}
          </p>
          <p class="text-xs leading-none text-muted-foreground">
            {{ profile?.operatorCode }}
          </p>
        </div>
      </UiDropdownMenuLabel>
      <UiDropdownMenuSeparator class="md:hidden" />
      <UiDropdownMenuGroup>
        <NuxtLink to="/profile">
          <UiDropdownMenuItem>
            Profile
            <UiDropdownMenuShortcut>⇧⌘P</UiDropdownMenuShortcut>
          </UiDropdownMenuItem>
        </NuxtLink>
        <UiDropdownMenuSeparator />
        <UiDropdownMenuItem @click="logoutHandler">
          Logout
        </UiDropdownMenuItem>
        <!-- <NuxtLink to="/settings">
          <UiDropdownMenuItem>
            Settings
            <UiDropdownMenuShortcut>⌘S</UiDropdownMenuShortcut>
          </UiDropdownMenuItem>
        </NuxtLink> -->
      </UiDropdownMenuGroup>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
