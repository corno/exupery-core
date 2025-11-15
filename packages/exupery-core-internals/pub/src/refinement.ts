import * as _et from 'exupery-core-types'


export namespace refinement {

    export const failed = <T, E>(
        error: E
    ): _et.Refinement_Result<T, E> => {
        return {
            'process': (success, error_handler) => {
                error_handler(error)
            },
            'transform': (success, error_handler) => {
                return error_handler(error)
            },
            'with_result': (success) => {
                return failed(error)
            },
            'map': <NT, NE>(
                handle_value: ($: T) => NT,
                handle_error: ($: E) => NE,
            ): _et.Refinement_Result<NT, NE> => {
                return failed<NT, NE>(handle_error(error))
            },
            'map_result': <NT>(
                handle_value: ($: T) => NT,
            ): _et.Refinement_Result<NT, E> => {
                return failed<NT, E>(error)
            }
        }
    }

    export const successful = <T, E>(
        value: T
    ): _et.Refinement_Result<T, E> => {
        return {
            'process': (success, error_handler) => {
                success(value)
            },
            'transform': (success, error_handler) => {
                return success(value)
            },
            'with_result': (success) => {
                return success(value)
            },
            'map': <NT, NE>(
                handle_value: ($: T) => NT,
                handle_error: ($: E) => NE,
            ): _et.Refinement_Result<NT, NE> => {
                return successful<NT, NE>(handle_value(value))
            },
            'map_result': <NT>(
                handle_value: ($: T) => NT,
            ): _et.Refinement_Result<NT, E> => {
                return successful<NT, E>(handle_value(value))
            }
        }
    }
}