import * as _et from 'exupery-core-types'

export interface Async_Value_Or_Exception<T, E> {
    map<NT>($v: ($: T) => Async_Value_Or_Exception<NT, E>): Async_Value_Or_Exception<NT, E>
    map_exception<NE>($e: ($: E) => NE): Async_Value_Or_Exception<T, NE>
    catch_exception($e: ($: E) => _et.Async_Value<T>): _et.Async_Value<T>
    __execute($i: ($: T) => void, $e: ($: E) => void): void;
}
