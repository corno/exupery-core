import { Array } from "./Array"
import { Async_Value } from "./Async_Value"
import { Optional_Value } from "./Optional_Value"

export type Key_Value_Pair<T> = {
    readonly 'key': string
    readonly 'value': T
}

export type Compare_Function<T> = (a: Key_Value_Pair<T>, b: Key_Value_Pair<T>) => number

/**
 * A Exupery dictionary.
 * unmutable and minimal by design
 */
export interface Dictionary<T> {
    /**
     * 
     * @param handle_value callback to transform an individual entry. keys are not available.
     */
    map<NT>(
        handle_value: ($: T, key: string) => NT
    ): Dictionary<NT>

    /**
     * 
     * @param handle_value callback that provides an {@link Async_Value}. keys are not available.
     */
    async_map<NT>(
        handle_value: ($: T) => Async_Value<NT>
    ): Async_Value<Dictionary<NT>>

    /**
     * This method is only to be used by resources
     * iterates over all entries in a sorted manner
     */
    to_array(
        compare: Compare_Function<T>,
    ): Array<Key_Value_Pair<T>>

    /**
     * This method is only to be used by resources
     * returns an {@link Optional_Value } of type T reflecting wether the entry existed or not
     * 
     * @param key 
     */
    __get_entry(
        key: string
    ): Optional_Value<T>

    __add_entry_if_not_exists(
        key: string,
        value: T
    ): Dictionary<T>

    __add_entry_overwrite_if_exists(
        key: string,
        value: T
    ): Dictionary<T>

    __remove_entry_if_exists(
        key: string
    ): Dictionary<T>

}