import * as _et from "exupery-core-types"
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
