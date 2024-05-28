<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-column align-items-center justify-content-center">
      <!-- <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" /> -->
      <div
        style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 105%)">
        <div class="w-full surface-card py-6 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-5">
            <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
            <div class="text-900 text-3xl font-medium mb-3">Welcome to AIS!</div>
            <span class="text-600 font-medium">Sign in to continue</span>
          </div>

          <transition-group name="p-message" tag="div">
            <Message v-for="msg of sessionStore.loginError " :severity="msg.severity" :key="msg.id">{{ msg.content }}
            </Message>
          </transition-group>

          <div>
            <label for="email1" class="block text-900 text-xl font-medium mb-2">Username</label>
            <InputText id="email1" type="text" placeholder="Username" class="w-full md:w-30rem mb-5" style="padding: 1rem"
              v-model="sessionStore.thisUser.username" />

            <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
            <Password id="password1" placeholder="Password" :toggleMask="true" :feedback="false" class="w-full mb-3"
              inputClass="w-full" :inputStyle="{ padding: '1rem' }" v-model="sessionStore.thisUser.password" />

            <div class="flex justify-content-end mb-5 gap-5">
              <a class="font-medium no-underline ml-2 text-right cursor-pointer"
                style="color: var(--primary-color)">Forgot password?
              </a>
            </div>
            <Button label="Login" class="w-full p-3 text-xl" @click="$emit('click-login-btn')" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSessionStore } from '@/stores/session';



const sessionStore = useSessionStore()

</script>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>