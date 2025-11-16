import * as _et from 'exupery-core-types'
import { __create_data_preparation_result } from './create_data_preparation_result'


export namespace data_processing {

    export const failed = <T, E>(
        error: E
    ): _et.Data_Preparation_Result<T, E> => {
        return __create_data_preparation_result<T, E>((on_result, on_error) => {
            on_error(error)
        })
    }

    export const successful = <T, E>(
        value: T
    ): _et.Data_Preparation_Result<T, E> => {
        return __create_data_preparation_result<T, E>((on_result, on_error) => {
            on_result(value)
        })
    }
}