<script setup lang="ts">
defineProps({
  id: String,
})
</script>

<template>
  <div>
    <p>blog/[id].vue: {{ id }}</p>
    <p>
      {{ $route }}
    </p>
  </div>
</template>
