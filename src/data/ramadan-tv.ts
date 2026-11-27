export type HistoricalEra = "الثمانينيات" | "التسعينيات" | "بداية الألفينات";

export interface Channel {
  id: string;
  number: string;
  name: string;
  category: string;
  description: string;
  icon: "drama" | "fawazeer" | "kids" | "ads" | "variety" | "music";
}

export interface Program {
  id: string;
  channelId: string;
  title: string;
  description: string;
  category: string;
  era: HistoricalEra;
  originalYear: null;
}

export interface ScheduleEntry {
  channelId: string;
  programIds: string[];
  isDemonstration: true;
}

export const ERA_OPTIONS: { value: HistoricalEra | "all"; label: string }[] = [
  { value: "all", label: "كل الأزمنة" },
  { value: "الثمانينيات", label: "الثمانينيات" },
  { value: "التسعينيات", label: "التسعينيات" },
  { value: "بداية الألفينات", label: "بداية الألفينات" },
];

export const CHANNELS: Channel[] = [
  {
    id: "drama",
    number: "01",
    name: "دراما زمان",
    category: "دراما مصرية",
    description: "حكايات الشاشة التي اجتمعت عليها العائلة بعد الإفطار.",
    icon: "drama",
  },
  {
    id: "fawazeer",
    number: "02",
    name: "قناة الفوازير",
    category: "فوازير رمضانية",
    description: "ألغاز واستعراضات صنعت طقساً رمضانياً لا يُنسى.",
    icon: "fawazeer",
  },
  {
    id: "kids",
    number: "03",
    name: "قناة الأطفال",
    category: "ذكريات الطفولة",
    description: "عالم من الحكايات والأغاني التي كبرنا عليها.",
    icon: "kids",
  },
  {
    id: "ads",
    number: "04",
    name: "قناة الإعلانات",
    category: "إعلانات من الذاكرة",
    description: "أغانٍ قصيرة وصور ارتبطت برمضان في البيوت المصرية.",
    icon: "ads",
  },
  {
    id: "variety",
    number: "05",
    name: "قناة المنوعات",
    category: "ترفيه ومسابقات",
    description: "جلسات تلفزيونية خفيفة من أمسيات الشهر الكريم.",
    icon: "variety",
  },
  {
    id: "music",
    number: "06",
    name: "قناة الطرب والذكريات",
    category: "موسيقى وإنشاد",
    description: "ألحان وأناشيد تستعيد سكينة ليالي رمضان.",
    icon: "music",
  },
];

export const PROGRAMS: Program[] = [
  { id: "drama-80", channelId: "drama", title: "حكاية من دراما زمان", description: "بطاقة تجريبية لأرشيف الدراما المصرية الرمضانية.", category: "دراما", era: "الثمانينيات", originalYear: null },
  { id: "drama-90", channelId: "drama", title: "سهرة درامية عائلية", description: "عنوان نموذجي لتجربة تصفح الأعمال الدرامية.", category: "دراما", era: "التسعينيات", originalYear: null },
  { id: "fawazeer-80", channelId: "fawazeer", title: "فقرة من الفوازير", description: "بطاقة توضيحية لفئة الفوازير والاستعراضات الرمضانية.", category: "فوازير", era: "الثمانينيات", originalYear: null },
  { id: "fawazeer-90", channelId: "fawazeer", title: "لغز الليلة", description: "عنوان تجريبي لتجربة مجموعة الفوازير.", category: "فوازير", era: "التسعينيات", originalYear: null },
  { id: "kids-90", channelId: "kids", title: "حكاية للصغار", description: "بطاقة نموذجية لمحتوى الأطفال والرسوم المصرية.", category: "أطفال", era: "التسعينيات", originalYear: null },
  { id: "kids-2000", channelId: "kids", title: "مغامرة بعد الإفطار", description: "عنوان تجريبي لرفوف ذكريات الطفولة.", category: "أطفال", era: "بداية الألفينات", originalYear: null },
  { id: "ads-80", channelId: "ads", title: "أغنية إعلانية من الذاكرة", description: "بطاقة توضيحية لفئة الإعلانات الرمضانية القديمة.", category: "إعلانات", era: "الثمانينيات", originalYear: null },
  { id: "ads-90", channelId: "ads", title: "فاصل رمضاني قصير", description: "عنوان نموذجي لقسم الفواصل والأغنيات القصيرة.", category: "إعلانات", era: "التسعينيات", originalYear: null },
  { id: "variety-90", channelId: "variety", title: "مسابقة السهرة", description: "بطاقة تجريبية لمسابقات وبرامج المنوعات.", category: "منوعات", era: "التسعينيات", originalYear: null },
  { id: "variety-2000", channelId: "variety", title: "لقاء على مائدة رمضان", description: "عنوان نموذجي لتجربة تصفح المنوعات.", category: "منوعات", era: "بداية الألفينات", originalYear: null },
  { id: "music-80", channelId: "music", title: "أنشودة من ليالي رمضان", description: "بطاقة توضيحية لفئة الأناشيد والابتهالات.", category: "طرب وإنشاد", era: "الثمانينيات", originalYear: null },
  { id: "music-2000", channelId: "music", title: "نغمات وذكريات", description: "عنوان تجريبي لقسم الموسيقى والذكريات.", category: "طرب وإنشاد", era: "بداية الألفينات", originalYear: null },
];

// The guide is an illustrative browsing order, not a real or current broadcast schedule.
export const SCHEDULES: ScheduleEntry[] = CHANNELS.map((channel) => ({
  channelId: channel.id,
  programIds: PROGRAMS.filter((program) => program.channelId === channel.id).map((program) => program.id),
  isDemonstration: true,
}));

export const filterPrograms = (
  programs: Program[],
  era: HistoricalEra | "all",
  channelId: string | "all",
  query: string,
) => {
  const normalizedQuery = query.trim().toLocaleLowerCase("ar");
  return programs.filter((program) => {
    const channel = CHANNELS.find((item) => item.id === program.channelId);
    return (
      (era === "all" || program.era === era) &&
      (channelId === "all" || program.channelId === channelId) &&
      (!normalizedQuery || `${program.title} ${program.description} ${program.category} ${channel?.name ?? ""}`.toLocaleLowerCase("ar").includes(normalizedQuery))
    );
  });
};