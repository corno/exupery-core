import * as _et from 'exupery-core-types'

export interface Unguaranteed_Transformation_Result<T, E> {
    /**
     * @param set what to do when the value was set, returns the new type
     * @param not_set  what to do when the value was not set, returns the new type
     */
    process(
        success: ($: T) => void,
        exception: ($: E) => void,
    ): void

    map<NT, NE>(
        handle_value: ($: T) => NT,
        handle_exception: ($: E) => NE
    ): Unguaranteed_Transformation_Result<NT, NE>

    map_result<NT>(
        handle_value: ($: T) => NT,
    ): Unguaranteed_Transformation_Result<NT, E>

    transform<NT>(
        handle_value: ($: T) => NT,
        handle_exception: ($: E) => NT
    ): NT
}

export type Guaranteed_Transformation_With_Parameters<In, Parameters, Out> = (
    $: In,
    $p: Parameters,
) => Out

export type Guaranteed_Transformation_Without_Parameters<In, Out> = (
    $: In,
) => Out

export type Unguaranteed_Transformation_With_Parameters<In, Parameters, Out, Error> = (
    $: In,
    $p: Parameters,
) => Unguaranteed_Transformation_Result<Out, Error>

export type Unguaranteed_Transformation_Without_Parameters<In, Out, Error> = (
    $: In,
) => Unguaranteed_Transformation_Result<Out, Error>

export namespace transformation {

    export const failed = <T, E>(
        exception: E
    ): Unguaranteed_Transformation_Result<T, E> => {
        return {
            process: (success, exception_handler) => {
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
            },
            'map_result': <NT>(
                handle_value: ($: T) => NT,
            ): Unguaranteed_Transformation_Result<NT, E> => {
                return failed<NT, E>(exception)
            }
        }
    }

    export const successful = <T, E>(
        value: T
    ): Unguaranteed_Transformation_Result<T, E> => {
        return {
            process: (success, exception_handler) => {
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
            },
            'map_result': <NT>(
                handle_value: ($: T) => NT,
            ): Unguaranteed_Transformation_Result<NT, E> => {
                return successful<NT, E>(handle_value(value))
            }
        }
    }
}