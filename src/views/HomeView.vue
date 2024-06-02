<template>
  <div class="layout-wrapper" :class="appStore.containerClass">
    <AppTopbar />
    <div class="layout-sidebar">
      <AppSidebar />
      <!-- <app-sidebar></app-sidebar> -->
    </div>
    <div class="layout-main-container">
      <div class="layout-main">
        <RouterView />
      </div>
      <!-- <app-footer></app-footer> -->
    </div>
    <!-- <app-config></app-config> -->
    <div class="layout-mask"></div>
  </div>
  <Toast  />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppTopbar from '@/components/common/AppTopbar.vue'
import AppSidebar from '@/components/common/AppSidebar.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
