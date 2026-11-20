import { createFileRoute } from "@tanstack/react-router";
import { RamadanExperience } from "@/components/ramadan/RamadanExperience";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "المفضّلة | رمضان زمان" },
      { name: "description", content: "ارجع بسهولة إلى عناوين ذكرياتك المختارة في رمضان زمان." },
      { property: "og:title", content: "المفضّلة | رمضان زمان" },
      { property: "og:description", content: "العناوين التي تحفظها من أرشيف الذكريات في مكان واحد." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FavoritesRoute,
});

function FavoritesRoute() {
  return <RamadanExperience section="favorites" />;
}