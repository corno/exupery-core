export const $$ = (path: string, escape: boolean): string => {
    if (escape) {
        return path.replaceAll(" ", '_')
    }
    return path
}