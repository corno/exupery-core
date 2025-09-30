import * as _et from 'exupery-core-types'

import { Guaranteed_Procedure_Context } from "./Guaranteed_Procedure_Context"

export interface Ungaranteed_Procedure_Context<E> {


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

    ): Ungaranteed_Procedure_Context<NE>

    throw_exception<E>(
        $: E
    ): Ungaranteed_Procedure_Context<E>

    catch(
        handle_exception: ($i: Guaranteed_Procedure_Context, $: E) => Guaranteed_Procedure_Context
    ): Guaranteed_Procedure_Context

    execute_unguaranteed(
        handle: ($i: Ungaranteed_Procedure_Context<E>) => Ungaranteed_Procedure_Context<E>
    ): Ungaranteed_Procedure_Context<E>

    execute(
        handle: ($i: Guaranteed_Procedure_Context) => Guaranteed_Procedure_Context
    ): Ungaranteed_Procedure_Context<E>

    execute_dictionary_unguaranteed<E2>(
        $: _et.Dictionary<Ungaranteed_Procedure_Context<E2>>,
        aggregate_exceptions: ($: _et.Dictionary<E2>) => E,
    ): Ungaranteed_Procedure_Context<E>

    execute_multiple_unguaranteed<E2>(
        $: _et.Array<Ungaranteed_Procedure_Context<E2>>,
        aggregate_exceptions: ($: _et.Array<E2>) => E,
    ): Ungaranteed_Procedure_Context<E>

    __start(
        on_success: () => void,
        on_exception: ($: E) => void
    ): void
}
