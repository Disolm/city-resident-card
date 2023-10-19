export interface ICitizen {
    "name": string,
    "id": number,
    "birthday": string,
    "city": number,
    "address": string,
    "mobilePhone": string,
    "photo": string,
    "additional": string,
    "gender": string,
    "isActive": boolean
}
export type TypeCitizens = ICitizen[]
export interface ICity {
        id: number
        name: string
}
export type TypeCities = ICity[]
export interface ITitleKey {
    birthday: { title: string };
    address: { title: string };
    mobilePhone: { title: string };
    gender: { title: string; value: { Female: string; Male: string } };
    additional: { title: string; multiline: boolean };
    name: { title: string };
    cityId: { title: string };
    isActive: { title: string; value: (ev: boolean) => (string) }
}