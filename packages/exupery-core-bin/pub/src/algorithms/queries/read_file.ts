import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

//interface
import * as resources from "exupery-resources/dist/interface/resources"

//data types
import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/read_file/data_types/target"

//dependencies
import * as s_path from "exupery-resources/dist/implementation/serializers/schemas/path"
import { readFile as fs_readFile } from "fs"

export const $$: resources.queries.read_file = _easync.__create_query((
    $p
) => {
    return _ei.__create_query_result((on_value, on_error) => {
        fs_readFile(
            s_path.Node_Path($p),
            { 'encoding': 'utf-8' },
            (err, data) => {
                if (err) {
                    on_error(_ei.block((): d.Error => {
                        if (err.code === 'ENOENT') {
                            return ['file does not exist', null]
                        }
                        if (err.code === 'EACCES' || err.code === 'EPERM') {
                            return ['permission denied', null]
                        }
                        if (err.code === 'EISDIR' || err.code === 'ENOTDIR') {
                            return ['node is not a file', null]
                        }
                        if (err.code === 'EFBIG') {
                            return ['file too large', null]
                        }
                        if (err.code === 'EIO' || err.code === 'ENXIO') {
                            return ['device not ready', null]
                        }
                        return _ei.panic(`unhandled fs.readFile error code: ${err.code}`)
                    }))
                } else {
                    on_value(data)
                }
            }
        )
    })
})