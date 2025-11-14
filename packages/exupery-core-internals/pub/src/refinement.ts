import * as _et from 'exupery-core-types'


export namespace refinement {

    export const failed = <T, E>(
        exception: E
    ): _et.Refinement_Result<T, E> => {
        return {
            'process': (success, exception_handler) => {
                exception_handler(exception)
            },
            'transform': (success, exception_handler) => {
                return exception_handler(exception)
            },
            'with_result': (success) => {
                return failed(exception)
            },
            'map': <NT, NE>(
                handle_value: ($: T) => NT,
                handle_exception: ($: E) => NE,
            ): _et.Refinement_Result<NT, NE> => {
                return failed<NT, NE>(handle_exception(exception))
            },
            'map_result': <NT>(
                handle_value: ($: T) => NT,
            ): _et.Refinement_Result<NT, E> => {
                return failed<NT, E>(exception)
            }
        }
    }

    export const successful = <T, E>(
        value: T
    ): _et.Refinement_Result<T, E> => {
        return {
            'process': (success, exception_handler) => {
                success(value)
            },
            'transform': (success, exception_handler) => {
                return success(value)
            },
            'with_result': (success) => {
                return success(value)
            },
            'map': <NT, NE>(
                handle_value: ($: T) => NT,
                handle_exception: ($: E) => NE,
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