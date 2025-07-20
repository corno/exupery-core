import * as pt from "exupery-core-types"

/**
 * this is an implementation, not public by design
 */
class Not_Set_Value<T> implements pt.Optional_Value<T> {

    constructor() {
        this.__raw = [false]
    }

    public transform<NT>(
        set: ($: T) => NT,
        not_set: () => NT,
    ) {
        return not_set()
    }

    public map<NT>(
        set: ($: T) => NT,
    ) {
        return not_set<NT>()
    }
    __raw: pt.Raw_Optional_Value<T>
}

/**
 * why is this not the constructor? to call a constructor, you have to use the keyword 'new'. Exupery doesn't use the concept of a class so that keyword should be avoided

 * creates a not set Optional_Value
 * @returns Optional_Value of type T
 */
export function not_set<T>(): pt.Optional_Value<T> {
    return new Not_Set_Value()
}