export const truncateString = (text: string, num: number): string => {
  if (text.length <= num) {
    return text;
  }
  return text.slice(0, num) + "...";
};
