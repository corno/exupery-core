import * as _easync from 'exupery-core-async'
import * as _et from 'exupery-core-types'
import { Signature } from "exupery-resources/dist/interface/algorithms/procedures/guaranteed/do_nothing"


export const $$: Signature = (
) => {
    return _easync.__create_guaranted_procedure({
        'execute': (on_success) => {
            on_success()
        }
    })
}