import * as _et from 'exupery-core-types'

import { __create_query } from "./create_query"

export const create_query_function = <Result, Error, Parameters, Queries>(
    handler: (
        $p: Parameters,
        $q: Queries,
    ) => _et.Query_Result<Result, Error>
): _et.Query_Function<Result, Error, Parameters, Queries> => {
    return ($q) => ($p, error_transformer) => handler($p, $q).deprecated_transform_error(error_transformer)
}