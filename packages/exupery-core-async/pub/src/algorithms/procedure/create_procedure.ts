import * as _et from 'exupery-core-types'

import { __create_procedure_primed_with_resources } from './__create_procedure_primed_with_resources'

export const create_procedure = <Parameters, Error, Resources>(
    handler: (
        $r: Resources,
        $p: Parameters,
    ) => _et.Procedure_Promise<Error>
): _et.Procedure<Parameters, Error, Resources> => {
    return ($r) => __create_procedure_primed_with_resources(($p) => handler($r, $p))
}