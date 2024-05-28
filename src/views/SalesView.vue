<template>
  <div class="layout-wrapper">
    <app-topbar></app-topbar>
    <div class="layout-sidebar">
      <app-sidebar></app-sidebar>
    </div>
    <div class="layout-main-container">
      <div class="layout-main">
        <router-view></router-view>
      </div>
      <!-- <app-footer></app-footer> -->
    </div>
    <!-- <app-config></app-config> -->
    <div class="layout-mask"></div>
  </div>
  <!-- <Toast /> -->
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
