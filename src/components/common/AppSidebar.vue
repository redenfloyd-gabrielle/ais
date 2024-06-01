<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in menuStore.menu(USER_TYPE.SuperAdmin)" :key="item">
      <AppMenuItem v-if="!item.separator" :item="item" :index="i" />
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppMenuItem from '@/components/common/AppMenuItem.vue'
import { useMenuStore } from '@/stores/menu'
import { USER_TYPE } from '@/stores/types'

const menuStore = useMenuStore()
</script>

<style lang="scss" scoped></style>
