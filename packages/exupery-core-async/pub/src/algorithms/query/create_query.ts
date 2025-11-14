import * as _et from "exupery-core-types"


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

class Query_Result_Promise_Class<T, E> implements _et.Query_Promise<T, E> {
    private executer: Executer<T, E>
    constructor(executer: Executer<T, E>) {
        this.executer = executer
    }
    map_<NT>(
        handle_value: ($: T) => NT
    ): _et.Query_Promise<NT, E> {
        return new Query_Result_Promise_Class<NT, E>({
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
        handle_value: ($: T) => _et.Query_Promise<NT, E>
    ): _et.Query_Promise<NT, E> {
        return new Query_Result_Promise_Class<NT, E>({
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
    ): _et.Query_Promise<T, NE> {
        return new Query_Result_Promise_Class<T, NE>({
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
export function __create_query<T, E>(
    executer: Executer<T, E>,
): _et.Query_Promise<T, E> {
    return new Query_Result_Promise_Class<T, E>(executer)

}