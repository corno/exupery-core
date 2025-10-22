import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

import { Value } from "./types/instance"

export type Typed_Value =
    | ['string', string]
    | ['number', number]
    | ['boolean', boolean]
    | ['null', null]
    | ['array', _et.Array<Value>]
    | ['object', _et.Dictionary<Value>]

export const determine_type = ($: Value): Typed_Value => {
    if (typeof $ === 'string') {
        return ['string', $]
    } else if (typeof $ === 'number') {
        return ['number', $]
    } else if (typeof $ === 'boolean') {
        return ['boolean', $]
    } else if ($ === null) {
        return ['null', null]
    } else if (Array.isArray($)) {
        return ['array', _ei.array_literal($)]
    } else if (typeof $ === 'object') {
        return ['object', _ei.dictionary_literal($)]
    } else {
        _ei.panic(`Unknown type: ${typeof $}`)
    }
}

export const expect_dictionary = (
    $: Value,
): _et.Dictionary<Value> => {
    if (typeof $ !== 'object' || $ === null || Array.isArray($)) {
        _ei.panic("Expected object")
    }
    const result = _ei.dictionary_literal($)
    return result
}

export const expect_verbose_type = (
    $: Value,
    allowed_properties: _et.Dictionary<null>
): _et.Dictionary<Value> => {
    if (typeof $ !== 'object' || $ === null || Array.isArray($)) {
        _ei.panic("Expected object")
    }
    const keys: string[] = []
    allowed_properties.map(($, key) => {
        keys.push(key)
    })
    Object.keys($).forEach((key) => {
        if (!keys.includes(key)) {
            _ei.panic(`Unexpected property: '${key}'`)
        }
    })
    return _ei.dictionary_literal($)
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
        () => _ei.panic("no such entry")
    )
}

export const expect_array = ($: Value): _et.Array<Value> => {
    if (!Array.isArray($)) {
        _ei.panic("Expected array")
    }
    return _ei.array_literal($)
}

export type State = [string, Value]

export const expect_state = ($: Value): State => {
    if (!Array.isArray($)) {
        console.log(JSON.stringify($))
        _ei.panic(`Expected array for state, got ${typeof $}`)
    }
    if ($.length !== 2) {
        console.log(JSON.stringify($))
        _ei.panic(`Expected tuple of 2 for state, got ${$.length}`)
    }
    const widget_name = $[0]
    const widget_value = $[1]
    if (typeof widget_name !== 'string') {
        console.log(JSON.stringify($))

        _ei.panic(`Expected state name to be string, got ${JSON.stringify(widget_name)}`)
    }
    return [widget_name, widget_value]
}

export const expect_number = ($: Value): number => {
    if (typeof $ !== 'number') {
        _ei.panic(`Expected number, got ${JSON.stringify($)}`)
    }
    return $
}

export const expect_boolean = ($: Value): boolean => {
    if (typeof $ !== 'boolean') {
        _ei.panic(`Expected boolean, got ${JSON.stringify($)}`)
    }
    return $
}

export const expect_text = ($: Value): string => {
    if (typeof $ !== 'string') {
        _ei.panic(`Expected text, got ${JSON.stringify($)}`)
    }
    return $
}

export const expect_null = ($: Value): null => {
    if ($ !== null) {
        _ei.panic(`Expected null, got ${JSON.stringify($)}`)
    }
    return null
}

export const expect_optional_null = ($: Value): _et.Optional_Value<Value> => {
    if ($ !== null) {
       return _ei.set($)
    }
    return _ei.not_set()
}