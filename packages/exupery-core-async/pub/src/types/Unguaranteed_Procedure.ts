import * as _et from 'exupery-core-types'

import { _Unguaranteed_Query } from "./Unguaranteed_Query"
import { _Guaranteed_Query } from "./Guaranteed_Query"

export type Unguaranteed_Procedure_Initializer<Parameters, Error> = ($: Parameters) => Unguaranteed_Procedure<Error>

export interface Unguaranteed_Procedure<Error> {
        __start: (
            on_success: () => void,
            on_error: (error: Error) => void,
        ) => void
    }