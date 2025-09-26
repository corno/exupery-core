import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import * as fs from "fs"

import * as pathlib from "path"

import * as D from "../types"

import { $$ as __possibly_escape_filename } from "../__internal/possibly_escape_file_name"

export type Error =
    | ['source does not exist', null]
    | ['node is not a file', null]
    | ['permission denied', null]
    | ['file too large', null]
    | ['device not ready', null]

export type Result = _easync.Unsafe_Command_Result<Error>

export const $$ = (
    source: string,
    target: string,
    escape_spaces_in_path: boolean,
    options: {
        recursive?: boolean,
        force?: boolean,
        errorOnExist?: boolean,
    }
): Result => {
    return _easync.__execute_unsafe_command({
        'execute': (on_success, on_exception) => {
            fs.cp(__possibly_escape_filename(source, escape_spaces_in_path), __possibly_escape_filename(target, escape_spaces_in_path), options, (err) => {
                if (err) {
                    on_exception(_ei.block((): Error => {
                        if (err.code === 'ENOENT') {
                            return ['source does not exist', null]
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
                        return _ei.panic(`unhandled fs.cp error code: ${err.code}`)
                    }))
                } else {
                    on_success()
                }
            })
        }
    })
}