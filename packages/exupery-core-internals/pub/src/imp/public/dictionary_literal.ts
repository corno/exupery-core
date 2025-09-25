import * as pt from "exupery-core-types"
import { create_async_registry } from "../private/create_async_registry"
import { cast_to_async_value_imp } from "./cast_to_async_value_imp"
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
    async_map<NT>($v: ($: T) => pt.Async_Value<NT>) {
        function imp<T, NT>(
            dictionary_as_array: Dictionary_As_Array<T>,
            $v: ($: T) => pt.Async_Value<NT>
        ): pt.Async_Value<pt.Dictionary<NT>> {
            const mapped = dictionary_as_array.map(($) => {
                return {
                    key: $.key,
                    value: $v($.value),
                }
            })
            return cast_to_async_value_imp(
                {
                    'execute': (on_value) => {
                        const temp: { [key: string]: NT } = {}
                        create_async_registry(
                            (counter) => {
                                mapped.map(($) => {
                                    counter.register()
                                    $.value.__start((nv) => {
                                        temp[$.key] = nv
                                        counter.report_finished()
                                    })
                                })
                            },
                            () => {
                                on_value(dictionary_literal(temp))
                            }
                        )
                    }
                }
            )
        }
        return imp<T, NT>(
            this.source,
            $v,
        )

    }

    __map_with_key<NT>(
        $v: (entry: T, key: string) => NT
    ) {
        return new Dictionary(this.source.map(($) => {
            return {
                key: $.key,
                value: $v($.value, $.key),
            }
        }))
    }

    to_array(
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

    __add_entry_if_not_exists(key: string, value: T): pt.Dictionary<T> {
        for (let i = 0; i !== this.source.length; i += 1) {
            const element = this.source[i]
            if (element.key === key) {
                return this
            }
        }
        return new Dictionary([...this.source, { key: key, value: value }])
    }

    __add_entry_overwrite_if_exists(key: string, value: T): pt.Dictionary<T> {
        return new Dictionary(this.source.map((entry) => {
            if (entry.key === key) {
                return { key: key, value: value }
            } else {
                return entry
            }
        }))
    }

    __remove_entry_if_exists(key: string): pt.Dictionary<T> {
        return new Dictionary(this.source.filter((entry) => {
            return entry.key !== key
        }))
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