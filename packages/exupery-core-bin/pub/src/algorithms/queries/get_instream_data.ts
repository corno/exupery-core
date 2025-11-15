import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

import * as d from "exupery-resources/dist/interface/generated/pareto/schemas/get_instream_data/data_types/target"
import { Signature } from "exupery-resources/dist/interface/algorithms/queries/guaranteed/get_instream_data"


export const $$: _et.Query_Primed_With_Resources<null, d.Result, null> = _easync.__create_query_primed_with_resources((
) => {
    return _easync.__create_query_promise({
        'execute': (on_value) => {
            
            const stdin = process.stdin;
            let data = '';
            stdin.setEncoding('utf8');

            stdin.on('data', (chunk: string) => {
                data += chunk;
            });

            stdin.on('end', () => {
                on_value(data);
            });

            stdin.resume();
        }
    })
})