export type I_Async_Registry = {
    readonly 'register': () => void
    readonly 'report_finished': () => void
}

/**
 * this function provides a callback with a counter as parameter
 * when the counter reaches 0, the onEnd callback is called
 * 
 * this function is specifically useful for async map functions
 * 
 * @param callback this callback creates a scope within which the counter is provided
 * @param onEnd this callback will be called when the counter reaches 0
 */
export function create_async_registry(
    registration_phase: ($: I_Async_Registry) => void,
    on_all_finished: () => void
): void {

    let counter = 0

    /*
     * we need to keep track of if the registration phase is ended or not.
     * it can happen that the counter reaches 0 during the registration phase, specifically if there is no real async calls being made
     * in that case the reportFinished counter is als called during the registration phase.
     * If that happens there should not yet be a call to onEnd().
     */
    let registration_phase_ended = false
    let on_all_finished_has_been_called = false

    function checkStatus() {
        if (registration_phase_ended) {

            if (counter === 0) {
                if (on_all_finished_has_been_called === true) {
                    throw new Error("CORE: already ended")
                }
                on_all_finished_has_been_called = true
                on_all_finished()
            }
        }
    }
    registration_phase({
        register: () => {
            if (on_all_finished_has_been_called) {
                throw new Error("CORE: async call done after context is ready")
            }
            counter += 1

        },
        report_finished: () => {
            if (counter === 0) {
                throw new Error("CORE: decrement while counter is 0")
            }
            counter -= 1
            checkStatus()
        },
    })
    registration_phase_ended = true
    checkStatus()
}
