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
        <h5>Inventory</h5>
        <Divider />
        <div class="grid grid-cols-6 gap-3 m-1">
          <Card class="col-2 lg:col-3 xl:col-3" :pt="{ body: { class: 'p-0' }, content: { class: 'hidden' } }">
            <template #title>Invetory 1</template>
            <template #subtitle>Card subtitle</template>
            <template #footer>
              <!-- <div class="flex"> -->
              <!-- <Button label="Cancel" severity="secondary" outlined class="w-full" /> -->
              <Button label="Save" size="small" class="w-full" />
              <!-- </div> -->
            </template>
          </Card>
          <Card class="col-2 lg:col-3 xl:col-3" :pt="{ body: { class: 'p-0' }, content: { class: 'hidden' } }">
            <!-- <template #title>Invetory 1</template> -->
            <!-- <template #subtitle>Card subtitle</template> -->
            <template #footer>
              <!-- <div class="flex"> -->
              <!-- <Button label="Cancel" severity="secondary" outlined class="w-full" /> -->
              <Button label="Add Invetory" iconPos="top" icon="pi pi-file-plus" outlined class="w-full"
                :pt="{ body: { class: 'h-full' }, icon: { class: 'size-32' } }" />
              <!-- </div> -->
            </template>
          </Card>

          <!-- <Button label="Add Invetory" iconPos="top" icon="pi pi-file-plus" class="size-full" outlined
            :pt="{ icon: { class: 'size-full' } }" /> -->






        </div>

      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
  import { FilterMatchMode } from 'primevue/api'
  import { ref, onMounted, onBeforeMount } from 'vue'
  import { BOOK_CATEGORY, TABLE_DATA, type Book, type User, } from '@/stores/types'
  import { useAppStore } from '@/stores/app'
  import { useBookStore } from '@/stores/book'
  import { useUserStore } from '@/stores/user'

  const appStore = useAppStore()
  const bookStore = useBookStore()
  const userStore = useUserStore()

  const bookDialog = ref(false)
  const deleteUserDialog = ref(false)
  const filters = ref({})
  const formSubmitted = ref(false)

  const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' })
  const breadcrumbItems = ref([{ label: 'Dashboard' }])

  onBeforeMount(() => {
    initFilters()
  })

  onMounted(() => {
    bookStore.getBooks()
  })

  const generateLabel = (string1: string, string3: string) => {
    return `${string1} ${string3}`
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

  // const onClickSaveSchool = async () => {
  //   const _user = userStore.getUserByUuid(bookStore.thisBook.agent as User)
  //   if (_user) {
  //     bookStore.thisBook.agent = _user as User
  //   }

  //   formSubmitted.value = true
  //   const response = await bookStore.saveBook()
  //   if (response.status === 'success') {
  //     bookDialog.value = false
  //     formSubmitted.value = false
  //   }
  //   appStore.displayToast(response)
  // }

  const onClickEditBtn = (_school: Book) => {
    if (
      bookStore.selectedBook.uuid !== _school.uuid ||
      JSON.stringify(bookStore.selectedBook) === '{}'
    ) {
      bookStore.selectedBook = _school
    }
    bookStore.thisBook = JSON.parse(JSON.stringify({ ...bookStore.selectedBook })) as Book
    bookDialog.value = true
  }

  const confirmDeleteProduct = (_school: Book) => {
    if (
      bookStore.selectedBook.uuid !== _school.uuid ||
      JSON.stringify(bookStore.selectedBook) === '{}'
    ) {
      bookStore.selectedBook = _school
    }
    bookStore.thisBook = { ...bookStore.selectedBook }
    deleteUserDialog.value = true
  }

  const onClickConfirmBtn = async () => {
    const response = await bookStore.deleteBook(bookStore.thisBook)
    if (response.status === 'success') {
      deleteUserDialog.value = false
      bookStore.clearBookState()
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
