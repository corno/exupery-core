import { Unguaranteed_Procedure_Context } from "./Unguaranteed_Procedure_Context"

export type Guaranteed_Action<Params> = ($: Params) => Guaranteed_Procedure_Context

export interface Guaranteed_Procedure_Context {
    execute<Params>(
        get_action: () => Guaranteed_Action<Params>,
        get_parameters: () => Params
    ): Guaranteed_Procedure_Context

    __start(
        on_finished: () => void,
    ): void
}
