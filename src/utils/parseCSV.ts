export const parseCSV = (input: string): string[] => {
  const splitValues = input.split(/,|\s|\n/);
  return splitValues.map((item) => item.trim()).filter((item) => item !== '');
};
