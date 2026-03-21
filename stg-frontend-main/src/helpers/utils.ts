// Calculates an equal division out of 100 for provided numbers

// Some examples:
// equalDivision([1]) => [100]
// equalDivision([1,1]) => [50, 50]
// equalDivision([1,2]) => [33, 67]
// equalDivision([10,10,10,10]) => [25, 25, 25, 25]
// equalDivision([10,10,10,10,10]) => [20, 20, 20, 20, 20]

export function equalDivision(numbers: number[]) {
  const total = numbers.reduce((a, b) => a + b, 0);
  const percentages = numbers.map((number) => {
    const number_ = (number / total) * 100;
    return Number.parseFloat(number_.toFixed(2));
  });
  return percentages;
}

export function formatNameList(names: string[], separator: string): string {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  const allButLast = names.slice(0, -1).join(', ');
  const last = names.at(-1);
  return `${allButLast} ${separator} ${last}`;
}
