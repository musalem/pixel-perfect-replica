import { createFileRoute } from "@tanstack/react-router";
import { RamadanExperience } from "@/components/ramadan/RamadanExperience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "رمضان زمان | تلفزيون الحكايات الرمضانية" },
      { name: "description", content: "شغّل التلفزيون واستعد دفء أمسيات رمضان المصرية بين قنوات زمان والأرشيف التفاعلي." },
      { property: "og:title", content: "رمضان زمان | تلفزيون الحكايات الرمضانية" },
      { property: "og:description", content: "تجربة تلفزيونية مصرية تستعيد حكايات وأمسيات رمضان القديمة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <RamadanExperience section="tv" />;
}
