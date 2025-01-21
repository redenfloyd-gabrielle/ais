<template>
  <RouterView />
</template>

<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
  import { onMounted } from 'vue'
  import { useAddressStore } from '@/stores/address'

  const addressStore = useAddressStore()

  onMounted(() => {
    addressStore.getPHAddressData()
  })
</script>

<style scoped></style>
