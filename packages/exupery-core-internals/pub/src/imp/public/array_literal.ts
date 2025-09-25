import * as _et from "exupery-core-types"
import { create_asynchronous_processes_monitor } from "../private/create_asynchronous_processes_monitor"
import { create_Async_Value } from "./create_Async_Value"
import { not_set } from "./not_set"
import { set } from "./set"

/**
 * this is an implementation, not public by design
 * If you feel the need to rename this class, don't rename it to 'Array',
 * it will break the 'instanceOf Array' test
 */
class Array_Class<T> implements _et.Array<T> {
    private data: readonly T[]
    constructor(data: readonly T[]) {
        this.data = data
    }
    map<NT>(
        $v: (entry: T) => NT
    ) {
        return array_literal(this.data.map((entry) => {
            return $v(entry)
        }))
    }
    map_async<NT>(on_element_value: ($: T) => _et.Async_Value<NT>): _et.Async_Value<_et.Array<NT>> {
        const data = this.data
        return create_Async_Value(
            {
                'execute': (on_array_value) => {
                    const temp: NT[] = []
                    create_asynchronous_processes_monitor(
                        (registry) => {
                            data.map(on_element_value).forEach((v) => {
                                registry['report process started']()
                                v.__start((v) => {
                                    temp.push(v)
                                    registry['report process finished']()
                                })
                            })
                        },
                        () => {
                            on_array_value(array_literal(temp))
                        }
                    )
                }
            },
        )
    }
    map_async_unsafe<NT, NE>(on_element_value: ($: T) => _et.Unsafe_Async_Value<NT, NE>): _et.Unsafe_Async_Value<_et.Array<NT>, _et.Array<NE>> {
        const data = this.data
        return create_Async_Value(
            {
                'execute': (on_array_value) => {
                    const temp: NT[] = []
                    create_asynchronous_processes_monitor(
                        (registry) => {
                            data.map(on_element_value).forEach((v) => {
                                registry['report process started']()
                                v.__start((v) => {
                                    temp.push(v)
                                    registry['report process finished']()
                                })
                            })
                        },
                        () => {
                            on_array_value(array_literal(temp))
                        }
                    )
                }
            },
        )
    }


    //internal methods
    __for_each($i: ($: T) => void) {
        this.data.forEach(($) => {
            $i($)
        })
    }
    __get_length() {
        return this.data.length
    }
    __get_element_at(index: number) {
        if (index < 0 || index >= this.data.length) {
            return not_set<T>()
        }
        return set(this.data[index])
    }
    __get_raw_copy(): T[] {
        return this.data.slice()
    }


}

/**
 * returns a Exupery array
 * why is this not the constructor? to call a constructor, you have to use the keyword 'new'. Exupery doesn't use the concept of a class so that keyword should be avoided

 * @param source An array literal
 * @returns 
 */
export function array_literal<T>(source: readonly T[]): _et.Array<T> {
    const data = source.slice() //create a copy
    if (!(data instanceof Array)) {
        throw new Error("invalid input in 'array_literal'")
    }
    return new Array_Class(source)
}
