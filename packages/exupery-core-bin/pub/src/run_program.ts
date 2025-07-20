import * as pt from 'exupery-core-types'
import * as pi from 'exupery-core-internals'

import * as api from "./bin_api"

import * as process from "process"

export function run_program(
    main_creator: api.API.main
): void {
    main_creator(null, null, null)({
        'exit': ($) => {
            process.exit($)
        },
        'stderr': {
            'data': ($) => {
                process.stderr.write($)
            },
            'end': () => {

            }
        },
        'stdout': {
            'data': ($) => {
                process.stdout.write($)

            },
            'end': () => {
                
            }
        }
    })({
        'arguments': pi.array_literal(process.argv.slice(2)) //strip 'node' and the script name
    })
}