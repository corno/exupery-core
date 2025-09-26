import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import * as D from "../types"

import { $$ as __possibly_escape_filename } from "../__internal/possibly_escape_file_name"

export const $$ = (
    data: string,
): _easync.Safe_Command_Result => {
    return _easync.__execute_safe_command({
        'execute': (on_success) => {
            console.error(data)
            on_success()
        }
    })
}