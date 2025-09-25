import { Async_Value } from "./Async_Value"
import { Unsafe_Async_Value } from "./Unsafe_Async_Value"
import { Optional_Value } from "./Optional_Value"

/**
 * A Exupery array.
 * unmutable and minimal by design
 */
export interface Array<T> {
    /**
     * 
     * @param handle_value callback to transform an individual entry.
     */
    map<NT>(
        handle_value: ($: T) => NT
    ): Array<NT>
    /**
     * maps the array to {@link Async_Value} that contains an array
     * @param handle_value callback that provides an async value. keys are not available.
     */
    map_async<NT>(
        handle_value: ($: T) => Async_Value<NT>
    ): Async_Value<Array<NT>>
    map_async_unsafe<NT, NE>(
        handle_value: ($: T) => Unsafe_Async_Value<NT, NE>
    ): Unsafe_Async_Value<Array<NT>, Array<NE>>

    /**
     * This method is only to be used by resources
     * iterates over all entries
     * 
     * @param $handle_value callback to process the entry
     */
    __for_each(
        handle_value: ($: T) => void
    ): void

    /**
     * This method is only to be used by resources
     * 
     */
    __get_length(): number

    /**
     * This method is only to be used by resources
     * 
     * @param index 
     */
    __get_element_at(index: number): Optional_Value<T> //panics if index < 0 or index >= length

    __get_raw_copy(): readonly T[]
}