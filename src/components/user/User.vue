<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button label="New" icon="pi pi-plus" class="mr-2 w-full" severity="success" @click="openNew" />
            </div>
          </template>

          <!-- <template v-slot:end>
            <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import"
              class="mr-2 inline-block" />
            <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
          </template> -->
        </Toolbar>

        <DataTable ref="dt" :value="userStore.filteredUsers" v-model:selection="userStore.selectedUser"
          selection-mode="single" dataKey="uuid" :paginator="true" :rows="25" size="small"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          :filters="filters"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">Manage Users</h5>
              <IconField iconPosition="left" class="block mt-2 md:mt-0">
                <InputIcon class="pi pi-search" />
                <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Search..." />
              </IconField>
            </div>
          </template>

          <Column field="uuid" header="UUID" headerStyle="width:10%; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Code</span>
              {{ `${slotProps.data.uuid.slice(-8)}` }}
            </template>
          </Column>
          <Column field="first_name" header="Name" :sortable="true" headerStyle="width:15%; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Name</span>
              {{
                `${slotProps.data.first_name} ${slotProps.data.middle_name ?
                  slotProps.data.middle_name.slice(0, 1) + '.' : ''} ${slotProps.data.last_name} `
              }}
            </template>
          </Column>
          <Column field="username" header="Username" :sortable="true" headerStyle="width:14%; min-width:8rem;">
            <template #body="slotProps">
              <span class="p-column-title">Price</span>
              {{ slotProps.data.username }}
            </template>
          </Column>
          <Column field="email" header="Email" :sortable="true" headerStyle="width:20%; min-width:18rem;">
            <template #body="slotProps">
              <span class="p-column-title">Price</span>
              {{ slotProps.data.email }}
            </template>
          </Column>
          <Column field="type" header="Type" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Category</span>
              {{ slotProps.data.type }}
            </template>
          </Column>
          <Column field="status" header="Status" :sortable="true" headerStyle="width:10%; min-width:8rem;">
            <template #body="slotProps">
              <span class="p-column-title">Category</span>
              <Tag class="w-6rem h-min"
                :icon="slotProps.data.status === USER_STATUS.Active ? 'pi pi-fw pi-check-circle' : 'pi pi-fw pi-times-circle'"
                :severity="slotProps.data.status === USER_STATUS.Active ? 'success' : 'danger'"
                :value="slotProps.data.status" />
            </template>
          </Column>
          <Column header="Action" headerStyle="width:10%; min-width:7rem;">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded
                @click="onClickEditBtn(slotProps.data as User)" />
              <Button icon="pi pi-trash" class="mt-2" severity="danger" rounded
                @click="confirmDeleteProduct(slotProps.data)" />
            </template>
          </Column>
        </DataTable>

        <Dialog v-model:visible="userDialog" :style="{ width: '516px' }" header="User Information" :modal="true"
          class="p-fluid">
          <!-- <img
            :src="'/demo/images/product/' + product.image"
            :alt="product.image"
            v-if="product.image"
            width="150"
            class="mt-0 mx-auto mb-5 block shadow-2"
          /> -->
          <h6>Personal Details</h6>
          <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-4">
              <label for="firstname" style="font-size: 0.875rem !important; font-weight: 500 !important">
                First Name *
              </label>
              <IconField>
                <InputIcon class="pi pi-user"
                  :class="formSubmitted && !userStore.thisUser.first_name ? 'text-red-300' : ''" />
                <InputText size="small" id="firstname" type="text" v-model="userStore.thisUser.first_name" autofocus
                  :invalid="formSubmitted && !userStore.thisUser.first_name" />

              </IconField>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !userStore.thisUser.first_name">First Name is
                required.</small>
            </div>
            <div class="field col-12 md:col-4">
              <label for="lastname" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Middle Name
              </label>
              <IconField>
                <InputIcon class="pi pi-user" />
                <InputText size="small" id="lastname" type="text" v-model="userStore.thisUser.middle_name" />
              </IconField>
            </div>
            <div class="field col-12 md:col-4">
              <label for="middlename" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Last Name *
              </label>
              <IconField>
                <InputIcon class="pi pi-user" :class="formSubmitted && !userStore.thisUser.last_name ? 'text-red-300' : ''" />
                <InputText size="small" id="middlename" type="text" v-model="userStore.thisUser.last_name"
                  :invalid="formSubmitted && !userStore.thisUser.last_name" />
              </IconField>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !userStore.thisUser.last_name">
                Last Name is required.
              </small>
            </div>
            <div class="field col-6">
              <label for="contact_number" style="font-size: 0.875rem !important; font-weight: bold !important">
                Contact Number *
              </label>
              <IconField>
                <InputIcon class="pi pi-phone" :class="formSubmitted && !userStore.thisUser.contact_number ? 'text-red-300' : ''"/>
                <InputMask class="p-inputtext-sm" id="contact_number" v-model="userStore.thisUser.contact_number"
                  mask="+63999 999 9999" placeholder="+63999 999 9999"
                  :invalid="formSubmitted && !userStore.thisUser.contact_number" />
              </IconField>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !userStore.thisUser.contact_number">Contact
                Number is required.
              </small>
            </div>
            <div class="field col-6">
              <label for="email" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Email *
              </label>
              <IconField>
                <InputIcon class="pi pi-envelope" :class="formSubmitted && !userStore.thisUser.email ? 'text-red-300' : ''" />
                <InputText :disabled="userStore.thisUser.uuid ? true : false" size="small" id="email" type="text"
                  v-model="userStore.thisUser.email" :invalid="formSubmitted && !userStore.thisUser.email" />
              </IconField>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !userStore.thisUser.email">Email is
                required.</small>
            </div>
          </div>
          <h6>User Details</h6>
          <div class="p-fluid formgrid grid">
            <div class="field col-6" v-if="userStore.thisUser.uuid">
              <label for="firstname2" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Username
              </label>
              <IconField>
                <InputIcon class="pi pi-user" />
                <InputText disabled="true" size="small" id="firstname2" type="text"
                  v-model="userStore.thisUser.username" />
              </IconField>
            </div>
            <div class="field col-6">
              <label for="state" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Type
              </label>
              <Dropdown class="p-inputtext-sm" size="small" id="state" v-model="userStore.thisUser.type"
                :options="user_types" optionValue="value" optionLabel="value" placeholder="Select One"
                :invalid="formSubmitted && !userStore.thisUser.type">
              </Dropdown>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !userStore.thisUser.type">
                Usery Type is required.
              </small>
            </div>
            <div class="field col-12 md:col-6">
              <label for="state" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Status
              </label>
              <SelectButton class="w-15rem h-2rem" v-model="userStore.thisUser.status"
                :options="Object.values(USER_STATUS)" aria-labelledby="basic" :allow-empty="false"
                :pt:button:class="'text-gray-500'" :invalid="formSubmitted && !userStore.thisUser.status"/>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !userStore.thisUser.status">
                Usery Type is required.
              </small>
            </div>
          </div>
          <template #footer>
            <Button label="Cancel" icon="pi pi-times" :text="true" @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" :text="true" @click="onClickSaveUser" />
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3 text-red-500" style="font-size: 2rem" />
            <span v-if="userStore.selectedUser">Are you sure you want to delete <b>{{ 
                `${userStore.thisUser.first_name} ${userStore.thisUser.middle_name ?
                  userStore.thisUser.middle_name.slice(0, 1) + '.' : ''} ${userStore.thisUser.last_name} `
              }}</b>?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" text @click="deleteUserDialog = false" />
            <Button label="Yes" icon="pi pi-check" text @click="onClickConfirmBtn" />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, onBeforeMount, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { USER_STATUS, type User } from '@/stores/types'
import { USER_TYPE } from '@/stores/types'
import { useAppStore } from '@/stores/app'

const userStore = useUserStore()
const appStore = useAppStore()

const products = ref(null)
const userDialog = ref(false)
const deleteUserDialog = ref(false)
const filters = ref({})

const toggleState = ref(true)
const formSubmitted = ref(false)

watch(toggleState, () => {
  userStore.thisUser.status = toggleState.value ? USER_STATUS.Active : USER_STATUS.Inactive
})

const user_types = ref([
  { name: USER_TYPE.SuperAdmin, value: USER_TYPE.SuperAdmin },
  { name: USER_TYPE.Admin, value: USER_TYPE.Admin },
  { name: USER_TYPE.Accountant, value: USER_TYPE.Accountant },
  { name: USER_TYPE.Sales, value: USER_TYPE.Sales }
])


onBeforeMount(() => {
  initFilters()
})

onMounted(() => {
  userStore.getUsers()
})

const openNew = () => {
  userStore.clearUserState()
  userDialog.value = true
  formSubmitted.value = false
}

const hideDialog = () => {
  userStore.clearUserState()
  userDialog.value = false
  formSubmitted.value = false
}

const onClickSaveUser = async () => {
  formSubmitted.value = true
  const response = await userStore.saveUser()
  if (response.status === 'success') {
    userDialog.value = false
    formSubmitted.value = false
  }
  appStore.displayToast(response)

}

const onClickEditBtn = (_user: User) => {
  console.log(`userStore.selectedUser :: ${JSON.stringify(userStore.selectedUser)}`)
  if (
    userStore.selectedUser.uuid !== _user.uuid ||
    JSON.stringify(userStore.selectedUser) === '{}'
  ) {
    userStore.selectedUser = _user
  }
  userStore.thisUser = { ...userStore.selectedUser }
  userDialog.value = true
}

const confirmDeleteProduct = (_user: User) => {
  if (
    userStore.selectedUser.uuid !== _user.uuid ||
    JSON.stringify(userStore.selectedUser) === '{}'
  ) {
    userStore.selectedUser = _user
  }
  userStore.thisUser = { ...userStore.selectedUser }
  deleteUserDialog.value = true
}

const onClickConfirmBtn = async () => {
  const response = await userStore.deleteUser(userStore.thisUser)
  if (response.status === 'success') {
    deleteUserDialog.value = false
    userStore.clearUserState()
  }
  appStore.displayToast(response)
}

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  }
}
</script>

<style scoped></style>
