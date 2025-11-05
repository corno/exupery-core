import * as _ei from 'exupery-core-internals'


class Refine_Guard_Abort_Exception<Error> {
    constructor(
        public readonly error: Error,
    ) { }
}

export type Abort<Error> = (error: Error) => never

export const refine_guard = <Result, Error>(
    callback: (abort: Abort<Error>) => Result
): _ei.Refinement_Result<Result, Error> => {
    try {
        return _ei.refinement.successful(callback((error) => {
            throw new Refine_Guard_Abort_Exception(error);
        }))
    } catch (e) {
        if (e instanceof Refine_Guard_Abort_Exception) {
            return _ei.refinement.failed<Result, Error>(e.error)
        }
        throw e
    }
}