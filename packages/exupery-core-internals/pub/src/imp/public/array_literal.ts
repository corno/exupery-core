import * as pt from "exupery-core-types"
import { create_async_registry } from "../private/create_async_registry"
import { cast_to_async_value_imp } from "./cast_to_async_value_imp"
import { Execute } from "../types/Execute"
import { not_set } from "./not_set"
import { set } from "./set"

/**
 * this is an implementation, not public by design
 * If you feel the need to rename this class, don't rename it to 'Array',
 * it will break the 'instanceOf Array' test
 */
class Array_Class<T> implements pt.Array<T> {
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
    async_map<NT>($v: ($: T) => pt.Async_Value<NT>) {
        // const elements = source.map($v)
        // let _isGuaranteedToReturnAResult = true
        // source.forEach(($) => {
        //     if ($)
        // })
        function array<T, NT>(
            array: readonly T[],
            $v: ($: T) => pt.Async_Value<NT>
        ): pt.Async_Value<pt.Array<NT>> {
            const mapped = array.map($v)

            return cast_to_async_value_imp(
                ($c) => {
                    const temp: NT[] = []
                    create_async_registry(
                        (registry) => {
                            mapped.forEach((v) => {
                                registry.register()
                                v.__execute((v) => {
                                    temp.push(v)
                                    registry.report_finished()
                                })
                            })
                        },
                        () => {
                            $c(array_literal(temp))
                        }
                    )
                },
            )
        }
        return array(this.data, $v)
    }

    /////////
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
export function array_literal<T>(source: readonly T[]): pt.Array<T> {
    const data = source.slice() //create a copy
    if (!(data instanceof Array)) {
        throw new Error("invalid input in 'array_literal'")
    }
    return new Array_Class(source)
}
