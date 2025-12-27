import * as _et from "exupery-core-types"
import { not_set } from "./not_set"
import { set } from "./set"

/**
 * this is an implementation, not public by design
 * If you feel the need to rename this class, don't rename it to 'Array',
 * it will break the 'instanceOf Array' test
 */
class List_Class<T> implements _et.List<T> {
    private data: readonly T[]
    constructor(data: readonly T[]) {
        this.data = data
    }
    map<NT>(
        $v: (entry: T) => NT
    ) {
        return list_literal(this.data.map((entry) => {
            return $v(entry)
        }))
    }


    get_number_of_elements() {
        return this.data.length
    }

    filter<New_Type>(handle_value: ($: T) => _et.Optional_Value<New_Type>): _et.List<New_Type> {
        const out: New_Type[] = []
        this.data.forEach(($) => {
            handle_value($).map(($) => {
                out.push($)
            })
        })
        return list_literal(out)    
    }

    is_empty() {    
        return this.data.length === 0
    }

    append_element(new_element: T): _et.List<T> {
        const new_data = this.data.slice()
        new_data.push(new_element)
        return new List_Class(new_data)
    }

    prepend_element(new_element: T): _et.List<T> {
        const new_data = this.data.slice()
        new_data.unshift(new_element)
        return new List_Class(new_data)
    }

    reverse(): _et.List<T> {
        const new_data = this.data.slice()
        new_data.reverse()
        return new List_Class(new_data)
    }

    flatten<New_Type>(
        handle_element: ($: T) => _et.List<New_Type>
    ): _et.List<New_Type> {
        const out: New_Type[] = []
        this.data.forEach(($) => {
            const inner_list = handle_element($)
            inner_list.__for_each((inner_entry) => {
                out.push(inner_entry)
            })
        })
        return list_literal(out)
    }


    //internal methods
    __for_each($i: ($: T) => void) {
        this.data.forEach(($) => {
            $i($)
        })
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
export function list_literal<T>(source: readonly T[]): _et.List<T> {
    if (!(source instanceof Array)) {
        throw new Error("invalid input in 'list_literal'")
    }
    const data = source.slice() //create a copy
    return new List_Class(data)
}
