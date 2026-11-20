import { createFileRoute } from "@tanstack/react-router";
import { RamadanExperience } from "@/components/ramadan/RamadanExperience";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "عن رمضان زمان | حكايات التلفزيون المصري" },
      { name: "description", content: "تعرف إلى رمضان زمان، تجربة تحتفي بذكريات أمسيات التلفزيون المصري وتحترم الحقوق والأرشيف." },
      { property: "og:title", content: "عن رمضان زمان | حكايات التلفزيون المصري" },
      { property: "og:description", content: "مشروع رقمي لاستعادة أجواء رمضان المصري وقنواته القديمة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutRoute,
});

function AboutRoute() {
  return <RamadanExperience section="about" />;
}