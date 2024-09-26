import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  ADDRESS_TYPE,
  type Address,
  type AddressPH,
  type Barangay,
  type City,
  type Province,
  type Region
} from './types'
import axios, { type AxiosResponse } from 'axios'
import { useSchoolStore } from './school'

export const useAddressStore = defineStore('address', () => {
  const PHAddress = ref<AddressPH>({})
  const regions = ref<Region[]>({} as Region[])
  const provinces = ref<Province[]>()
  const cities = ref<City[]>()
  const barangays = ref<Barangay[]>()

  const retrieveData = async (payload: ADDRESS_TYPE): Promise<AxiosResponse> => {
    try {
      const response = await axios.get(
        `https://isaacdarcilla.github.io/philippine-addresses/${payload}.json`
      )
      console.log('regions ::', response)
      return response
    } catch (error) {
      console.error('Error retrieving data:', error)
      throw error // Optionally rethrow or handle the error as needed
    }
  }

  const isAddressValid = (payload: Address) => {
    if (!payload.region) {
      return false
    }

    if (!payload.province) {
      return false
    }

    if (!payload.city) {
      return false
    }

    if (!payload.barangay) {
      return false
    }

    if (!payload.address_1) {
      return false
    }

    return true
  }

  const getPHAddressData = async () => {
    try {
      const regionResponse = await retrieveData(ADDRESS_TYPE.Regions)
      const provinceResponse = await retrieveData(ADDRESS_TYPE.Provinces)
      const cityResponse = await retrieveData(ADDRESS_TYPE.Cities)
      const brgyResponse = await retrieveData(ADDRESS_TYPE.Barangays)
      // console.log('regions ::', regionResponse.data)
      // console.log('provinces ::', provinceResponse.data)
      // console.log('cities ::', cityResponse.data)
      // console.log('bgys ::', brgyResponse.data)

      // const _PHAddress: Region[] = regionResponse.data.map((_region: any) => {
      regions.value = regionResponse.data.map((_region: any) => {
        const __region: Region = {
          code: _region.region_code,
          name: _region.region_name,
          provinces: provinceResponse.data
            .filter((_province: any) => _province.region_code === _region.region_code)
            .map((filteredProvince: any) => {
              return {
                code: filteredProvince.province_code,
                name: filteredProvince.province_name,
                region_code: filteredProvince.region_code,
                cities: cityResponse.data
                  .filter((_city: any) => _city.province_code === filteredProvince.province_code)
                  .map((filteredCity: any) => {
                    return {
                      code: filteredCity.city_code,
                      name: filteredCity.city_name,
                      province_code: filteredCity.province_code,
                      barangays: brgyResponse.data
                        .filter((_brgy: any) => _brgy.city_code == filteredCity.city_code)
                        .map((filteredBrgy: any) => {
                          return {
                            code: filteredBrgy.brgy_code,
                            name: filteredBrgy.brgy_name,
                            city_code: filteredBrgy.city_code
                          } as Barangay
                        }) as Barangay[]
                    } as City
                  }) as City[]
              } as Province
            }) as Province[]
        }

        return { ...__region } as Region
      })
    } catch (error: any) {
      return error.message
    }
  }

  // getPHAddressData()

  const getRegions = async () => {
    try {
      const response = await retrieveData(ADDRESS_TYPE.Regions)
      console.log('regions ::', response.data)
      if (response.status === 200) {
        regions.value = response.data.map((_region: any) => {
          return {
            code: _region.region_code,
            name: _region.region_name,
            provinces: [] as Province[]
          } as Region
        })
        console.log('regions :: ', regions.value)
      } else {
        console.error('Error on retrieving regions :: ', response)
      }
    } catch (error: any) {
      return error.message
    }
  }

  const getProvincesByRegion = async (payload: string) => {
    try {
      const response = await retrieveData(ADDRESS_TYPE.Provinces)
      console.log('provinces ::', response.data)
      if (response.status === 200) {
        provinces.value = response.data
          .filter((_province: any) => _province.region_code === payload)
          .map((filtered: any) => {
            return {
              code: filtered.province_code,
              name: filtered.province_name,
              region_code: filtered.region_code,
              cities: [] as City[]
            } as Province
          })
        console.log('provinces :: ', provinces.value)
      } else {
        console.error('Error on retrieving provinces :: ', response)
      }
    } catch (error: any) {
      return error.message
    }
  }

  const getCitiesByProvinces = async (payload: string) => {
    try {
      const response = await retrieveData(ADDRESS_TYPE.Cities)
      console.log('cities ::', response.data)
      if (response.status === 200) {
        cities.value = response.data
          .filter((_city: any) => _city.province_code === payload)
          .map((filtered: any) => {
            return {
              code: filtered.city_code,
              name: filtered.city_name,
              province_code: filtered.province_code,
              barangays: [] as Barangay[]
            } as City
          })
        console.log('cities :: ', cities.value)
      } else {
        console.error('Error on retrieving cities :: ', response)
      }
    } catch (error: any) {
      return error.message
    }
  }

  const getBarangaysByCity = async (payload: string) => {
    try {
      const response = await retrieveData(ADDRESS_TYPE.Barangays)
      console.log('barangays ::', response.data)
      if (response.status === 200) {
        barangays.value = response.data
          .filter((_city: any) => _city.city_code === payload)
          .map((filtered: any) => {
            return {
              code: filtered.brgy_code,
              name: filtered.brgy_name,
              city_code: filtered.city_code
            } as Barangay
          })
        console.log('barangays :: ', barangays.value)
      } else {
        console.error('Error on retrieving barangays :: ', response)
      }
    } catch (error: any) {
      return error.message
    }
  }

  // return provinces.data
  //   .filter((province) => province.region_code === code)
  //   .map((filtered) => {
  //     return {
  //       psgc_code: filtered.psgc_code,
  //       province_name: filtered.province_name,
  //       province_code: filtered.province_code,
  //       region_code: filtered.region_code
  //     }
  //   })

  return {
    PHAddress,
    regions,
    provinces,
    cities,
    barangays,
    isAddressValid,
    getRegions,
    getPHAddressData,
    getProvincesByRegion,
    getCitiesByProvinces
  }
})
