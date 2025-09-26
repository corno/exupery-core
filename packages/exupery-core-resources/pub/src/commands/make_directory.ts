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
): _easync.Unsafe_Command_Result<D.Make_Directory_Error> => {

    return _easync.__execute_unsafe_command({
        'execute': (on_success, on_exception) => {
            fs.mkdir(
                __possibly_escape_filename(path, escape_spaces_in_path),
                {
                    'recursive': true,
                },
                (err, path) => {
                    if (err) {
                        on_exception(_ei.block(() => {
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
}