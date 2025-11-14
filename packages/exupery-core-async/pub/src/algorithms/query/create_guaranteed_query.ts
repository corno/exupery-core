import * as _et from "exupery-core-types"

type Executer<T> = {
    'execute': (
        on_value: ($: T) => void
    ) => void
}


class Guaranteed_Query_Result_Promise_Class<T> implements _et.Guaranteed_Query_Promise<T> {
    private executer: Executer<T>
    constructor(executer: Executer<T>) {
        this.executer = executer
    }

    map<NT>(
        handle_value: ($: T) => NT
    ): _et.Guaranteed_Query_Promise<NT> {
        return __create_guaranteed_query(
            {
                'execute': (on_value) => {
                    this.executer.execute(
                        (value) => {
                            on_value(handle_value(value))
                        }
                    )
                }
            }
        )
    }
    then<NT>(
        handle_value: ($: T) => _et.Guaranteed_Query_Promise<NT>
    ): _et.Guaranteed_Query_Promise<NT> {
        return __create_guaranteed_query(
            {
                'execute': (on_value) => {
                    this.executer.execute(
                        (value) => {
                            handle_value(value).__start(on_value)
                        }
                    )
                }
            }
        )
    }

    __start(
        on_value: ($: T) => void
    ) {
        this.executer.execute(on_value)
    }
}

/**
 * returns an {@link Async_Value }
 * @param executer the function that produces the eventual value
 * @returns 
 */
export function __create_guaranteed_query<T>(
    executer: Executer<T>,
): _et.Guaranteed_Query_Promise<T> {
    return new Guaranteed_Query_Result_Promise_Class<T>(executer)

}