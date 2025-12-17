import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/read_directory/data_types/target"
import { Signature } from "exupery-resources/dist/interface/algorithms/queries/read_directory"

import { readdir as fs_readdir } from "fs"
import * as t_path_to_text from "exupery-resources/dist/implementation/transformers/path/text"
import * as t_path_to_path from "exupery-resources/dist/implementation/transformers/path/path"


export const $$: _et.Query<d.Result, d.Error, d.Parameters> = _easync.__create_query((
    $p
) => {
    const __possibly_escape_filename = (path: string, escape: boolean): string => {
        if (escape) {
            return path.replace(/ /g, '_')
        }
        return path
    }
    return _ei.__create_query_result((on_value, on_error) => {
        fs_readdir(
            __possibly_escape_filename(
                t_path_to_text.Node_Path($p.path.path),
                $p.path['escape spaces in path']
            ),
            {
                'encoding': 'utf-8',
                'withFileTypes': true,
            },
            (err, files) => {
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
                    const out: { [key: string]: d.Result.D } = {}
                    files.forEach((file) => {
                        out[file.name] = {
                            'node type': file.isFile() ? ['file', null] : ['directory', null],
                            'context directory': t_path_to_path.node_path_to_context_path($p.path.path),
                            'path': t_path_to_path.create_node_path(
                                t_path_to_path.node_path_to_context_path($p.path.path),
                                file.name,
                            )
                        }
                    })
                    on_value(_ei.dictionary_literal(out))
                }
            }
        )
    })
})