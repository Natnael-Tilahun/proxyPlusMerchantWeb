<script setup>
// components/PermissionGuard.vue
const props = defineProps({
  permission: {
    type: [String, Array],
    required: true
  },
  role: {
    type: String,
    default: ''
  },
  any: {
    type: Boolean,
    default: false
  }
})

const store = useAuthStore()
const hasAccess = computed(() => {
  if (props.any) {
    // Handle array of permissions
    const hasPermission = Array.isArray(props.permission)
      ? props.permission.some(p => store.hasPermissions(p))
      : store.hasPermissions(props.permission)
    
    return hasPermission || (props.role && store.hasRole(props.role))
  }
  
  // Handle array of permissions
  const hasPermission = Array.isArray(props.permission)
    ? props.permission.every(p => store.hasPermissions(p))
    : store.hasPermissions(props.permission)

  
  return (!props.permission || hasPermission) && 
         (!props.role || store.hasRole(props.role))
})
</script>

<template>
  <slot v-if="hasAccess" />
</template>