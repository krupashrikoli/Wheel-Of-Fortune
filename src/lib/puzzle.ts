export function normalizeMovieTitle(title: string): string {
  return title.toUpperCase();
}

export function getPuzzleLetters(title: string): string[] {
  return normalizeMovieTitle(title)
    .split("")
    .filter((char) => /[A-Z]/.test(char));
}

export function isLetterInPuzzle(title: string, letter: string): boolean {
  return getPuzzleLetters(title).includes(letter.toUpperCase());
}

export function isPuzzleSolved(title: string, guessedLetters: Set<string>): boolean {
  return getPuzzleLetters(title).every((letter) => guessedLetters.has(letter));
}

export function pickRoundMovies(
  movies: readonly string[],
  count: number,
  usedIndices: Set<number>
): { indices: number[]; titles: string[] } {
  const available = movies
    .map((title, index) => ({ title, index }))
    .filter(({ index }) => !usedIndices.has(index));

  const pool = available.length >= count ? available : movies.map((title, index) => ({ title, index }));

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  return {
    indices: selected.map(({ index }) => index),
    titles: selected.map(({ title }) => title),
  };
}
