import { Unguaranteed_Procedure } from "./Unguaranteed_Procedure"

export type Guaranteed_Procedure_Initializer<Parameters> = ($: Parameters) => Guaranteed_Procedure

export interface Guaranteed_Procedure {
        __start: (
            on_finished: () => void,
        ) => void
    }