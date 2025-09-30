import { Safe_Procedure_Context } from "./Safe_Procedure_Context"
import { Unsafe_Procedure_Context } from "./Unsafe_Procedure_Context"

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
        handle_value: ($i: Safe_Procedure_Context, $: T) => Safe_Procedure_Context
    ): Safe_Procedure_Context
    
    process_unsafe<E>(
        handle_value: ($i: Unsafe_Procedure_Context<E>, $: T) => Unsafe_Procedure_Context<E>
    ): Unsafe_Procedure_Context<E>

    /**
     * This method is only to be used by resources
     */
    __start(
        on_value: ($: T) => void
    ): void
}