import * as _et from "exupery-core-types"

import { __create_guaranteed_query } from "./create_guaranteed_query"
import { _Unguaranteed_Query } from "../../types/Unguaranteed_Query"
import { _Guaranteed_Query } from "../../types/Guaranteed_Query"


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

class Unguaranteed_Query_Result_Class<T, E> implements _Unguaranteed_Query<T, E> {
    private executer: Executer<T, E>
    constructor(executer: Executer<T, E>) {
        this.executer = executer
    }
    map_<NT>(
        handle_value: ($: T) => NT
    ): _Unguaranteed_Query<NT, E> {
        return new Unguaranteed_Query_Result_Class<NT, E>({
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
        handle_value: ($: T) => _Guaranteed_Query<NT>
    ): _Unguaranteed_Query<NT, E> {
        return new Unguaranteed_Query_Result_Class<NT, E>({
            'execute': (new_on_value, new_on_exception) => {
                this.executer.execute(
                    ($) => {
                        handle_value($).__start(
                            new_on_value,
                        )
                    },
                    new_on_exception,
                )
            }
        })
    }
    then_unguaranteed<NT>(
        handle_value: ($: T) => _Unguaranteed_Query<NT, E>
    ): _Unguaranteed_Query<NT, E> {
        return new Unguaranteed_Query_Result_Class<NT, E>({
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
    map_exception_<NE>(
        handle_exception: ($: E) => NE
    ): _Unguaranteed_Query<T, NE> {
        return new Unguaranteed_Query_Result_Class<T, NE>({
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

    catch_(
        handle_exception: ($: E) => _Guaranteed_Query<T>
    ): _Guaranteed_Query<T> {
        return __create_guaranteed_query<T>({
            'execute': (on_value) => {
                this.executer.execute(
                    on_value,
                    ($) => {
                        handle_exception($).__start(on_value)
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
export function __create_unguaranteed_query<T, E>(
    executer: Executer<T, E>,
): _Unguaranteed_Query<T, E> {
    return new Unguaranteed_Query_Result_Class<T, E>(executer)

}