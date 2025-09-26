import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import * as fs from "fs"

import * as D from "../types"

import { $$ as __possibly_escape_filename } from "../__internal/possibly_escape_file_name"

export const $$ = (
    path: string,
    escape_spaces_in_path: boolean,
): _easync.Unsafe_Query_Result<_et.Dictionary<D.Node_Type>, D.Read_Directory_Error> => {
    return _easync.__run_unsafe_query({
        'execute': (on_value, on_exception) => {
            fs.readdir(__possibly_escape_filename(path, escape_spaces_in_path), {
                'encoding': 'utf-8',
                'withFileTypes': true,
            }, (err, files) => {
                if (err) {
                    on_exception(_ei.block(() => {
                        if (err.code === 'ENOENT') {
                            return ['directory does not exist', null]
                        }
                        if (err.code === 'ENOTDIR' || err.code === 'EISDIR') {
                            return ['node is not a directory', null]
                        }
                        return _ei.panic(`unhandled fs.readdir error code: ${err.code}`)
                    }))
                } else {
                    const out: { [key: string]: D.Node_Type } = {}
                    files.forEach((file) => {
                        out[file.name] = file.isFile() ? ['file', null] : ['directory', null]
                    })
                    on_value(_ei.dictionary_literal(out))
                }
            })
        }
    })
}