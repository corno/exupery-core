import { Ungaranteed_Procedure_Context } from "./Unguaranteed_Procedure_Context"


export interface Guaranteed_Procedure_Context {
    execute(
        handle: ($i: Guaranteed_Procedure_Context) => Guaranteed_Procedure_Context
    ): Guaranteed_Procedure_Context

    __start(
        on_finished: () => void,
    ): void
}
