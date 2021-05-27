export const filterUndefinedVars = (vars: {
  [variableName: string]: unknown;
}): string[] => {
  return Object.entries(vars)
    .filter(([_k, v]) => typeof v === 'undefined')
    .map(([variableName]) => variableName);
};
