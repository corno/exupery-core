import * as _et from "exupery-core-types"

import { Async_Value } from "exupery-core-types"
import { create_Async_Value } from "./create_Async_Value"


/**
 * this function contains the body in which the async value or exception is executed
 * after the execution, either the on_value or on_exception callback will be called
 * @param on_value the callback to call when a value is produced
 * @param on_exception the callback to call when an error is produced
 */
type Executer<T, E> = {
    'execute': (
        on_value: ($: T) => void,
        on_exception: ($: E) => void,
    ) => void
}

class Unsafe_Async_Value_Class<T, E> implements _et.Unsafe_Async_Value<T, E> {
    private executer: Executer<T, E>
    constructor(executer: Executer<T, E>) {
        this.executer = executer
    }
    map<NT>(
        handle_value: ($: T) => NT
    ): _et.Unsafe_Async_Value<NT, E> {
        return new Unsafe_Async_Value_Class<NT, E>({
            'execute': (on_value, on_exception) => {
                this.executer.execute(
                    ($) => {
                        on_value(handle_value($))
                    },
                    on_exception
                )
            }
        })
    }
    then<NT>(
        handle_value: ($: T) => _et.Unsafe_Async_Value<NT, E>
    ): _et.Unsafe_Async_Value<NT, E> {
        return new Unsafe_Async_Value_Class<NT, E>({
            'execute': (new_on_value, new_on_exception) => {
                this.executer.execute(
                    ($) => {
                        handle_value($).__start(
                            new_on_value,
                            new_on_exception,
                        )
                    },
                    new_on_exception,
                )
            }
        })
    }
    if_exception_then<NE>(
        handle_exception: ($: E) => _et.Unsafe_Async_Value<T, NE>
    ): _et.Unsafe_Async_Value<T, NE> {
        return new Unsafe_Async_Value_Class<T, NE>({
            'execute': (new_on_value, new_on_exception) => {
                this.executer.execute(
                    new_on_value,
                    ($) => {
                        handle_exception($).__start(
                            new_on_value,
                            new_on_exception,
                        )
                    },
                )
            }
        })
    }
    map_exception<NE>(
        handle_exception: ($: E) => NE
    ): _et.Unsafe_Async_Value<T, NE> {
        return new Unsafe_Async_Value_Class<T, NE>({
            'execute': (on_value, on_exception) => {
                this.executer.execute(
                    on_value,
                    ($) => {
                        on_exception(handle_exception($))
                    },
                )
            }
        })
    }
    catch(
        handle_exception: ($: E) => T
    ): _et.Async_Value<T> {
        return create_Async_Value<T>({
            'execute': (on_value) => {
                this.executer.execute(
                    on_value,
                    ($) => {
                        on_value(handle_exception($))
                    },
                )
            }
        })
    }
    catch_and_map<NT>(
        handle_value: ($: T) => NT,
        handle_exception: ($: E) => NT,
    ): _et.Async_Value<NT> {
        return create_Async_Value<NT>({
            'execute': (on_value) => {
                this.executer.execute(
                    ($) => {
                        on_value(handle_value($))
                    },
                    ($) => {
                        on_value(handle_exception($))
                    },
                )
            }
        })
    }
    __start(
        on_value: ($: T) => void,
        on_exception: ($: E) => void,
    ): void {
        this.executer.execute(on_value, on_exception)
    }
}

/**
 * returns an {@link Async_Value }
 * @param executer the function that produces the eventual value
 * @returns 
 */
export function create_Unsafe_Async_Value<T, E>(
    executer: Executer<T, E>,
): _et.Unsafe_Async_Value<T, E> {
    return new Unsafe_Async_Value_Class<T, E>(executer)

}