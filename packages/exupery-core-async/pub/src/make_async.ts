import * as pt from "exupery-core-types"

import { run_safe_query } from "./run_safe_query"
import { Safe_Query_Result } from "./Safe_Query_Result"

/**
 * converts a regular value to a {@link Async_Value}
 * @param $ the value
 * @returns 
 */
export function create_safe_query_result<T>(
    $: T
): Safe_Query_Result<T> {
    return run_safe_query(
        {
            'execute': (on_value) => {
                on_value($)
            }
        }
    )
}