import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/write_to_stdout/data_types/target"
import { Signature } from "exupery-resources/dist/interface/algorithms/procedures/log"

export const $$: _et.Command<d.Parameters, null> = _easync.__create_procedure_primed_with_resources((
    $p,
) => {
    return _easync.__create_command_promise({
        'execute': (on_success) => {
            process.stdout.write($p)
            on_success()
        }
    })
})