import {defineStore} from 'pinia'
import type {TypeCities} from '@/types'
import axios from 'axios';

interface State {
    cities: TypeCities | null | undefined
}
export const useCitiesStore = defineStore('cities', {
    state: ():State => ({
        cities: null ,
    }),
    getters: {
        getCities(state) {
            return state.cities
        },

    },
    actions: {
        async fetchCities() {
            const baseURL: string = "./src/api/json/cities.json";
            await axios
                .get(baseURL)
                .then(response => {
                    this.cities = response.data
                })
                .catch(e => {
                    this.cities = undefined
                    console.error(e);
                })
        },
    },
})
