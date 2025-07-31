export const formaterNumerToPercert = (num: number) => {
    const numFormated = num.toFixed(2)
    if (num > 0) {
        return '+' + numFormated + '%'
    } else if (num < 0) {
        return numFormated + '%'
    } else {
        return numFormated + '%'
    }
}
