import { Guaranteed_Procedure_Context } from "./Guaranteed_Procedure_Context"
import { Ungaranteed_Procedure_Context } from "./Unguaranteed_Procedure_Context"

/**
 * A value that will asynchronously become available.
 * Similar to the concept of a promise, but with a smaller API.
 */
export interface Guaranteed_Query_Result<T> {

    map<NT>(
        handle_value: ($: T) => NT
    ): Guaranteed_Query_Result<NT>

    /**
     * maps the current async value into a new async value
     * @param handle_value callback that transforms the actual value into a new Async_Value
     */
    then<NT>(
        handle_value: ($: T) => Guaranteed_Query_Result<NT>
    ): Guaranteed_Query_Result<NT>

    process_guaranteed(
        handle_value: ($i: Guaranteed_Procedure_Context, $: T) => Guaranteed_Procedure_Context
    ): Guaranteed_Procedure_Context
    
    process_unguaranteed<E>(
        handle_value: ($i: Ungaranteed_Procedure_Context<E>, $: T) => Ungaranteed_Procedure_Context<E>
    ): Ungaranteed_Procedure_Context<E>

    /**
     * This method is only to be used by resources
     */
    __start(
        on_value: ($: T) => void
    ): void
}