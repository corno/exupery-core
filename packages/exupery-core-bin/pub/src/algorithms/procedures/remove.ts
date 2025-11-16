import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import { rm as fs_rm } from "fs"

import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/remove/data_types/target"
import { Signature } from "exupery-resources/dist/interface/algorithms/procedures/remove"


export const $$: _et.Command<d.Parameters, d.Error> = _easync.__create_procedure_primed_with_resources( (
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
            fs_rm(
                __possibly_escape_filename($p.path.path, $p.path['escape spaces in path']),
                {
                    'recursive': true,
                },
                (err) => {

                    if (err) {
                        if (err.code === 'ENOENT' && !$p['error if not exists']) {
                            on_success()
                        } else {
                            on_error(_ei.block((): d.Error => {
                                if (err.code === 'ENOENT') {
                                    return ['node does not exist', null]
                                }
                                if (err.code === 'EACCES' || err.code === 'EPERM') {
                                    return ['permission denied', null]
                                }
                                // if (err.code === 'EISDIR' || err.code === 'ENOTDIR') {
                                //     return ['node is not a directory', null]
                                // }
                                // if (err.code === 'ERR_FS_EISDIR') {
                                //     return ['node is a directory', null]
                                // }
                                return _ei.panic(`unhandled fs.rm error code: ${err.code}`)
                            }))
                        }
                    } else {
                        on_success()
                    }
                }
            )
        }
    })
})