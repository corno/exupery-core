import * as _et from 'exupery-core-types'

import { Unguaranteed_Query_Promise } from "./Unguaranteed_Query"
import { Guaranteed_Query_Promise } from "./Guaranteed_Query"

export type Unguaranteed_Procedure_Initializer<Parameters, Resources, Error> = ($: Parameters, $r: Resources) => Unguaranteed_Procedure_Promise<Error>

export interface Unguaranteed_Procedure_Promise<Error> {
        __start: (
            on_success: () => void,
            on_error: (error: Error) => void,
        ) => void
    }