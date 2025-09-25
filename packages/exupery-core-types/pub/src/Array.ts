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