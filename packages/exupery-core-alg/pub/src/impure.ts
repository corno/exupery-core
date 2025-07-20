import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

export const temp_j2d = (number_of_julian_days: number) => {
    const date = new Date((number_of_julian_days - 2440587) * 86400 * 1000)
    return date.toISOString().split('T')[0]
}

export type Temp_Impure = {
    'dictionary': {
    }
    'list': {
        // 'discard first': <T>($: _et.Array<T>) => _et.Optional_Value<_et.Array<T>>
        'reverse': <T>($: _et.Array<T>) => _et.Array<T>
        'repeat': <T>($: T, count: number) => _et.Array<T>
    }
    'approximate number': {
        'floor': ($: number) => number
        'serialize': ($: number) => string
    }
    'integer': {
        'integer division': ($: number, divisor: number) => number
        'modulo': ($: number, divisor: number) => number
        'parse': ($: string) => number
        'parse hexadecimal': ($: string) => number
        'parse octal': ($: string) => number
        'serialize': ($: number) => string
        'serialize with decimal shift': ($: number, decimal_separator_shift: number, decimal_character: 'comma' | 'period') => string
    }
    'natural': {
        'parse': ($: string) => number
        'serialize': ($: number) => string
        'serialize with decimal shift': ($: number, decimal_separator_shift: number, decimal_character: 'comma' | 'period') => string
    }
    'text': {
        'replace all occurences': ($: string, search_value: string, replace_value: string) => string
        'replace all occurences of all patterns': ($: string, patterns: _et.Array<{ 'search value': string, 'replace value': string }>) => string
        'split': ($: string, separator: string) => _et.Array<string>
        'starts with': (haystack: string, needle: string, position: number) => boolean
        'to character list': ($: string) => _et.Array<number>
        'from character list': ($: _et.Array<number>) => string
    }
}

export const $: Temp_Impure = {
    'dictionary': {
    },
    'list': {
        'reverse': ($) => {
            return _ei.array_literal($.__get_raw_copy().slice().reverse())
        },
        'repeat': <T>($: T, count: number): _et.Array<T> => {
            const result: T[] = []
            for (let i = 0; i < count; i++) {
                result.push($)
            }
            return _ei.array_literal(result)
        },
    },
    'approximate number': {
        'floor': ($) => {
            return Math.floor($)
        },
        'serialize': ($) => {
            return $.toString()
        },
    },
    'integer': {
        'integer division': ($, divisor) => {
            return Math.floor($ / divisor)
        },
        'modulo': ($, divisor) => {
            return $ % divisor
        },
        'parse': ($) => {
            return parseFloat($)
        },
        'parse hexadecimal': ($) => {
            return parseInt($, 16)
        },
        'parse octal': ($) => {
            return parseInt($, 8)
        },
        'serialize': ($) => {
            return $.toFixed(0)
        },
        'serialize with decimal shift': ($, decimal_separator_shift, decimal_character) => {
            const shifted = $ / (10 ** decimal_separator_shift)
            const stringified = shifted.toFixed(decimal_separator_shift)
            if (decimal_character === 'comma') {
                return stringified.replace('.', ',')
            } else {
                return stringified
            }
        },
    },
    'natural': {
        'parse': ($) => {
            return parseFloat($)
        },
        'serialize': ($) => {
            return $.toFixed(0)
        },
        'serialize with decimal shift': ($, decimal_separator_shift, decimal_character) => {
            const shifted = $ / (10 ** decimal_separator_shift)
            const stringified = shifted.toFixed(decimal_separator_shift)
            if (decimal_character === 'comma') {
                return stringified.replace('.', ',')
            } else {
                return stringified
            }
        },
    },
    'text': {
        'replace all occurences': ($, search_value, replace_value) => {
            return $.replaceAll(search_value, replace_value)
        },
        'replace all occurences of all patterns': ($, patterns) => {
            let current = $
            patterns.__for_each(($) => {
                current = current.replaceAll($['search value'], $['replace value'])
            })
            return current
        },
        'split': ($, separator) => {
            return _ei.array_literal($.split(separator))
        },
        'to character list': ($) => {
            const out: number[] = []
            for (let i = 0; i < $.length; i++) {
                out.push($.charCodeAt(i))
            }
            return _ei.array_literal(out)
        },
        'from character list': ($) => {
            let out = ""
            $.__for_each(($) => {
                out += String.fromCodePoint($)
            })
            return out
        },
        'starts with': (haystack: string, needle: string, position: number) => {
            return haystack.startsWith(needle, position)
        }
    },
}