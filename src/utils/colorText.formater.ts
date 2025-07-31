
export const isPositive = (num: number) => {
    if (num > 0) {
        return 'text-green-500'
    } else if (num < 0) {
        return 'text-red-500'
    } else {
        return 'text-white'
    }
}