import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

//interface
import * as resources from "exupery-resources/dist/interface/resources"

//data types
import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/write_file/data_types/target"

//dependencies
import { mkdir as fs_mkdir, writeFile as fs_writeFile } from "fs"
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"

export const $$: resources.commands.write_file = _easync.__create_resource_command((
    $p,
) => {
    return _easync.__create_command_promise({
        'execute': (on_success, on_error) => {

            fs_mkdir(
                s_path.Context_Path($p.path.context),
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
                        s_path.Node_Path($p.path),
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