import * as _et from "exupery-core-types"

import { _Guaranteed_Query } from "./Guaranteed_Query"

export interface _Unguaranteed_Query<T, E> {
    map_<NT>(
        handle_value: ($: T) => NT
    ): _Unguaranteed_Query<NT, E>

    map_exception_<NE>(
        handle_exception: ($: E) => NE
    ): _Unguaranteed_Query<T, NE>

    then<NT>(
        handle_value: ($: T) => _Guaranteed_Query<NT>
    ): _Unguaranteed_Query<NT, E>
    
    then_unguaranteed<NT>(
        handle_value: ($: T) => _Unguaranteed_Query<NT, E>
    ): _Unguaranteed_Query<NT, E>

    catch_(
        handle_exception: ($: E) => _Guaranteed_Query<T>
    ): _Guaranteed_Query<T>

    __start(
        on_value: ($: T) => void,
        on_exception: ($: E) => void
    ): void
}

export type Unguaranteed_Query_Initializer<Parameters, Result, Error> = ($: Parameters) => _Unguaranteed_Query<Result, Error>


export namespace Unguaranteed {

    export type Query<Result, Error> = {
        __start: (
            on_success: (result: Result) => void,
            on_error: (error: Error) => void,
        ) => void
    }

}
