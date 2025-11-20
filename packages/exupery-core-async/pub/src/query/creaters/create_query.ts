import * as _et from 'exupery-core-types'


type Queryer<Output, Error, Input> = (
    $: Input,
) => _et.Query_Result<Output, Error>

export const __create_query = <Result, Error, Parameters, Resources>(
    handler: Queryer<Result, Error, Parameters>,
): _et.Query<Result, Error, Parameters> => {
    return (parameters, error_transformer) => {
        return handler(parameters).transform_error_temp(error_transformer)
    }
}