
/**
 * A value that will asynchronously become available.
 * Similar to the concept of a promise, but with a smaller API.
 */
export interface _Guaranteed_Query<T> {

    map<NT>(
        handle_value: ($: T) => NT
    ): _Guaranteed_Query<NT>

    /**
     * maps the current async value into a new async value
     * @param handle_value callback that transforms the actual value into a new Async_Value
     */
    then<NT>(
        handle_value: ($: T) => _Guaranteed_Query<NT>
    ): _Guaranteed_Query<NT>

    /**
     * This method is only to be used by resources
     */
    __start(
        on_value: ($: T) => void
    ): void
}