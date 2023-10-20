import type {ITitleKey} from "@/types";

export const titleKey: ITitleKey = {
    name: {title: "ФИО:", type: "text"},
    birthday: {title: "Дата рождения:", type: "date"},
    cityId: {title: "Город:", select: true, type: ""},
    address: {title: "Адрес:", type: "text"},
    mobilePhone: {title: "Телефон:", type: "tel", placeholder: "+7 987-654-3210"},
    gender: {
        title: "Пол:",
        select: true,
        value: {Female: "Женский", Male: "Мужской"},
        type: ""
    },
    isActive: {
        title: "Активный:",
        select: true,
        value: (ev) => ev ? "Да" : "Нет",
        type: ""
    },
    additional: {title: "Доп. информация:", type: "multiline"},
}