import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import {
  USER_TYPE,
  type Address,
  type ApiResponse,
  type Barangay,
  type City,
  type Province,
  type Region,
  type School,
  type User
} from './types'
import { faker } from '@faker-js/faker'
import { useAddressStore } from './address'
import { useUserStore } from './user'
import { useAppStore } from './app'

export const useSchoolStore = defineStore('school', () => {
  const appStore = useAppStore()
  const addressStore = useAddressStore()
  const userStore = useUserStore()

  const schools = ref([] as School[])
  const thisSchool = ref({
    address: {
      region: '',
      province: '',
      city: '',
      barangay: '',
      address_1: '',
      address_2: ''
    } as Address,
    agent: {
      uuid: ''
    } as User
  } as School)
  const selectedSchool = ref({} as School)

  const provinces = computed((): Province[] => {
    console.log('@___ computed provinces', thisSchool.value.address.region)

    const _region = addressStore.regions.find(
      (region) => region.name === thisSchool.value.address.region
    )
    if (_region) {
      if (
        !_region.provinces.find(
          (province: Province) => province.name === thisSchool.value.address.province
        )
      ) {
        thisSchool.value.address.province = ''
        thisSchool.value.address.city = ''
        thisSchool.value.address.barangay = ''
      }
      addressStore.provinces = _region.provinces

      return _region.provinces as Province[]
    } else {
      return [] as Province[]
    }
  })

  const cities = computed((): City[] => {
    console.log('@___ computed cities', thisSchool.value.address.province)

    const _province = addressStore.provinces?.find(
      (province) => province.name === thisSchool.value.address.province
    )
    if (_province) {
      if (!_province.cities.find((city: City) => city.name === thisSchool.value.address.city)) {
        thisSchool.value.address.city = ''
        thisSchool.value.address.barangay = ''
      }
      addressStore.cities = _province.cities
      return _province.cities as City[]
    } else {
      return [] as City[]
    }
  })

  const brgys = computed((): Barangay[] => {
    console.log('@___ computed brgys', thisSchool.value.address.city)

    const _city = addressStore.cities?.find((city) => city.name === thisSchool.value.address.city)
    if (_city) {
      if (
        !_city.barangays.find(
          (barangay: Barangay) => barangay.name === thisSchool.value.address.barangay
        )
      ) {
        thisSchool.value.address.barangay = ''
      }
      addressStore.barangays = _city.barangays
      return _city.barangays as Barangay[]
    } else {
      return [] as Barangay[]
    }
  })

  const filteredSchools = computed(() => (user?: User) => {
    let _schools = [] as School[]

    if (user && user.type === USER_TYPE.Sales) {
      _schools = schools.value.filter((_school) => _school.agent.uuid === user?.uuid)
    } else {
      _schools = schools.value
    }

    return _schools
  })

  const isTableLoading = computed(() => {
    return schools.value.length === 0
  })

  const _fakeSchool = async (): Promise<School> => {
    const _school = {} as School
    await appStore.waitFor(() => addressStore.regions.length > 0, 5)
    const _region = faker.helpers.arrayElement(addressStore.regions)
    const _province = faker.helpers.arrayElement(_region.provinces)
    const _city = faker.helpers.arrayElement(_province.cities)
    const _brgy = faker.helpers.arrayElement(_city.barangays)

    const _address: Address = {
      region: _region.name,
      province: _province.name,
      city: _city.name,
      barangay: _brgy.name,
      address_1: faker.location.streetAddress()
    }

    _school.uuid = faker.string.uuid()
    _school.name = faker.company.name()
    _school.address = _address
    _school.telephone_number = faker.datatype.boolean(0.3)
      ? faker.phone.number('(0##) ### ####')
      : undefined
    _school.mobile_number = faker.phone.number('+639## ### ####')
    _school.person_in_charge = faker.person.fullName()
    _school.person_in_charge_contact_number = faker.phone.number('+639## ### ####')
    _school.email = faker.internet
      .email({
        provider: 'school.edu.ph'
      })
      .toLowerCase()
    _school.agent = faker.helpers.arrayElement(
      userStore.users.filter((_agent: User) => {
        return _agent.type === USER_TYPE.Sales
      })
    )
    console.log('@___ _fakeSchool :: ', _school)
    return _school
  }

  const _generateSchools = async (numberOfUsers: number): Promise<Array<School>> => {
    const _schools = [] as School[]

    for (let i = 0; i < numberOfUsers; i++) {
      _schools.push(await _fakeSchool())
    }

    return _schools
  }

  const isSchoolValid = (payload: School) => {
    if (!payload.name) {
      return false
    }

    if (!addressStore.isAddressValid(payload.address)) {
      return false
    }

    if (!payload.mobile_number) {
      return false
    }

    if (!payload.person_in_charge) {
      return false
    }

    if (!payload.person_in_charge_contact_number) {
      return false
    }

    if (!payload.email) {
      return false
    }

    if (!userStore.isUserValid(payload.agent)) {
      return false
    }

    return true
  }

  const saveSchool = async (): Promise<ApiResponse> => {
    if (isSchoolValid(thisSchool.value)) {
      if (thisSchool.value.uuid) {
        return await updateSchool(thisSchool.value)
      } else {
        return await addSchool(thisSchool.value)
      }
    } else {
      return {
        status: 'error',
        message: 'Missing required fields'
      }
    }
  }

  const addSchool = async (payload: School): Promise<ApiResponse> => {
    // if (isUserValid(payload)) {
    payload.uuid = faker.string.uuid()
    //   payload.username = `${payload.first_name.split(' ')[0]}.${payload.last_name}`.toLowerCase()
    schools.value.unshift(payload)
    return {
      status: 'success',
      message: 'School updated successfully',
      data: payload
    }
    // } else {
    //   return {
    //     status: 'error',
    //     message: 'Missing required fields'
    //   }
    // }
  }

  const getSchools = async () => {
    // replace axios call when using live data
    const _schools = await _generateSchools(100)
    schools.value.push(..._schools)
  }

  const updateSchool = async (payload: School): Promise<ApiResponse> => {
    const idx = schools.value.findIndex((item) => item.uuid === payload.uuid)
    if (idx != -1) {
      schools.value[idx] = payload
      return {
        status: 'success',
        message: 'School updated successfully',
        data: payload
      }
    } else {
      return {
        status: 'error',
        message: 'School not found'
      }
    }
  }

  const deleteSchool = async (payload: School): Promise<ApiResponse> => {
    const idx = schools.value.findIndex((item) => item.uuid === payload.uuid)
    if (idx != -1) {
      schools.value.splice(idx, 1)
      return {
        status: 'success',
        message: 'School deleted successfully',
        data: payload
      }
    } else {
      return {
        status: 'error',
        message: 'School not found'
      }
    }
  }

  const clearSchoolState = () => {
    thisSchool.value = {
      address: {
        region: '',
        province: '',
        city: '',
        barangay: '',
        address_1: '',
        address_2: ''
      } as Address,
      agent: {
        uuid: ''
      } as User
    } as School
    selectedSchool.value = {} as School
  }

  return {
    schools,
    thisSchool,
    selectedSchool,
    filteredSchools,
    isTableLoading,
    saveSchool,
    getSchools,
    updateSchool,
    deleteSchool,
    clearSchoolState,
    provinces,
    cities,
    brgys
  }
})
