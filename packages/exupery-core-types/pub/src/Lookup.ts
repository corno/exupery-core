import { Optional_Value } from "./Optional_Value"

/**
 * A lookup is similar to a Dictionary, but much more basic.
 * There are only operations to retrieve entries
 */
export interface Lookup<T> {
    /**
     * This method is only to be used by resources
     * returns an {@link Optional_Value } of type T reflecting wether the entry existed or not
     * 
     * @param key 
     */
    __get_entry(
        key: string
    ): Optional_Value<T>
}