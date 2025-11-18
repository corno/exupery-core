import * as _et from 'exupery-core-types'
import { __create_staging_result } from './create_staging_result'


export namespace data_processing {

    export const failed = <T, E>(
        error: E
    ): _et.Staging_Result<T, E> => {
        return __create_staging_result<T, E>((on_result, on_error) => {
            on_error(error)
        })
    }

    export const successful = <T, E>(
        value: T
    ): _et.Staging_Result<T, E> => {
        return __create_staging_result<T, E>((on_result, on_error) => {
            on_result(value)
        })
    }
}