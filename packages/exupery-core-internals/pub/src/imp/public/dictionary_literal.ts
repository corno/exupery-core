import * as pt from "exupery-core-types"
import { set } from "./set"
import { not_set } from "./not_set"
import { array_literal } from "./array_literal"


type Dictionary_As_Array<T> = readonly pt.Key_Value_Pair<T>[]

/**
 * this is an implementation, not public by design
 */
class Dictionary<T> implements pt.Dictionary<T> {
    private source: Dictionary_As_Array<T>
    constructor(source: Dictionary_As_Array<T>) {
        this.source = source
    }
    public map<NT>(
        $v: (entry: T, key: string) => NT
    ) {
        return new Dictionary<NT>(this.source.map(($) => {
            return {
                key: $.key,
                value: $v($.value, $.key)
            }
        }))
    }
    deprecated_to_array(
        compare: pt.Compare_Function<T>,
    ): pt.Array<pt.Key_Value_Pair<T>> {
        const sorted_keys = this.source.slice().sort(compare)
        return array_literal(sorted_keys)
    }
    __get_entry(
        key: string,
    ): pt.Optional_Value<T> {
        for (let i = 0; i !== this.source.length; i += 1) {
            const element = this.source[i]
            if (element.key === key) {
                return set(element.value)
            }
        }
        return not_set()
    }

    __get_number_of_entries(): number {
        return this.source.length
    }

}

/**
 * returns a Exupery dictionary
 * 
 * why is this not the constructor? to call a constructor, you have to use the keyword 'new'. Exupery doesn't use the concept of a class so that keyword should be avoided
 * @param source An object literal
 * @returns 
 */
export function dictionary_literal<T>(source: { readonly [key: string]: T }): pt.Dictionary<T> {

    //first we clone the source data so that changes to that source will have no impact on this implementation.
    //only works if the set does not become extremely large

    function create_dictionary_as_array<X>(source: { readonly [key: string]: X }): Dictionary_As_Array<X> {
        const imp: pt.Key_Value_Pair<X>[] = []
        Object.keys(source).forEach((key) => {
            imp.push({ key: key, value: source[key] })
        })
        return imp
    }
    const daa = create_dictionary_as_array(source)
    return new Dictionary(daa)
}