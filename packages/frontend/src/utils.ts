
export const mergeClassName = (val1: string, val2?: string) => {
  return val1 + (val2 ? ' ' + val2 : '')
}
