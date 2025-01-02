import pseudoThumbnail from "../images/pseudo_thumbnail.jpg";

export default async function (
  type: string,
  url: string | null,
): Promise<string> {
  if (!url) return pseudoThumbnail.src;

  switch (type) {
    case "nicovideo": {
      const sourceId = /(nm|sm)\d+/.exec(url)?.[0];

      if (!sourceId) {
        return pseudoThumbnail.src;
      }

      const res = await fetch(
        new URL(
          `/video/${sourceId}`,
          "https://nicovideo-api-proxy.otomadb.com",
        ),
      );
      if (!res.ok) return pseudoThumbnail.src;

      return (await res.json())?.thumbnailUrl || pseudoThumbnail.src;
    }
    default:
      return pseudoThumbnail.src;
  }
}
