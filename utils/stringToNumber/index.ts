export const convertFieldsToNumber = <T extends Record<string, any>>(
  data: T[],
  fields: (keyof T)[]
): T[] => {
  return data.map((item) => {
    const newItem = { ...item };
    fields.forEach((field) => {
      const value = newItem[field];
      if (typeof value === "string") {
        (newItem[field] as number) = parseFloat(value.replace(",", ".")) || 0;
      }
    });
    return newItem;
  });
};
