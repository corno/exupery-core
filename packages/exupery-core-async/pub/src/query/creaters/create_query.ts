import * as _et from 'exupery-core-types'

export const __create_query = <Result, Error, Parameters, Resources>(
    handler: _et.Stager<Result, Error, Parameters>,
): _et.Query<Result, Error, Parameters> => {
    return (parameters, error_transformer) => {
        return handler(parameters).transform_error_temp(error_transformer)
    }
}