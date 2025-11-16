import * as _et from 'exupery-core-types'
import { __create_query_promise } from './create_query_promise'

export const __create_query = <Parameters, Result, Error, Resources>(
    handler: _et.Query<Parameters, Result, Error>,
): _et.Query<Parameters, Result, Error> => {
    return handler
}