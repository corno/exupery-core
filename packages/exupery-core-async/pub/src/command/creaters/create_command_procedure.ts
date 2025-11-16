import * as _et from 'exupery-core-types'

import { __create_command } from './create_command'

export const create_command_procedure = <Parameters, Error, Resources>(
    handler: (
        $r: Resources,
        $p: Parameters,
    ) => _et.Command_Promise<Error>
): _et.Command_Procedure<Parameters, Error, Resources> => {
    return ($r) => __create_command(($p) => handler($r, $p))
}