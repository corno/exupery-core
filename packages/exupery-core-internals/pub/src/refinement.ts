import * as _et from 'exupery-core-types'

export interface Refinement_Result<T, E> {
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
    ): Refinement_Result<NT, NE>

    map_result<NT>(
        handle_value: ($: T) => NT,
    ): Refinement_Result<NT, E>

    transform<NT>(
        handle_value: ($: T) => NT,
        handle_exception: ($: E) => NT
    ): NT

    with_result<NT>(
        handle_value: ($: T) => Refinement_Result<NT, E>,
    ): Refinement_Result<NT, E>
}

export type Refinement_With_Parameters<In, Parameters, Out, Error> = (
    $: In,
    $p: Parameters,
) => Refinement_Result<Out, Error>

export type Refinement_Without_Parameters<In, Out, Error> = (
    $: In,
) => Refinement_Result<Out, Error>


export namespace refinement {

    export const failed = <T, E>(
        exception: E
    ): Refinement_Result<T, E> => {
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
            ): Refinement_Result<NT, NE> => {
                return failed<NT, NE>(handle_exception(exception))
            },
            'map_result': <NT>(
                handle_value: ($: T) => NT,
            ): Refinement_Result<NT, E> => {
                return failed<NT, E>(exception)
            }
        }
    }

    export const successful = <T, E>(
        value: T
    ): Refinement_Result<T, E> => {
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
            ): Refinement_Result<NT, NE> => {
                return successful<NT, NE>(handle_value(value))
            },
            'map_result': <NT>(
                handle_value: ($: T) => NT,
            ): Refinement_Result<NT, E> => {
                return successful<NT, E>(handle_value(value))
            }
        }
    }
}