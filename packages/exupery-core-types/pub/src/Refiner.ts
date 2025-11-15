
export interface Refinement_Result<T, E> {
    /**
     * @param set what to do when the value was set, returns the new type
     * @param not_set  what to do when the value was not set, returns the new type
     */
    process(
        success: ($: T) => void,
        error: ($: E) => void,
    ): void

    map<NT, NE>(
        handle_value: ($: T) => NT,
        handle_error: ($: E) => NE
    ): Refinement_Result<NT, NE>

    map_result<NT>(
        handle_value: ($: T) => NT,
    ): Refinement_Result<NT, E>

    transform<NT>(
        handle_value: ($: T) => NT,
        handle_error: ($: E) => NT
    ): NT

    with_result<NT>(
        handle_value: ($: T) => Refinement_Result<NT, E>,
    ): Refinement_Result<NT, E>
}

export type Refiner_With_Parameters<In, Parameters, Out, Error> = (
    $: In,
    $p: Parameters,
) => Refinement_Result<Out, Error>

export type Refiner_Without_Parameters<In, Out, Error> = (
    $: In,
) => Refinement_Result<Out, Error>
