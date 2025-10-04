import { Unguaranteed_Procedure } from "./Unguaranteed_Procedure"

export type Initialize_Guaranteed_Procedure<Params> = ($: Params) => Guaranteed_Procedure

export interface Guaranteed_Procedure {
        __start: (
            on_finished: () => void,
        ) => void
    }