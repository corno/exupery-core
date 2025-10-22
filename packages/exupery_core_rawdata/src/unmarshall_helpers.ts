import * as _ed from 'exupery-core-dev'
import * as _et from 'exupery-core-types'
import * as _ea from 'exupery-core-alg'

import { Value } from "./types/instance"

export const expect_object = ($: Value): _et.Dictionary<Value> => {
    if (typeof $ !== 'object' || $ === null || Array.isArray($)) {
        _ea.panic("Expected object")
    }
    return _ea.dictionary_literal($)
}

// export const resolve_object = <T, NT>(
//     $: { [key: string]: T },
//     fn: (value: T, key: string, sibling_getter: ($: string) => NT) => NT
// ): { [key: string]: NT } => {
//     const result: { [key: string]: NT } = {}
//     const inner_resolve = (key: string): NT => {
//         if (key in result) {
//             return result[key]
//         }
//         if (!(key in $)) {
//             _ea.panic(`no such entry: '${key}'`)
//         }
//         const value = $[key]
//         const resolved = fn(value, key, (sibling_key: string) => inner_resolve(sibling_key))
//         result[key] = resolved
//         return resolved
//     }
//     Object.entries($).forEach(([key, value]) => {
//         inner_resolve(key)
//     })
//     return result
// }

export const expect_property = ($: _et.Dictionary<Value>, key: string): Value => {
    
    return $.__get_entry(key).transform(
        ($) => $,
        () => _ea.panic("no such entry")
    )
}

export const expect_array = ($: Value): _et.Array<Value> => {
    if (!Array.isArray($)) {
        _ea.panic("Expected array")
    }
    return _ea.array_literal($)
}

export type State = [string, Value]

export const expect_state = ($: Value): State => {
    if (!Array.isArray($)) {
        console.log(JSON.stringify($))
        _ea.panic(`Expected array for state, got ${typeof $}`)
    }
    if ($.length !== 2) {
        console.log(JSON.stringify($))
        _ea.panic(`Expected tuple of 2 for state, got ${$.length}`)
    }
    const widget_name = $[0]
    const widget_value = $[1]
    if (typeof widget_name !== 'string') {
        console.log(JSON.stringify($))

        _ea.panic(`Expected state name to be string, got ${JSON.stringify(widget_name)}`)
    }
    return [widget_name, widget_value]
}

export const expect_number = ($: Value): number => {
    if (typeof $ !== 'number') {
        _ea.panic(`Expected number, got ${JSON.stringify($)}`)
    }
    return $
}

export const expect_boolean = ($: Value): boolean => {
    if (typeof $ !== 'boolean') {
        _ea.panic(`Expected boolean, got ${JSON.stringify($)}`)
    }
    return $
}

export const expect_text = ($: Value): string => {
    if (typeof $ !== 'string') {
        _ea.panic(`Expected text, got ${JSON.stringify($)}`)
    }
    return $
}

export const expect_null = ($: Value): null => {
    if ($ !== null) {
        _ea.panic(`Expected null, got ${JSON.stringify($)}`)
    }
    return null
}