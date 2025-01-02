export default function fetchMiru10(): Promise<
  Record<
    string,
    { count: number; url: string | null; title: string; type: string }[]
  >
> {
  return fetch("https://otomadb.github.io/miru10-extract/data.json").then((b) =>
    b.json(),
  );
}
