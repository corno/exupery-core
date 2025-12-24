import * as _easync from 'exupery-core-async'
import * as _ei from 'exupery-core-internals'
import * as _et from 'exupery-core-types'

//interface
import * as resources from "exupery-resources/dist/interface/resources"

export const $$: resources.queries.get_instream_data = _easync.__create_query((
) => {
    return _ei.__create_query_result((on_value) => {

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
    })
})