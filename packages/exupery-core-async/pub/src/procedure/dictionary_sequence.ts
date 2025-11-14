import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'
import { __create_procedure_promise } from '../algorithms/procedure/create_procedure_promise'

const op_dictionary_to_list_based_on_insertion_order = <T>(
    dict: _et.Dictionary<T>,
): _et.Array<{ key: string, value: T }> => {
    const temp: { key: string, value: T }[] = []
    dict.map(($, key) => {
        temp.push({ key, value: $ })
    })
    return _ei.array_literal(temp)
}

export type Sequence_Error<Err> = {
    'error': Err
    'step': string
}

export const dictionary_sequence = <Err>(
    steps: _et.Dictionary<_et.Procedure_Promise<Err>>,
): _et.Procedure_Promise<Sequence_Error<Err>> => {
    return __create_procedure_promise({
        'execute': (on_success, on_exception) => {
            const as_list = op_dictionary_to_list_based_on_insertion_order(steps)

            let current = 0

            const do_next = () => {
                as_list.__get_element_at(current).transform(
                    ($) => {
                        const key = $.key
                        current += 1
                        $.value.__start(
                            () => {
                                do_next()
                            },
                            ($) => {
                                on_exception({
                                    'error': $,
                                    'step': key,
                                })
                            }
                        )
                    },
                    () => {
                        on_success()
                    }
                )
            }
            do_next()
        }
    })
}