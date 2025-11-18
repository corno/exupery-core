import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as pt from 'exupery-core-types'

import { Source_Location, get_location_info } from "../get_location_info"

const depth = 1

export type Raw_Or_Normal_Dictionary<T> = { [key: string]: T } | pt.Dictionary<T>
export type Raw_Or_Normal_Array<T> = T[] | pt.Array<T>
export type Raw_Dictionary<T> = { [key: string]: T }

export type Reference_To_Normal_Dictionary_Entry<G_Source, T_Dictionary_Entry> = {
    readonly 'key': string
    readonly 'location': G_Source
}

export type Reference_To_Stacked_Dictionary_Entry<G_Source, T_Dictionary_Entry> = {
    readonly 'key': string
    readonly 'location': G_Source
}

export const to_raw_array = <T>($: pt.Array<T>): readonly T[] => $.__get_raw_copy()


export type Dictionary<G_Source, T_D> = {
    readonly 'dictionary': _et.Dictionary<{
        readonly 'entry': T_D
        readonly 'location': G_Source
    }>
    readonly 'location': G_Source
}

export type List<G_Source, T_L> = {
    readonly 'list': _et.List<{
        readonly 'element': T_L
        readonly 'location': G_Source
    }>
    readonly 'location': G_Source
}


export const wrap_dictionary = <T>(
    $: Raw_Or_Normal_Dictionary<T>,
): Dictionary<Source_Location, T> => {
    const location = get_location_info(depth + 1)
    function is_normal($: Raw_Or_Normal_Dictionary<T>): $ is pt.Dictionary<T> {
        return $.__get_number_of_entries !== undefined && typeof $.__get_number_of_entries === "function"
    }
    if (is_normal($)) {
        return {
            'location': location,
            'dictionary': $.map(($) => ({
                'location': location,
                'entry': $,
            }))
        }
    } else {
        return {
            'location': location,
            'dictionary': _ei.dictionary_literal($).map(($) => ({
                'location': location,
                'entry': $,
            }))
        }
    }
}

export const wrap_list = <T>(
    $: Raw_Or_Normal_Array<T>,
): List<Source_Location, T> => {
    const location = get_location_info(depth + 1)
    const decorated: _et.List<T> = $ instanceof Array
        ? _ei.list_literal($)
        : $

    if (!(decorated.__for_each instanceof Function)) {
        throw new Error("invalid input in 'wrap_list'")
    }
    return {
        'location': location,
        'list': decorated.map(($) => ({
            'location': location,
            'element': $,
        }))
    }
}

export const wrap_state_group = <T>(
    $: T,
) => {
    return {
        'location': get_location_info(depth + 1),
        'state group': $,
    }
}

export const wrap_reference = <T>(
    $: string,
): Reference_To_Normal_Dictionary_Entry<Source_Location, T> => {
    return {
        'location': get_location_info(depth + 1),
        'key': $,
    }
}

export const wrap_stack_reference = <T>(
    name: string,
): Reference_To_Stacked_Dictionary_Entry<Source_Location, T> => {
    return {
        'location': get_location_info(depth + 1),
        'key': name,
    }
}