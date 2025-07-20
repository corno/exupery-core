import { get_location_info, location_to_string } from "./get_location_info"


export function panic_for_internal_functions(depth: number, ...message: string[]): never {
    const location = get_location_info(depth + 1)
    console.error(`PANIC: ${message.join(" ")} @ ${location_to_string(location)}`)
    const e = new Error()
    console.error(e.stack)
    process.exit(1)
}

/**
 * call this function if an error is en encountered that is unrecoverable
 * and the application should terminate immediately
 * this avoids throwing an Error because those can always be caught, which could lead to
 * misuse of library functionality
 * 
 * @param message message to be printed on stderr
 */
export function panic(...message: string[]): never {
    panic_for_internal_functions(1, ...message)
}