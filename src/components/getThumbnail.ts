export default async function (type: string, url: string | null) {
  if (!url) return null;

  switch (type) {
    case "nicovideo": {
      const sourceId = /(nm|sm)\d+/.exec(url)?.[0];

      if (!sourceId) {
        return null;
      }

      const res = await fetch(
        new URL(
          `/video/${sourceId}`,
          "https://nicovideo-api-proxy.otomadb.com",
        ),
      );
      if (!res.ok) return null;

      return (await res.json())?.thumbnailUrl || null;
    }
    default:
      return null;
  }
}
