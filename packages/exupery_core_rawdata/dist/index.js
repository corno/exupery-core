export const JSON_stringify = (obj) => {
    return JSON.stringify(obj);
};
export const String_length = (s) => {
    return s.length;
};
export const Math_min = (...values) => {
    return Math.min(...values);
};
export const Math_max = (...values) => {
    return Math.max(...values);
};
export const console_log = (...args) => {
    console.log(...args);
};
export * from "./unmarshall_helpers";
