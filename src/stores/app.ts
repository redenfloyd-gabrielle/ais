import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'

export const useAppStore = defineStore('app', () => {

  const route = useRoute()

  const menuMode = ref('static')
  const activeMenuItem = ref(null)

  const overlayMenuActive = ref(false)
  const staticMenuDesktopInactive = ref(false)
  const staticMenuMobileActive = ref(false)
  const topbarMenuActive = ref(false)
  const currentRoute = ref()

  const containerClass = computed(() => {
    return {
      'layout-overlay': menuMode.value === 'overlay',
      'layout-static': menuMode.value === 'static',
      'layout-static-inactive': staticMenuDesktopInactive.value && menuMode.value === 'static',
      'layout-overlay-active': overlayMenuActive.value,
      'layout-mobile-active': staticMenuMobileActive.value,
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
    };
  });

  const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
  };

  const checkActiveRoute = (item: any) => {
    currentRoute.value = route.name?.toString()
    return route.path === item.to
  }

  return {
    currentRoute,
    containerClass,
    activeMenuItem,
    overlayMenuActive,
    staticMenuDesktopInactive,
    staticMenuMobileActive,
    topbarMenuActive,
    topbarMenuClasses,
    onMenuToggle,
    onTopBarMenuButton,
    checkActiveRoute
  }
})
