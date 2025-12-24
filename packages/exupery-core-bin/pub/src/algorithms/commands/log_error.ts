import * as _easync from 'exupery-core-async'
import * as _ea from 'exupery-core-alg'
import * as _et from 'exupery-core-types'

//interface
import * as resources from "exupery-resources/dist/interface/resources"

export const $$: resources.commands.log_error = _easync.__create_resource_command((
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