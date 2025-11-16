import * as _et from 'exupery-core-types'

export const __create_query = <Parameters, Result, Error, Resources>(
    handler: _et.Data_Preparer<Parameters, Result, Error>,
): _et.Data_Preparer<Parameters, Result, Error> => {
    return handler
}