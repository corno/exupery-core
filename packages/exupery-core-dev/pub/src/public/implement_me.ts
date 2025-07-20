import * as pi from 'exupery-core-internals'
/**
 * use this function as a placeholder when you want to compile but have not fully developed all functionality yet.
 * 
 * this function should only be called from code that is in the development phase,
 * before publishing, the usages should be removed
 * @param message the string to be printed to stderr
 */
export function implement_me(): never {
    throw new Error(`IMPLEMENT ME @ ${pi.location_to_string(pi.get_location_info(1))}`)
}