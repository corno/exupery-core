import * as _et from 'exupery-core-types'

import { Safe_Command_Result } from "./Safe_Command_Result"

export interface Unsafe_Command_Result<E> {


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
        handle: ($: E) => Safe_Command_Result,
        map: ($: E) => NE

    ): Unsafe_Command_Result<NE>

    catch(
        handle_exception: ($: E) => Safe_Command_Result
    ): Safe_Command_Result

    then(
        handle: () => Unsafe_Command_Result<E>
    ): Unsafe_Command_Result<E>

    then_dictionary<E2>(
        $: _et.Dictionary<Unsafe_Command_Result<E2>>,
        aggregate_exceptions: ($: _et.Dictionary<E2>) => E,
    ): Unsafe_Command_Result<E>
    then_multiple<E2>(
        $: _et.Array<Unsafe_Command_Result<E2>>,
        aggregate_exceptions: ($: _et.Array<E2>) => E,
    ): Unsafe_Command_Result<E>

    __start(
        on_success: () => void,
        on_exception: ($: E) => void
    ): void
}
