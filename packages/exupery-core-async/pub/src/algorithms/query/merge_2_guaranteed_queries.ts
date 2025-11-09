
import * as pt from 'exupery-core-types'

import { __create_guaranteed_query } from "./create_guaranteed_query"
import { Guaranteed_Query_Promise } from "../../types/Guaranteed_Query"

export type Sync_Tuple_2<T1, T2> = {
    readonly 'first': T1
    readonly 'second': T2
};

export function merge_2_unguaranteed_queries<T1, T2>(
    first: Guaranteed_Query_Promise<T1>,
    second: Guaranteed_Query_Promise<T2>,
): Guaranteed_Query_Promise<Sync_Tuple_2<T1, T2>> {
    return __create_guaranteed_query(
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