export function convertStringToNumber(value: string) {
  if (typeof value === "string") {
    if (value.includes(",")) {
      return Number(value.replace(",", "."));
    }
  }
  return Number(value);
}
