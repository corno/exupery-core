import * as _et from 'exupery-core-types'

export interface Unguaranteed_Transformation_Result<T, E> {
    /**
     * @param set what to do when the value was set, returns the new type
     * @param not_set  what to do when the value was not set, returns the new type
     */
    'process result'(
        success: ($: T) => void,
        exception: ($: E) => void,
    ): void

    map<NT, NE>(
        handle_value: ($: T) => NT,
        handle_exception: ($: E) => NE
    ): Unguaranteed_Transformation_Result<NT, NE>

    transform<NT>(
        handle_value: ($: T) => NT,
        handle_exception: ($: E) => NT
    ): NT
}

export namespace transformation {

    export const failed = <T, E>(
        exception: E
    ): Unguaranteed_Transformation_Result<T, E> => {
        return {
            'process result': (success, exception_handler) => {
                exception_handler(exception)
            },
            'transform': (success, exception_handler) => {
                return exception_handler(exception)
            },
            'map': <NT, NE>(
                handle_value: ($: T) => NT,
                handle_exception: ($: E) => NE,
            ): Unguaranteed_Transformation_Result<NT, NE> => {
                return failed<NT, NE>(handle_exception(exception))
            }
        }
    }

    export const successful = <T, E>(
        value: T
    ): Unguaranteed_Transformation_Result<T, E> => {
        return {
            'process result': (success, exception_handler) => {
                success(value)
            },
            'transform': (success, exception_handler) => {
                return success(value)
            },
            'map': <NT, NE>(
                handle_value: ($: T) => NT,
                handle_exception: ($: E) => NE,
            ): Unguaranteed_Transformation_Result<NT, NE> => {
                return successful<NT, NE>(handle_value(value))
            }
        }
    }
}
