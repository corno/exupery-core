import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

//interface
import * as resources from "exupery-resources/dist/interface/resources"

//data types
import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/remove/data_types/target"

//dependencies
import { rm as fs_rm } from "fs"
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"


export const $$: resources.commands.remove = _easync.__create_resource_command((
    $p,
) => {
    return _easync.__create_command_promise({
        'execute': (on_success, on_error) => {
            fs_rm(
                s_path.Node_Path($p.path),
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