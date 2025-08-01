export const formaterNumerToPercert = (num: number, isPoints = true) => {
    const numFormated = num.toFixed(2)
    if (num > 0) {
        return '+' + numFormated + (isPoints ? '%' : ' ')
    } else if (num < 0) {
        return numFormated + (isPoints ? '%' : '')
    } else {
        return numFormated 
    }
}
