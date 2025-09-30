import * as _et from 'exupery-core-types'

import { Safe_Procedure_Context } from "./Safe_Procedure_Context"

export interface Unsafe_Procedure_Context<E> {


    /**
     * 
     * executes a command when an exception has occurred,
     * but stays in the unsafe context
     * 
     * this is useful when you want to do some cleanup
     * or logging in case of an exception,
     * but still want to propagate the exception further
     * 
     * note that this is different from `catch`,
     * which would switch to the safe context
     */
    process_exception<NE>(
        handle: ($i: Safe_Procedure_Context, $: E) => Safe_Procedure_Context,
        map: ($: E) => NE

    ): Unsafe_Procedure_Context<NE>


    throw_exception<E>($: E): Unsafe_Procedure_Context<E>

    catch(
        handle_exception: ($i: Safe_Procedure_Context, $: E) => Safe_Procedure_Context
    ): Safe_Procedure_Context

    execute_unsafe(
        handle: ($i: Unsafe_Procedure_Context<E>) => Unsafe_Procedure_Context<E>
    ): Unsafe_Procedure_Context<E>

    execute(
        handle: ($i: Safe_Procedure_Context) => Safe_Procedure_Context
    ): Unsafe_Procedure_Context<E>

    execute_dictionary_unsafe<E2>(
        $: _et.Dictionary<Unsafe_Procedure_Context<E2>>,
        aggregate_exceptions: ($: _et.Dictionary<E2>) => E,
    ): Unsafe_Procedure_Context<E>
    execute_multiple_unsafe<E2>(
        $: _et.Array<Unsafe_Procedure_Context<E2>>,
        aggregate_exceptions: ($: _et.Array<E2>) => E,
    ): Unsafe_Procedure_Context<E>

    __start(
        on_success: () => void,
        on_exception: ($: E) => void
    ): void
}
