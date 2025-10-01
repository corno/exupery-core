import * as _et from 'exupery-core-types'

import { Guaranteed_Procedure_Context } from "./Guaranteed_Procedure_Context"
import { Unguaranteed_Query_Result } from './Unguaranteed_Query_Result'

export interface Unguaranteed_Procedure_Context<E> {


    /**
     * 
     * executes a command when an exception has occurred,
     * but stays in the ungaranteed context
     * 
     * this is useful when you want to do some cleanup
     * or logging in case of an exception,
     * but still want to propagate the exception further
     * 
     * note that this is different from `catch`,
     * which would switch to the guaranteed context
     */
    process_exception_deprecated<NE>(
        handle: ($i: Guaranteed_Procedure_Context, $: E) => Guaranteed_Procedure_Context,
        map: ($: E) => NE

    ): Unguaranteed_Procedure_Context<NE>


    process_unguaranteed_data<T, NE>(
        get_data: () => Unguaranteed_Query_Result<T, NE>,
        handle_exception: ($i: Guaranteed_Procedure_Context, $: NE) => Guaranteed_Procedure_Context,
        map_exception: ($: NE) => E,
        handle_data: ($i: Unguaranteed_Procedure_Context<E>, $: T) => Unguaranteed_Procedure_Context<E>,
    ): Unguaranteed_Procedure_Context<E>

    throw_exception<E>(
        $: E
    ): Unguaranteed_Procedure_Context<E>

    catch(
        handle_exception: ($i: Guaranteed_Procedure_Context, $: E) => Guaranteed_Procedure_Context
    ): Guaranteed_Procedure_Context

    execute_unguaranteed(
        executer: ($i: Unguaranteed_Procedure_Context<E>) => Unguaranteed_Procedure_Context<E>,
    ): Unguaranteed_Procedure_Context<E>

    execute_foreign<NE>(
        executer: ($i: Unguaranteed_Procedure_Context<NE>) => Unguaranteed_Procedure_Context<NE>,
        handle_exception: ($i: Guaranteed_Procedure_Context, $: NE) => Guaranteed_Procedure_Context,
        map: ($: NE) => E
    ): Unguaranteed_Procedure_Context<E>

    execute(
        executer: ($i: Guaranteed_Procedure_Context) => Guaranteed_Procedure_Context
    ): Unguaranteed_Procedure_Context<E>

    execute_dictionary_unguaranteed<E2>(
        $: _et.Dictionary<Unguaranteed_Procedure_Context<E2>>,
        aggregate_exceptions: ($: _et.Dictionary<E2>) => E,
    ): Unguaranteed_Procedure_Context<E>

    execute_multiple_unguaranteed<E2>(
        $: _et.Array<Unguaranteed_Procedure_Context<E2>>,
        aggregate_exceptions: ($: _et.Array<E2>) => E,
    ): Unguaranteed_Procedure_Context<E>

    __start(
        on_success: () => void,
        on_exception: ($: E) => void
    ): void
}
