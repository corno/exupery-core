import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import { mkdir as fs_mkdir, writeFile as fs_writeFile} from "fs"

import { dirname as path_dirname} from "path"

import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/write_file/data_types/target"
import { Signature } from "exupery-resources/dist/interface/algorithms/procedures/unguaranteed/write_file"


export const $$: _et.Procedure_Primed_With_Resources<d.Parameters, d.Error> = (
    $p,
) => {
    const __possibly_escape_filename = (path: string, escape: boolean): string => {
        if (escape) {
            return path.replace(/ /g, '_')
        }
        return path
    }
    return _easync.__create_unguaranteed_procedure({
        'execute': (on_success, on_exception) => {

            const fname = __possibly_escape_filename($p.path.path, $p.path['escape spaces in path'])
            fs_mkdir(
                path_dirname(fname),
                {
                    'recursive': true
                },
                (err, path) => {
                    if (err) {
                        on_exception(_ei.block((): d.Error => {
                            if (err.code === 'EACCES' || err.code === 'EPERM') {
                                return ['permission denied', null]
                            }
                            return _ei.panic(`unhandled fs.writeFile error code: ${err.code}`)
                        }))
                        return
                    }
                    fs_writeFile(fname, $p.data, (err) => {
                        if (err) {
                            on_exception(_ei.block((): d.Error => {
                                if (err.code === 'EACCES' || err.code === 'EPERM') {
                                    return ['permission denied', null]
                                }
                                return _ei.panic(`unhandled fs.writeFile error code: ${err.code}`)
                            }))
                        } else {
                            on_success()
                        }
                    })
                }
            )
        }
    })
}