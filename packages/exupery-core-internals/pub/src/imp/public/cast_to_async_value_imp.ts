import * as pt from "exupery-core-types"

import { Async_Value } from "exupery-core-types"

import { Execute } from "../types/Execute"

class Async_Value_Class<T> implements pt.Async_Value<T> {
    private execute: Execute<T>
    constructor(execute: Execute<T>) {
        this.execute = execute
    }
    map<NT>($v: ($: T) => Async_Value<NT>): pt.Async_Value<NT> {
        function rewrite<In, Out>(
            source: Execute<In>,
            rewrite: (source: In) => pt.Async_Value<Out>
        ): pt.Async_Value<Out> {
            return cast_to_async_value_imp(
                ((cb) => {
                    source((v) => {
                        rewrite(v).__execute(cb)
                    })
                })
            )
        }
        return rewrite(this.execute, $v)
    }

    __execute ($i: ($: T) => void) {
        this.execute($i)
    }
}

/**
 * returns an {@link Async_Value }
 * @param execute the function that produces the eventual value
 * @returns 
 */
export function cast_to_async_value_imp<T>(
    execute: Execute<T>,
): pt.Async_Value<T> {
    return new Async_Value_Class<T>(execute)

}