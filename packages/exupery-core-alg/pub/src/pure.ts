import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

export type Key_Value_Pair<T> = {
    'key': string
    'value': T
}

export type Compare_Result =
    | 'left is before right'
    | 'both are equal'
    | 'right is before left'

export type Temp_Pure = {
    'dictionary': {
        'build dictionary of lists': <T>($: ($c: { 'add entry': (key: string, value: T) => void }) => void) => _et.Dictionary<_et.Array<T>>
        'build, overwrite clashing keys': <T>($: ($c: { 'add entry': (key: string, value: T) => void }) => void) => _et.Dictionary<T>
        'build, ignore clashing keys': <T>($: ($c: { 'add entry': (key: string, value: T) => void }) => void) => _et.Dictionary<T>

        'to list': <T>(
            $: _et.Dictionary<T>,
            $c: {
                'compare': (left: string, right: string) => Compare_Result
            }
        ) => _et.Array<Key_Value_Pair<T>>
    }
    'list': {
        'build': <T>($: ($c: {
            'add element': ($: T) => void
            'add list': ($: _et.Array<T>) => void
        }) => void) => _et.Array<T>
    }
    'approximate number': {
    }
    'integer': {}
    'natural': {}
    'text': {
        'build': (
            $: (
                $c: {
                    'add snippet': ($: string) => void
                    'add character': ($: number) => void
                }
            ) => void
        ) => string
    }
}

export const $$: Temp_Pure = {
    'dictionary': {
        'build dictionary of lists': <T>(
            $: (
                $c: { 'add entry': (key: string, value: T) => void }
            ) => void
        ): _et.Dictionary<_et.Array<T>> => {
            const temp: { [key: string]: T[] } = {}
            $({
                'add entry': (key, $) => {
                    if (temp[key] === undefined) {
                        temp[key] = []
                    }
                    temp[key].push($)
                }
            })
            return _ei.dictionary_literal(temp).map(($) => _ei.array_literal($))
        },
        'build, overwrite clashing keys': <T>(
            $: (
                $c: { 'add entry': (key: string, value: T) => void }
            ) => void
        ): _et.Dictionary<T> => {
            const temp: { [key: string]: T } = {}
            $({
                'add entry': (key, $) => {

                    temp[key] = $
                }
            })
            return _ei.dictionary_literal(temp)
        },
        'build, ignore clashing keys': <T>(
            $: (
                $c: { 'add entry': (key: string, value: T) => void }
            ) => void
        ): _et.Dictionary<T> => {
            const temp: { [key: string]: T } = {}
            $({
                'add entry': (key, $) => {
                    if (temp[key] === undefined) {
                        temp[key] = $
                    }
                }
            })
            return _ei.dictionary_literal(temp)
        },
        'to list': <T>(
            $: _et.Dictionary<T>,
            $c: {
                'compare': (left: string, right: string) => Compare_Result
            }
        ): _et.Array<Key_Value_Pair<T>> => {
            const temp: Key_Value_Pair<T>[] = []
            $.map(($, key) => temp.push({
                'key': key,
                'value': $
            }))
            temp.sort((a, b) => {
                const compare_result = $c['compare'](a.key, b.key)
                if (compare_result === 'left is before right') {
                    return -1
                } else if (compare_result === 'right is before left') {
                    return 1
                } else {
                    return 0
                }
            })
            return _ei.array_literal(temp)
        },
    },
    'list': {
        'build': <T>($: ($c: {
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
        },
    },
    'approximate number': {
    },
    'integer': {
    },
    'natural': {
    },
    'text': {
        'build': ($c) => {
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
    },
}