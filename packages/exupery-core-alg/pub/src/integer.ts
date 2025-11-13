
/**
 * Performs integer division of two numbers (rounding towards negative infinity).
 * 
 * dividend / divisor
 * 
 * examples:
 * integer_division(7, 3) === 2
 * integer_division(7, -3) === -3
 * integer_division(-7, 3) === -3
 * integer_division(-7, -3) === 2
 */
export const integer_division = (dividend: number, divisor: number): number => {
    if (divisor === 0) {
        throw new Error(`DIVISION BY ZERO`)
    }
    const quotient = dividend / divisor
    // when dividend and divisor have different signs, the quotient is negative
    // For positive quotients, use Math.floor to round down

    // this behavior matches the integer division in Python, Java, and C99 and later

    if (quotient >= 0) {
        return Math.floor(quotient)
    } else {
        return Math.ceil(quotient)
    }
}