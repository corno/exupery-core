import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'
import * as pt from 'exupery-core-types'

export type Raw_Or_Normal_Dictionary<T> = { [key: string]: T } | pt.Dictionary<T>
export type Raw_Dictionary<T> = { [key: string]: T }

export const to_raw_array = <T>($: pt.Array<T>): readonly T[] => $.__get_raw_copy()


export type Dictionary<T_D> = _et.Dictionary<T_D>

export type List<T_L> = _et.Array<T_L>


export const wrap_dictionary = <T>($: Raw_Or_Normal_Dictionary<T>): Dictionary<T> => {
    function is_normal($: Raw_Or_Normal_Dictionary<T>): $ is pt.Dictionary<T> {
        return $.to_array !== undefined && typeof $.to_array === "function"
    }
    if (is_normal($)) {
        return $
    } else {
        return _ei.dictionary_literal($)
    }
}

export const wrap_list = <T>($: T[]): List<T> => {
    return _ei.array_literal($)
}

export const wrap_state_group = <T>($: T) => {
    return $
}