import { createFileRoute } from "@tanstack/react-router";
import { RamadanExperience } from "@/components/ramadan/RamadanExperience";

export const Route = createFileRoute("/archive")({
  head: () => ({
    meta: [
      { title: "أرشيف الذكريات | رمضان زمان" },
      { name: "description", content: "ابحث في عناوين رمضانية تجريبية وصفّها حسب القناة والفترة التاريخية في أرشيف رمضان زمان." },
      { property: "og:title", content: "أرشيف الذكريات | رمضان زمان" },
      { property: "og:description", content: "أرشيف قابل للتصفح ينتظر التسجيلات الموثوقة والمصرّح بها." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArchiveRoute,
});

function ArchiveRoute() {
  return <RamadanExperience section="archive" />;
}