import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import { cp as fs_cp } from "fs"

import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/copy/data_types/target"
import { Signature } from "exupery-resources/dist/interface/algorithms/procedures/unguaranteed/copy"


export const $$: _et.Procedure_Primed_With_Resources<d.Parameters, d.Error> = (
    $p,
) => {
    const __possibly_escape_filename = (path: string, escape: boolean): string => {
    if (escape) {
        return path.replace(/ /g, '_')
    }
    return path
}
    return _easync.__create_procedure({
        'execute': (on_success, on_exception) => {
            const options: any = {}
            $p.options.recursive.map(($) => { options.recursive = $ })
            $p.options.force.map(($) => { options.force = $ })
            $p.options.errorOnExist.map(($) => { options.errorOnExist = $ })
            
            fs_cp(__possibly_escape_filename($p.source.path, $p.source['escape spaces in path']), __possibly_escape_filename($p.target.path, $p.target['escape spaces in path']), options, (err) => {
                if (err) {
                    on_exception(_ei.block((): d.Error => {
                        if (err.code === 'ENOENT') {
                            return ['source does not exist', null]
                        }
                        if (err.code === 'EACCES' || err.code === 'EPERM') {
                            return ['permission denied', null]
                        }
                        if (err.code === 'EISDIR' || err.code === 'ERR_FS_EISDIR') {
                            return ['node is not a file', null]
                        }
                        if (err.code === 'EFBIG') {
                            return ['file too large', null]
                        }
                        if (err.code === 'EIO' || err.code === 'ENXIO') {
                            return ['device not ready', null]
                        }
                        return _ei.panic(`unhandled fs.cp error code: ${err.code}`)
                    }))
                } else {
                    on_success()
                }
            })
        }
    })
}