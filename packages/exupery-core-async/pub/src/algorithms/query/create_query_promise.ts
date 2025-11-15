import * as _et from "exupery-core-types"


/**
 * this function contains the body in which the async value or error is executed
 * after the execution, either the on_result or on_error callback will be called
 * @param on_result the callback to call when a value is produced
 * @param on_error the callback to call when an error is produced
 */
type Executer<T, E> = {
    'execute': (
        on_result: ($: T) => void,
        on_error: ($: E) => void,
    ) => void
}

class Query_Result_Promise_Class<Result, Error> implements _et.Query_Promise<Result, Error> {
    private executer: Executer<Result, Error>
    constructor(executer: Executer<Result, Error>) {
        this.executer = executer
    }

    query_with_result<New_Result>(
        resource: _et.Query_Primed_With_Resources<Result, New_Result, Error>
    ): _et.Query_Promise<New_Result, Error> {
        return new Query_Result_Promise_Class<New_Result, Error>({
            'execute': (on_result, on_error) => {
                this.executer.execute(
                    ($) => {
                        resource.execute($).__start(
                            on_result,
                            on_error,
                        )
                    },
                    on_error,
                )
            }
        })
    }

    process_result<New_Result>(
        processor: _et.Processor<Result, New_Result, Error>
    ): _et.Query_Promise<New_Result, Error> {
        return new Query_Result_Promise_Class<New_Result, Error>({
            'execute': (on_result, on_error) => {
                this.executer.execute(
                    ($) => {
                        processor(
                            $,

                        ).__extract_data(
                            on_result,
                            on_error,
                        )
                    },
                    on_error,
                )
            }
        })
    }

    process_error<New_Error>(
        processor: _et.Processor<Error, Result, New_Error>
    ): _et.Query_Promise<Result, New_Error> {
        return new Query_Result_Promise_Class<Result, New_Error>({
            'execute': (on_result, on_error) => {
                this.executer.execute(
                    on_result,
                    ($) => {
                        processor(
                            $,

                        ).__extract_data(
                            on_result,
                            on_error,
                        )
                    },
                )
            }
        })
    }

    process<New_Result, New_Error>(processors: {
        'result': _et.Processor<Result, New_Result, New_Error>,
        'error': _et.Processor<Error, New_Result, New_Error>,
    }): _et.Query_Promise<New_Result, New_Error> {
        return new Query_Result_Promise_Class<New_Result, New_Error>({
            'execute': (on_result, on_error) => {
                this.executer.execute(
                    ($) => {
                        processors.result(
                            $,

                        ).__extract_data(
                            on_result,
                            on_error,
                        )
                    },
                    ($) => {
                        processors.error(
                            $,

                        ).__extract_data(
                            on_result,
                            on_error,
                        )
                    }
                )
            }
        })
    }


    map_result<New_Result>(
        resource: ($: Result) => New_Result
    ): _et.Query_Promise<New_Result, Error> {
        return new Query_Result_Promise_Class<New_Result, Error>({
            'execute': (on_result, on_error) => {
                this.executer.execute(
                    ($) => {
                        on_result(resource($))
                    },
                    on_error,
                )
            }
        })
    }

    map_error<New_Error>(
        handle_error: ($: Error) => New_Error
    ): _et.Query_Promise<Result, New_Error> {
        return new Query_Result_Promise_Class<Result, New_Error>({
            'execute': (on_result, on_error) => {
                this.executer.execute(
                    on_result,
                    ($) => {
                        on_error(handle_error($))
                    },
                )
            }
        })
    }

    map<New_Result, New_Error>(mappers: {
        'result': ($: Result) => New_Result,
        'error': ($: Error) => New_Error,
    }): _et.Query_Promise<New_Result, New_Error> {
        return new Query_Result_Promise_Class<New_Result, New_Error>({
            'execute': (on_result, on_error) => {
                this.executer.execute(
                    ($) => {
                        on_result(mappers.result($))
                    },
                    ($) => {
                        on_error(mappers.error($))
                    },
                )
            }
        })
    }

    __start(
        on_result: ($: Result) => void,
        on_error: ($: Error) => void,
    ): void {
        this.executer.execute(on_result, on_error)
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