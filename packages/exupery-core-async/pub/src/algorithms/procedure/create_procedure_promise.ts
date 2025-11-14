import * as _et from "exupery-core-types"
import * as _ei from "exupery-core-internals"


/**
 * this function contains the body in which the async value or exception is executed
 * after the execution, either the on_value or on_exception callback will be called
 * @param on_value the callback to call when a value is produced
 * @param on_exception the callback to call when an error is produced
 */
type Executer<E> = {
    'execute': (
        on_success: () => void,
        on_exception: ($: E) => void,
    ) => void
}

class Procedure_Promise_Class<E> implements _et.Procedure_Promise<E> {
    private executer: Executer<E>
    constructor(executer: Executer<E>) {
        this.executer = executer
    }

    __start(
        on_success: () => void,
        on_exception: ($: E) => void,
    ): void {
        this.executer.execute(on_success, on_exception)
    }

    map_error<NE>(
        handle_error: (error: E) => NE
    ): _et.Procedure_Promise<NE> {
        return new Procedure_Promise_Class<NE>({
            'execute': (on_success, on_exception) => {
                this.executer.execute(
                    on_success,
                    (error) => {
                        on_exception(handle_error(error))
                    }
                )
            }
        })
    }
}

/**
 * returns an {@link Async_Value }
 * @param executer the function that produces the eventual value
 * @returns 
 */
export function __create_procedure_promise<E>(
    executer: Executer<E>,
): _et.Procedure_Promise<E> {
    return new Procedure_Promise_Class<E>(executer)

}