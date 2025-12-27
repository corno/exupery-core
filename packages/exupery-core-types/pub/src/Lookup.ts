import { Optional_Value } from "./data/Optional_Value"

/**
 * A lookup is similar to a Dictionary, but much more basic.
 * There is only 1 operation: __get_entry.
 * 
 * this interface should be moved to the only place it is used; resolve_ordered_dictionary
 */
export interface Lookup<T> {
    /**
     * returns an {@link Optional_Value } of type T reflecting wether the entry existed or not
     * 
     * @param key 
     */
    get_entry(
        key: string
    ): Optional_Value<T>
}