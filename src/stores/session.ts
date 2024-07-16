import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { USER_TYPE, type User } from './types'
import router from '@/router'
import { fa, faker } from '@faker-js/faker'
import { useUserStore } from './user'

export const useSessionStore = defineStore('session', () => {
  const userStore = useUserStore()

  const loginError = ref([] as any[])
  const _count = ref(0)

  const loginUser = () => {
    loginError.value = [] as any[]
    // console.log(
    //   'thisUser.value.username :: ',
    //   JSON.stringify(thisUser.value) === '{}',
    //   thisUser.value
    // )
    if (JSON.stringify(userStore.thisUser) === '{}') {
      loginError.value = [
        {
          severity: 'error',
          detail: 'Error Message',
          content: 'Username and password are required.',
          id: _count.value++
        }
      ]
      return
    }

    if (!userStore.thisUser.username) {
      loginError.value = [
        {
          severity: 'error',
          detail: 'Error Message',
          content: 'Username is required.',
          id: _count.value++
        }
      ]
      return
    }

    if (!userStore.thisUser.password) {
      loginError.value = [
        {
          severity: 'error',
          detail: 'Error Message',
          content: 'Password is required.',
          id: _count.value++
        }
      ]
      return
    }

    //Save all information to localSession
    const foundUser = userStore.getUser(userStore.thisUser)
    console.log('foundUser ::', foundUser)
    if (foundUser) {
      switch (foundUser.type) {
        case USER_TYPE.SuperAdmin:
          console.log('System Administrator')
          router.push('/superadmin')
          break
        case USER_TYPE.Admin:
          console.log('Administrator')
          router.push('/admin')
          break
        case USER_TYPE.Accountant:
          console.log('Accountant')
          break
        case USER_TYPE.Sales:
          console.log('Sales')
          break

        default:
          break
      }
    } else {
      // console.error('User not found')
      loginError.value = [
        {
          severity: 'error',
          detail: 'Error Message',
          content: 'Invalid username or password.',
          id: _count.value++
        }
      ]
    }
  }


  return {
    loginError,
    loginUser
  }
})
