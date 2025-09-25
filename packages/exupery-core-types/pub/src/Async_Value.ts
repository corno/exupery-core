
/**
 * A value that will asynchronously become available.
 * Similar to the concept of a promise, but with a smaller API.
 */
export interface Async_Value<T> {

    /**
     * maps the current async value into a new async value
     * @param handle_value callback that transforms the actual value into a new Async_Value
     */
    map<NT>(handle_value: ($: T) => Async_Value<NT>): Async_Value<NT>
    
    /**
     * This method is only to be used by resources
     */
    __start(
        on_value: ($: T) => void
    ): void
}