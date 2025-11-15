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
        query: _et.Query_Primed_With_Resources<Result, New_Result, Error>
    ): _et.Query_Promise<New_Result, Error> {
        return new Query_Result_Promise_Class<New_Result, Error>({
            'execute': (on_result, on_error) => {
                this.executer.execute(
                    ($) => {
                        query.execute($).__start(
                            on_result,
                            on_error,
                        )
                    },
                    on_error,
                )
            }
        })
    }
    query_with_error<New_Error>(
        query: _et.Query_Primed_With_Resources<Error, Result, New_Error>
    ): _et.Query_Promise<Result, New_Error> {
        return new Query_Result_Promise_Class<Result, New_Error>({
            'execute': (on_result, on_error) => {
                this.executer.execute(
                    on_result,
                    ($) => {
                        query.execute($).__start(
                            on_result,
                            on_error,
                        )
                    },
                )
            }
        })
    }

    query<New_Result, New_Error>(queries: {
        'result': _et.Query_Primed_With_Resources<Result, New_Result, New_Error>,
        'error': _et.Query_Primed_With_Resources<Error, New_Result, New_Error>,
    }): _et.Query_Promise<New_Result, New_Error> {
        return new Query_Result_Promise_Class<New_Result, New_Error>({
            'execute': (on_result, on_error) => {
                this.executer.execute(
                    ($) => {
                        queries.result.execute($).__start(
                            on_result,
                            on_error,
                        )
                    },
                    ($) => {
                        queries.error.execute($).__start(
                            on_result,
                            on_error,
                        )
                    }
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


    transform_result<New_Result>(
        transformer: _et.Transformer_Without_Parameters<Result, New_Result>
    ): _et.Query_Promise<New_Result, Error> {
        return new Query_Result_Promise_Class<New_Result, Error>({
            'execute': (on_result, on_error) => {
                this.executer.execute(
                    ($) => {
                        on_result(transformer($))
                    },
                    on_error,
                )
            }
        })
    }

    transform_error<New_Error>(
        transformer: _et.Transformer_Without_Parameters<Error, New_Error>
    ): _et.Query_Promise<Result, New_Error> {
        return new Query_Result_Promise_Class<Result, New_Error>({
            'execute': (on_result, on_error) => {
                this.executer.execute(
                    on_result,
                    ($) => {
                        on_error(transformer($))
                    },
                )
            }
        })
    }

    transform<New_Result, New_Error>(transformers: {
        'result': _et.Transformer_Without_Parameters<Result, New_Result>,
        'error': _et.Transformer_Without_Parameters<Error, New_Error>,
    }): _et.Query_Promise<New_Result, New_Error> {
        return new Query_Result_Promise_Class<New_Result, New_Error>({
            'execute': (on_result, on_error) => {
                this.executer.execute(
                    ($) => {
                        on_result(transformers.result($))
                    },
                    ($) => {
                        on_error(transformers.error($))
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