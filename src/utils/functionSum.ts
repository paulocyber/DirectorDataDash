// Utils
import { convertStringToNumber } from "./convertToNumeric";

export function TotalSum(data: any[], value: string) {
  return data.reduce((total, data) => {
    return total + convertStringToNumber(data[value]);
  }, 0);
}
