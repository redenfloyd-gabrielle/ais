<template>
  <div class="grid">
    <div class="col-12">
      <!-- <div class="card card-w-title"> -->
      <Breadcrumb
        :home="breadcrumbHome"
        :model="breadcrumbItems"
        style="
          box-shadow:
            0px 3px 5px rgba(0, 0, 0, 0.02),
            0px 0px 2px rgba(0, 0, 0, 0.05),
            0px 1px 4px rgba(0, 0, 0, 0.08);
        "
      />
      <!-- </div> -->
    </div>
    <div class="col-12 lg:col-8 xl:col-4">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Users</span>
            <div class="text-900 font-medium text-xl">152</div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-blue-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-users text-blue-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">24 </span>
        <span class="text-500">newly registered</span>
      </div>
    </div>
    <div class="col-12 lg:col-8 xl:col-4">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Active Users</span>
            <div class="text-900 font-medium text-xl">142</div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-primary-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-check-circle text-primary-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">12 </span>
        <span class="text-500">newly activated users</span>
      </div>
    </div>
    <div class="col-12 lg:col-8 xl:col-4">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Inactive Users</span>
            <div class="text-900 font-medium text-xl">10</div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-red-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-times-circle text-red-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">5</span>
        <span class="text-500"> newly deactivated users</span>
      </div>
    </div>
    <!-- <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Comments</span>
            <div class="text-900 font-medium text-xl">152 Unread</div>
          </div>
          <div
            class="flex align-items-center justify-content-center bg-purple-100 border-round"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-comment text-purple-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">85 </span>
        <span class="text-500">responded</span>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' })
const breadcrumbItems = ref([
  { label: 'Dashboard' }
  // { label: 'Notebook' },
  // { label: 'Accessories' },
  // { label: 'Backpacks' },
  // { label: 'Item' }
])
// import { onMounted, reactive, ref, watch } from 'vue'
// import { ProductService } from '@/service/ProductService'
// import { useLayout } from '@/layout/composables/layout'

// const { isDarkTheme } = useLayout()

// const products = ref(null)
// const lineData = reactive({
//   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//   datasets: [
//     {
//       label: 'First Dataset',
//       data: [65, 59, 80, 81, 56, 55, 40],
//       fill: false,
//       backgroundColor: '#2f4860',
//       borderColor: '#2f4860',
//       tension: 0.4
//     },
//     {
//       label: 'Second Dataset',
//       data: [28, 48, 40, 19, 86, 27, 90],
//       fill: false,
//       backgroundColor: '#00bb7e',
//       borderColor: '#00bb7e',
//       tension: 0.4
//     }
//   ]
// })
// const items = ref([
//   { label: 'Add New', icon: 'pi pi-fw pi-plus' },
//   { label: 'Remove', icon: 'pi pi-fw pi-minus' }
// ])
// const lineOptions = ref(null)
// const productService = new ProductService()

// onMounted(() => {
//   productService.getProductsSmall().then((data) => (products.value = data))
// })

// const formatCurrency = (value) => {
//   return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
// }
// const applyLightTheme = () => {
//   lineOptions.value = {
//     plugins: {
//       legend: {
//         labels: {
//           color: '#495057'
//         }
//       }
//     },
//     scales: {
//       x: {
//         ticks: {
//           color: '#495057'
//         },
//         grid: {
//           color: '#ebedef'
//         }
//       },
//       y: {
//         ticks: {
//           color: '#495057'
//         },
//         grid: {
//           color: '#ebedef'
//         }
//       }
//     }
//   }
// }

// const applyDarkTheme = () => {
//   lineOptions.value = {
//     plugins: {
//       legend: {
//         labels: {
//           color: '#ebedef'
//         }
//       }
//     },
//     scales: {
//       x: {
//         ticks: {
//           color: '#ebedef'
//         },
//         grid: {
//           color: 'rgba(160, 167, 181, .3)'
//         }
//       },
//       y: {
//         ticks: {
//           color: '#ebedef'
//         },
//         grid: {
//           color: 'rgba(160, 167, 181, .3)'
//         }
//       }
//     }
//   }
// }

// watch(
//   isDarkTheme,
//   (val) => {
//     if (val) {
//       applyDarkTheme()
//     } else {
//       applyLightTheme()
//     }
//   },
//   { immediate: true }
// )
</script>
