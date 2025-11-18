import * as _et from 'exupery-core-types'

import { __create_command } from './create_command'

export const create_command_procedure = <Parameters, Error, Variables, Query_Resources, Command_Resources>(
    variables_handler: (
        $q: Query_Resources,
        $p: Parameters,
    ) => _et.Data_Preparation_Result<Variables, Error>,
    execution_handler: (
        $c: Command_Resources,
        $p: Parameters,
    ) => _et.Command_Promise<Error>,
): _et.Command_Procedure<Parameters, Error, Query_Resources, Command_Resources> => {
    return ($c) => __create_command(($p) => execution_handler($c, $p))
}