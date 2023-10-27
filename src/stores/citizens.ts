import {defineStore} from 'pinia'
import type {TypeCitizens} from '@/types'
import axios from 'axios';
// @ts-ignore
import phone from '@/api/json/phones.json'
// @ts-ignore
import address from '@/api/json/address.json'
// @ts-ignore
import prof from '@/api/json/prof.json'

interface State {
    citizens: TypeCitizens | null | undefined
    serverURL: string
    serverPort: string
    person: any
    // finallyRequest?: boolean
}
const clickHandler = function (json: any) {
    const indentInJson: string = '    '
    const textData: string = JSON.stringify(json, null, indentInJson)
    const blob: Blob = new Blob([textData],{type: 'application/json'})
    const link: HTMLElement = document.createElement('a')
    link.setAttribute('href', URL.createObjectURL(blob))
    link.setAttribute('download', 'myJSON')
    link.click()
}
export const useCitizensStore = defineStore('citizens', {
    state: (): State => ({
        citizens: null,
        serverURL: '',
        serverPort: '',
        person: []
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
        async getPerson() {
            const URL: string = 'https://rickandmortyapi.com/api/character/'
            const idStart: number = 1
            const idStop: number = 827
            if (!this.citizens) return
            this.citizens = []
            for (let i = idStart; i < idStop; i++) {
                await axios
                    .get(URL + i)
                    .then(response => {
                        const person = {
                            name: response.data.name,
                            id: response.data.id,
                            birthday: `${Math.floor(Math.random() * (2005 - 1960) + 1960)}-${Math.floor(Math.random() * 12)}-${Math.floor(Math.random() * 28)}`,
                            cityId: Math.floor(Math.random() * 30),
                            address: address[i],
                            mobilePhone: phone[i],
                            photo: `./src/api/picture/${i}.jpeg`,
                            additional: prof[Math.floor(Math.random() * prof.length-1)],
                            gender: response.data.gender,
                            isActive: "Alive" === response.data.status
                        }
                        this.citizens?.push(person)
                    })
                    .catch(e => {
                        this.citizens = undefined
                        console.error(e);
                    })
            }
            clickHandler(this.citizens)
        }
    },
})
