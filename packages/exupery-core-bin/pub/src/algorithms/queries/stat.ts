import * as _easync from 'exupery-core-async'
import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

//interface
import * as resources from "exupery-resources/dist/interface/resources"

//data types
import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/stat/data_types/target"

//dependencies
import { stat as fs_stat } from "fs"
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"

export const $$: resources.queries.stat = _easync.__create_query((
    $p
) => {
    return _ei.__create_query_result((on_value, on_error) => {
        fs_stat(
                s_path.Node_Path($p),
            (err, stats) => {
                if (err) {
                    on_error(_ei.block((): d.Error => {
                        if (err.code === 'ENOENT') {
                            return ['node does not exist', null]
                        }
                        return _ei.panic(`unhandled fs.stat error code: ${err.code}`)
                    }))
                }
                on_value(stats.isFile()
                    ? ['file', null]
                    : ['directory', null]
                )
            }
        )
    })
})