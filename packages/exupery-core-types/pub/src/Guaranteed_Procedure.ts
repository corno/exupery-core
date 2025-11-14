import { Unguaranteed_Procedure_Promise } from "./Unguaranteed_Procedure"

export type Guaranteed_Procedure<Parameters, Resources> = ($: Parameters, $r: Resources) => Guaranteed_Procedure_Promise

export type Guaranteed_Procedure_Promise = {
    __start: (
        on_finished: () => void,
    ) => void
}