export default function fetch10sen(): Promise<
  Record<
    string,
    { count: number; url: string | null; title: string; type: string }[]
  >
> {
  return fetch("https://otomadb.github.io/10sen-extract/data.json").then((b) =>
    b.json(),
  );
}
