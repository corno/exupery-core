import * as _et from 'exupery-core-types'

export interface Unsafe_Transformation_Result<T, E> {
    /**
     * @param set what to do when the value was set, returns the new type
     * @param not_set  what to do when the value was not set, returns the new type
     */
    transform<NT>(
        success: ($: T) => NT,
        exception: ($: E) => NT,
    ): NT

    map<NT>(
        handle_value: ($: T) => NT
    ): Unsafe_Transformation_Result<NT, E>
}

export namespace transformation {

export const failed = <T, E>(
    exception: E
): Unsafe_Transformation_Result<T, E> => {
    return {
        'transform': (success, exception_handler) => {
            return exception_handler(exception)
        },
        'map': <NT>(
            handle_value: ($: T) => NT
        ): Unsafe_Transformation_Result<NT, E> => {
            return failed<NT, E>(exception)
        }
    }
}

export const successful = <T, E>(
    value: T
): Unsafe_Transformation_Result<T, E> => {
    return {
        'transform': (success, exception_handler) => {
            return success(value)
        },
        'map': <NT>(
            handle_value: ($: T) => NT
        ): Unsafe_Transformation_Result<NT, E> => {
            return successful<NT, E>(handle_value(value))
        }
    }
}
}
