import * as _et from "exupery-core-types"
import * as _ei from "exupery-core-internals"

import { Async_Value } from "exupery-core-types"
import * as x from "./Async_Value_Or_Exception.js"


/**
 * this function contains the body in which the async value or exception is executed
 * after the execution, either the on_value or on_error callback will be called
 * @param on_value the callback to call when a value is produced
 * @param on_error the callback to call when an error is produced
 */
type Executer<T, E> = {
    'execute': (
        on_value: ($: T) => void,
        on_error: ($: E) => void,
    ) => void
}

class Async_Value_Or_Exception_Class<T, E> implements x.Async_Value_Or_Exception<T, E> {
    private executer: Executer<T, E>
    constructor(executer: Executer<T, E>) {
        this.executer = executer
    }
    map<NT>(
        handle_value: ($: T) => x.Async_Value_Or_Exception<NT, E>
    ): x.Async_Value_Or_Exception<NT, E> {
        return new Async_Value_Or_Exception_Class<NT, E>({
            'execute': (new_on_value, new_on_error) => {
                this.executer.execute(
                    ($) => {
                        handle_value($).__start(
                            new_on_value,
                            new_on_error,
                        )
                    },
                    new_on_error,
                )
            }
        })
    }
    map_exception<NE>(
        handle_error: ($: E) => x.Async_Value_Or_Exception<T, NE>
    ): x.Async_Value_Or_Exception<T, NE> {
        return new Async_Value_Or_Exception_Class<T, NE>({
            'execute': (new_on_value, new_on_error) => {
                this.executer.execute(
                    new_on_value,
                    ($) => {
                        handle_error($).__start(
                            new_on_value,
                            new_on_error,
                        )
                    },
                )
            }
        })
    }
    catch(
        handle_error: ($: E) => _et.Async_Value<T>
    ): _et.Async_Value<T> {
        return _ei.cast_to_async_value_imp<T>({
            'execute': (new_on_value) => {
                this.executer.execute(
                    new_on_value,
                    ($) => {
                        handle_error($).__start(
                            new_on_value,
                        )
                    },
                )
            }
        })
    }
    catch_and_map<NT>(
        handle_value: ($: T) => _et.Async_Value<NT>,
        handle_error: ($: E) => _et.Async_Value<NT>,
    ): _et.Async_Value<NT> {
        return _ei.cast_to_async_value_imp<NT>({
            'execute': (new_on_value) => {
                this.executer.execute(
                    ($) => {
                        handle_value($).__start(new_on_value)
                    },
                    ($) => {
                        handle_error($).__start(new_on_value)
                    },
                )
            }
        })
    }
    __start(
        on_value: ($: T) => void,
        on_error: ($: E) => void,
    ): void {
        this.executer.execute(on_value, on_error)
    }
}

/**
 * returns an {@link Async_Value }
 * @param executer the function that produces the eventual value
 * @returns 
 */
export function cast_to_async_value_or_exception_imp<T, E>(
    executer: Executer<T, E>,
): x.Async_Value_Or_Exception<T, E> {
    return new Async_Value_Or_Exception_Class<T, E>(executer)

}