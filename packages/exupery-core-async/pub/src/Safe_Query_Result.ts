import { Safe_Command_Result } from "./Safe_Command_Result"
import { Unsafe_Command_Result } from "./Unsafe_Command_Result"

/**
 * A value that will asynchronously become available.
 * Similar to the concept of a promise, but with a smaller API.
 */
export interface Safe_Query_Result<T> {

    map<NT>(
        handle_value: ($: T) => NT
    ): Safe_Query_Result<NT>

    /**
     * maps the current async value into a new async value
     * @param handle_value callback that transforms the actual value into a new Async_Value
     */
    then<NT>(
        handle_value: ($: T) => Safe_Query_Result<NT>
    ): Safe_Query_Result<NT>

    process_safe(
        handle_value: ($: T, init: Safe_Command_Result) => Safe_Command_Result
    ): Safe_Command_Result
    
    process_unsafe<E>(
        handle_value: ($: T, init: Unsafe_Command_Result<E>) => Unsafe_Command_Result<E>
    ): Unsafe_Command_Result<E>

    /**
     * This method is only to be used by resources
     */
    __start(
        on_value: ($: T) => void
    ): void
}