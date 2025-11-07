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
    __get_number_of_elements() {
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

 * @param source An array literal
 * @returns 
 */
export function array_literal<T>(source: readonly T[]): _et.Array<T> {
    if (!(source instanceof Array)) {
        throw new Error("invalid input in 'array_literal'")
    }
    const data = source.slice() //create a copy
    return new Array_Class(data)
}
