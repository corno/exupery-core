
export const JSON_stringify = (obj: any): string => {
    return JSON.stringify(obj)
}

export const String_length = (s: string): number => {
    return s.length
}

export const Math_min = (...values: number[]): number => {
    return Math.min(...values)
}

export const Math_max = (...values: number[]): number => {
    return Math.max(...values)
}

export const console_log = (...args: any[]): void => {
    console.log(...args)
}

export * from "./unmarshall_helpers"