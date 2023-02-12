// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const removeProperty = (key, { [key]: value, ...rest }) => rest;
export const removeProperties = (object, ...keys) =>
  keys.length
    ? removeProperties(removeProperty(keys.pop(), object), ...keys)
    : object;
