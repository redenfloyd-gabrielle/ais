import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { TABLE_DATA, type ApiResponse } from './types'
import axios, { type AxiosInstance } from 'axios'
import { useBookStore } from './book'

export const useAppStore = defineStore('app', () => {
  const toast = useToast()
  const route = useRoute()

  const bookStore = useBookStore()

  const menuMode = ref('static')
  const activeMenuItem = ref<any | null>(null)

  const overlayMenuActive = ref(false)
  const staticMenuDesktopInactive = ref(false)
  const staticMenuMobileActive = ref(false)
  const topbarMenuActive = ref(false)
  const currentRoute = ref()
  const addressApi = ref<AxiosInstance>()

  const containerClass = computed(() => {
    return {
      'layout-overlay': menuMode.value === 'overlay',
      'layout-static': menuMode.value === 'static',
      'layout-static-inactive': staticMenuDesktopInactive.value && menuMode.value === 'static',
      'layout-overlay-active': overlayMenuActive.value,
      'layout-mobile-active': staticMenuMobileActive.value
    }
  })

  const onMenuToggle = () => {
    if (menuMode.value === 'overlay') {
      overlayMenuActive.value = !overlayMenuActive.value
    }

    if (window.innerWidth > 991) {
      staticMenuDesktopInactive.value = !staticMenuDesktopInactive.value
    } else {
      staticMenuMobileActive.value = !staticMenuMobileActive.value
    }
  }

  const topbarMenuClasses = computed(() => {
    return {
      'layout-topbar-menu-mobile-active': topbarMenuActive.value
    }
  })

  const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value
  }

  const checkActiveRoute = (item: any) => {
    currentRoute.value = route.name?.toString()
    return route.path === item.to
  }

  const displayToast = (data: ApiResponse) => {
    toast.add({
      severity: data.status,
      summary: data.status === 'success' ? 'Successful Message' : 'Error Message',
      detail: data.message,
      life: 3000
    })
  }

  const isTableLoading = computed(() => (payload: TABLE_DATA) => {
    console.log('@___ computed isTableLoading (payload) :: ', payload)
    if (payload === TABLE_DATA.Book) {
      return bookStore.books.length === 0
    }

    return false
  })

  const waitFor = (conditionFunction: () => boolean, maxRetries: number): Promise<void> => {
    let retries = 0
    return new Promise<void>(function (resolve, reject) {
      const checkCondition = () => {
        if (conditionFunction()) {
          console.log('@___ waitFor resolved')
          resolve()
        } else if (retries < maxRetries) {
          retries++
          console.log('@___ waitFor (retries < maxRetires) ::', retries)
          setTimeout(checkCondition, 1000)
        } else {
          console.warn('Maximum retries reached')
          reject()
        }
      }
      checkCondition()
    })
  }

  return {
    toast,
    currentRoute,
    containerClass,
    activeMenuItem,
    overlayMenuActive,
    staticMenuDesktopInactive,
    staticMenuMobileActive,
    topbarMenuActive,
    topbarMenuClasses,
    displayToast,
    onMenuToggle,
    onTopBarMenuButton,
    checkActiveRoute,
    waitFor,
    isTableLoading
  }
})
