import * as _et from 'exupery-core-types';
import { Value } from "../src/types/instance";
export declare const expect_object: ($: Value) => _et.Dictionary<Value>;
export declare const expect_property: ($: _et.Dictionary<Value>, key: string) => Value;
export declare const expect_array: ($: Value) => _et.Array<Value>;
export type State = [string, Value];
export declare const expect_state: ($: Value) => State;
export declare const expect_number: ($: Value) => number;
export declare const expect_boolean: ($: Value) => boolean;
export declare const expect_text: ($: Value) => string;
export declare const expect_null: ($: Value) => null;
//# sourceMappingURL=unmarshall_helpers.d.ts.map