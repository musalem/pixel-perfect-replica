import { createFileRoute } from "@tanstack/react-router";
import { RamadanExperience } from "@/components/ramadan/RamadanExperience";

export const Route = createFileRoute("/channels")({
  head: () => ({
    meta: [
      { title: "القنوات | رمضان زمان" },
      { name: "description", content: "اكتشف القنوات الافتراضية الست في تجربة رمضان زمان، من الدراما والفوازير إلى الطرب والذكريات." },
      { property: "og:title", content: "القنوات | رمضان زمان" },
      { property: "og:description", content: "محطات رمضانية افتراضية تستعيد نكهات التلفزيون المصري." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChannelsRoute,
});

function ChannelsRoute() {
  return <RamadanExperience section="channels" />;
}