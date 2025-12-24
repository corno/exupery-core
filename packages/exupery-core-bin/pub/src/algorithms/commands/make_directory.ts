import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

//interface
import * as resources from "exupery-resources/dist/interface/resources"

//data types
import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/make_directory/data_types/target"

//dependencies
import { mkdir as fs_mkdir } from "fs"
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"

export const $$: resources.commands.make_directory = _easync.__create_resource_command((
    $p,
) => {
    return _easync.__create_command_promise({
        'execute': (on_success, on_error) => {
            fs_mkdir(
                s_path.Node_Path($p),
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