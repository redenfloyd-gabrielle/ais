<template>
  <Login @click-login-btn="onClickLoginBtn" />
</template>

<script setup lang="ts">
import Login from '../components/Login.vue'
import { RouterView } from 'vue-router'
import { useSessionStore } from '@/stores/session';
import { onMounted } from 'vue';

const sessionStore = useSessionStore()

onMounted(() => {
  // sessionStore.getUsers()
})

const onClickLoginBtn = () => {
  sessionStore.loginUser()
}
</script>

<style scoped></style>
