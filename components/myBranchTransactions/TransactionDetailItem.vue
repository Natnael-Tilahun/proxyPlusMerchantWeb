<template>
  <div class="flex flex-col space-y-1">
    <span class="text-sm font-medium text-muted-foreground">{{ label }}</span>
    <span v-if="!status" class="text-sm font-medium">
      {{ value ?? "-" }}
    </span>
    <span
      v-else
      :class="[
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ',
        {
          'bg-green-100 text-green-800 w-fit':
            String(value).toLowerCase() === 'completed',
          'bg-yellow-100 text-yellow-800 w-fit':
            String(value).toLowerCase() === 'pending',
          'bg-red-100 text-red-800 w-fit':
            String(value).toLowerCase() === 'failed' || String(value).toLowerCase() === 'expired',
        },
      ]"
    >
      {{ value ?? "-" }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number | null;
  status?: boolean;
}>();
</script>
