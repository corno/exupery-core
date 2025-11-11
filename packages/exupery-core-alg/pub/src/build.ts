import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

export type List_Builder<T> = {
    'add element': ($: T) => void
    'add list': ($: _et.Array<T>) => void
}

export type Text_Builder = {
    'add snippet': ($: string) => void
    'add character': ($: number) => void
}

export type Dictionary_Builder<T> = {
    'add entry': (key: string, value: T) => void
}

export const build_list = <T>($: ($c: List_Builder<T>) => void): _et.Array<T> => {
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
    $c: ($c: Text_Builder) => void
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

export type Key_Value_Pair<T> = {
    'key': string,
    'value': T,
}

export const group_list = <T>(
    list: _et.Array<Key_Value_Pair<T>>,
): _et.Dictionary<_et.Array<T>> => {
    const temp: { [key: string]: T[] } = {}
    list.__for_each(($) => {
        if (temp[$.key] === undefined) {
            temp[$.key] = []
        }
        temp[$.key].push($.value)
    })
    return _ei.dictionary_literal(temp).map(($) => _ei.array_literal($))
}

export const group_dictionary = <T>(
    dictionary: _et.Dictionary<Key_Value_Pair<T>>,
): _et.Dictionary<_et.Dictionary<T>> => {
    const temp: { [key: string]: { [key: string]: T } } = {}
    dictionary.map(($, key) => {
        if (temp[$.key] === undefined) {
            temp[$.key] = {}
        }
        temp[$.key][key] = $.value
    })
    return _ei.dictionary_literal(temp).map(($) => _ei.dictionary_literal($))
}