export function useHasPermissions(permission: string) {
    if (!permission) {
        return true;
    }
    // const data = ref(null)
    const authStore = useAuthStore();
    return authStore.hasPermissions(permission);

    // return { data, error }
}