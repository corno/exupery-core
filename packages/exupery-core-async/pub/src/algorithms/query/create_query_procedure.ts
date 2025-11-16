import * as _et from 'exupery-core-types'

import { __create_query_primed_with_resources } from './create_query_primed_with_resources'

export const create_query_procedure = <Parameters, Result, Error, Resources>(
    handler: (
        $r: Resources,
        $p: Parameters,
    ) => _et.Query_Promise<Result, Error>
): _et.Query_Procedure<Parameters, Result, Error, Resources> => {
    return ($r) => __create_query_primed_with_resources(($p) => handler($r, $p))
}