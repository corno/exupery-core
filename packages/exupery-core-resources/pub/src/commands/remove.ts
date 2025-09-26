import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import * as fs from "fs"

import * as pathlib from "path"

import * as D from "../types"

import { $$ as __possibly_escape_filename } from "../__internal/possibly_escape_file_name"

export const $$ = (
    path: string,
    escape_spaces_in_path: boolean,
    options: {

        // recursive?: boolean,
        // force?: boolean,
        // errorOnExist?: boolean,
    }
): _easync.Unsafe_Command_Result<D.Remove_Error> => {
    return _easync.__execute_unsafe_command({
        'execute': (on_success, on_exception) => {
            fs.rm(__possibly_escape_filename(path, escape_spaces_in_path), options, (err) => {

                if (err) {
                    on_exception(_ei.block((): D.Remove_Error => {
                        if (err.code === 'ENOENT') {
                            return ['node does not exist', null]
                        }
                        if (err.code === 'EACCES' || err.code === 'EPERM') {
                            return ['permission denied', null]
                        }
                        if (err.code === 'EISDIR' || err.code === 'ENOTDIR') {
                            return ['node is not a directory', null]
                        }
                        return _ei.panic(`unhandled fs.rm error code: ${err.code}`)
                    }))
                } else {
                    on_success()
                }
            })
        }
    })
}