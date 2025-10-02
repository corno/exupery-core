import * as _et from "exupery-core-types"

import { Guaranteed_Procedure_Context } from "./Guaranteed_Procedure_Context"
import { Guaranteed_Query_Result } from "./Guaranteed_Query_Result"
import { Unguaranteed_Procedure_Context } from "./Unguaranteed_Procedure_Context"

export interface Unguaranteed_Query_Result<T, E> {
    map_<NT>(
        handle_value: ($: T) => NT
    ): Unguaranteed_Query_Result<NT, E>

    map_exception_<NE>(
        handle_exception: ($: E) => NE
    ): Unguaranteed_Query_Result<T, NE>

    then<NT>(
        handle_value: ($: T) => Guaranteed_Query_Result<NT>
    ): Unguaranteed_Query_Result<NT, E>
    
    then_unguaranteed<NT>(
        handle_value: ($: T) => Unguaranteed_Query_Result<NT, E>
    ): Unguaranteed_Query_Result<NT, E>

    catch_(
        handle_exception: ($: E) => Guaranteed_Query_Result<T>
    ): Guaranteed_Query_Result<T>

    __start(
        on_value: ($: T) => void,
        on_exception: ($: E) => void
    ): void
}
