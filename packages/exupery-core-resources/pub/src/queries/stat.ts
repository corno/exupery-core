import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'

import * as fs from "fs"

import { $$ as __possibly_escape_filename } from "../__internal/possibly_escape_file_name"
import * as D from "../types"

export const $$ = (
    path: string,
    escape_spaces_in_path: boolean
): _easync.Unsafe_Query_Result<D.Node_Type, D.Stat_Error> => {
    return _easync.__run_unsafe_query({
        'execute': (on_value, on_exception) => {
            fs.stat(__possibly_escape_filename(path, escape_spaces_in_path), (err, stats) => {
                if (err) {
                    on_exception(_ei.block(() => {
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
            })
        }
    })
}