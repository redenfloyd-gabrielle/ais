<template>
  <div class="grid">
    <div class="col-12">
      <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" style="
          box-shadow:
            0px 3px 5px rgba(0, 0, 0, 0.02),
            0px 0px 2px rgba(0, 0, 0, 0.05),
            0px 1px 4px rgba(0, 0, 0, 0.08);
        " />

    </div>

    <div class="col-12">
      <div class="card">
        <DataTable ref="dt" :value="schoolStore.filteredSchools(undefined)"
          v-model:selection="schoolStore.selectedSchool" selection-mode="single" dataKey="uuid" :paginator="true"
          :rows="50" size="small"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25, 50]" :filters="filters" :loading="schoolStore.isTableLoading"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">Manage Schools</h5>
              <div class="flex flex-row">
                <Button label="Add New School" icon="pi pi-plus" class="mr-2" severity="success" @click="openNew" />
                <IconField iconPosition="left" class="block mt-2 md:mt-0">
                  <InputIcon class="pi pi-search" />
                  <InputText class="w-full sm:w-auto" v-model="(filters as any)['global'].value"
                    placeholder="Search..." />
                </IconField>
              </div>
            </div>
          </template>

          <!-- <Column field="uuid" header="UUID" headerStyle="width:5%; min-width:4rem;">
            <template #body="slotProps">
              {{ `${slotProps.data.uuid.slice(-8)}` }}
            </template>
          </Column> -->
          <Column field="name" header="Name" :sortable="true" headerStyle="width:16%; min-width:18rem;">
            <template #body="slotProps">
              {{ `${slotProps.data.name}` }}
            </template>
          </Column>
          <Column field="telephone_number" header="Contact Number/s" :sortable="true"
            headerStyle="width:12%; min-width:12rem;">
            <template #body="slotProps">
              <span v-if="slotProps.data.telephone_number">
                {{ slotProps.data.telephone_number }} <b>/</b> <br> {{ slotProps.data.mobile_number }}
              </span>
              <span v-else>
                {{ slotProps.data.mobile_number }}
              </span>
              <!-- {{ slotProps.data.telephone_number }} / {{ slotProps.data.mobile_number }} -->
            </template>
          </Column>
          <Column field="person_in_charge" header="Person In Charge" :sortable="true"
            headerStyle="width:14%; min-width:12rem;">
            <template #body="slotProps">
              {{ `${slotProps.data.person_in_charge}` }}
            </template>
          </Column>


          <Column field="person_in_charge_contact_number" header="Person In Charge Contact Number" :sortable="true"
            headerStyle="width:14%; min-width:12rem;">
            <template #body="slotProps">
              {{ slotProps.data.person_in_charge_contact_number }}
            </template>
          </Column>
          <Column field="agent.first_name" header="Sales Agent" :sortable="true"
            headerStyle="width:10%; min-width:12rem;">
            <template #body="slotProps">
              <span class="p-column-title">Name</span>
              {{
                `${slotProps.data.agent.first_name} ${slotProps.data.agent.middle_name ?
                  slotProps.data.agent.middle_name.slice(0, 1) + '.' : ''} ${slotProps.data.agent.last_name} `
              }}
            </template>
          </Column>
          <Column header="Action" headerStyle="width:10%; min-width:12rem;"
            :bodyStyle="{ textAlign: 'center', verticalAlign: 'middle' }">
            <template #body="slotProps">
              <div class="flex">

              </div>
              <Button icon="pi pi-eye" class="mr-2" severity="info" rounded @click="" />
              <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded
                @click="onClickEditBtn(slotProps.data as School)" />
              <Button icon="pi pi-trash" class="mt-2" severity="danger" rounded
                @click="confirmDeleteProduct(slotProps.data)" />
            </template>
          </Column>
        </DataTable>

        <Dialog v-model:visible="schoolDialog" :style="{ width: '80rem' }" header="School Information" :modal="true"
          :draggable="false" class="p-fluid">
          <h6>Details</h6>
          <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-6">
              <label for="schooL_name" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Name *
              </label>
              <IconField>
                <InputIcon class="pi pi-graduation-cap"
                  :class="formSubmitted && !schoolStore.thisSchool.name ? 'text-red-300' : ''" />
                <InputText size="small" id="schooL_name" type="text" v-model="schoolStore.thisSchool.name" autofocus
                  :invalid="formSubmitted && !schoolStore.thisSchool.name" />

              </IconField>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !schoolStore.thisSchool.name">
                Name is required.
              </small>
            </div>
            <div class="field col-12 md:col-6">
              <label for="school_email" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Email *
              </label>
              <IconField>
                <InputIcon class="pi pi-envelope"
                  :class="formSubmitted && !schoolStore.thisSchool.email ? 'text-red-300' : ''" />
                <InputText size="small" id="school_email" type="text" v-model="schoolStore.thisSchool.email" autofocus
                  :invalid="formSubmitted && !schoolStore.thisSchool.email" />

              </IconField>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !schoolStore.thisSchool.email">
                Email is required.
              </small>
            </div>
            <div class="field col-6">
              <label for="telephone_number" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Telephone Number
              </label>
              <IconField>
                <InputIcon class="pi pi-phone" />
                <InputMask class="p-inputtext-sm" id="telephone_number"
                  v-model="schoolStore.thisSchool.telephone_number" mask="(999) 999 9999"
                  placeholder="(999) 999 9999" />
              </IconField>
            </div>
            <div class="field col-6">
              <label for="mobile_number" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Mobile Number
              </label>
              <IconField>
                <InputIcon class="pi pi-mobile"
                  :class="formSubmitted && !schoolStore.thisSchool.mobile_number ? 'text-red-300' : ''" />
                <InputMask class="p-inputtext-sm" id="mobile_number" v-model="schoolStore.thisSchool.mobile_number"
                  mask="+63999 999 9999" placeholder="+63999 999 9999"
                  :invalid="formSubmitted && !schoolStore.thisSchool.mobile_number" />
              </IconField>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !schoolStore.thisSchool.mobile_number">
                Mobile Number is required.
              </small>
            </div>
          </div>
          <h6>Address</h6>
          <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-6">
              <label for="resgion" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Region *
              </label>
              <Dropdown class="p-inputtext-sm" size="small" id="resgion" v-model="schoolStore.thisSchool.address.region"
                :options="addressStore.regions" optionValue="name" optionLabel="name" placeholder="Select Region"
                :invalid="formSubmitted && !schoolStore.thisSchool.address.region"
                :dropdownIcon="formSubmitted && !schoolStore.thisSchool.address.region ? 'pi pi-chevron-down text-red-300' : 'pi pi-chevron-down'">
              </Dropdown>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !schoolStore.thisSchool.address.region">
                Region is required.
              </small>
            </div>
            <div class="field col-6">
              <label for="province" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Province *
              </label>
              <Dropdown class="p-inputtext-sm" size="small" id="province"
                v-model="schoolStore.thisSchool.address.province" :options="addressStore.provinces" optionValue="name"
                optionLabel="name" placeholder="Select Province"
                :disabled="schoolStore.thisSchool.address.region === ''"
                :invalid="formSubmitted && !schoolStore.thisSchool.address.province"
                :dropdownIcon="formSubmitted && !schoolStore.thisSchool.address.province ? 'pi pi-chevron-down text-red-300' : 'pi pi-chevron-down'">
              </Dropdown>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !schoolStore.thisSchool.address.province">
                Province is required.
              </small>
            </div>
            <div class="field col-6">
              <label for="city" style="font-size: 0.875rem !important; font-weight: 500 !important">
                City *
              </label>
              <Dropdown class="p-inputtext-sm" size="small" id="city" v-model="schoolStore.thisSchool.address.city"
                :options="addressStore.cities" optionValue="name" optionLabel="name" placeholder="Select City"
                :disabled="schoolStore.thisSchool.address.province === ''"
                :invalid="formSubmitted && !schoolStore.thisSchool.address.city"
                :dropdownIcon="formSubmitted && !schoolStore.thisSchool.address.city ? 'pi pi-chevron-down text-red-300' : 'pi pi-chevron-down'">
              </Dropdown>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !schoolStore.thisSchool.address.city">
                City is required.
              </small>
            </div>
            <div class="field col-6">
              <label for="barangay" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Barangay *
              </label>
              <Dropdown class="p-inputtext-sm" size="small" id="barangay"
                v-model="schoolStore.thisSchool.address.barangay" :options="addressStore.barangays" optionValue="name"
                optionLabel="name" placeholder="Select Barangay" :disabled="schoolStore.thisSchool.address.city === ''"
                :invalid="formSubmitted && !schoolStore.thisSchool.address.province"
                :dropdownIcon="formSubmitted && !schoolStore.thisSchool.address.barangay ? 'pi pi-chevron-down text-red-300' : 'pi pi-chevron-down'">
              </Dropdown>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !schoolStore.thisSchool.address.barangay">
                Barangay is required.
              </small>
            </div>
            <div class="field col-6">
              <label for="detail_address1" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Detailed Address 1 *
              </label>
              <IconField>
                <InputIcon class="pi pi-map"
                  :class="formSubmitted && !schoolStore.thisSchool.address.address_1 ? 'text-red-300' : ''" />
                <InputText id="detail_address1" type="text" size="small"
                  v-model="schoolStore.thisSchool.address.address_1"
                  :invalid="formSubmitted && !schoolStore.thisSchool.address.address_1" />
              </IconField>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !schoolStore.thisSchool.address.address_1">
                Detailed Address is required.
              </small>
            </div>
            <div class="field col-6">
              <label for="detail_address2" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Detailed Address 2
              </label>
              <IconField>
                <InputIcon class="pi pi-map" />
                <InputText id="detail_address2" type="text" size="small"
                  v-model="schoolStore.thisSchool.address.address_2" />
              </IconField>
            </div>
          </div>
          <h6>Person In Charge Details</h6>
          <div class="p-fluid formgrid grid">
            <div class="field col-6">
              <label for="person_in_charge" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Person In Charge Name*
              </label>
              <IconField>
                <InputIcon class="pi pi-id-card"
                  :class="formSubmitted && !schoolStore.thisSchool.person_in_charge ? 'text-red-300' : ''" />
                <InputText id="person_in_charge" type="text" size="small"
                  v-model="schoolStore.thisSchool.person_in_charge"
                  :invalid="formSubmitted && !schoolStore.thisSchool.person_in_charge" />
              </IconField>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !schoolStore.thisSchool.person_in_charge">
                Person In Charged is required.
              </small>
            </div>
            <div class="field col-6">
              <label for="state" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Person In Charge Contact Number *
              </label>
              <IconField>
                <InputIcon class="pi pi-mobile"
                  :class="formSubmitted && !schoolStore.thisSchool.person_in_charge_contact_number ? 'text-red-300' : ''" />
                <InputMask class="p-inputtext-sm" id="mobile_number"
                  v-model="schoolStore.thisSchool.person_in_charge_contact_number" mask="+63999 999 9999"
                  placeholder="+63999 999 9999"
                  :invalid="formSubmitted && !schoolStore.thisSchool.person_in_charge_contact_number" />
              </IconField>
              <small class="p-invalid text-red-300"
                v-if="formSubmitted && !schoolStore.thisSchool.person_in_charge_contact_number">
                Person In Charge Contact Number is required.
              </small>
            </div>
          </div>
          <h6>Agent Details</h6>
          <div class="p-fluid formgrid grid">
            <div class="field col-6">
              <label for="person_in_charge" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Sales Agent *
              </label>
              <Dropdown class="p-inputtext-sm" size="small" id="state" v-model="schoolStore.thisSchool.agent.uuid"
                :options="userStore.salesAgentUsers" :optionValue="(data) => data.uuid"
                :optionLabel="(data: User) => `${data.first_name} ${data.middle_name ? data.middle_name.slice(0, 1) + '.' : ''} ${data.last_name}`"
                placeholder="Select Sales Agent" :invalid="formSubmitted && !schoolStore.thisSchool.agent.uuid"
                :dropdownIcon="formSubmitted && !schoolStore.thisSchool.agent.uuid ? 'pi pi-chevron-down text-red-300' : 'pi pi-chevron-down'">
              </Dropdown>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !schoolStore.thisSchool.agent.uuid">
                Sales Agent is required.
              </small>
            </div>
          </div>
          <template #footer>
            <Button label="Cancel" icon="pi pi-times" :text="true" @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" :text="true" @click="onClickSaveSchool" />
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3 text-red-500" style="font-size: 2rem" />
            <span v-if="schoolStore.selectedSchool">
              Are you sure you want to delete
              <b>
                {{ `${schoolStore.thisSchool.name}` }}
              </b>
              ?
            </span>
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
  import { USER_STATUS, type Address, type School, type User, } from '@/stores/types'
  import { USER_TYPE } from '@/stores/types'
  import { useAppStore } from '@/stores/app'
  import { useAddressStore } from '@/stores/address'
  import { useSchoolStore } from '@/stores/school'
  import { useUserStore } from '@/stores/user'

  const appStore = useAppStore()
  const userStore = useUserStore()
  const addressStore = useAddressStore()
  const schoolStore = useSchoolStore()

  const schoolDialog = ref(false)
  const deleteUserDialog = ref(false)
  const filters = ref({})

  const toggleState = ref(true)
  const formSubmitted = ref(false)

  const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' })
  const breadcrumbItems = ref([
    { label: 'Dashboard' }
    // { label: 'Notebook' },
    // { label: 'Accessories' },
    // { label: 'Backpacks' },
    // { label: 'Item' }
  ])

  // watch(toggleState, () => {
  //   schoolStore.thisSchool.status = toggleState.value ? USER_STATUS.Active : USER_STATUS.Inactive
  // })

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
    addressStore.getPHAddressData()
    schoolStore.getSchools()
  })

  const generateLabel = (string1: string, string3: string) => {
    return `${string1} ${string3}`
    // ('middle_name' ? 'middle_name'.splice(0, 0) + '.' : '') 'last_name' 

  }

  const openNew = () => {
    schoolStore.clearSchoolState()
    schoolDialog.value = true
    formSubmitted.value = false
  }

  const hideDialog = () => {
    schoolStore.clearSchoolState()
    schoolDialog.value = false
    formSubmitted.value = false
  }

  const onClickSaveSchool = async () => {
    const _user = userStore.getUserByUuid(schoolStore.thisSchool.agent as User)
    if (_user) {
      schoolStore.thisSchool.agent = _user as User
    }

    formSubmitted.value = true
    const response = await schoolStore.saveSchool()
    if (response.status === 'success') {
      schoolDialog.value = false
      formSubmitted.value = false
    }
    appStore.displayToast(response)

  }

  const onClickEditBtn = (_school: School) => {
    console.log(`schoolStore.selectedSchool :: ${JSON.stringify(schoolStore.selectedSchool)}`)
    if (
      schoolStore.selectedSchool.uuid !== _school.uuid ||
      JSON.stringify(schoolStore.selectedSchool) === '{}'
    ) {
      schoolStore.selectedSchool = _school
    }
    // schoolStore.thisSchool = { ...schoolStore.selectedSchool }
    schoolStore.thisSchool = JSON.parse(JSON.stringify({ ...schoolStore.selectedSchool })) as School
    schoolDialog.value = true
  }

  const confirmDeleteProduct = (_school: School) => {
    if (
      schoolStore.selectedSchool.uuid !== _school.uuid ||
      JSON.stringify(schoolStore.selectedSchool) === '{}'
    ) {
      schoolStore.selectedSchool = _school
    }
    schoolStore.thisSchool = { ...schoolStore.selectedSchool }
    deleteUserDialog.value = true
  }

  const onClickConfirmBtn = async () => {
    const response = await schoolStore.deleteSchool(schoolStore.thisSchool)
    if (response.status === 'success') {
      deleteUserDialog.value = false
      schoolStore.clearSchoolState()
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
