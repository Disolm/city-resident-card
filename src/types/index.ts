export interface ICitizen {
    "name": string,
    "id": number,
    "birthday": string,
    "cityId": number,
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
    birthday: { select?: boolean; title: string; type: string; placeholder?: string };
    address: { select?: boolean; title: string; type: string; placeholder?: string  };
    mobilePhone: { select?: boolean; title: string; type: string; placeholder?: string   };
    gender: { select: boolean; title: string; value: { Female: string; Male: string }; type: string; placeholder?: string  };
    additional: { select?: boolean; type: string; title: string; placeholder?: string  };
    name: { select?: boolean; title: string; type: string; placeholder?: string   };
    cityId: { select: boolean; title: string; type: string; placeholder?: string   };
    isActive: { select: boolean; title: string; value: (ev: boolean) => string; type: string; placeholder?: string   }
}