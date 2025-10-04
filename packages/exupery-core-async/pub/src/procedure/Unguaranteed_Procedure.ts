import * as _et from 'exupery-core-types'

import { _Unguaranteed_Query } from "../query/Unguaranteed_Query"
import { _Guaranteed_Query } from "../query/Guaranteed_Query"

import { Initialize_Guaranteed_Procedure, Guaranteed_Procedure } from "./Guaranteed_Procedure"



export type Initialize_Unguaranteed_Procedure<Params, Error> = ($: Params) => Unguaranteed_Procedure<Error>

export interface Unguaranteed_Procedure<Error> {
        __start: (
            on_success: () => void,
            on_error: (error: Error) => void,
        ) => void
    }