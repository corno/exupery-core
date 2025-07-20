
/**
 * this is literal data type, either [false] or [true, T]
 * the first entry of the tuple is thus 'false' or 'true'. If the first one is 'true',
 * then there is a second one containing the value T
 */
export type Raw_Optional_Value<T> = readonly [false] | readonly [true, T]

/**
 * Why this type and not use for example 'null | T'?
 * the 'null | T' is vulnerable. If you have a parametrized function 'foo<T>() null | T' and T is null | number,
 * you cannot discern if a return value is null because of the function or because of the data
 * this 'Optional_Value' type makes it possible to have recursive optional types like this: Optional_Value<Optional_Value<number>>
 */
export interface Optional_Value<T> {
    /**
     * @param set what to do when the value was set, returns the new type
     * @param not_set  what to do when the value was not set, returns the new type
     */
    transform<NT>(
        set: ($: T) => NT,
        not_set: () => NT,
    ): NT
    /**
     * 
     */
    map<NT>( //this one should be called 'map'
        set: ($: T) => NT,
    ): Optional_Value<NT>

    __raw: Raw_Optional_Value<T>
}