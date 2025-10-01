import * as _et from "exupery-core-types"

import { Guaranteed_Procedure_Context } from "./Guaranteed_Procedure_Context"
import { Guaranteed_Query_Result } from "./Guaranteed_Query_Result"
import { Unguaranteed_Procedure_Context } from "./Unguaranteed_Procedure_Context"

export interface Unguaranteed_Query_Result<T, E> {
    map<NT>(
        handle_value: ($: T) => NT
    ): Unguaranteed_Query_Result<NT, E>

    map_exception<NE>(
        handle_exception: ($: E) => NE
    ): Unguaranteed_Query_Result<T, NE>

    then_<NT>(
        handle_value: ($: T) => Guaranteed_Query_Result<NT>
    ): Unguaranteed_Query_Result<NT, E>
    
    then_unguaranteed<NT>(
        handle_value: ($: T) => Unguaranteed_Query_Result<NT, E>
    ): Unguaranteed_Query_Result<NT, E>

    catch(
        handle_exception: ($: E) => Guaranteed_Query_Result<T>
    ): Guaranteed_Query_Result<T>

    /**
     * processes the queried data by executing a command.
     * 
     * if the result on which this method is called is in an exception state, the command will not be executed.
     * instead, the 2 other handlers will be called.
     * first, the exception handler will be called, to report the exception.
     * secondly, the exception will be mapped into a new exception value that has the same type as the command's exception type.
     * 
     * @param handle_value the handler that will be called to process the queried data, if no exception has occurred
     * @param handle_exception the handler that will process an exception if the query is in an exception state to allow reporting the exception
     * @param map_exception the handler that will map the exception of the query into a new exception value of the command's exception type
     * 
     */
    process<NE>(
        handle_exception: ($i: Guaranteed_Procedure_Context, $: E) => Guaranteed_Procedure_Context,
        map_exception: ($: E) => NE,
        handle_value: ($i: Unguaranteed_Procedure_Context<NE>, $: T) => Unguaranteed_Procedure_Context<NE>,
    ): Unguaranteed_Procedure_Context<NE>

    __start(
        on_value: ($: T) => void,
        on_exception: ($: E) => void
    ): void
}
