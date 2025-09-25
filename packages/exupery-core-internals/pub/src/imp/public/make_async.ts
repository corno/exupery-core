import * as pt from "exupery-core-types"

import { Async_Value } from "exupery-core-types"
import { cast_to_async_value_imp } from "./cast_to_async_value_imp"

/**
 * converts a regular value to a {@link Async_Value}
 * @param $ the value
 * @returns 
 */
export function make_async<T>(
    $: T
): pt.Async_Value<T> {
    return cast_to_async_value_imp(
        {
            'execute': (on_value) => {
                on_value($)
            }
        }
    )
}