import * as _et from 'exupery-core-types'

import { Safe_Command_Result } from "./Safe_Command_Result"

export interface Unsafe_Command_Result<E> {

    map_exception<NE>(
        handle_exception: ($: E) => NE
    ): Unsafe_Command_Result<NE>

    catch<NE>(
        handle_exception: ($: E) => Safe_Command_Result
    ): Safe_Command_Result

    then(
        handle: () => Unsafe_Command_Result<E> 
    ): Unsafe_Command_Result<E>
    
    then_dictionary<E2>(
        $: _et.Dictionary<Unsafe_Command_Result<E2>>,
        aggregate_exceptions: ($: _et.Dictionary<E2>) => E,
    ): Unsafe_Command_Result<E>

    __start(
        on_success: () => void,
        on_exception: ($: E) => void
    ): void
}
