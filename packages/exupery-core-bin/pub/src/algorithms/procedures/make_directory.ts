import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import { mkdir as fs_mkdir } from "fs"

import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/make_directory/data_types/target"
import { Signature } from "exupery-resources/dist/interface/algorithms/procedures/make_directory"


export const $$: _et.Command<d.Parameters, d.Error> = _easync.__create_procedure_primed_with_resources((
    $p,
) => {
    const __possibly_escape_filename = (path: string, escape: boolean): string => {
        if (escape) {
            return path.replace(/ /g, '_')
        }
        return path
    }
    return _easync.__create_command_promise({
        'execute': (on_success, on_error) => {
            fs_mkdir(
                __possibly_escape_filename($p.path, $p['escape spaces in path']),
                {
                    'recursive': true,
                },
                (err, path) => {
                    if (err) {
                        on_error(_ei.block((): d.Error => {
                            if (err.code === 'EEXIST') {
                                return ['directory already exists', null]
                            }
                            return _ei.panic(`unhandled fs.mkdir error code: ${err.code}`)
                        }))
                    } else {
                        on_success()
                    }
                }
            )
        }
    })
})