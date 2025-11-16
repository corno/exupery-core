import * as _et from 'exupery-core-types'

import { __create_query } from './create_query'

export const create_query_procedure = <Parameters, Result, Error, Resources>(
    handler: (
        $r: Resources,
        $p: Parameters,
    ) => _et.Query_Promise<Result, Error>
): _et.Query_Procedure<Parameters, Result, Error, Resources> => {
    return ($r) => __create_query(($p) => handler($r, $p))
}