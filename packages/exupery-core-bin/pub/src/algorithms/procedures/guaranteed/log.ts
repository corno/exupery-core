import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/log/data_types/target"
import { Signature } from "exupery-resources/dist/interface/algorithms/procedures/guaranteed/log"

export const $$: _easync.Guaranteed_Procedure<d.Parameters, null> = (
    $p,
) => {
    return _easync.__create_guaranted_procedure({
        'execute': (on_success) => {
            $p.lines.__for_each(($) => {
                process.stdout.write($ + `\n`)
            })
            on_success()
        }
    })
}