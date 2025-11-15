import * as _et from "exupery-core-types"


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

class Query_Result_Promise_Class<T, E> implements _et.Query_Promise<T, E> {
    private executer: Executer<T, E>
    constructor(executer: Executer<T, E>) {
        this.executer = executer
    }

    then<NT>(
        handle_value: ($: T) => _et.Query_Promise<NT, E>
    ): _et.Query_Promise<NT, E> {
        return new Query_Result_Promise_Class<NT, E>({
            'execute': (on_value, on_error) => {
                this.executer.execute(
                    ($) => {
                        handle_value($).__start(
                            on_value,
                            on_error,
                        )
                    },
                    on_error,
                )
            }
        })
    }
    map_exception<NE>(
        handle_exception: ($: E) => NE
    ): _et.Query_Promise<T, NE> {
        return new Query_Result_Promise_Class<T, NE>({
            'execute': (on_value, on_error) => {
                this.executer.execute(
                    on_value,
                    ($) => {
                        on_error(handle_exception($))
                    },
                )
            }
        })
    }

    process<New_Result>(
        processor: _et.Processor<T, New_Result, E>
    ): _et.Query_Promise<New_Result, E> {
        return new Query_Result_Promise_Class<New_Result, E>({
            'execute': (on_value, on_error) => {
                this.executer.execute(
                    ($) => {
                        processor(
                            $,
                            
                        ).__extract_data(
                            on_value,
                            on_error,
                        )
                    },
                    on_error,
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
export function __create_query_promise<T, E>(
    executer: Executer<T, E>,
): _et.Query_Promise<T, E> {
    return new Query_Result_Promise_Class<T, E>(executer)

}