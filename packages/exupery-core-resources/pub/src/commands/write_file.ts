import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import * as fs from "fs"

import * as pathlib from "path"

import * as D from "../types"

import { $$ as __possibly_escape_filename } from "../__internal/possibly_escape_file_name"

export const $$ = (
    path: string,
    data: string,
    escape_spaces_in_path: boolean
): _easync.Unsafe_Command_Result<D.Write_File_Error> => {
    return _easync.__execute_unsafe_command({
        'execute': (on_success, on_exception) => {

            const fname = __possibly_escape_filename(path, escape_spaces_in_path)
            fs.mkdir(
                pathlib.dirname(fname),
                {
                    'recursive': true
                },
                (err, path) => {
                    if (err) {
                        on_exception(_ei.block(() => {
                            if (err.code === 'EACCES' || err.code === 'EPERM') {
                                return ['permission denied', null]
                            }
                            return _ei.panic(`unhandled fs.writeFile error code: ${err.code}`)
                        }))
                        return
                    }
                    fs.writeFile(fname, data, (err) => {
                        if (err) {
                            on_exception(_ei.block(() => {
                                if (err.code === 'EACCES' || err.code === 'EPERM') {
                                    return ['permission denied', null]
                                }
                                return _ei.panic(`unhandled fs.writeFile error code: ${err.code}`)
                            }))
                        } else {
                            on_success()
                        }
                    })
                }
            )
        }
    })
}