import * as _et from "exupery-core-types"
import { set } from "./set"
import { not_set } from "./not_set"
import { list_literal } from "./list_literal"


type Dictionary_As_Array<T> = readonly _et.Key_Value_Pair<T>[]

/**
 * this is an implementation, not public by design
 */
class Dictionary<T> implements _et.Dictionary<T> {
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
    to_list<New_Type>(
        handle_value: (value: T, key: string) => New_Type
    ): _et.List<New_Type> {
        return list_literal(this.source.map(($) => {
            return handle_value($.value, $.key)
        }))
    }

    filter<New_Type>(handle_value: (value: T, key: string) => _et.Optional_Value<New_Type>): _et.Dictionary<New_Type> {
        const out: _et.Key_Value_Pair<New_Type>[] = []
        this.source.forEach(($) => {
            const result = handle_value($.value, $.key)
            result.map((new_value) => {
                out.push({
                    key: $.key,
                    value: new_value
                })
            })
        })
        return new Dictionary<New_Type>(out)   
    }

    get_entry(
        key: string,
    ): _et.Optional_Value<T> {
        for (let i = 0; i !== this.source.length; i += 1) {
            const element = this.source[i]
            if (element.key === key) {
                return set(element.value)
            }
        }
        return not_set()
    }

    get_number_of_entries(): number {
        return this.source.length
    }

    is_empty(): boolean {
        return this.source.length === 0
    }

}

/**
 * returns a Exupery dictionary
 * 
 * why is this not the constructor? to call a constructor, you have to use the keyword 'new'. Exupery doesn't use the concept of a class so that keyword should be avoided
 * @param source An object literal
 * @returns 
 */
export function dictionary_literal<T>(source: { readonly [key: string]: T }): _et.Dictionary<T> {

    //first we clone the source data so that changes to that source will have no impact on this implementation.
    //only works if the set does not become extremely large

    function create_dictionary_as_array<X>(source: { readonly [key: string]: X }): Dictionary_As_Array<X> {
        const imp: _et.Key_Value_Pair<X>[] = []
        Object.keys(source).forEach((key) => {
            imp.push({ key: key, value: source[key] })
        })
        return imp
    }
    const daa = create_dictionary_as_array(source)
    return new Dictionary(daa)
}