
import * as pt from 'exupery-core-types'

import { __run_safe_query } from "./run_safe_query"
import { Safe_Query_Result } from "./Safe_Query_Result"

export type Sync_Tuple_2<T1, T2> = {
    readonly 'first': T1
    readonly 'second': T2
};

export function merge_2_safe_query_results<T1, T2>(
    first: Safe_Query_Result<T1>,
    second: Safe_Query_Result<T2>,
): Safe_Query_Result<Sync_Tuple_2<T1, T2>> {
    return __run_safe_query(
        {
            'execute': (on_value) => {
                let element_1_is_set = false
                let element_2_is_set = false

                let elem1: T1
                let elem2: T2

                function wrap_up() {
                    if (element_1_is_set && element_2_is_set) {
                        on_value({ first: elem1, second: elem2 })
                    }
                }
                first.__start((val) => {
                    elem1 = val
                    element_1_is_set = true
                    wrap_up()
                })
                second.__start((val) => {
                    elem2 = val
                    element_2_is_set = true
                    wrap_up()
                })
            }
        }
    )
}