import { Unsafe_Procedure_Context } from "./Unsafe_Procedure_Context"


export interface Safe_Procedure_Context {
    execute(
        handle: ($i: Safe_Procedure_Context) => Safe_Procedure_Context
    ): Safe_Procedure_Context

    __start(
        on_finished: () => void,
    ): void
}
