export enum TABLE_DATA {
  User = 'users',
  School = 'schools',
  Book = 'books'
}

export enum BOOK_CATEGORY {
  PreSchool = 'Pre School',
  ElementarySchool = 'Elementary School',
  HighSchool = 'High School'
}

export enum USER_TYPE {
  SuperAdmin = 'System Administrator', // root
  Admin = 'Administrator', // Adminstrator
  Accountant = 'Accountant', // manage user
  Sales = 'Sales'
}

export enum USER_STATUS {
  Active = 'Active', // root
  Inactive = 'Inactive' // Adminstrator
}

export enum PO_STATUS {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  ForDelivery = 'For Delivery',
  Delivered = 'Delivered'
}

export enum PAYMENT_STATUS {
  Pending = 'Pending',
  Partial = 'Paid Parital Payment',
  Paid = 'Fully Paid',
  Overdue = 'Overdue'
}

export enum ADDRESS_TYPE {
  Regions = 'region',
  Provinces = 'province',
  Cities = 'city',
  Barangays = 'barangay'
}

export interface ApiResponse<T = any> {
  status: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast' | undefined
  message: string
  data?: T
}

export interface Book {
  uuid: string
  unit_price: string
  title: string
  category: BOOK_CATEGORY
  year_published: number
  author: string
  remarks?: string
}

export interface BookFilterData {
  category?: BOOK_CATEGORY
  keywords?: string
}

export interface BookInventory {
  uuid: string
  name: string
  school_year: string
  books: BookItem[]
}

export interface BookItem {
  uuid: string
  book: Book
  stock: number
}

export interface User {
  uuid: string
  username: string
  password: string
  first_name: string
  middle_name?: string
  last_name: string
  contact_number: string
  type: USER_TYPE
  email: string
  status: USER_STATUS
}

export interface AddressPH {
  [key: string]: Region
}

export interface Region {
  code: string
  name: string
  provinces: Province[]
}

export interface Province {
  code: string
  name: string
  region_code: string
  cities: City[]
}

export interface City {
  code: string
  name: string
  province_code: string
  barangays: Barangay[]
}

export interface Barangay {
  code: string
  name: string
  city_code: string
}

export interface Address {
  region: string
  province: string
  city: string
  barangay: string
  address_1: string
  address_2?: string
}

export interface School {
  uuid: String
  name: string
  address: Address
  telephone_number?: string
  mobile_number: string
  person_in_charge: string
  person_in_charge_contact_number: string
  email: string
  agent: User
}

export interface PurchaseOrder {
  uuid: string
  po_id: number
  items: PurchaseOrderItem[]
  total_amount: number
  order_date: number
  delivery_date?: Date
  status: PO_STATUS
  school: School
  remarks?: string
  prepared_by: User
}

export interface PurchaseOrderItem {
  book: Book
  quantity: number
  remarks?: string
}

export interface DeliveryReceipt {
  uuid: string
  dr_id: number
  po: PurchaseOrder
  recipient: School
  delivery_date: number
  delivered_by: string
  items: DeliveryItem[]
}

export interface DeliveryItem {
  book: Book
  quantity: number
  book_inventory: BookInventory
  remarks?: string
}

//Statement of Account
export interface SOA {
  uuid: string
  soa_id: number
  po: PurchaseOrder
  dr: DeliveryReceipt
  customer: School
  items: SOAItem[]
  discount?: number[]
}

export interface SOAItem {
  book: Book
  quantity: number
  returned_quantity: number
  remarks?: string
}

export interface PullOutReceipt {
  uuid: string
  pull_out_id: number
  po: PurchaseOrder
  dr: DeliveryReceipt
  soa: SOA
  customer: School
  pull_out_date: number
  items: PulledOutItem[]
}

export interface PulledOutItem {
  book: Book
  quantity: number
  remarks?: string
}

export interface Payment {
  uuid: string
  payment_id: number
  or_number: number
  or_attachment?: string
  soa: SOA
  amount: number
  payment_date: number
  payment_method: string
  reference_number?: string
  payment_attachemnt?: string
  is_full_payment: boolean
  paid_to: User
}
