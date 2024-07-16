import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { BOOK_CATEGORY, type ApiResponse, type Book, type BookFilterData } from './types'
import { faker } from '@faker-js/faker'

export const useBookStore = defineStore('book', () => {
  const books = ref<Array<Book>>([])
  const thisBook = ref<Book>({} as Book)
  const selectedBook = ref<Book>({} as Book)
  const filterOption = ref<BookFilterData>()

  const filteredBooks = computed(() => {
    if (filterOption.value?.category) {
      return books.value?.filter((_book: Book) => _book.category === filterOption.value?.category)
    }

    return books.value
  })

  const bookCategory = computed(() => {
    return Object.values(BOOK_CATEGORY).map((category) => ({ label: category, value: category }))
  })

  // (): any => {
  //   return Object.values(BOOK_CATEGORY).map((category) => ({ label: category, value: category }))
  // }
  const _fakeBook = (): Book => {
    const _book = {} as Book

    _book.uuid = faker.string.uuid()
    _book.title = faker.commerce.productName()
    _book.unit_price = faker.commerce.price({ min: 200, max: 900 }) // 154.00
    _book.category = faker.helpers.arrayElement(Object.values(BOOK_CATEGORY))
    _book.year_published = faker.number.int({ min: 2015, max: 2024 })
    _book.author = faker.person.fullName()
    _book.remarks = faker.datatype.boolean(0.3) ? faker.commerce.productDescription() : undefined

    return _book
  }

  const _generateBooks = (numberofBooks: number): Array<Book> => {
    const _books: Array<Book> = []

    for (let i = 0; i < numberofBooks; i++) {
      _books.push(_fakeBook())
    }
    return _books
  }

  const clearBookState = () => {
    thisBook.value = {} as Book
    selectedBook.value = {} as Book
    filterOption.value = {} as BookFilterData
  }

  const isBookValid = (book: Book) => {
    if (!book.unit_price) {
      return false
    }

    if (!book.title) {
      return false
    }

    if (book.category === undefined || book.category === null) {
      return false
    }

    if (book.year_published <= 0) {
      return false
    }

    if (!book.author) {
      return false
    }

    return true
  }

  const saveBook = async (): Promise<ApiResponse> => {
    if (thisBook.value?.uuid) {
      return await updateBook(thisBook.value)
    } else {
      return await addBook(thisBook.value)
    }
  }

  const addBook = async (payload: Book): Promise<ApiResponse> => {
    if (isBookValid(payload)) {
      try {
        payload.uuid = faker.string.uuid()
        books.value.unshift(payload)
        return {
          status: 'success',
          message: 'User updated successfully',
          data: payload
        }
      } catch (error: any) {
        return {
          status: 'error',
          message: `Error on adding book :: ${error}`
        }
      }
    } else {
      return {
        status: 'error',
        message: 'Missing required fields'
      }
    }
  }

  const updateBook = async (payload: Book): Promise<ApiResponse> => {
    const idx = books.value.findIndex((item) => item.uuid === payload.uuid)
    if (idx != -1) {
      try {
        books.value[idx] = payload
        return {
          status: 'success',
          message: 'Book updated successfully',
          data: payload
        }
      } catch (error: any) {
        return {
          status: 'error',
          message: `Error on updating book :: ${error}`
        }
      }
    } else {
      return {
        status: 'error',
        message: 'Book not found'
      }
    }
  }

  const deleteBook = async (payload: Book): Promise<ApiResponse> => {
    const idx = books.value.findIndex((item) => item.uuid === payload.uuid)
    if (idx != -1) {
      try {
        books.value.splice(idx, 1)
        return {
          status: 'success',
          message: 'Book updated successfully',
          data: payload
        }
      } catch (error: any) {
        return {
          status: 'error',
          message: `Error on deleting book :: ${error}`
        }
      }
    } else {
      return {
        status: 'error',
        message: 'User not found'
      }
    }
  }

  const getBooks = () => {
    // replace axios call when using live data
    const _books = _generateBooks(100)
    books.value.push(..._books)
  }

  return {
    books,
    thisBook,
    selectedBook,
    filterOption,
    filteredBooks,
    bookCategory,
    clearBookState,
    saveBook,
    addBook,
    updateBook,
    deleteBook,
    getBooks
  }
})
