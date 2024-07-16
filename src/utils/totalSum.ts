// Utils
import { convertStringToNumber } from "./masks/convertStringToNumber";

export function TotalSum(data: any[], value: string) {
  return data.reduce((total, data) => {
    return total + convertStringToNumber(data[value]);
  }, 0);
}
