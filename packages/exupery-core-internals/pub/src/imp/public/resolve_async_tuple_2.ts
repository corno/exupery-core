
import * as pt from 'exupery-core-types'
import { create_Async_Value } from './create_Async_Value';

export type Sync_Tuple_2<T1, T2> = {
    readonly 'first': T1
    readonly 'second': T2
};

export function resolve_async_tuple_2<T1, T2>(
    first: pt.Async_Value<T1>,
    second: pt.Async_Value<T2>,
): pt.Async_Value<Sync_Tuple_2<T1, T2>> {
    return create_Async_Value(
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