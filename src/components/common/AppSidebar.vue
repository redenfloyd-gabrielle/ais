<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <AppMenuItem v-if="!item.separator" :item="item" :index="i" />
      <li v-if="item.separator" class="menu-separator">asd</li>
    </template>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
  {
    label: 'Home',
    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/superadmin/dashboard' }],
    separator: false
  },
  {
    label: 'Menu',
    items: [
      { label: 'Users', icon: 'pi pi-fw pi-users', to: '/superadmin/users' },
    ],
    separator: false
  },
]);
</script>

<style lang="scss" scoped></style>
