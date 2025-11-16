import * as _et from 'exupery-core-types'
import { __create_data_preparation_result } from './create_data_preparation_result'

export const __create_query = <Parameters, Result, Error, Resources>(
    handler: _et.Query<Parameters, Result, Error>,
): _et.Query<Parameters, Result, Error> => {
    return handler
}