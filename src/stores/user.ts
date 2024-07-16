import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { USER_STATUS, USER_TYPE, type ApiResponse, type User } from './types'
import { faker } from '@faker-js/faker'
import { useAppStore } from './app'
import type { ToastMessageOptions } from 'primevue/toast'

export const useUserStore = defineStore('user', () => {
  const appStore = useAppStore()
  const users = ref([
    {
      uuid: '05d9de78-eb06-41e7-8c75-8d24807ef7fa',
      first_name: 'Dudley',
      last_name: 'Orn',
      middle_name: 'Phoenix',
      username: 'ais.sysad',
      contact_number: '+63955 979 7525',
      password: 'AIS_123',
      email: 'dudley_orn@example-ais.com',
      type: 'System Administrator',
      status: 'Active'
    },
    {
      uuid: '45dc5b2c-4bfd-48df-996a-355710e23ea1',
      first_name: 'Rebekah',
      last_name: 'Hayden',
      username: 'ais.admin',
      contact_number: '+63966 175 5813',
      password: 'AIS_123',
      email: 'rebekah_hayden@example-ais.com',
      type: 'Administrator',
      status: 'Active'
    },
    {
      uuid: 'f4d39f7d-4a61-48dd-9613-a67e85869e2f',
      first_name: 'Ivory',
      last_name: 'Raynor',
      middle_name: 'Taylor',
      username: 'ais.sales',
      contact_number: '+63955 380 2475',
      password: 'AIS_123',
      email: 'ivory_raynor@example-ais.com',
      type: 'Sales',
      status: 'Active'
    },
    {
      uuid: 'f0e3ccde-48d5-4bc3-8241-c272119b3186',
      first_name: 'Lucio',
      last_name: 'Howell',
      middle_name: 'Brooklyn',
      username: 'ais_acct',
      contact_number: '+63973 292 0500',
      password: 'AIS_123',
      email: 'lucio_howell@example-ais.com',
      type: 'Accountant',
      status: 'Active'
    }
  ] as User[])

  const thisUser = ref({} as User)
  const selectedUser = ref({} as User)

  // const toggleState = ref(true)

  // watch(toggleState, () => {
  //   console.log('test')
  //   thisUser.value.status = toggleState.value ? USER_STATUS.Active : USER_STATUS.Inactive
  // })

  const filteredUsers = computed(() => {
    const _routeName = appStore.currentRoute
    console.log(`_routeName :: ${_routeName}`)
    const _status =
      _routeName.split(' ')[0].charAt(0).toUpperCase() + _routeName.split(' ')[0].slice(1)
    console.log(`_status :: ${_status}`)
    // const _status = 'users'
    let _users = [] as User[]
    if (Object.values(USER_STATUS).includes(_status)) {
      _users = users.value.filter((_user) => _user.status === _status)
    } else {
      _users = users.value
    }

    return _users
  })

  const salesAgentUsers = computed(() => {
    return users.value
      .filter((_user) => _user.status === USER_STATUS.Active && _user.type === USER_TYPE.Sales)
      .map((filtered) => {
        return {
          ...filtered,
          fullname: `${filtered.first_name} ${filtered.middle_name ? filtered.middle_name.slice(0, 1) + '.' : ''} ${filtered.last_name}`
        }
      })
  })

  const _fakeUser = (type?: any): User => {
    const _user = {} as User

    _user.uuid = faker.string.uuid()
    _user.first_name = faker.person.firstName()
    _user.last_name = faker.person.lastName()
    _user.middle_name = faker.datatype.boolean() ? faker.person.middleName() : undefined
    _user.username = `${_user.first_name}.${_user.last_name}`.toLowerCase()
    _user.contact_number = faker.phone.number('+639## ### ####')
    _user.password = `${_user.last_name}_123`
    _user.type =
      type ??
      faker.helpers.arrayElement(
        Object.values(USER_TYPE).filter((_value) => _value !== USER_TYPE.SuperAdmin)
      )
    _user.status = faker.helpers.arrayElement(Object.values(USER_STATUS))
    _user.email = faker.internet.email({
      firstName: _user.first_name.toLowerCase(),
      lastName: _user.last_name.toLowerCase(),
      provider: 'example-ais.com'
    })

    return _user
  }

  const _generateUsers = (numberOfUsers: number): Array<User> => {
    const _users = [] as User[]

    for (let i = 0; i < numberOfUsers; i++) {
      _users.push(_fakeUser())
    }

    return _users
  }

  const clearUserState = () => {
    thisUser.value = {} as User
    selectedUser.value = {} as User
  }

  const isUserValid = (payload: User) => {
    if (payload.first_name === '') {
      return false
    }

    if (payload.last_name === '') {
      return false
    }

    if (!payload.contact_number) {
      return false
    }

    if (!payload.email) {
      return false
    }

    if (!payload.type) {
      return false
    }

    if (!payload.status) {
      return false
    }

    return true
  }

  const saveUser = async (): Promise<ApiResponse> => {
    if (thisUser.value.uuid) {
      return await updateUser(thisUser.value)
    } else {
      return await addUser(thisUser.value)
    }
  }

  const addUser = async (payload: User): Promise<ApiResponse> => {
    if (isUserValid(payload)) {
      payload.uuid = faker.string.uuid()
      payload.username = `${payload.first_name.split(' ')[0]}.${payload.last_name}`.toLowerCase()
      users.value.unshift(payload)
      return {
        status: 'success',
        message: 'User updated successfully',
        data: payload
      }
    } else {
      return {
        status: 'error',
        message: 'Missing required fields'
      }
    }
  }

  const updateUser = async (payload: User): Promise<ApiResponse> => {
    const idx = users.value.findIndex((item) => item.uuid === payload.uuid)
    if (idx != -1) {
      users.value[idx] = payload
      return {
        status: 'success',
        message: 'User updated successfully',
        data: payload
      }
    } else {
      return {
        status: 'error',
        message: 'User not found'
      }
    }
  }

  const deleteUser = async (payload: User): Promise<ApiResponse> => {
    const idx = users.value.findIndex((item) => item.uuid === payload.uuid)
    if (idx != -1) {
      users.value.splice(idx, 1)
      return {
        status: 'success',
        message: 'User deleted successfully',
        data: payload
      }
    } else {
      return {
        status: 'error',
        message: 'User not found'
      }
    }
  }

  const getUsers = () => {
    // replace axios call when using live data
    const _users = _generateUsers(10)
    users.value.push(..._users)
    // return users.value
    // return Promise.resolve(users.value);
  }

  const getUserByUuid = (payload: User): User | undefined => {
    if (payload && payload.uuid) {
      return users.value.find((u) => u.uuid === payload.uuid) as User
    } else {
      return undefined
    }
  }

  const getUser = (payload: User): User => {
    console.log('users.value ::', users.value)
    return users.value.find(
      (u) => u.username === payload.username && u.password === payload.password
    ) as User
  }

  return {
    users,
    thisUser,
    selectedUser,
    filteredUsers,
    salesAgentUsers,
    clearUserState,
    saveUser,
    deleteUser,
    getUser,
    getUserByUuid,
    getUsers,
    isUserValid
  }
})
