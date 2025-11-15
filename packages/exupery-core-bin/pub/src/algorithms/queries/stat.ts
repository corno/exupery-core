import * as _easync from 'exupery-core-async'
import * as _et from 'exupery-core-types'
import * as _ei from 'exupery-core-internals'

import { stat as fs_stat } from "fs"

import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/stat/data_types/target"
import { Signature } from "exupery-resources/dist/interface/algorithms/queries/stat"


export const $$: _et.Query_Primed_With_Resources<d.Parameters, d.Result, d.Error> = _easync.__create_query_primed_with_resources((
    $p
) => {
    const __possibly_escape_filename = (path: string, escape: boolean): string => {
        if (escape) {
            return path.replace(/ /g, '_')
        }
        return path
    }
    return _easync.__create_query_promise({
        'execute': (on_value, on_error) => {
            fs_stat(__possibly_escape_filename($p.path, $p['escape spaces in path']), (err, stats) => {
                if (err) {
                    on_error(_ei.block((): d.Error => {
                        if (err.code === 'ENOENT') {
                            return ['node does not exist', null]
                        }
                        return _ei.panic(`unhandled fs.stat error code: ${err.code}`)
                    }))
                }
                on_value(stats.isFile()
                    ? ['file', null]
                    : ['directory', null]
                )
            })
        }
    })
})