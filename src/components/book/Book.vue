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
        <DataTable ref="dt" :value="bookStore.filteredBooks" v-model:selection="bookStore.selectedBook"
          selection-mode="single" dataKey="uuid" :paginator="true" :rows="25" size="small"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]" :filters="filters" :loading="appStore.isTableLoading(TABLE_DATA.Book)"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" removableSort>
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">Manage Books</h5>
              <div class="flex flex-row">
                <Button label="Add New Book" icon="pi pi-plus" class="mr-2" severity="success" @click="openNew" />
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
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()"
                placeholder="Search by name" />
            </template>
          </Column> -->
          <Column field="title" header="Title" :sortable="true" headerStyle="width:18%; min-width:16rem;">
            <template #body="slotProps">
              {{ `${slotProps.data.title}` }}
            </template>
          </Column>
          <Column field="category" header="Category" :sortable="true" headerStyle="width:12%; min-width:10rem;">
            <template #body="slotProps">
              <span>
                {{ slotProps.data.category }}
              </span>
              <!-- {{ slotProps.data.telephone_number }} / {{ slotProps.data.mobile_number }} -->
            </template>
          </Column>
          <Column field="author" header="Auhtor" :sortable="true" headerStyle="width:14%; min-width:12rem;">
            <template #body="slotProps">
              {{ slotProps.data.author }}
            </template>
          </Column>
          <Column field="year_published" header="Year" :sortable="true" headerStyle="width:8%; min-width:6rem;">
            <template #body="slotProps">
              {{ `${slotProps.data.year_published}` }}
            </template>
          </Column>
          <Column field="unit_price" header="Unit Price" :sortable="true" headerStyle="width:10%; min-width:8rem;">
            <template #body="slotProps">
              {{ `₱ ${slotProps.data.unit_price}` }}
            </template>
          </Column>
          <Column header="Action" headerStyle="width:10%; min-width:6.5rem;">
            <template #body="slotProps">
              <!-- <Button icon="pi pi-eye" class="mr-2" severity="info" rounded @click="" /> -->
              <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded
                @click="onClickEditBtn(slotProps.data as School)" />
              <Button icon="pi pi-trash" class="mt-2" severity="danger" rounded
                @click="confirmDeleteProduct(slotProps.data)" />
            </template>
          </Column>
        </DataTable>

        <Dialog v-model:visible="bookDialog" :style="{ width: '60rem' }" header="Book" :modal="true" :draggable="false"
          class="p-fluid">
          <h6>Details</h6>
          <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-6">
              <label for="book_title" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Title *
              </label>
              <IconField>
                <InputIcon class="pi pi-book"
                  :class="formSubmitted && !bookStore.thisBook.title ? 'text-red-300' : ''" />
                <InputText size="small" id="book_title" type="text" v-model="bookStore.thisBook.title" autofocus
                  :invalid="formSubmitted && !bookStore.thisBook.title" />
              </IconField>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !bookStore.thisBook.title">
                Name is required.
              </small>
            </div>
            <div class="field col-12 md:col-6">
              <label for="book_category" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Author *
              </label>
              <IconField>
                <InputIcon class="pi pi-user"
                  :class="formSubmitted && !bookStore.thisBook.author ? 'text-red-300' : ''" />
                <InputText size="small" id="book_category" type="text" v-model="bookStore.thisBook.author" autofocus
                  :invalid="formSubmitted && !bookStore.thisBook.author" />

              </IconField>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !bookStore.thisBook.author">
                Name is required.
              </small>
            </div>
            <div class="field col-12 md:col-6">
              <label for="telephone_number" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Category
              </label>
              <Dropdown class="p-inputtext-sm" size="small" id="province" v-model="bookStore.thisBook.category"
                :options="bookStore.bookCategory" optionValue="value" optionLabel="value" placeholder="Select Province"
                :invalid="formSubmitted && !bookStore.thisBook.category"
                :dropdownIcon="formSubmitted && !bookStore.thisBook.category ? 'pi pi-chevron-down text-red-300' : 'pi pi-chevron-down'">
              </Dropdown>
              <small class="p-invalid text-red-300" v-if="formSubmitted">
                Email is required.
              </small>
            </div>
            <div class="field col-6 md:col-3">
              <label for="school_email" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Year Published *
              </label>
              <IconField>
                <InputIcon class="pi pi-calendar  " :class="formSubmitted ? 'text-red-300' : ''" />
                <InputText size="small" id="school_email" type="text" autofocus :invalid="formSubmitted" />

              </IconField>
              <small class="p-invalid text-red-300" v-if="formSubmitted">
                Email is required.
              </small>
            </div>

            <div class="field col-6 md:col-3">
              <label for="unit_price" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Unit Price
              </label>
              <!-- <IconField> -->
              <!-- <InputIcon class="pi pi-mobile" :class="formSubmitted ? 'text-red-300' : ''" /> -->
              <InputNumber inputClass="p-inputtext-sm" id="unit_price" v-model="bookStore.thisBook.unit_price"
                inputId="unit_price" mode="currency" currency="PHP" locale="en-PH" fluid
                :invalid="formSubmitted && !bookStore.thisBook.unit_price" />
              <!-- <InputMask class="p-inputtext-sm" id="mobile_number" mask="+63999 999 9999"
                  placeholder="+63999 999 9999" :invalid="formSubmitted" /> -->
              <!-- </IconField> -->
              <small class="p-invalid text-red-300" v-if="formSubmitted && !bookStore.thisBook.unit_price"">
                Unit Price is required.
              </small>
            </div>
            <div class=" field col-12 md:col-6">
                <label for="remarks" style="font-size: 0.875rem !important; font-weight: 500 !important">
                  Remarks
                </label>
                <Textarea size="small" autoResize rows="3" cols="60" id="remarks" />
            </div>
          </div>
          <!-- <h6>Address</h6>
          <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-6">
              <label for="resgion" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Region *
              </label>
              <Dropdown class="p-inputtext-sm" size="small" id="resgion" v-model="bookStore.thisSchool.address.region"
                :options="addressStore.regions" optionValue="name" optionLabel="name" placeholder="Select Region"
                :invalid="formSubmitted && !bookStore.thisSchool.address.region"
                :dropdownIcon="formSubmitted && !bookStore.thisSchool.address.region ? 'pi pi-chevron-down text-red-300' : 'pi pi-chevron-down'">
              </Dropdown>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !bookStore.thisSchool.address.region">
                Region is required.
              </small>
            </div>
            <div class="field col-6">
              <label for="province" style="font-size: 0.875rem !important; font-weight: bold !important">
                Province *
              </label>
              <Dropdown class="p-inputtext-sm" size="small" id="province"
                v-model="bookStore.thisSchool.address.province" :options="addressStore.provinces" optionValue="name"
                optionLabel="name" placeholder="Select Province" :disabled="bookStore.thisSchool.address.region === ''"
                :invalid="formSubmitted && !bookStore.thisSchool.address.province"
                :dropdownIcon="formSubmitted && !bookStore.thisSchool.address.province ? 'pi pi-chevron-down text-red-300' : 'pi pi-chevron-down'">
              </Dropdown>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !bookStore.thisSchool.address.province">
                Province is required.
              </small>
            </div>
            <div class="field col-6">
              <label for="city" style="font-size: 0.875rem !important; font-weight: 500 !important">
                City *
              </label>
              <Dropdown class="p-inputtext-sm" size="small" id="city" v-model="bookStore.thisSchool.address.city"
                :options="addressStore.cities" optionValue="name" optionLabel="name" placeholder="Select City"
                :disabled="bookStore.thisSchool.address.province === ''"
                :invalid="formSubmitted && !bookStore.thisSchool.address.city"
                :dropdownIcon="formSubmitted && !bookStore.thisSchool.address.city ? 'pi pi-chevron-down text-red-300' : 'pi pi-chevron-down'">
              </Dropdown>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !bookStore.thisSchool.address.city">
                City is required.
              </small>
            </div>
            <div class="field col-6">
              <label for="barangay" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Barangay *
              </label>
              <Dropdown class="p-inputtext-sm" size="small" id="barangay"
                v-model="bookStore.thisSchool.address.barangay" :options="addressStore.barangays" optionValue="name"
                optionLabel="name" placeholder="Select Barangay" :disabled="bookStore.thisSchool.address.city === ''"
                :invalid="formSubmitted && !bookStore.thisSchool.address.province"
                :dropdownIcon="formSubmitted && !bookStore.thisSchool.address.barangay ? 'pi pi-chevron-down text-red-300' : 'pi pi-chevron-down'">
              </Dropdown>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !bookStore.thisSchool.address.barangay">
                Barangay is required.
              </small>
            </div>
            <div class="field col-6">
              <label for="detail_address1" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Detailed Address 1 *
              </label>
              <IconField>
                <InputIcon class="pi pi-map"
                  :class="formSubmitted && !bookStore.thisSchool.address.address_1 ? 'text-red-300' : ''" />
                <InputText id="detail_address1" type="text" size="small"
                  v-model="bookStore.thisSchool.address.address_1"
                  :invalid="formSubmitted && !bookStore.thisSchool.address.address_1" />
              </IconField>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !bookStore.thisSchool.address.address_1">
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
                  v-model="bookStore.thisSchool.address.address_2" />
              </IconField>
            </div>
          </div> -->
          <!-- <h6>Person In Charge Details</h6>
          <div class="p-fluid formgrid grid">
            <div class="field col-6">
              <label for="person_in_charge" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Person In Charge Name*
              </label>
              <IconField>
                <InputIcon class="pi pi-id-card"
                  :class="formSubmitted && !bookStore.thisSchool.person_in_charge ? 'text-red-300' : ''" />
                <InputText id="person_in_charge" type="text" size="small"
                  v-model="bookStore.thisSchool.person_in_charge"
                  :invalid="formSubmitted && !bookStore.thisSchool.person_in_charge" />
              </IconField>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !bookStore.thisSchool.person_in_charge">
                Person In Charged is required.
              </small>
            </div>
            <div class="field col-6">
              <label for="state" style="font-size: 0.875rem !important; font-weight: 500 !important">
                Person In Charge Contact Number *
              </label>
              <IconField>
                <InputIcon class="pi pi-mobile"
                  :class="formSubmitted && !bookStore.thisSchool.person_in_charge_contact_number ? 'text-red-300' : ''" />
                <InputMask class="p-inputtext-sm" id="mobile_number"
                  v-model="bookStore.thisSchool.person_in_charge_contact_number" mask="+63999 999 9999"
                  placeholder="+63999 999 9999"
                  :invalid="formSubmitted && !bookStore.thisSchool.person_in_charge_contact_number" />
              </IconField>
              <small class="p-invalid text-red-300"
                v-if="formSubmitted && !bookStore.thisSchool.person_in_charge_contact_number">
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
              <Dropdown class="p-inputtext-sm" size="small" id="state" v-model="bookStore.thisSchool.agent.uuid"
                :options="userStore.salesAgentUsers" :optionValue="(data) => data.uuid"
                :optionLabel="(data: User) => `${data.first_name} ${data.middle_name ? data.middle_name.slice(0, 1) + '.' : ''} ${data.last_name}`"
                placeholder="Select Sales Agent" :invalid="formSubmitted && !bookStore.thisSchool.agent.uuid"
                :dropdownIcon="formSubmitted && !bookStore.thisSchool.agent.uuid ? 'pi pi-chevron-down text-red-300' : 'pi pi-chevron-down'">
              </Dropdown>
              <small class="p-invalid text-red-300" v-if="formSubmitted && !bookStore.thisSchool.agent.uuid">
                Sales Agent is required.
              </small>
            </div>
          </div> -->
          <template #footer>
            <Button label="Cancel" icon="pi pi-times" :text="true" @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" :text="true" @click="onClickSaveSchool" />
          </template>
        </Dialog>

        <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3 text-red-500" style="font-size: 2rem" />
            <span v-if="bookStore.selectedSchool">
              Are you sure you want to delete
              <b>
                {{ `${bookStore.thisSchool.name}` }}
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
  import { BOOK_CATEGORY, TABLE_DATA, type School, type User, } from '@/stores/types'
  import { useAppStore } from '@/stores/app'
  import { useBookStore } from '@/stores/book'

  const appStore = useAppStore()
  const bookStore = useBookStore()


  const bookDialog = ref(false)
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



  onBeforeMount(() => {
    initFilters()
  })

  onMounted(() => {
    bookStore.getBooks()

  })

  const generateLabel = (string1: string, string3: string) => {
    return `${string1} ${string3}`
    // ('middle_name' ? 'middle_name'.splice(0, 0) + '.' : '') 'last_name' 

  }

  const openNew = () => {
    bookStore.clearBookState()
    bookDialog.value = true
    formSubmitted.value = false
  }

  const hideDialog = () => {
    bookStore.clearBookState()
    bookDialog.value = false
    formSubmitted.value = false
  }

  const onClickSaveSchool = async () => {
    const _user = userStore.getUserByUuid(bookStore.thisSchool.agent as User)
    if (_user) {
      bookStore.thisSchool.agent = _user as User
    }

    formSubmitted.value = true
    const response = await bookStore.saveSchool()
    if (response.status === 'success') {
      bookDialog.value = false
      formSubmitted.value = false
    }
    appStore.displayToast(response)

  }

  const onClickEditBtn = (_school: School) => {
    console.log(`bookStore.selectedSchool :: ${JSON.stringify(bookStore.selectedSchool)}`)
    if (
      bookStore.selectedSchool.uuid !== _school.uuid ||
      JSON.stringify(bookStore.selectedSchool) === '{}'
    ) {
      bookStore.selectedSchool = _school
    }
    // bookStore.thisSchool = { ...bookStore.selectedSchool }
    bookStore.thisSchool = JSON.parse(JSON.stringify({ ...bookStore.selectedSchool })) as School
    bookDialog.value = true
  }

  const confirmDeleteProduct = (_school: School) => {
    if (
      bookStore.selectedSchool.uuid !== _school.uuid ||
      JSON.stringify(bookStore.selectedSchool) === '{}'
    ) {
      bookStore.selectedSchool = _school
    }
    bookStore.thisSchool = { ...bookStore.selectedSchool }
    deleteUserDialog.value = true
  }

  const onClickConfirmBtn = async () => {
    const response = await bookStore.deleteSchool(bookStore.thisSchool)
    if (response.status === 'success') {
      deleteUserDialog.value = false
      bookStore.clearSchoolState()
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
