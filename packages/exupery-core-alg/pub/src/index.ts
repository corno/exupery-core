import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

/**
 * these functions coming from core-internals should be exposed for library development
 */
export {
    set,
    not_set,
    cc,
    au,
    ss,
    panic,
    array_literal,
    dictionary_literal,
    block,
    Error // <-- remove this one (I think)
} from "exupery-core-internals"

export const build_list = <T>($: ($c: {
    'add element': ($: T) => void
    'add list': ($: _et.Array<T>) => void
}) => void): _et.Array<T> => {
    const temp: T[] = []
    $({
        'add element': ($) => {
            temp.push($)
        },
        'add list': ($) => {
            temp.push(...$.__get_raw_copy())
        }
    })
    return _ei.array_literal(temp)
}

export const build_text = (
    $c: (
        $c: {
            'add snippet': ($: string) => void
            'add character': ($: number) => void
        }
    ) => void
) => {
    let out = ""
    $c({
        'add snippet': ($) => {
            out += $
        },
        'add character': ($) => {
            out += String.fromCodePoint($)
        }
    })
    return out
}

export const build_dictionary = <T>(
    $: (
        $c: { 'add entry': (key: string, value: T) => void }
    ) => void
): _et.Dictionary<T> => {
    const temp: { [key: string]: T } = {}
    $({
        'add entry': (key, $) => {
            if (key in temp) {
                _ei.panic(`duplicate key in dictionary literal: ${key}`)
            }
            temp[key] = $
        }
    })
    return _ei.dictionary_literal(temp)
}