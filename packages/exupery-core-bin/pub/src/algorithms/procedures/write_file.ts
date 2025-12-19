import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/write_file/data_types/target"
import { Signature } from "exupery-resources/dist/interface/algorithms/procedures/write_file"

import { mkdir as fs_mkdir, writeFile as fs_writeFile } from "fs"

import { dirname as path_dirname } from "path"

import * as t_path_to_text from "exupery-resources/dist/implementation/transformers/path/text"

export const $$: _et.Command<d.Error, d.Parameters> = _easync.__create_resource_command((
    $p,
) => {
    return _easync.__create_command_promise({
        'execute': (on_success, on_error) => {

            fs_mkdir(
                t_path_to_text.Context_Path($p.path.context),
                {
                    'recursive': true
                },
                (err, path) => {
                    if (err) {
                        on_error(_ei.block((): d.Error => {
                            if (err.code === 'EACCES' || err.code === 'EPERM') {
                                return ['permission denied', null]
                            }
                            return _ei.panic(`unhandled fs.writeFile error code: ${err.code}`)
                        }))
                        return
                    }
                    fs_writeFile(
                        t_path_to_text.Node_Path($p.path),
                        $p.data,
                        (err) => {
                            if (err) {
                                on_error(_ei.block((): d.Error => {
                                    if (err.code === 'EACCES' || err.code === 'EPERM') {
                                        return ['permission denied', null]
                                    }
                                    return _ei.panic(`unhandled fs.writeFile error code: ${err.code}`)
                                }))
                            } else {
                                on_success()
                            }
                        }
                    )
                }
            )
        }
    })
})