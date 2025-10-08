import { cwd as process_cwd } from "process"
import { relative as path_relative } from "path"

export type Source_Location = {
    'file': string,
    'line': number,
    'column': number,
}

/**
 * 
 * @returns the string on the specified line
 */
function get_line(e: Error, depth: number): string {
    const regex = /\((.*)\)$/
    //const regex = /\((.*):(\d+):(\d+)\)$/ //further splitted; file,line,column,
    if (e.stack === undefined) {
        throw new Error("NO STACK INFO")
    }
    const line = e.stack.split("\n")[depth + 2]
    const match = regex.exec(line);

    //determine the path relative to the current working directory
    return path_relative(process_cwd(), (() => {
        if (match === null) {
            const begin = "    at /"
            if (line.startsWith(begin)) {
                return path_relative(process_cwd(), line.substring(begin.length - 1));
            } else {
                throw new Error(`COULD NOT PARSE STACK LINE: ${line}`)
            }
        } else {
            return match[1]
        }
    })())

}

/**
 * provides the source location (filepath and line number) of the source code file where this function is called,
 * or if the depth is bigger than 0, the source location of the function at that stack depth
 * @param depth 
 * @returns 
 */
export function get_location_info(depth: number): Source_Location {

    //we create an error, not to be thrown but to be disected for its stack
    const e = new Error(); //don't move this statement to another function, it will change the depth of its stack

    const line = get_line(e, depth)
    const split = line.split(":")
    if (split.length !== 3) {
        throw new Error(`UNEXPECTED LOCATION FORMAT (CHECK THE DEPTH PARAMETER): ${line} (Expected 'file:line:column')`)
    }
    return {
        'file': split[0],
        'line': Number(split[1]),
        'column': Number(split[2]),
    }
}

export function location_to_string(location: Source_Location): string {
    return `${location.file}:${location.line}:${location.column}`
}