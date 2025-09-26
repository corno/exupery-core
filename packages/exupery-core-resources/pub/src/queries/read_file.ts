import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'

import * as fs from "fs"

import { $$ as __possibly_escape_filename } from "../__internal/possibly_escape_file_name"
import * as D from "../types"

export const $$ = (
    path: string,
    escape_spaces_in_path: boolean,
): _easync.Unsafe_Query_Result<string, D.Read_File_Error> => {
    return _easync.__run_unsafe_query({
        'execute': (on_value, on_exception) => {
            fs.readFile(__possibly_escape_filename(path, escape_spaces_in_path), { 'encoding': 'utf-8' }, (err, data) => {
                if (err) {
                    on_exception(_ei.block(() => {
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