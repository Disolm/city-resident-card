export function formatPhoneNumber(value: string): string {
    if (!value || (value.slice(0, 1) === '+' && value.length === 1)) return value
    let phoneNumber: string = value.replace(/\D+/g, '')
    const phoneNumberLength = phoneNumber.length

    if (phoneNumber.slice(0, 1) !== '7') phoneNumber = '7' + phoneNumber
    if (phoneNumberLength > 0) phoneNumber = '+' + phoneNumber
    if (phoneNumberLength > 1) phoneNumber = phoneNumber.slice(0, 2) + ' ' + phoneNumber.slice(2)
    if (phoneNumberLength > 4) phoneNumber = phoneNumber.slice(0, 6) + '-' + phoneNumber.slice(6)
    if (phoneNumberLength > 7) phoneNumber = phoneNumber.slice(0, 10) + '-' + phoneNumber.slice(10)
    if (phoneNumberLength > 12) phoneNumber = phoneNumber.slice(0, 15)
    return phoneNumber
}