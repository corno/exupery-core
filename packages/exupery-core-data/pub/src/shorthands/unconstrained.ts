import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

export type Raw_Or_Normal_Dictionary<T> = { [key: string]: T } | _et.Dictionary<T>
export type Raw_Or_Normal_List<T> = T[] | _et.List<T>
export type Raw_Dictionary<T> = { [key: string]: T }

export const to_raw_array = <T>($: _et.List<T>): readonly T[] => $.__get_raw_copy()


export type Dictionary<T_D> = _et.Dictionary<T_D>

export type List<T_L> = _et.List<T_L>


export const wrap_dictionary = <T>($: Raw_Or_Normal_Dictionary<T>): Dictionary<T> => {
    function is_normal($: Raw_Or_Normal_Dictionary<T>): $ is _et.Dictionary<T> {
        return $.__get_number_of_entries !== undefined && typeof $.__get_number_of_entries === "function"
    }
    if (is_normal($)) {
        return $
    } else {
        return _ei.dictionary_literal($)
    }
}

export const wrap_list = <T>($: Raw_Or_Normal_List<T>): List<T> => {
    if ($ instanceof Array) {
        return _ei.list_literal($)
    }
    if (!($.__for_each instanceof Function)) {
        throw new Error("invalid input in 'wrap_list'")
    }
    return $
}

export const wrap_state_group = <T>($: T) => {
    return $
}