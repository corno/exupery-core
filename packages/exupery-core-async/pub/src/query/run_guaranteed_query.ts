import * as _et from "exupery-core-types"

import { Guaranteed_Query_Result } from "./Guaranteed_Query_Result"

type Executer<T> = {
    'execute': (
        on_value: ($: T) => void
    ) => void
}


class Guaranteed_Query_Result_Class<T> implements Guaranteed_Query_Result<T> {
    private executer: Executer<T>
    constructor(executer: Executer<T>) {
        this.executer = executer
    }

    map<NT>(
        handle_value: ($: T) => NT
    ): Guaranteed_Query_Result<NT> {
        return __run_guaranteed_query(
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
        handle_value: ($: T) => Guaranteed_Query_Result<NT>
    ): Guaranteed_Query_Result<NT> {
        return __run_guaranteed_query(
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
export function __run_guaranteed_query<T>(
    executer: Executer<T>,
): Guaranteed_Query_Result<T> {
    return new Guaranteed_Query_Result_Class<T>(executer)

}