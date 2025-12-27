import { Optional_Value } from "./Optional_Value"

/**
 * An Exupery List.
 * unmutable and minimal by design
 */
export interface List<T> {
    /**
     * 
     * @param handle_value callback to transform an individual entry.
     */
    map<NT>(
        handle_value: ($: T) => NT
    ): List<NT>

    filter<New_Type>(
        handle_value: ($: T) => Optional_Value<New_Type>
    ): List<New_Type>

    get_number_of_elements(): number

    is_empty(): boolean

    __get_element_at(index: number): Optional_Value<T>

    __get_raw_copy(): readonly T[]

    /**
     * This method is only to be used by resources
     * iterates over all entries
     * 
     * @param $handle_value callback to process the entry
     */
    __for_each(
        handle_value: ($: T) => void
    ): void

}