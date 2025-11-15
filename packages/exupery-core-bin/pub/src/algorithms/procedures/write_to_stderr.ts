import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/write_to_stderr/data_types/target"
import { Signature } from "exupery-resources/dist/interface/algorithms/procedures/guaranteed/log"

export const $$: _et.Procedure_Primed_With_Resources<d.Parameters, null> = _easync.create_procedure_primed_with_resources_a( (
    $p,
) => {
    return _easync.__create_procedure_promise({
        'execute': (on_success) => {
            process.stderr.write($p)
            on_success()
        }
    })
})