import * as pt from "exupery-core-types"

import { Optional_Value } from "exupery-core-types"

/**
 * this is an implementation, not public by design
 */
class Set_Value<T> implements pt.Optional_Value<T> {

    constructor(source: T) {
        this.source = source
        this.__raw = [true, source]
        this.value = source
    }

    source: T

    public transform<NT>(
        set: ($: T) => NT,
        not_set: () => NT,
    ) {
        if (this.__raw[0] === true) {
            return set(this.__raw[1])
        } else {
            return not_set()
        }
    }

    public map<NT>(
        if_set: ($: T) => NT,
    ) {
        return set(if_set(this.value))
    }

    __raw: pt.Raw_Optional_Value<T>

    value: T
}

/**
 * returns a set {@link Optional_Value}.

 * @param $ the set value
 */
export function set<T>($: T): pt.Optional_Value<T> {
    return new Set_Value($)
}
