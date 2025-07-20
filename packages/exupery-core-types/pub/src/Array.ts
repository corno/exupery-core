import { Async_Value } from "./Async_Value"
import { Optional_Value } from "./Optional_Value"

/**
 * A Exupery array.
 * unmutable and minimal by design
 */
export interface Array<T> {
    /**
     * 
     * @param $v callback to transform an individual entry.
     */
    map<NT>(
        $v: ($: T) => NT
    ): Array<NT>
    /**
     * maps the array to {@link Async_Value} that contains an array
     * @param $v callback that provides an async value. keys are not available.
     */
    async_map<NT>(
        $v: ($: T) => Async_Value<NT>
    ): Async_Value<Array<NT>>

    /**
     * This method is only to be used by resources
     * iterates over all entries
     * 
     * @param $v callback to process the entry
     */
    __for_each(
        $v: ($: T) => void
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