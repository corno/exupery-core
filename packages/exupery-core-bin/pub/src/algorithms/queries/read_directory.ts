import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import { readdir as fs_readdir } from "fs"

import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/read_directory/data_types/target"
import { Signature } from "exupery-resources/dist/interface/algorithms/queries/read_directory"


export const $$: _et.Query<d.Parameters, d.Result, d.Error> = _easync.__create_query_primed_with_resources((
    $p
) => {
    const __possibly_escape_filename = (path: string, escape: boolean): string => {
        if (escape) {
            return path.replace(/ /g, '_')
        }
        return path
    }
    return _easync.__create_query_promise({
        'execute': (on_value, on_error) => {
            fs_readdir(__possibly_escape_filename($p.path.path, $p.path['escape spaces in path']), {
                'encoding': 'utf-8',
                'withFileTypes': true,
            }, (err, files) => {
                if (err) {
                    on_error(_ei.block((): d.Error => {
                        if (err.code === 'ENOENT') {
                            return ['directory does not exist', null]
                        }
                        if (err.code === 'ENOTDIR' || err.code === 'EISDIR') {
                            return ['node is not a directory', null]
                        }
                        return _ei.panic(`unhandled fs.readdir error code: ${err.code}`)
                    }))
                } else {
                    const out: { [key: string]: d.Node_Type } = {}
                    files.forEach((file) => {
                        out[($p['prepend results with path'] ? ($p.path.path + "/" ) : "") + file.name] = file.isFile() ? ['file', null] : ['directory', null]
                    })
                    on_value(_ei.dictionary_literal(out))
                }
            })
        }
    })
})