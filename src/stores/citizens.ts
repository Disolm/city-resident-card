import {defineStore} from 'pinia'
import type {TypeCitizens} from '@/types'
import axios from 'axios';

interface State {
    citizens: TypeCitizens | null | undefined
    serverURL: string
    serverPort: string
    // finallyRequest?: boolean
}
export const useCitizensStore = defineStore('citizens', {
    state: ():State => ({
        citizens: null ,
        serverURL: '',
        serverPort: '',
        // finallyRequest: false
    }),
    getters: {
        getCitizens(state) {
            return state.citizens
        },

    },
    actions: {
        async fetchCitizens() {
            const baseURL: string = "./src/api/json/citizens.json";
            // this.finallyRequest = false
            await axios
                .get(baseURL)
                .then(response => {
                    this.citizens = response.data
                })
                .catch(e => {
                    this.citizens = undefined
                    console.error(e);
                })
                // .finally(() => this.finallyRequest = true)
        },
        async sendingFileToServer() {
            axios.post(this.serverURL + this.serverPort, {
                body: JSON.stringify(this.citizens)
            })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        setCitizens(citizens: TypeCitizens) {
            this.citizens = citizens
        },
    },
})
