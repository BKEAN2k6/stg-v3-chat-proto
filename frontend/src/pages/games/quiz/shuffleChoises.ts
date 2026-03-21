export function shuffleChoises<T>(array: T[], seed: string): T[] {
  const result = [...array];
  let s = [...seed].reduce(
    (accumulator, char) => accumulator + char.codePointAt(0)!,
    0,
  );

  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 9301 + 49_297) % 233_280; // Simple linear congruential generator
    const randomIndex = Math.floor((s / 233_280) * (i + 1));
    [result[i], result[randomIndex]] = [result[randomIndex], result[i]];
  }

  return result;
}
