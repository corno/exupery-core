import * as _et from 'exupery-core-types'

import { __create_query } from './create_query'

export const create_query_procedure = <Result, Error, Parameters, Queries>(
    handler: (
        $p: Parameters,
        $q: Queries,
    ) => _et.Data_Preparation_Result<Result, Error>
): _et.Query_Procedure<Result, Error, Parameters, Queries> => {
    return ($q) => __create_query(($p) => handler($q, $p))
}