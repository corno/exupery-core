import * as pt from "exupery-core-types"

import { Async_Value } from "exupery-core-types"
import * as x from "./Async_Value_Or_Exception.js"

type Execute<T, E> = (
    on_value: ($: T) => void,
    on_error: ($: E) => void,
) => void

class Async_Value_Or_Exception_Class<T, E> implements x.Async_Value_Or_Exception<T, E> {
    private execute: Execute<T, E>
    constructor(execute: Execute<T, E>) {
        this.execute = execute
    }
    map<NT>($v: ($: T) => x.Async_Value_Or_Exception<NT, E>): x.Async_Value_Or_Exception<NT, E> {
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
    map_exception<NE>($e: ($: E) => NE): x.Async_Value_Or_Exception<T, NE> {
        return new Async_Value_Or_Exception_Class<T, NE>(this.execute)
    }
    catch_exception($e: ($: E) => _et.Async_Value<T>): _et.Async_Value<T> {
        return cast_to_async_value_imp(this.execute)
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
export function cast_to_async_value_or_exception_imp<T, E>(
    execute: Execute<T, E>,
): x.Async_Value_Or_Exception<T, E> {
    return new Async_Value_Or_Exception_Class<T, E>(execute)

}