import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { USER_TYPE, type User } from './types'
import router from '@/router'
import { fa, faker } from '@faker-js/faker'

export const useSessionStore = defineStore('session', () => {
  const users = ref([
    {
      uuid: '05d9de78-eb06-41e7-8c75-8d24807ef7fa',
      first_name: 'Dudley',
      last_name: 'Orn',
      middle_name: 'Phoenix',
      username: 'ais.sysad',
      contact_number: '1-858-228-7807 x7137',
      password: 'AIS_123',
      email: 'dudley_orn@example-ais.com',
      user_type: 'System Administrator'
    },
    {
      uuid: '45dc5b2c-4bfd-48df-996a-355710e23ea1',
      first_name: 'Rebekah',
      last_name: 'Hayden',
      middle_name: '',
      username: 'ais.admin',
      contact_number: '389-796-1891',
      password: 'AIS_123',
      email: 'rebekah_hayden@example-ais.com',
      user_type: 'Administrator'
    },
    {
      uuid: 'f4d39f7d-4a61-48dd-9613-a67e85869e2f',
      first_name: 'Ivory',
      last_name: 'Raynor',
      middle_name: 'Taylor',
      username: 'ais.sales',
      contact_number: '505-532-3479 x14720',
      password: 'AIS_123',
      email: 'ivory_raynor@example-ais.com',
      user_type: 'Sales'
    },
    {
      uuid: 'f0e3ccde-48d5-4bc3-8241-c272119b3186',
      first_name: 'Lucio',
      last_name: 'Howell',
      middle_name: 'Brooklyn',
      username: 'ais_acct',
      contact_number: '(367) 345-8982 x332',
      password: 'AIS_123',
      email: 'lucio_howell@example-ais.com',
      user_type: 'Accountant'
    }
  ] as User[])

  const thisUser = ref({} as User)
  const loginError = ref([] as any[])
  const _count = ref(0)

  const _fakeUser = (type?: any) => {
    const _user = {} as User

    _user.uuid = faker.string.uuid()
    _user.first_name = faker.person.firstName()
    _user.last_name = faker.person.lastName()
    _user.middle_name = faker.datatype.boolean() ? faker.person.middleName() : ''
    _user.username = `${_user.first_name}.${_user.last_name}`.toLowerCase()
    _user.contact_number = faker.phone.number()
    _user.password = `${_user.last_name}_123`
    _user.user_type = type ?? faker.helpers.arrayElement(Object.values(USER_TYPE))
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

  const getUsers = () => {
    // replace axios call when using live data
    const _users = _generateUsers(5)
    users.value = _users
  }

  const loginUser = () => {
    loginError.value = [] as any[]
    // console.log(
    //   'thisUser.value.username :: ',
    //   JSON.stringify(thisUser.value) === '{}',
    //   thisUser.value
    // )
    if (JSON.stringify(thisUser.value) === '{}') {
      loginError.value = [
        {
          severity: 'error',
          detail: 'Error Message',
          content: 'Username and password are required.',
          id: _count.value++
        }
      ]
      return
    }

    if (!thisUser.value.username) {
      loginError.value = [
        {
          severity: 'error',
          detail: 'Error Message',
          content: 'Username is required.',
          id: _count.value++
        }
      ]
      return
    }

    if (!thisUser.value.password) {
      loginError.value = [
        {
          severity: 'error',
          detail: 'Error Message',
          content: 'Password is required.',
          id: _count.value++
        }
      ]
      return
    }

    //Save all information to localSession
    const foundUser = findUser()
    console.log('foundUser ::', foundUser)
    if (foundUser) {
      switch (foundUser.user_type) {
        case USER_TYPE.SuperAdmin:
          console.log('System Administrator')
          router.push('/superadmin')
          break
        case USER_TYPE.Admin:
          console.log('Administrator')
          break
        case USER_TYPE.Accountant:
          console.log('Accountant')
          break
        case USER_TYPE.Sales:
          console.log('Sales')
          break

        default:
          break
      }
    } else {
      // console.error('User not found')
      loginError.value = [
        {
          severity: 'error',
          detail: 'Error Message',
          content: 'Invalid username or password.',
          id: _count.value++
        }
      ]
    }
  }

  const findUser = (): User => {
    console.log('users.value ::', users.value)
    return users.value.find(
      (u) => u.username === thisUser.value.username && u.password === thisUser.value.password
    ) as User
  }

  return {
    thisUser,
    loginError,
    users,
    getUsers,
    loginUser
  }
})
