
/**
 * A value that will asynchronously become available.
 * Similar to the concept of a promise, but with a smaller API.
 */
export interface Async_Value<T> {

    /**
     * maps the current async value into a new async value
     * @param $v callback that transforms the actual value into a new Async_Value
     */
    map<NT>($v: ($: T) => Async_Value<NT>): Async_Value<NT>
    
    /**
     * This method is only to be used by resources
     */
    __execute(
        $i: ($: T) => void
    ): void
}