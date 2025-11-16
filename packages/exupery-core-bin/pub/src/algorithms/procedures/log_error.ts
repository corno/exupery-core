import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/log_error/data_types/target"
import { Signature } from "exupery-resources/dist/interface/algorithms/procedures/log_error"


export const $$: _et.Command<d.Parameters, null> = _easync.__create_command((
    $p,
) => {
    return _easync.__create_command_promise({
        'execute': (on_success) => {
            $p.lines.__for_each(($) => {
                process.stderr.write($ + `\n`)
            })
            on_success()
        }
    })
})