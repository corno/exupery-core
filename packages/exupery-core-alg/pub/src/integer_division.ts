
export const integer_division = (dividend: number, divisor: number): number => {
    if (divisor === 0) {
        throw new Error(`DIVISION BY ZERO`)
    }
    const quotient = dividend / divisor
    // when dividend and divisor have different signs, the quotient is negative
    // For positive quotients, use Math.floor to round down
    if (quotient >= 0) {
        return Math.floor(quotient)
    } else {
        return Math.ceil(quotient)
    }
}