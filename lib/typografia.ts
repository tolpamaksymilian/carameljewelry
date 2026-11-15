/**
 * Typografia: twarda spacja po jednoliterowych słowach (i, z, w, o, a, u), żeby nie zostawały
 * na końcu linii, oraz przed krótkim myślnikiem, żeby nie zaczynał nowej linii.
 */
export const nbsp = (text: string) =>
  text.replace(/(^|[\s\u00A0])([aiouwzAIOUWZ]) /g, "$1$2\u00A0").replace(/ - /g, "\u00A0- ");
