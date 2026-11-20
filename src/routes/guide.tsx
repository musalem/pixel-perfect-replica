import { createFileRoute } from "@tanstack/react-router";
import { RamadanExperience } from "@/components/ramadan/RamadanExperience";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "دليل البرامج | رمضان زمان" },
      { name: "description", content: "تصفّح قوائم برامج رمضان زمان التجريبية حسب القناة والفترة التاريخية، دون ادعاء وجود بث حي." },
      { property: "og:title", content: "دليل البرامج | رمضان زمان" },
      { property: "og:description", content: "قوائم استكشاف تجريبية للقنوات والذكريات الرمضانية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GuideRoute,
});

function GuideRoute() {
  return <RamadanExperience section="guide" />;
}