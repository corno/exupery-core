import * as pt from "exupery-core-types"

import { Async_Value } from "exupery-core-types"



export type Executer<T> = {
    'execute': (
        on_value: ($: T) => void
    ) => void
}


class Async_Value_Class<T> implements pt.Async_Value<T> {
    private executer: Executer<T>
    constructor(executer: Executer<T>) {
        this.executer = executer
    }
    map<NT>(handle_value: ($: T) => Async_Value<NT>): pt.Async_Value<NT> {
        return cast_to_async_value_imp(
            {
                'execute': (on_value) => {
                    this.executer.execute((value) => {
                        handle_value(value).__start(on_value)
                    })
                }
            }
        )
    }

    __start(on_value: ($: T) => void) {
        this.executer.execute(on_value)
    }
}

/**
 * returns an {@link Async_Value }
 * @param executer the function that produces the eventual value
 * @returns 
 */
export function cast_to_async_value_imp<T>(
    executer: Executer<T>,
): pt.Async_Value<T> {
    return new Async_Value_Class<T>(executer)

}