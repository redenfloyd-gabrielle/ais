import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { USER_TYPE } from '@/stores/types'
import { useAppStore } from './app'

export const useMenuStore = defineStore('menu', () => {
  const appStore = useAppStore()
  const isActiveMenu = ref(false)
  const models = ref([
    {
      label: 'Home',
      items: [
        { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' },
        {
          label: 'Users', icon: 'pi pi-fw pi-users', items: [
            {
              label: 'All Users',
              icon: 'pi pi-fw pi-users',
              to: '/users'
            },
            {
              label: 'Active Users',
              icon: 'pi pi-fw pi-check-circle',
              to: '/users/active'
            },
            {
              label: 'Inactive Users',
              icon: 'pi pi-fw pi-times-circle',
              to: '/users/inactive'
            }
          ]
        },
      ],
      // separator: false,
      user: USER_TYPE.SuperAdmin
    },
    {
      label: 'Home',
      items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/superadmin/dashboard' }],
      separator: false,
      user: USER_TYPE.SuperAdmin
    }
  ])


  const menu = computed(() => (userType: USER_TYPE) => {
    console.log(`USER TYPE :: ${userType}`)
    const _menu = models.value.filter((_model) => _model.user === userType)
    return _menu
  })

  const setActiveMenuItem = (item: any) => {
    appStore.activeMenuItem = item.value || item;
  }


  return { menu, isActiveMenu, setActiveMenuItem }
})
