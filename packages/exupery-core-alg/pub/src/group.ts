import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

export type Key_Value_Pair<T> = {
    'key': string,
    'value': T,
}

export const group_list = <T>(
    list: _et.List<Key_Value_Pair<T>>,
): _et.Dictionary<_et.List<T>> => {
    const temp: { [key: string]: T[] } = {}
    list.__for_each(($) => {
        if (temp[$.key] === undefined) {
            temp[$.key] = []
        }
        temp[$.key].push($.value)
    })
    return _ei.dictionary_literal(temp).map(($) => _ei.list_literal($))
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