import * as pt from "exupery-core-types"

import { Async_Value } from "exupery-core-types"
import { create_Async_Value } from "./create_Async_Value"

/**
 * converts a regular value to a {@link Async_Value}
 * @param $ the value
 * @returns 
 */
export function make_async<T>(
    $: T
): pt.Async_Value<T> {
    return create_Async_Value(
        {
            'execute': (on_value) => {
                on_value($)
            }
        }
    )
}