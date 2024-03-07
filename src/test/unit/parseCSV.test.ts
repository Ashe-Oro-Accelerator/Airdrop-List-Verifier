import { parseCSV } from '@/utils/parseCSV';

describe('parseCSV', () => {
  it('should return array of strings from separated by commas string ', async () => {
    const input = '0.0.123, 0.0.124, 0.0.125, 0.0.126';

    const result = parseCSV(input);

    expect(result).toEqual(['0.0.123', '0.0.124', '0.0.125', '0.0.126']);
  });

  it('should return array of strings from separated by commas without space string', async () => {
    const input = '0.0.123,0.0.124,0.0.125,0.0.126';

    const result = parseCSV(input);

    expect(result).toEqual(['0.0.123', '0.0.124', '0.0.125', '0.0.126']);
  });

  it('should return array of strings from separated by spaces string ', async () => {
    const input = '0.0.123 0.0.124 0.0.125 0.0.126';

    const result = parseCSV(input);

    expect(result).toEqual(['0.0.123', '0.0.124', '0.0.125', '0.0.126']);
  });

  it('should return array of strings from separated by commas and spaces string ', async () => {
    const input = '0.0.123, 0.0.124 0.0.125, 0.0.126';

    const result = parseCSV(input);

    expect(result).toEqual(['0.0.123', '0.0.124', '0.0.125', '0.0.126']);
  });

  it('should allow line breaks(enter key) between strings', () => {
    const input = '0.0.123\n' + '0.0.124';

    const result = parseCSV(input);

    expect(result).toEqual(['0.0.123', '0.0.124']);
  });
});
