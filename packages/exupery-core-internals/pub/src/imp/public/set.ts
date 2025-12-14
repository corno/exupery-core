import * as _et from "exupery-core-types"

import { Optional_Value } from "exupery-core-types"

/**
 * this is an implementation, not public by design
 */
class Set_Value<T> implements _et.Optional_Value<T> {

    constructor(source: T) {
        this.value = source
    }

    public transform<NT>(
        set: ($: T) => NT,
        not_set: () => NT,
    ) {
        return set(this.value)

    }

    public map<NT>(
        if_set: ($: T) => NT,
    ) {
        return set(if_set(this.value))
    }

    value: T
}

/**
 * returns a set {@link Optional_Value}.

 * @param $ the set value
 */
export function set<T>($: T): _et.Optional_Value<T> {
    return new Set_Value($)
}
