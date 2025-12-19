import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/copy/data_types/target"
import { Signature } from "exupery-resources/dist/interface/algorithms/procedures/copy"

import { cp as fs_cp } from "fs"
import * as t_path_to_text from "exupery-resources/dist/implementation/transformers/path/text"

export const $$: _et.Command<d.Error, d.Parameters> = _easync.__create_resource_command((
    $p,
) => {
    return _easync.__create_command_promise({
        'execute': (on_success, on_error) => {
            const options: any = {}
            $p.options.recursive.map(($) => { options.recursive = $ })
            $p.options.force.map(($) => { options.force = $ })
            $p.options.errorOnExist.map(($) => { options.errorOnExist = $ })

            fs_cp(
                t_path_to_text.Node_Path($p.source),
                t_path_to_text.Node_Path($p.target),
                options,
                (err) => {
                    if (err) {
                        on_error(_ei.block((): d.Error => {
                            if (err.code === 'ENOENT') {
                                return ['source does not exist', null]
                            }
                            if (err.code === 'EACCES' || err.code === 'EPERM') {
                                return ['permission denied', null]
                            }
                            if (err.code === 'EISDIR' || err.code === 'ERR_FS_EISDIR') {
                                return ['node is not a file', null]
                            }
                            if (err.code === 'EFBIG') {
                                return ['file too large', null]
                            }
                            if (err.code === 'EIO' || err.code === 'ENXIO') {
                                return ['device not ready', null]
                            }
                            return _ei.panic(`unhandled fs.cp error code: ${err.code}`)
                        }))
                    } else {
                        on_success()
                    }
                }
            )
        }
    })
})