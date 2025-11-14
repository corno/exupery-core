import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import { readFile as fs_readFile } from "fs"

import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/read_file/data_types/target"
import { Signature } from "exupery-resources/dist/interface/algorithms/queries/unguaranteed/read_file"


export const $$: _et.Query_Primed_With_Resources<d.Parameters, d.Result, d.Error> = (
    $p
) => {
    const __possibly_escape_filename = (path: string, escape: boolean): string => {
        if (escape) {
            return path.replace(/ /g, '_')
        }
        return path
    }
    return _easync.__create_query_promise({
        'execute': (on_value, on_exception) => {
            fs_readFile(__possibly_escape_filename($p.path, $p['escape spaces in path']), { 'encoding': 'utf-8' }, (err, data) => {
                if (err) {
                    on_exception(_ei.block((): d.Error => {
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
            })
        }
    })
}