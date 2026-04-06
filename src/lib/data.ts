//src/lib/data.ts
import type {
  Article,
  BalloonQuestion,
  FillBlankQuestion,
  Letter,
  LevelOption,
  PlacementLevel,
  QuizQuestion,
  SortSentence,
  Word,
} from "@/types";

// =====================================================
// Extra local types
// =====================================================

export type LessonKind = "lesson" | "rule" | "practice" | "exam";

export interface GradeLesson {
  id: string;
  grade: number;
  kind: LessonKind;
  title: string;
  short: string;
  quiz: string;
  html: string;
}

export interface MatchPair {
  left: string;
  right: string;
  hint?: string;
}
export interface SpeedRound {
  prompt: string;
  correct: string;
  wrong: string[];
  mode: "letter" | "word" | "rule" | "sentence";
  mg?: string | null;
}

export interface WriteTarget {
  mg: string;
  r: string;
  guide: string;
  example?: string;
}

function gradeKey(grade: number): 6 | 7 | 8 | 9 | 10 | 11 | 12 {
  if (grade <= 6) return 6;
  if (grade === 7) return 7;
  if (grade === 8) return 8;
  if (grade === 9) return 9;
  if (grade === 10) return 10;
  if (grade === 11) return 11;
  return 12;
}
// =====================================================
// Alphabet / letters
// =====================================================

export const LETTERS: Letter[] = [
  { mg: "ᠠ", r: "A", t: "vowel", x: "аав" },
  { mg: "ᠡ", r: "E", t: "vowel", x: "ээж" },
  { mg: "ᠢ", r: "I", t: "vowel", x: "ишиг" },
  { mg: "ᠣ", r: "O", t: "vowel", x: "орон" },
  { mg: "ᠤ", r: "U", t: "vowel", x: "ус" },
  { mg: "ᠥ", r: "Ö", t: "vowel", x: "өнгө" },
  { mg: "ᠦ", r: "Ü", t: "vowel", x: "үсэг" },

  { mg: "ᠨ", r: "N", t: "consonant", x: "нар" },
  { mg: "ᠩ", r: "NG", t: "consonant", x: "энгэ" },
  { mg: "ᠪ", r: "B", t: "consonant", x: "багш" },
  { mg: "ᠫ", r: "P", t: "consonant", x: "парк" },
  { mg: "ᠬ", r: "H", t: "consonant", x: "хүүхэд" },
  { mg: "ᠭ", r: "G", t: "consonant", x: "газар" },
  { mg: "ᠮ", r: "M", t: "consonant", x: "морь" },
  { mg: "ᠯ", r: "L", t: "consonant", x: "лам" },
  { mg: "ᠰ", r: "S", t: "consonant", x: "сар" },
  { mg: "ᠱ", r: "SH", t: "consonant", x: "шар" },
  { mg: "ᠲ", r: "T", t: "consonant", x: "тал" },
  { mg: "ᠳ", r: "D", t: "consonant", x: "дуу" },
  { mg: "ᠴ", r: "CH", t: "consonant", x: "чоно" },
  { mg: "ᠵ", r: "J", t: "consonant", x: "жил" },
  { mg: "ᠶ", r: "Y", t: "consonant", x: "явах" },
  { mg: "ᠷ", r: "R", t: "consonant", x: "радио" },
  { mg: "ᠸ", r: "W", t: "consonant", x: "вагон" },
  { mg: "ᠹ", r: "F", t: "consonant", x: "файл" },
  { mg: "ᠺ", r: "K", t: "consonant", x: "карт" },
  { mg: "ᠻ", r: "KH", t: "consonant", x: "хишиг" },
  { mg: "ᠼ", r: "TS", t: "consonant", x: "цас" },
  { mg: "ᠽ", r: "Z", t: "consonant", x: "зам" },
  { mg: "ᠾ", r: "HH", t: "consonant", x: "һаан" },
  { mg: "ᡀ", r: "LH", t: "consonant", x: "алхаа" },
  { mg: "ᡁ", r: "ZH", t: "consonant", x: "жавар" },
  { mg: "ᡂ", r: "CHH", t: "consonant", x: "чимээ" },
  { mg: "ᡃ", r: "RH", t: "consonant", x: "арвин" },
  { mg: "ᡄ", r: "Q", t: "consonant", x: "хатан" },
  { mg: "ᡅ", r: "X", t: "consonant", x: "хүсэл" },
];

// =====================================================
// Dictionary words
// =====================================================

export const WORDS: Word[] = [
  { mg: "ᠮᠣᠷᠢ", r: "mori", mn: "морь", cat: "Амьтан", grades: [6] },
  { mg: "ᠴᠣᠨᠣ", r: "chono", mn: "чоно", cat: "Амьтан", grades: [7] },
  { mg: "ᠣᠭᠣᠲᠣᠨᠣ", r: "ogotono", mn: "оготно", cat: "Амьтан", grades: [8] },
  { mg: "ᠪᠤᠭ᠎ᠠ", r: "buga", mn: "буга", cat: "Амьтан", grades: [9] },

  { mg: "ᠭᠡᠷ", r: "ger", mn: "гэр", cat: "Гэр ахуй", grades: [10] },
  { mg: "ᠲᠣᠣᠨᠣ", r: "toono", mn: "тооно", cat: "Гэр ахуй", grades: [11] },
  { mg: "ᠬᠠᠨ᠎ᠠ", r: "khana", mn: "хана", cat: "Гэр ахуй", grades: [12] },

  { mg: "ᠤᠰ", r: "us", mn: "ус", cat: "Байгаль", grades: [6] },
  { mg: "ᠨᠠᠷ", r: "nar", mn: "нар", cat: "Байгаль", grades: [6] },
  { mg: "ᠲᠡᠩᠭᠡᠷ", r: "tenger", mn: "тэнгэр", cat: "Байгаль", grades: [6] },
  { mg: "ᠰᠠᠯᠬᠢ", r: "salkhi", mn: "салхи", cat: "Байгаль", grades: [6] },

  {
    mg: "ᠰᠤᠷᠭᠠᠭᠤᠯᠢ",
    r: "surguuli",
    mn: "сургууль",
    cat: "Боловсрол",
    grades: [6],
  },
  { mg: "ᠪᠠᠭᠰᠢ", r: "bagshi", mn: "багш", cat: "Боловсрол", grades: [6] },
  { mg: "ᠬᠢᠴᠢᠶᠡᠯ", r: "khicheel", mn: "хичээл", cat: "Боловсрол", grades: [6] },
  { mg: "ᠨᠣᠮ", r: "nom", mn: "ном", cat: "Боловсрол", grades: [6] },
  { mg: "ᠲᠣᠯᠢ", r: "toli", mn: "толь", cat: "Боловсрол", grades: [6] },

  { mg: "ᠰᠠᠢᠨ", r: "sain", mn: "сайн", cat: "Тэмдэг нэр", grades: [6] },
  { mg: "ᠲᠣᠮᠣ", r: "tomo", mn: "том", cat: "Тэмдэг нэр", grades: [6] },
  { mg: "ᠵᠢᠵᠢᠭ", r: "jijig", mn: "жижиг", cat: "Тэмдэг нэр", grades: [6] },
  {
    mg: "ᠦᠵᠡᠰᠭᠡᠯᠡᠨᠲᠡᠢ",
    r: "uzesgelentei",
    mn: "үзэсгэлэнтэй",
    cat: "Тэмдэг нэр",
  },

  { mg: "ᠶᠠᠪᠠᠬᠤ", r: "yabahu", mn: "явах", cat: "Үйл үг" },
  { mg: "ᠤᠩᠰᠢᠬᠤ", r: "ungshikhu", mn: "унших", cat: "Үйл үг" },
  { mg: "ᠪᠢᠴᠢᠬᠦ", r: "bichikhu", mn: "бичих", cat: "Үйл үг" },
  { mg: "ᠰᠤᠷᠠᠬᠤ", r: "surakhu", mn: "сурах", cat: "Үйл үг" },
  { mg: "ᠬᠠᠷᠠᠬᠤ", r: "kharakhu", mn: "харах", cat: "Үйл үг" },
  { mg: "ᠢᠳᠡᠬᠦ", r: "idekhu", mn: "идэх", cat: "Үйл үг" },
];

// =====================================================
// Level select
// =====================================================

export const LEVEL_OPTIONS: LevelOption[] = [
  {
    n: 1,
    grade: "6-р анги",
    name: "Анхан шат",
    desc: "Үсэг таних, энгийн үг унших суурь түвшин",
    color: "sky",
  },
  {
    n: 2,
    grade: "7-р анги",
    name: "Суурь дүрэм",
    desc: "Эгшгийн зохицол, нөхцөл залгалтын эхний ойлголт",
    color: "grass",
  },
  {
    n: 3,
    grade: "8-р анги",
    name: "Хэлбэр зүй",
    desc: "Үйл үгийн хэлбэр, үг бүтцийн ойлголт",
    color: "sand",
  },
  {
    n: 4,
    grade: "9-р анги",
    name: "Уншлагын ахиц",
    desc: "Өгүүлбэрийн бүтэц, эх ойлголт",
    color: "ember",
  },
  {
    n: 5,
    grade: "10-р анги",
    name: "Уран уншлага",
    desc: "Уран зохиолын эх, утга тайлбарлах түвшин",
    color: "sky",
  },
  {
    n: 6,
    grade: "11–12-р анги",
    name: "Ахисан шат",
    desc: "Соёлын эх, хөрвүүлэлт, найруулга",
    color: "grass",
  },
];

// =====================================================
// Placement
// =====================================================

export const PLACEMENT_LEVELS: PlacementLevel[] = [
  { score: 0, n: 1, emoji: "", name: "Анхан шат", grade: "6-р анги" },
  { score: 3, n: 2, emoji: "", name: "Суурь шат", grade: "7-р анги" },
  { score: 5, n: 3, emoji: "", name: "Дунд шат", grade: "8-р анги" },
  { score: 7, n: 4, emoji: "", name: "Ахиж буй шат", grade: "9-р анги" },
  { score: 9, n: 5, emoji: "", name: "Сайн түвшин", grade: "10-р анги" },
  {
    score: 11,
    n: 6,
    emoji: "🏆",
    name: "Ахисан түвшин",
    grade: "11–12-р анги",
  },
];

export const PLACEMENT_QUESTIONS: QuizQuestion[] = [
  {
    q: "Үндэсний бичиг ямар чиглэлтэй бичигддэг вэ?",
    mg: null,
    opts: ["Зүүнээс баруун", "Дээрээс доош", "Баруунаас зүүн", "Доороос дээш"],
    c: 1,
    lvl: 1,
    cat: "Үсэг таних",
  },
  {
    q: "ᠠ нь ямар төрлийн үсэг вэ?",
    mg: "ᠠ",
    opts: ["Эгшиг", "Гийгүүлэгч", "Нөхцөл", "Дагавар"],
    c: 0,
    lvl: 1,
    cat: "Үсэг таних",
  },
  {
    q: "“хичээл” + “ийн” зөв хэлбэр аль нь вэ?",
    mg: null,
    opts: ["хичээлын", "хичээлийн", "хичээлээ", "хичээлд"],
    c: 1,
    lvl: 2,
    cat: "Нөхцөл залгавар",
  },
  {
    q: "Эгшгийн зохицол нь юунд нөлөөлдөг вэ?",
    mg: null,
    opts: ["Үсгийн өнгө", "Нөхцөл сонголт", "Зураг", "Тоолол"],
    c: 1,
    lvl: 2,
    cat: "Нөхцөл залгавар",
  },
  {
    q: "Аль нь үйл үг вэ?",
    mg: null,
    opts: ["гэр", "уншина", "хүүхэд", "ном"],
    c: 1,
    lvl: 3,
    cat: "Үгийн утга",
  },
  {
    q: "Үгийн үндэс ба дагаврыг ялгах нь юунд хэрэгтэй вэ?",
    mg: null,
    opts: [
      "Үг бүтцийг ойлгоход",
      "Зөвхөн зураг зурахад",
      "Өнгө ялгахад",
      "Дуу дуулахад",
    ],
    c: 0,
    lvl: 3,
    cat: "Нөхцөл залгавар",
  },
  {
    q: "Өгүүлбэрийн гол санааг олох нь аль чадварт хамаарах вэ?",
    mg: null,
    opts: ["Уншлагын ойлголт", "Тоо бодолт", "Зураглал", "Өнгө ялгах"],
    c: 0,
    lvl: 4,
    cat: "Өгүүлбэр",
  },
  {
    q: "Энгийн ба нийлмэл өгүүлбэр судлах нь аль ангид илүү тохирох вэ?",
    mg: null,
    opts: ["6-р анги", "7-р анги", "9-р анги", "12-р анги"],
    c: 2,
    lvl: 4,
    cat: "Өгүүлбэр",
  },
  {
    q: "Уран зохиолын эхтэй ажиллахад юу илүү чухал вэ?",
    mg: null,
    opts: [
      "Дүр, утга, санааг тайлбарлах",
      "Зөвхөн тоо харах",
      "Зөвхөн үсэг цээжлэх",
      "Зөвхөн зураг будах",
    ],
    c: 0,
    lvl: 5,
    cat: "Өгүүлбэр",
  },
  {
    q: "Соёлын агуулгатай эх унших нь аль түвшинд илүү тохирох вэ?",
    mg: null,
    opts: ["6-р анги", "8-р анги", "11-р анги", "7-р анги"],
    c: 2,
    lvl: 5,
    cat: "Өгүүлбэр",
  },
  {
    q: "Кириллээс үндэсний бичигт буулгахдаа юуг хамт авч үзэх вэ?",
    mg: null,
    opts: [
      "Дүрэм, утга, бүтэц",
      "Зөвхөн эхний үсэг",
      "Зөвхөн өнгө",
      "Зөвхөн зурган тэмдэг",
    ],
    c: 0,
    lvl: 6,
    cat: "Өгүүлбэр",
  },
  {
    q: "Найруулан бичихэд аль нь хамгийн чухал вэ?",
    mg: null,
    opts: [
      "Өгүүлбэрийн уялдаа",
      "Зөвхөн мөрийн урт",
      "Зөвхөн үгийн тоо",
      "Зөвхөн үсгийн өндөр",
    ],
    c: 0,
    lvl: 6,
    cat: "Өгүүлбэр",
  },
];

// =====================================================
// Grade options + lessons
// =====================================================

export const GRADE_OPTIONS = [6, 7, 8, 9, 10, 11, 12] as const;

export const LESSONS: GradeLesson[] = [
  // 6-р анги
  {
    id: "g6_intro",
    grade: 6,
    kind: "lesson",
    title: "6-р анги · Үндэсний бичгийн анхан ойлголт",
    short: "Бичих чиглэл, үсгийн байрлал, дармал ба бичмэл дүрсийн ялгаа.",
    quiz: "g6_basic",
    html: `
      <div class="bg-sky-50 border-2 border-sky-100 rounded-2xl p-4 mb-4">
        <p class="text-[12px] font-extrabold text-sky-300 mb-2 uppercase tracking-wide">Гол ойлголт</p>
        <p class="text-[14px] text-[#3a3a5c] font-semibold leading-relaxed">
          Үндэсний бичиг нь босоо бичигддэг. Үсэг нь эх, дунд, адаг байрлалд өөр дүрстэй байж болно.
        </p>
      </div>
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        6-р ангид сурагчид үндэсний бичгийн бичлэгийн чиглэл, үсгийн байрлал, энгийн таних чадварыг эзэмшинэ.
      </p>
    `,
  },
  {
    id: "g6_letters",
    grade: 6,
    kind: "lesson",
    title: "6-р анги · Эгшиг ба гийгүүлэгч",
    short: "Үсгийг ангилж таних, энгийн үгэнд ялгаж унших.",
    quiz: "g6_basic",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed mb-4">
        Эгшиг нь үе бүтээдэг, гийгүүлэгч нь үгийн хэлбэрийг тогтооно. Энэ ялгааг зөв таних нь унших суурь болно.
      </p>
      <table class="w-full text-[14px] border-collapse">
        <thead>
          <tr class="border-b-2 border-paper-100">
            <th class="text-left px-3 py-2 font-extrabold">Төрөл</th>
            <th class="text-left px-3 py-2 font-extrabold">Жишээ</th>
            <th class="text-left px-3 py-2 font-extrabold">Тайлбар</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-paper-50">
            <td class="px-3 py-3">Эгшиг</td>
            <td class="px-3 py-3">ᠠ, ᠡ, ᠢ</td>
            <td class="px-3 py-3">Үеийн цөм болдог</td>
          </tr>
          <tr>
            <td class="px-3 py-3">Гийгүүлэгч</td>
            <td class="px-3 py-3">ᠮ, ᠨ, ᠯ</td>
            <td class="px-3 py-3">Эгшигтэй нийлж үг бүтээнэ</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: "g6_practice",
    grade: 6,
    kind: "practice",
    title: "6-р анги · Энгийн үг унших дасгал",
    short: "Энгийн үг, холбоо үгийг хараад таних, унших.",
    quiz: "g6_basic",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Энэ дасгалд сурагч энгийн үгсийг хараад таних, ижил дүрсийг олж унших, зурагтай холбох дасгал хийнэ.
      </p>
    `,
  },
  {
    id: "g6_exam",
    grade: 6,
    kind: "exam",
    title: "6-р анги · Анхан шатны шалгалт",
    short: "Үсэг таних, ялгах, энгийн үг унших чадварыг шалгана.",
    quiz: "g6_basic",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Энэ шалгалтаар 6-р ангийн сурагч үсэг таних, энгийн үг унших чадвараа шалгана.
      </p>
    `,
  },

  // 7-р анги
  {
    id: "g7_harmony",
    grade: 7,
    kind: "lesson",
    title: "7-р анги · Эгшгийн зохицол",
    short: "Эгшгийн шинж нөхцөл сонгоход хэрхэн нөлөөлдөгийг сурна.",
    quiz: "g7_rules",
    html: `
      <div class="bg-grass-50 border-2 border-grass-100 rounded-2xl p-4 mb-4">
        <p class="text-[12px] font-extrabold text-grass-300 mb-2 uppercase tracking-wide">Гол ойлголт</p>
        <p class="text-[14px] text-[#3a3a5c] font-semibold leading-relaxed">
          Үгийн эгшгийн шинж нь дараа залгах нөхцөл, дагаврын хэлбэрт нөлөөлдөг.
        </p>
      </div>
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        7-р ангид сурагч зөв хувилбар сонгох, дүрмийн дагуу залгах чадвараа хөгжүүлнэ.
      </p>
    `,
  },
  {
    id: "g7_cases",
    grade: 7,
    kind: "rule",
    title: "7-р анги · Нөхцөл залгалт",
    short: "Үгэнд нөхцөл хэрхэн залгахыг сурна.",
    quiz: "g7_rules",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed mb-4">
        Нөхцөл залгахдаа үгийн төгсгөлийн үсэг, эгшгийн шинж, авианы зохицлыг хамт харгалзана.
      </p>
      <table class="w-full text-[14px] border-collapse">
        <thead>
          <tr class="border-b-2 border-paper-100">
            <th class="text-left px-3 py-2 font-extrabold">Үндэс</th>
            <th class="text-left px-3 py-2 font-extrabold">Нөхцөл</th>
            <th class="text-left px-3 py-2 font-extrabold">Зөв хэлбэр</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-paper-50">
            <td class="px-3 py-3">хичээл</td>
            <td class="px-3 py-3">+ийн</td>
            <td class="px-3 py-3">хичээлийн</td>
          </tr>
          <tr>
            <td class="px-3 py-3">сургууль</td>
            <td class="px-3 py-3">+д</td>
            <td class="px-3 py-3">сургуульд</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: "g7_practice",
    grade: 7,
    kind: "practice",
    title: "7-р анги · Зөв хувилбар сонгох",
    short: "Ижил төстэй хоёр хэлбэрээс дүрмийн дагуу зөвийг сонгоно.",
    quiz: "g7_rules",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Энэ дасгалд сурагч зөв, буруу хоёр бичлэгийг харьцуулж, дүрмийн дагуу зөв хувилбарыг сонгоно.
      </p>
    `,
  },
  {
    id: "g7_exam",
    grade: 7,
    kind: "exam",
    title: "7-р анги · Дүрмийн шалгалт",
    short: "Эгшгийн зохицол ба нөхцөл залгалтын агуулгаар шалгалт өгнө.",
    quiz: "g7_rules",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Энэ шалгалтаар 7-р ангийн дүрмийн үндсэн ойлголтуудыг бататгана.
      </p>
    `,
  },

  // 8-р анги
  {
    id: "g8_verb",
    grade: 8,
    kind: "lesson",
    title: "8-р анги · Үйл үгийн хэлбэр",
    short: "Үйл үгийн цаг, хэлбэр, хэрэглээний анхан ойлголт.",
    quiz: "g8_verb",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed mb-4">
        8-р ангид үйл үгийн хэлбэрийг ялгах, өгүүлбэр доторх хэрэглээг ойлгох нь чухал.
      </p>
      <div class="bg-sand-50 border-2 border-sand-100 rounded-2xl p-4">
        <p class="text-[13px] font-extrabold text-sand-300 mb-2 uppercase tracking-wide">Жишээ</p>
        <p class="text-[14px] text-[#3a3a5c] font-semibold leading-relaxed">
          уншина, бичнэ, сурсан, харсан, явж байна
        </p>
      </div>
    `,
  },
  {
    id: "g8_suffix",
    grade: 8,
    kind: "rule",
    title: "8-р анги · Дагавар, залгаврын хэрэглээ",
    short: "Үг бүтэхэд оролцох дагавар, нөхцөлийг танина.",
    quiz: "g8_verb",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Үгийн бүтцийг задлан харах, үндэс ба дагаврыг ялгах нь зөв бичих суурь болно.
      </p>
    `,
  },
  {
    id: "g8_practice",
    grade: 8,
    kind: "practice",
    title: "8-р анги · Үг бүтцийн дасгал",
    short: "Үгийн үндэс, дагавар, нөхцөлийг ялгах дасгал.",
    quiz: "g8_verb",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Энэ хэсэгт сурагч үгийг задлан харж, бүтцийг нь тайлбарлах дасгал хийнэ.
      </p>
    `,
  },
  {
    id: "g8_exam",
    grade: 8,
    kind: "exam",
    title: "8-р анги · Хэлбэр зүйн шалгалт",
    short: "Үйл үг, дагавар, үг бүтцийн агуулгаар шалгалт өгнө.",
    quiz: "g8_verb",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Энэ шалгалтаар 8-р ангийн хэлбэр зүйн ойлголтыг бататгана.
      </p>
    `,
  },

  // 9-р анги
  {
    id: "g9_sentence",
    grade: 9,
    kind: "lesson",
    title: "9-р анги · Өгүүлбэрийн бүтэц",
    short: "Энгийн ба нийлмэл өгүүлбэрийг ялгаж ойлгоно.",
    quiz: "g9_reading",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed mb-4">
        9-р ангид өгүүлбэрийг бүтнээр нь ойлгох, үгийн холбоо, бүтцийн уялдааг харах чадвар чухал.
      </p>
      <ul class="list-disc pl-5 text-[14px] text-[#6a6a8a] font-semibold leading-relaxed space-y-2">
        <li>Энгийн өгүүлбэр</li>
        <li>Нийлмэл өгүүлбэр</li>
        <li>Холбоо үг, хоршоо үг</li>
      </ul>
    `,
  },
  {
    id: "g9_wordform",
    grade: 9,
    kind: "rule",
    title: "9-р анги · Үг бүтэх ёс",
    short: "Үгийн бүтэц, бүтээвэр, хэлбэрийг ажиглана.",
    quiz: "g9_reading",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Үгийг зөвхөн уншихаас гадна яаж бүтэж байгааг нь тайлбарлах нь утгыг ойлгоход тусална.
      </p>
    `,
  },
  {
    id: "g9_practice",
    grade: 9,
    kind: "practice",
    title: "9-р анги · Эх уншиж ойлгох",
    short: "Бичмэл, дармал эхээс гол санаа, үгсийн утгыг танина.",
    quiz: "g9_reading",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Эх уншихдаа гол санаа, түлхүүр үг, утгын холбоог таних дасгал хийнэ.
      </p>
    `,
  },
  {
    id: "g9_exam",
    grade: 9,
    kind: "exam",
    title: "9-р анги · Уншлагын шалгалт",
    short: "Өгүүлбэрийн бүтэц, эх ойлголтын агуулгаар шалгалт өгнө.",
    quiz: "g9_reading",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Энэ шалгалтаар 9-р ангийн уншлага, өгүүлбэрийн ойлголтыг шалгана.
      </p>
    `,
  },

  // 10-р анги
  {
    id: "g10_literature",
    grade: 10,
    kind: "lesson",
    title: "10-р анги · Уран зохиолын эх унших",
    short: "Сонгодог болон орчин үеийн эхийн гол санааг ойлгоно.",
    quiz: "g10_literature",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed mb-4">
        10-р ангид уран зохиолын эх уншиж, утга, санаа, дүрийг тайлбарлах чадвар хөгжүүлнэ.
      </p>
      <div class="bg-ember-50 border-2 border-ember-100 rounded-2xl p-4">
        <p class="text-[13px] font-extrabold text-ember-300 mb-2 uppercase tracking-wide">Чадвар</p>
        <p class="text-[14px] text-[#3a3a5c] font-semibold leading-relaxed">
          Гол санаа олох · дүр ойлгох · сургамж гаргах
        </p>
      </div>
    `,
  },
  {
    id: "g10_meaning",
    grade: 10,
    kind: "rule",
    title: "10-р анги · Утга тайлбарлах",
    short: "Эхийн доторх үг, хэллэгийн утгыг тайлбарлана.",
    quiz: "g10_literature",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Уран зохиолын эхийн үг, хэллэгийн утга, дүрслэлийг агуулгаас нь тайлбарлах дасгал хийнэ.
      </p>
    `,
  },
  {
    id: "g10_practice",
    grade: 10,
    kind: "practice",
    title: "10-р анги · Уншлагын сорил",
    short: "Уншсан эхээс асуултад хариулж гол санааг ялгана.",
    quiz: "g10_literature",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Сурагч эхийн гол санаа, дүр, сургамжийг ялган таних сорил ажиллана.
      </p>
    `,
  },
  {
    id: "g10_exam",
    grade: 10,
    kind: "exam",
    title: "10-р анги · Уран уншлагын шалгалт",
    short: "Уран зохиолын эхтэй ажиллах чадварыг шалгана.",
    quiz: "g10_literature",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Энэ шалгалтаар 10-р ангийн уншлага, утга тайлбарлах чадварыг үнэлнэ.
      </p>
    `,
  },

  // 11-р анги
  {
    id: "g11_culture",
    grade: 11,
    kind: "lesson",
    title: "11-р анги · Монгол ёс заншлын эх",
    short: "Уламжлал, ахуй, зан үйлийн агуулгатай эх уншина.",
    quiz: "g11_culture",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed mb-4">
        11-р ангид монгол ёс заншил, уламжлалт ахуйн эхүүдийг уншиж ойлгох агуулга давамгайлна.
      </p>
      <ul class="list-disc pl-5 text-[14px] text-[#6a6a8a] font-semibold leading-relaxed space-y-2">
        <li>Уламжлалт зан үйл</li>
        <li>Ахуй соёлын эх</li>
        <li>Соёлын нэр томьёо</li>
      </ul>
    `,
  },
  {
    id: "g11_terms",
    grade: 11,
    kind: "rule",
    title: "11-р анги · Нэр томьёо ба ухагдахуун",
    short: "Соёлын агуулгатай нэр томьёог зөв ойлгож хэрэглэнэ.",
    quiz: "g11_culture",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Энэ хичээлд соёл, уламжлалтай холбоотой үгсийн утга, хэрэглээг таних дасгал хийнэ.
      </p>
    `,
  },
  {
    id: "g11_practice",
    grade: 11,
    kind: "practice",
    title: "11-р анги · Соёлын эхийн ойлголт",
    short: "Эхээс гол санаа, нэр томьёо, агуулгын холбоог гаргана.",
    quiz: "g11_culture",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Уламжлалт эхийг уншихдаа утга, нөхцөл, соёлын агуулгыг хамтад нь харах хэрэгтэй.
      </p>
    `,
  },
  {
    id: "g11_exam",
    grade: 11,
    kind: "exam",
    title: "11-р анги · Соёлын уншлагын шалгалт",
    short: "Ёс заншил, уламжлалын эхийн ойлголтоор шалгалт өгнө.",
    quiz: "g11_culture",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Энэ шалгалтаар сурагч соёлын эхийг ойлгож, нэр томьёог зөв таньж байгаа эсэхээ шалгана.
      </p>
    `,
  },

  // 12-р анги
  {
    id: "g12_translation",
    grade: 12,
    kind: "lesson",
    title: "12-р анги · Хөрвүүлэлт",
    short: "Үндэсний бичиг ба кирилл бичгийн хооронд буулгах чадвар.",
    quiz: "g12_advanced",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed mb-4">
        12-р ангид үндэсний бичгийг кириллд, кириллийг үндэсний бичигт буулгах чадвар хөгжүүлнэ.
      </p>
      <div class="bg-sky-50 border-2 border-sky-100 rounded-2xl p-4">
        <p class="text-[13px] font-extrabold text-sky-300 mb-2 uppercase tracking-wide">Анхаарах зүйл</p>
        <p class="text-[14px] text-[#3a3a5c] font-semibold leading-relaxed">
          Шууд нэг үсэг-нэг үсгээр бус, дүрэм, утга, бүтцийг хамтад нь харна.
        </p>
      </div>
    `,
  },
  {
    id: "g12_writing",
    grade: 12,
    kind: "lesson",
    title: "12-р анги · Найруулан бичих",
    short: "Өөрийн санааг зөв бүтэцтэй, найруулгатай бичих.",
    quiz: "g12_advanced",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Энэ хэсэгт өгүүлбэрийн уялдаа, санааны дараалал, зөв бичгийн дүрмийг баримтлан богино эх бичих чадварыг хөгжүүлнэ.
      </p>
    `,
  },
  {
    id: "g12_practice",
    grade: 12,
    kind: "practice",
    title: "12-р анги · Ахисан түвшний дасгал",
    short: "Хөрвүүлэлт, утга тайлбар, найруулгын холимог дасгал.",
    quiz: "g12_advanced",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Энд сурагч ахисан түвшний нийлмэл даалгавар гүйцэтгэж, өмнөх мэдлэгээ нэгтгэнэ.
      </p>
    `,
  },
  {
    id: "g12_exam",
    grade: 12,
    kind: "exam",
    title: "12-р анги · Төгсгөлийн шалгалт",
    short: "Хөрвүүлэлт, найруулга, утга ойлголтын нийлмэл шалгалт.",
    quiz: "g12_advanced",
    html: `
      <p class="text-[15px] text-[#6a6a8a] font-semibold leading-relaxed">
        Энэ шалгалт нь ахисан түвшний нэгтгэсэн үнэлгээ бөгөөд хөрвүүлэлт, утга ойлголт, бичлэгийг хамтад нь шалгана.
      </p>
    `,
  },
];

// =====================================================
// Quiz banks
// =====================================================

// =====================================================
// Reading
// =====================================================

export const ARTICLES: Article[] = [
  {
    t: "6-р анги · Энгийн үг таних",
    l: "Анхан шат",
    mg: "ᠮᠣᠷᠢ ᠭᠦᠶᠦᠨ᠎ᠡ᠃ ᠬᠦᠦᠬᠡᠳ ᠤᠩᠰᠢᠨ᠎ᠠ᠃",
    mn: "Морь гүйнэ. Хүүхэд уншина.",
  },
  {
    t: "7-р анги · Зөв хувилбар таних",
    l: "Суурь дүрэм",
    mg: "ᠬᠢᠴᠢᠶᠡᠯ ᠬᠢᠳᠦᠨ ᠪᠠᠶᠢᠨ᠎ᠠ᠃",
    mn: "Хичээл хэдэн байна.",
  },
  {
    t: "8-р анги · Үйл үгийн хэрэглээ",
    l: "Хэлбэр зүй",
    mg: "ᠪᠢ ᠨᠣᠮ ᠤᠩᠰᠢᠨ᠎ᠠ᠃ ᠲᠡᠷᠡ ᠪᠢᠴᠢᠨ᠎ᠡ᠃",
    mn: "Би ном уншина. Тэр бичнэ.",
  },
  {
    t: "9-р анги · Өгүүлбэрийн ойлголт",
    l: "Уншлага",
    mg: "ᠬᠠᠪᠠᠷ ᠴᠠᠭ ᠨᠠᠶᠢᠮ᠎ᠠ᠃ ᠬᠦᠦᠬᠡᠳ ᠲᠠᠯ᠎ᠠ ᠳᠡᠭᠡᠷ ᠨᠠᠭᠠᠳᠠᠨ᠎ᠠ᠃",
    mn: "Хавар цаг найман. Хүүхэд тал дээр наадана.",
  },
  {
    t: "10-р анги · Эхийн гол санаа",
    l: "Уран уншлага",
    mg: "ᠮᠣᠩᠭᠣᠯ ᠬᠦᠨ ᠪᠠᠶᠢᠭᠠᠯᠢ ᠳᠤ ᠬᠠᠶᠢᠷᠲᠠᠢ᠃",
    mn: "Монгол хүн байгальд хайртай.",
  },
  {
    t: "11-р анги · Соёлын эх",
    l: "Уламжлал",
    mg: "ᠭᠡᠷ ᠪᠣᠯ ᠮᠣᠩᠭᠣᠯ ᠠᠬᠤᠢ ᠰᠣᠶᠣᠯ ᠮᠥᠨ᠃",
    mn: "Гэр бол монгол ахуй соёл мөн.",
  },
  {
    t: "12-р анги · Хөрвүүлэлт ба найруулга",
    l: "Ахисан шат",
    mg: "ᠪᠢᠴᠢᠭ ᠬᠡᠯ ᠬᠥᠷᠪᠦᠯᠭᠡ ᠪᠣᠯ ᠳᠦᠷᠢᠮ ᠪᠠ ᠤᠲᠭ᠎ᠠ ᠬᠣᠶᠠᠷ ᠰᠢᠳᠦᠯᠲᠡᠢ᠃",
    mn: "Бичиг хэл хөрвүүлэг бол дүрэм ба утга хоёр шүтэлцээтэй.",
  },
];
// =====================================================
// Games data (legacy flat data)
// =====================================================

export const MATCH_PAIRS: MatchPair[] = [
  { left: "морь", right: "амьтан", hint: "унаа, мал" },
  { left: "гэр", right: "байшин", hint: "амьдрах орон" },
  { left: "ус", right: "шингэн", hint: "ундаа, гол" },
  { left: "нар", right: "гэрэл", hint: "өдрийн тэнгэрт" },
  { left: "ном", right: "унших", hint: "хичээлийн хэрэглэгдэхүүн" },
  { left: "багш", right: "заах", hint: "хичээл ордог хүн" },
  { left: "толь", right: "тайлбар", hint: "үгийн сан" },
  { left: "сургууль", right: "боловсрол", hint: "хичээл ордог газар" },
];

export const SORT_SENTENCES: SortSentence[] = [
  {
    p: ["Би", "ном", "уншина"],
    a: ["Би", "ном", "уншина"],
    tr: "I read a book.",
  },
  {
    p: ["Хүүхэд", "сургуульд", "явна"],
    a: ["Хүүхэд", "сургуульд", "явна"],
    tr: "The child goes to school.",
  },
  {
    p: ["Монгол", "бичиг", "сайхан"],
    a: ["Монгол", "бичиг", "сайхан"],
    tr: "Mongolian script is beautiful.",
  },
  {
    p: ["Багш", "хичээл", "заана"],
    a: ["Багш", "хичээл", "заана"],
    tr: "The teacher teaches a lesson.",
  },
  {
    p: ["Бид", "өдөр", "бүр", "сурна"],
    a: ["Бид", "өдөр", "бүр", "сурна"],
    tr: "We study every day.",
  },
];

export const FILL_BLANKS: FillBlankQuestion[] = [
  {
    before: "Маргааш миний",
    blank: "төрсөн",
    after: "өдөр.",
    choices: ["төрсөн", "төссөн", "тарсан", "төрөөсөн"],
    c: 0,
    tr: "Tomorrow is my birthday.",
  },
  {
    before: "Хүүхэд",
    blank: "сургуульд",
    after: "явна.",
    choices: ["сургуульд", "сургуулыд", "сургуулд", "сургуулд"],
    c: 0,
    tr: "The child goes to school.",
  },
  {
    before: "Би номоо",
    blank: "уншина",
    after: ".",
    choices: ["уншина", "уншена", "уншино", "уншанаа"],
    c: 0,
    tr: "I will read my book.",
  },
  {
    before: "Манай анги",
    blank: "гучин",
    after: "сурагчтай.",
    choices: ["гучин", "гүчин", "гочин", "гучэн"],
    c: 0,
    tr: "Our class has thirty students.",
  },
  {
    before: "Зараа их",
    blank: "тайван",
    after: "амьтан.",
    choices: ["тайван", "тайбаан", "таван", "тайбан"],
    c: 0,
    tr: "The hedgehog is a very calm animal.",
  },
];

export const BALLOON_QUESTIONS: BalloonQuestion[] = [
  {
    q: "Зөв бичсэн үгийг сонго",
    correct: "сургууль",
    wrong: ["шударга", "сургуул", "сургуули", "сургуульа"],
  },
  {
    q: "Зөв бичсэн үгийг сонго",
    correct: "арга",
    wrong: ["араг", "аргаа", "арг", "аргааа"],
  },
  {
    q: "Зөв бичсэн үгийг сонго",
    correct: "харах",
    wrong: ["харх", "хараах", "харак", "харга"],
  },
  {
    q: "Зөв бичсэн үгийг сонго",
    correct: "ургамал",
    wrong: ["урғамал", "ургамл", "ургаамал", "ургмaл"],
  },
  {
    q: "Зөв бичсэн үгийг сонго",
    correct: "оготно",
    wrong: ["огтно", "оготноо", "оготано", "огтоно"],
  },
];

export const BALLOON_COLORS = [
  "#4a9ede",
  "#3dba68",
  "#f0a030",
  "#e84848",
  "#7c5cbf",
  "#1a9e8a",
];

// =====================================================
// Grade-based game banks
// =====================================================

export const MATCH_BANK: Record<6 | 7 | 8 | 9 | 10 | 11 | 12, MatchPair[]> = {
  6: [
    { left: "ᠠ", right: "А", hint: "эгшиг" },
    { left: "ᠮ", right: "М", hint: "гийгүүлэгч" },
    { left: "ᠨ", right: "Н", hint: "гийгүүлэгч" },
    { left: "ᠭ", right: "Г", hint: "гийгүүлэгч" },
    { left: "ᠣ", right: "О", hint: "эгшиг" },
    { left: "ᠤ", right: "У", hint: "эгшиг" },
  ],
  7: [
    { left: "сайн", right: "тэмдэг нэр", hint: "чанар" },
    { left: "том", right: "тэмдэг нэр", hint: "хэмжээ" },
    { left: "жижиг", right: "тэмдэг нэр", hint: "хэмжээ" },
    { left: "морь", right: "амьтан", hint: "үг ↔ утга" },
    { left: "гэр", right: "гэр ахуй", hint: "үг ↔ ангилал" },
    { left: "ном", right: "боловсрол", hint: "үг ↔ ангилал" },
  ],
  8: [
    { left: "унших", right: "үйл үг", hint: "үйл үгийн хэлбэр" },
    { left: "бичих", right: "үйл үг", hint: "үйл үгийн хэлбэр" },
    { left: "сурах", right: "үйл үг", hint: "үйл үгийн хэлбэр" },
    { left: "харах", right: "үйл үг", hint: "үйл үгийн хэлбэр" },
    { left: "идэх", right: "үйл үг", hint: "үйл үгийн хэлбэр" },
    { left: "явах", right: "үйл үг", hint: "үйл үгийн хэлбэр" },
  ],
  9: [
    { left: "өгүүлбэр", right: "хэлзүй", hint: "ойлголт" },
    { left: "үг", right: "хэлзүй", hint: "ойлголт" },
    { left: "утга", right: "тайлбар", hint: "өгүүлбэрийн ойлголт" },
    { left: "холбоо", right: "үг", hint: "холбоо үг" },
    { left: "хоршоо", right: "үг", hint: "хоршоо үг" },
    { left: "санаа", right: "гол агуулга", hint: "эх ойлголт" },
  ],
  10: [
    { left: "зохиол", right: "уран зохиол", hint: "төрөл" },
    { left: "тууль", right: "уран зохиол", hint: "төрөл" },
    { left: "тууж", right: "уран зохиол", hint: "төрөл" },
    { left: "дүр", right: "утга тайлбар", hint: "ойлголт" },
    { left: "санаа", right: "гол санаа", hint: "ойлголт" },
    { left: "сургаал", right: "сургамж", hint: "ойлголт" },
  ],
  11: [
    { left: "ёс", right: "соёл", hint: "утга" },
    { left: "заншил", right: "соёл", hint: "утга" },
    { left: "уламжлал", right: "соёл", hint: "утга" },
    { left: "ахуй", right: "амьдралын хэв маяг", hint: "тайлбар" },
    { left: "тооно", right: "гэрийн эд анги", hint: "соёлын үг" },
    { left: "соёл", right: "өв", hint: "ойлголт" },
  ],
  12: [
    { left: "хөрвүүлэг", right: "буулгах", hint: "ахисан ойлголт" },
    { left: "найруулга", right: "өгүүлбэрийн уялдаа", hint: "ахисан ойлголт" },
    { left: "тайлбар", right: "утга гаргах", hint: "ахисан ойлголт" },
    { left: "дүрэм", right: "зөв бичих", hint: "ахисан ойлголт" },
    { left: "хана", right: "гэрийн эд анги", hint: "соёлын үг" },
    { left: "соёл", right: "үндэсний өв", hint: "ахисан агуулга" },
  ],
};

export const SPEED_BANK: Record<6 | 7 | 8 | 9 | 10 | 11 | 12, SpeedRound[]> = {
  6: [
    {
      prompt: "Энэ ямар чиглэлтэй бичиг вэ?",
      correct: "Дээрээс доош",
      wrong: ["Зүүнээс баруун", "Баруунаас зүүн", "Доороос дээш"],
      mode: "rule",
      mg: "ᠠ",
    },
    {
      prompt: "ᠠ ямар үсэг вэ?",
      correct: "Эгшиг",
      wrong: ["Гийгүүлэгч", "Дагавар", "Нөхцөл"],
      mode: "letter",
      mg: "ᠠ",
    },
    {
      prompt: "ᠮ ямар үсэг вэ?",
      correct: "Гийгүүлэгч",
      wrong: ["Эгшиг", "Нөхцөл", "Дагавар"],
      mode: "letter",
      mg: "ᠮ",
    },
  ],
  7: [
    {
      prompt: "“хичээл + ийн” зөв хэлбэр аль нь вэ?",
      correct: "хичээлийн",
      wrong: ["хичээлын", "хичээлээ", "хичээлд"],
      mode: "rule",
    },
    {
      prompt: "“сургууль + д” зөв хэлбэр аль нь вэ?",
      correct: "сургуульд",
      wrong: ["сургуулыд", "сургуульын", "сургуульаа"],
      mode: "rule",
    },
    {
      prompt: "Эгшгийн зохицол юунд нөлөөлөх вэ?",
      correct: "Нөхцөл сонголт",
      wrong: ["Зөвхөн өнгө", "Зөвхөн урт", "Зөвхөн дуу"],
      mode: "rule",
    },
  ],
  8: [
    {
      prompt: "Аль нь үйл үг вэ?",
      correct: "унших",
      wrong: ["гэр", "ном", "багш"],
      mode: "word",
    },
    {
      prompt: "Аль нь үйл үг вэ?",
      correct: "явах",
      wrong: ["сургууль", "тооно", "утга"],
      mode: "word",
    },
    {
      prompt: "Үгийн бүтэцтэй холбоотой ойлголт аль нь вэ?",
      correct: "дагавар",
      wrong: ["өнгө", "зураг", "тоо"],
      mode: "rule",
    },
  ],
  9: [
    {
      prompt: "Гол санаа олох нь аль чадвар вэ?",
      correct: "Уншлагын ойлголт",
      wrong: ["Өнгө ялгалт", "Зураг тайлбар", "Тоолол"],
      mode: "sentence",
    },
    {
      prompt: "Холбоо үг, хоршоо үг аль ангид илүү чухал вэ?",
      correct: "9-р анги",
      wrong: ["6-р анги", "7-р анги", "12-р анги"],
      mode: "sentence",
    },
    {
      prompt: "Өгүүлбэрийн бүтцийг ойлгох нь юунд туслах вэ?",
      correct: "Эх ойлгоход",
      wrong: ["Зөвхөн будах", "Зөвхөн тоглоход", "Зөвхөн цээжлэхэд"],
      mode: "sentence",
    },
  ],
  10: [
    {
      prompt: "Зохиолын гол санааг олох нь ямар чадвар вэ?",
      correct: "Уран уншлага",
      wrong: ["Зөвхөн үсэг таних", "Зөвхөн нөхцөл сонгох", "Зөвхөн тоолох"],
      mode: "sentence",
    },
    {
      prompt: "Аль нь уран зохиолын төрөл вэ?",
      correct: "тууль",
      wrong: ["нөхцөл", "дагавар", "үсэг"],
      mode: "word",
    },
    {
      prompt: "Дүр гэж юуг хэлэх вэ?",
      correct: "Зохиолын хүн/дүрслэл",
      wrong: ["Өнгө", "Тоо", "Нөхцөл"],
      mode: "sentence",
    },
  ],
  11: [
    {
      prompt: "Аль нь соёлын агуулгатай үг вэ?",
      correct: "уламжлал",
      wrong: ["харах", "ном", "унших"],
      mode: "word",
    },
    {
      prompt: "Аль нь ёс заншилтай холбоотой ойлголт вэ?",
      correct: "заншил",
      wrong: ["дүр", "үйл үг", "өгүүлбэр"],
      mode: "word",
    },
    {
      prompt: "Соёлын эх уншихад юуг хамт бодох вэ?",
      correct: "Утга ба нөхцөл",
      wrong: ["Зөвхөн үсэг", "Зөвхөн тоо", "Зөвхөн зураг"],
      mode: "sentence",
    },
  ],
  12: [
    {
      prompt: "Хөрвүүлэг гэж юу вэ?",
      correct: "Нэг бичгээс нөгөөд буулгах",
      wrong: ["Зураг будах", "Тоолох", "Дуу авиа бичих"],
      mode: "sentence",
    },
    {
      prompt: "Найруулга юунд хамаарах вэ?",
      correct: "Өгүүлбэрийн уялдаа",
      wrong: ["Зөвхөн үсэг", "Зөвхөн өнгө", "Зөвхөн зураг"],
      mode: "sentence",
    },
    {
      prompt: "Ахисан түвшинд аль нь илүү чухал вэ?",
      correct: "Дүрэм + утга + бүтэц",
      wrong: ["Зөвхөн нэг үсэг", "Зөвхөн хурд", "Зөвхөн тоглоом"],
      mode: "sentence",
    },
  ],
};

export const WRITE_BANK: Record<6 | 7 | 8 | 9 | 10 | 11 | 12, WriteTarget[]> = {
  6: [
    {
      mg: "ᠠ",
      r: "A",
      guide: "Эхлээд суурь хэлбэрийг дагаж зур.",
      example: "аав",
    },
    {
      mg: "ᠮ",
      r: "M",
      guide: "Үсгийн ерөнхий хэлбэрийг дагаж зур.",
      example: "морь",
    },
    {
      mg: "ᠨ",
      r: "N",
      guide: "Босоо хэлбэрийг тогтвортой зур.",
      example: "нар",
    },
  ],
  7: [
    {
      mg: "ᠰ",
      r: "S",
      guide: "Үсгийг цэвэр, тасралтгүй зур.",
      example: "сайн",
    },
    { mg: "ᠲ", r: "T", guide: "Хэлбэрийн ялгааг анхаар.", example: "том" },
    { mg: "ᠵ", r: "J", guide: "Дүрсийг гүйцэд дагаж бич.", example: "жижиг" },
  ],
  8: [
    {
      mg: "ᠤᠩᠰᠢᠬᠤ",
      r: "ungshikhu",
      guide: "Богино үгийг бүтнээр нь дагаж бич.",
      example: "унших",
    },
    {
      mg: "ᠪᠢᠴᠢᠬᠦ",
      r: "bichikhu",
      guide: "Үйл үгийг үеэр нь ажигла.",
      example: "бичих",
    },
    {
      mg: "ᠶᠠᠪᠠᠬᠤ",
      r: "yabahu",
      guide: "Үгийн урт хэлбэрийг тогтвортой зур.",
      example: "явах",
    },
  ],
  9: [
    {
      mg: "ᠥᠭᠦᠯᠪᠦᠷ",
      r: "ogulbur",
      guide: "Ойлголтын үгийг бүтнээр нь бич.",
      example: "өгүүлбэр",
    },
    { mg: "ᠤᠲᠭ᠎ᠠ", r: "utga", guide: "Үгийн бүтцэд анхаар.", example: "утга" },
    {
      mg: "ᠬᠣᠯᠪᠣᠭ᠎ᠠ",
      r: "kholboo",
      guide: "Үсгийн холбоосыг жигд зур.",
      example: "холбоо",
    },
  ],
  10: [
    {
      mg: "ᠵᠣᠬᠢᠶᠠᠯ",
      r: "jokhiyal",
      guide: "Уран зохиолын үгийг нямбай бич.",
      example: "зохиол",
    },
    {
      mg: "ᠲᠤᠤᠯᠢ",
      r: "tuuli",
      guide: "Үгийн уртыг жигд барь.",
      example: "тууль",
    },
    {
      mg: "ᠰᠤᠷᠭᠠᠯ",
      r: "surgal",
      guide: "Дүрслэх үгийг бүтнээр нь бич.",
      example: "сургаал",
    },
  ],
  11: [
    { mg: "ᠶᠣᠰᠣ", r: "yos", guide: "Соёлын үгийг цэвэр бич.", example: "ёс" },
    {
      mg: "ᠵᠠᠩᠰᠢᠯ",
      r: "jangsil",
      guide: "Урт үгийн хэлбэрт анхаар.",
      example: "заншил",
    },
    {
      mg: "ᠤᠯᠠᠮᠵᠢᠯᠠᠯ",
      r: "ulamjlal",
      guide: "Уламжлалын үгийг бүтнээр нь дага.",
      example: "уламжлал",
    },
  ],
  12: [
    {
      mg: "ᠬᠥᠷᠪᠦᠯᠭᠡ",
      r: "khorvulge",
      guide: "Ахисан түвшний үгийг алдаагүй зур.",
      example: "хөрвүүлэг",
    },
    {
      mg: "ᠨᠠᠶᠢᠷᠤᠯᠭ᠎ᠠ",
      r: "nairuulga",
      guide: "Урт үгийн холболтыг анхаар.",
      example: "найруулга",
    },
    {
      mg: "ᠲᠠᠶᠢᠯᠪᠤᠷᠢ",
      r: "tailburi",
      guide: "Тайлбарлах үгийг бүтнээр нь бич.",
      example: "тайлбар",
    },
  ],
};

export const SORT_BANK: Record<6 | 7 | 8 | 9 | 10 | 11 | 12, SortSentence[]> = {
  6: [
    {
      p: ["Би", "ном", "уншина"],
      a: ["Би", "ном", "уншина"],
      tr: "Би ном уншина.",
    },
    {
      p: ["Хүүхэд", "сургуульд", "явна"],
      a: ["Хүүхэд", "сургуульд", "явна"],
      tr: "Хүүхэд сургуульд явна.",
    },
  ],
  7: [
    {
      p: ["Сайн", "хүүхэд", "хичээлээ", "хийнэ"],
      a: ["Сайн", "хүүхэд", "хичээлээ", "хийнэ"],
      tr: "Сайн хүүхэд хичээлээ хийнэ.",
    },
    {
      p: ["Том", "гэр", "талд", "байна"],
      a: ["Том", "гэр", "талд", "байна"],
      tr: "Том гэр талд байна.",
    },
  ],
  8: [
    {
      p: ["Би", "өдөр", "бүр", "уншина"],
      a: ["Би", "өдөр", "бүр", "уншина"],
      tr: "Би өдөр бүр уншина.",
    },
    {
      p: ["Тэр", "хичээлээ", "сайн", "бичнэ"],
      a: ["Тэр", "хичээлээ", "сайн", "бичнэ"],
      tr: "Тэр хичээлээ сайн бичнэ.",
    },
  ],
  9: [
    {
      p: ["Өгүүлбэрийн", "гол", "санааг", "ол"],
      a: ["Өгүүлбэрийн", "гол", "санааг", "ол"],
      tr: "Өгүүлбэрийн гол санааг ол.",
    },
    {
      p: ["Эхийг", "уншаад", "утгыг", "тайлбарла"],
      a: ["Эхийг", "уншаад", "утгыг", "тайлбарла"],
      tr: "Эхийг уншаад утгыг тайлбарла.",
    },
  ],
  10: [
    {
      p: ["Зохиолын", "гол", "санааг", "тайлбарла"],
      a: ["Зохиолын", "гол", "санааг", "тайлбарла"],
      tr: "Зохиолын гол санааг тайлбарла.",
    },
    {
      p: ["Дүрийн", "үйлдлээс", "сургамж", "ав"],
      a: ["Дүрийн", "үйлдлээс", "сургамж", "ав"],
      tr: "Дүрийн үйлдлээс сургамж ав.",
    },
  ],
  11: [
    {
      p: ["Уламжлалт", "эхийн", "утгыг", "тайлбарла"],
      a: ["Уламжлалт", "эхийн", "утгыг", "тайлбарла"],
      tr: "Уламжлалт эхийн утгыг тайлбарла.",
    },
    {
      p: ["Ёс", "заншлын", "үгийг", "тайлбарла"],
      a: ["Ёс", "заншлын", "үгийг", "тайлбарла"],
      tr: "Ёс заншлын үгийг тайлбарла.",
    },
  ],
  12: [
    {
      p: ["Кириллээс", "үндэсний", "бичигт", "хөрвүүл"],
      a: ["Кириллээс", "үндэсний", "бичигт", "хөрвүүл"],
      tr: "Кириллээс үндэсний бичигт хөрвүүл.",
    },
    {
      p: ["Найруулгын", "алдааг", "олон", "зас"],
      a: ["Найруулгын", "алдааг", "олон", "зас"],
      tr: "Найруулгын алдааг олж зас.",
    },
  ],
};

export const BALLOON_BANK: Record<
  6 | 7 | 8 | 9 | 10 | 11 | 12,
  BalloonQuestion[]
> = {
  6: [
    { q: "Эгшиг үсгийг ол", correct: "ᠠ", wrong: ["ᠮ", "ᠨ", "ᠭ", "ᠯ"] },
    { q: "Гийгүүлэгч үсгийг ол", correct: "ᠮ", wrong: ["ᠠ", "ᠡ", "ᠣ", "ᠤ"] },
    {
      q: "Зөв бичсэн үгийг сонго",
      correct: "сургууль",
      wrong: ["сургуул", "сургуул", "сургуулы", "сургули"],
    },
  ],
  7: [
    {
      q: "Зөв хувилбарыг сонго",
      correct: "хичээлийн",
      wrong: ["хичээлын", "хичээлээ", "хичээлд", "хичээлы"],
    },
    {
      q: "Зөв хувилбарыг сонго",
      correct: "сургуульд",
      wrong: ["сургуулыд", "сургуульын", "сургуульаа", "сургуульэ"],
    },
    {
      q: "Зөв бичсэн тэмдэг нэрийг сонго",
      correct: "жижиг",
      wrong: ["жижигг", "жижек", "жижигэ", "жижигн"],
    },
  ],
  8: [
    {
      q: "Үйл үгийг сонго",
      correct: "унших",
      wrong: ["ном", "гэр", "багш", "охин"],
    },
    {
      q: "Үйл үгийг сонго",
      correct: "явах",
      wrong: ["тооно", "дүрэм", "утга", "морь"],
    },
    {
      q: "Зөв хэлбэрийг сонго",
      correct: "бичих",
      wrong: ["бичил", "бичиг", "бичээ", "бичим"],
    },
  ],
  9: [
    {
      q: "Өгүүлбэрийн ойлголттой холбоотой үгийг сонго",
      correct: "өгүүлбэр",
      wrong: ["өнгө", "зураг", "тоглоом", "сандал"],
    },
    {
      q: "Гол санаатай холбоотой үгийг сонго",
      correct: "утга",
      wrong: ["өнгө", "цаг", "байшин", "дэвтэр"],
    },
    {
      q: "Холбоо үгтэй холбоотой үгийг сонго",
      correct: "холбоо",
      wrong: ["хөгжим", "харандаа", "сүүдэр", "далай"],
    },
  ],
  10: [
    {
      q: "Уран зохиолын төрөл сонго",
      correct: "тууль",
      wrong: ["нөхцөл", "дагавар", "эгшиг", "хичээл"],
    },
    {
      q: "Зохиолтой холбоотой үгийг сонго",
      correct: "зохиол",
      wrong: ["өнгө", "тоолол", "зангилаа", "зураг"],
    },
    {
      q: "Дүртэй холбоотой үгийг сонго",
      correct: "дүр",
      wrong: ["үсэг", "өндөр", "дэвтэр", "хана"],
    },
  ],
  11: [
    {
      q: "Соёлын үгийг сонго",
      correct: "уламжлал",
      wrong: ["харах", "бичих", "унших", "тоолох"],
    },
    {
      q: "Ёс заншилтай холбоотой үгийг сонго",
      correct: "заншил",
      wrong: ["өгүүлбэр", "толь", "дүрэм", "ном"],
    },
    {
      q: "Ахуйтай холбоотой үгийг сонго",
      correct: "ахуй",
      wrong: ["утга", "өнгө", "хурд", "сүүдэр"],
    },
  ],
  12: [
    {
      q: "Ахисан түвшний ойлголтыг сонго",
      correct: "хөрвүүлэг",
      wrong: ["өнгө", "үсэг", "зураг", "будаг"],
    },
    {
      q: "Найруулгатай холбоотой үгийг сонго",
      correct: "найруулга",
      wrong: ["холбоо", "амьтан", "тэнгэр", "ус"],
    },
    {
      q: "Тайлбартай холбоотой үгийг сонго",
      correct: "тайлбар",
      wrong: ["дэвтэр", "үзэг", "ном", "зураг"],
    },
  ],
};

export const FILL_BANK: Record<
  6 | 7 | 8 | 9 | 10 | 11 | 12,
  FillBlankQuestion[]
> = {
  6: [
    {
      before: "Би",
      blank: "ном",
      after: "уншина.",
      choices: ["ном", "гэр", "ус", "морь"],
      c: 0,
      tr: "Би ном уншина.",
    },
    {
      before: "Хүүхэд",
      blank: "сургуульд",
      after: "явна.",
      choices: ["сургуульд", "гэрт", "мод", "тал"],
      c: 0,
      tr: "Хүүхэд сургуульд явна.",
    },
  ],
  7: [
    {
      before: "Энэ бол маш",
      blank: "сайн",
      after: "сурагч.",
      choices: ["сайн", "унших", "гэр", "өнгө"],
      c: 0,
      tr: "Энэ бол маш сайн сурагч.",
    },
    {
      before: "Манай анги",
      blank: "том",
      after: "өрөөтэй.",
      choices: ["том", "уншина", "зураг", "гэр"],
      c: 0,
      tr: "Манай анги том өрөөтэй.",
    },
  ],
  8: [
    {
      before: "Би өдөр бүр",
      blank: "уншина",
      after: ".",
      choices: ["уншина", "ном", "анги", "өнгө"],
      c: 0,
      tr: "Би өдөр бүр уншина.",
    },
    {
      before: "Тэр хичээлээ",
      blank: "бичнэ",
      after: ".",
      choices: ["бичнэ", "ном", "толь", "ус"],
      c: 0,
      tr: "Тэр хичээлээ бичнэ.",
    },
  ],
  9: [
    {
      before: "Эхийн гол",
      blank: "санаа",
      after: "маш чухал.",
      choices: ["санаа", "өнгө", "байшин", "үзэг"],
      c: 0,
      tr: "Эхийн гол санаа маш чухал.",
    },
    {
      before: "Өгүүлбэрийн",
      blank: "утга",
      after: "зөв байх хэрэгтэй.",
      choices: ["утга", "өнгө", "цонх", "морь"],
      c: 0,
      tr: "Өгүүлбэрийн утга зөв байх хэрэгтэй.",
    },
  ],
  10: [
    {
      before: "Зохиолын гол",
      blank: "санаа",
      after: "юу вэ?",
      choices: ["санаа", "гэр", "өндөр", "зураг"],
      c: 0,
      tr: "Зохиолын гол санаа юу вэ?",
    },
    {
      before: "Энэ бүтээлд нэг гол",
      blank: "дүр",
      after: "бий.",
      choices: ["дүр", "өнгө", "үсэг", "цаг"],
      c: 0,
      tr: "Энэ бүтээлд нэг гол дүр бий.",
    },
  ],
  11: [
    {
      before: "Монгол",
      blank: "уламжлал",
      after: "маш баялаг.",
      choices: ["уламжлал", "өнгө", "үсэг", "ном"],
      c: 0,
      tr: "Монгол уламжлал маш баялаг.",
    },
    {
      before: "Ёс",
      blank: "заншил",
      after: "бол соёлын нэг хэсэг.",
      choices: ["заншил", "хурд", "дэвтэр", "харандаа"],
      c: 0,
      tr: "Ёс заншил бол соёлын нэг хэсэг.",
    },
  ],
  12: [
    {
      before: "Кириллээс үндэсний бичигт",
      blank: "хөрвүүлэг",
      after: "хийнэ.",
      choices: ["хөрвүүлэг", "өнгө", "үсэг", "зураг"],
      c: 0,
      tr: "Кириллээс үндэсний бичигт хөрвүүлэг хийнэ.",
    },
    {
      before: "Сайн бичвэрт",
      blank: "найруулга",
      after: "маш чухал.",
      choices: ["найруулга", "өнгө", "морь", "цонх"],
      c: 0,
      tr: "Сайн бичвэрт найруулга маш чухал.",
    },
  ],
};

// =====================================================
// Reading
// =====================================================

export const QUIZ_BANKS: Record<string, QuizQuestion[]> = {
  default: [
    {
      q: "Үндэсний бичиг ямар чиглэлтэй бичигддэг вэ?",
      mg: null,
      opts: [
        "Зүүнээс баруун",
        "Дээрээс доош",
        "Баруунаас зүүн",
        "Доороос дээш",
      ],
      c: 1,
      lvl: 1,
      cat: "Үсэг таних",
    },
    {
      q: "ᠠ ямар үсэг вэ?",
      mg: "ᠠ",
      opts: ["Эгшиг", "Гийгүүлэгч", "Дагавар", "Нөхцөл"],
      c: 0,
      lvl: 1,
      cat: "Үсэг таних",
    },
    {
      q: "Эгшгийн зохицол нь юунд нөлөөлдөг вэ?",
      mg: null,
      opts: [
        "Нөхцөл сонголтод",
        "Зургийн өнгөнд",
        "Тоо бодолтод",
        "Дууны өндөрт",
      ],
      c: 0,
      lvl: 2,
      cat: "Нөхцөл залгавар",
    },
    {
      q: "Аль нь үйл үг вэ?",
      mg: null,
      opts: ["гэр", "уншина", "сургууль", "багш"],
      c: 1,
      lvl: 3,
      cat: "Үгийн утга",
    },
    {
      q: "Өгүүлбэрийн гол санааг олох нь ямар чадвар вэ?",
      mg: null,
      opts: ["Уншлагын ойлголт", "Өнгө ялгалт", "Зураглалт", "Тоо бодолт"],
      c: 0,
      lvl: 4,
      cat: "Өгүүлбэр",
    },
  ],

  g6_basic: [
    {
      q: "Үндэсний бичиг ямар чиглэлтэй бичигддэг вэ?",
      mg: null,
      opts: [
        "Зүүнээс баруун",
        "Дээрээс доош",
        "Баруунаас зүүн",
        "Доороос дээш",
      ],
      c: 1,
      lvl: 1,
      cat: "Үсэг таних",
    },
    {
      q: "ᠠ нь ямар төрлийн үсэг вэ?",
      mg: "ᠠ",
      opts: ["Эгшиг", "Гийгүүлэгч", "Нөхцөл", "Дагавар"],
      c: 0,
      lvl: 1,
      cat: "Үсэг таних",
    },
    {
      q: "ᠮ ямар үсэг вэ?",
      mg: "ᠮ",
      opts: ["Эгшиг", "Гийгүүлэгч", "Нөхцөл", "Дагавар"],
      c: 1,
      lvl: 1,
      cat: "Үсэг таних",
    },
    {
      q: "Дармал ба бичмэл дүрсийг ялгах нь юунд туслах вэ?",
      mg: null,
      opts: ["Унших", "Зөвхөн будах", "Тоолох", "Гүйх"],
      c: 0,
      lvl: 1,
      cat: "Үсэг таних",
    },
    {
      q: "Энгийн үг таних чадвар аль ангид хамгийн чухал суурь болдог вэ?",
      mg: null,
      opts: ["6-р анги", "10-р анги", "11-р анги", "12-р анги"],
      c: 0,
      lvl: 1,
      cat: "Үсэг таних",
    },
  ],

  g7_rules: [
    {
      q: "7-р ангид аль чадвар илүү төв болж эхэлдэг вэ?",
      mg: null,
      opts: [
        "Үсэг будгах",
        "Дүрэм ба нөхцөл",
        "Зөвхөн зураг харах",
        "Зөвхөн тоглоом",
      ],
      c: 1,
      lvl: 2,
      cat: "Нөхцөл залгавар",
    },
    {
      q: "Эгшгийн шинж нь юунд нөлөөлдөг вэ?",
      mg: null,
      opts: ["Зургийн өнгө", "Нөхцөл сонголт", "Тоолол", "Дууны өндөр"],
      c: 1,
      lvl: 2,
      cat: "Нөхцөл залгавар",
    },
    {
      q: "“хичээл” + “ийн” зөв хэлбэр аль нь вэ?",
      mg: null,
      opts: ["хичээлийн", "хичээлын", "хичээлээ", "хичээлд"],
      c: 0,
      lvl: 2,
      cat: "Нөхцөл залгавар",
    },
    {
      q: "“сургууль” + “д” зөв хэлбэр аль нь вэ?",
      mg: null,
      opts: ["сургуульд", "сургуулыд", "сургуульын", "сургуульээ"],
      c: 0,
      lvl: 2,
      cat: "Нөхцөл залгавар",
    },
    {
      q: "Ижил төстэй хоёр хэлбэрээс зөвийг сонгох нь юуг хөгжүүлдэг вэ?",
      mg: null,
      opts: ["Алдааг таних", "Зөвхөн цээжлэх", "Өнгө ялгах", "Тоолох"],
      c: 0,
      lvl: 2,
      cat: "Нөхцөл залгавар",
    },
  ],

  g8_verb: [
    {
      q: "8-р ангид голчлон юу судалж эхэлдэг вэ?",
      mg: null,
      opts: [
        "Үйл үгийн хэлбэр",
        "Зөвхөн зураг",
        "Зөвхөн үсэг",
        "Зөвхөн тоглоом",
      ],
      c: 0,
      lvl: 3,
      cat: "Үгийн утга",
    },
    {
      q: "Аль нь үйл үг вэ?",
      mg: null,
      opts: ["уншина", "гэр", "хүүхэд", "цонх"],
      c: 0,
      lvl: 3,
      cat: "Үгийн утга",
    },
    {
      q: "Үгийн үндэс ба дагаврыг ялгах нь юунд хэрэгтэй вэ?",
      mg: null,
      opts: [
        "Үг бүтцийг ойлгоход",
        "Зураг зурахад",
        "Өнгө сонгоход",
        "Дуу дуулахад",
      ],
      c: 0,
      lvl: 3,
      cat: "Үгийн утга",
    },
    {
      q: "Дагавар, залгавар нь юунд оролцдог вэ?",
      mg: null,
      opts: ["Үг бүтэхэд", "Зөвхөн зурагт", "Өнгө ялгахад", "Тоо бодоход"],
      c: 0,
      lvl: 3,
      cat: "Үгийн утга",
    },
    {
      q: "Үгийн бүтцийг задлаж харах нь ямар чадварыг дэмжих вэ?",
      mg: null,
      opts: ["Зөв бичих", "Зөвхөн унтах", "Тоглох", "Будах"],
      c: 0,
      lvl: 3,
      cat: "Үгийн утга",
    },
  ],

  g9_reading: [
    {
      q: "9-р ангид юу илүү чухал болдог вэ?",
      mg: null,
      opts: [
        "Өгүүлбэрийг бүтнээр нь ойлгох",
        "Зөвхөн нэг үсэг цээжлэх",
        "Зөвхөн зураг харах",
        "Зөвхөн тоглоом",
      ],
      c: 0,
      lvl: 4,
      cat: "Өгүүлбэр",
    },
    {
      q: "Эх уншиж ойлгохдоо юуг олох хэрэгтэй вэ?",
      mg: null,
      opts: ["Гол санаа", "Зөвхөн өнгө", "Зөвхөн тоо", "Зөвхөн зураг"],
      c: 0,
      lvl: 4,
      cat: "Өгүүлбэр",
    },
    {
      q: "Холбоо үг, хоршоо үг судлах нь аль ангид илүү тохирох вэ?",
      mg: null,
      opts: ["6-р анги", "7-р анги", "9-р анги", "12-р анги"],
      c: 2,
      lvl: 4,
      cat: "Өгүүлбэр",
    },
    {
      q: "Үг бүтэх ёсийг судлах нь юунд туслах вэ?",
      mg: null,
      opts: [
        "Утгыг сайн ойлгоход",
        "Өнгө ялгахад",
        "Зураг зурахад",
        "Дуу хураахад",
      ],
      c: 0,
      lvl: 4,
      cat: "Өгүүлбэр",
    },
    {
      q: "Бичмэл ба дармал эхтэй ажиллах түвшин аль ангид өргөждөг вэ?",
      mg: null,
      opts: ["9-р анги", "6-р анги", "7-р анги", "8-р анги"],
      c: 0,
      lvl: 4,
      cat: "Өгүүлбэр",
    },
  ],

  g10_literature: [
    {
      q: "10-р ангид аль агуулга түлхүү орж ирдэг вэ?",
      mg: null,
      opts: ["Уран зохиолын эх", "Зөвхөн үсэг", "Зөвхөн нөхцөл", "Зөвхөн тоо"],
      c: 0,
      lvl: 5,
      cat: "Өгүүлбэр",
    },
    {
      q: "Эхийн гол санааг олох нь ямар чадвар вэ?",
      mg: null,
      opts: ["Уншлагын ойлголт", "Будах чадвар", "Үсэг таних", "Зураг тайрах"],
      c: 0,
      lvl: 5,
      cat: "Өгүүлбэр",
    },
    {
      q: "Утга тайлбарлахдаа юуг хамт харна вэ?",
      mg: null,
      opts: ["Агуулга ба дүрслэл", "Зөвхөн тоо", "Зөвхөн зураг", "Зөвхөн өнгө"],
      c: 0,
      lvl: 5,
      cat: "Өгүүлбэр",
    },
    {
      q: "10-р ангид ямар төрлийн эхүүдтэй ажиллаж болох вэ?",
      mg: null,
      opts: [
        "Тууль, тууж, сургаал",
        "Зөвхөн хүснэгт",
        "Зөвхөн тоглоом",
        "Зөвхөн зураг",
      ],
      c: 0,
      lvl: 5,
      cat: "Өгүүлбэр",
    },
    {
      q: "Дүр, санаа, сургамж ойлгох нь юунд хамаарах вэ?",
      mg: null,
      opts: [
        "Уран уншлагын ойлголт",
        "Үсэг будалт",
        "Тоо бодолт",
        "Хуулбар бичиг",
      ],
      c: 0,
      lvl: 5,
      cat: "Өгүүлбэр",
    },
  ],

  g11_culture: [
    {
      q: "11-р ангид ямар төрлийн эхүүд давамгайлдаг вэ?",
      mg: null,
      opts: [
        "Ёс заншил, уламжлалын эх",
        "Зөвхөн үсгийн дасгал",
        "Зөвхөн зураг",
        "Зөвхөн тоглоом",
      ],
      c: 0,
      lvl: 6,
      cat: "Өгүүлбэр",
    },
    {
      q: "Нэр томьёо таних нь юунд туслах вэ?",
      mg: null,
      opts: ["Соёлын агуулгыг ойлгоход", "Гүйхэд", "Зурахад", "Дуулахад"],
      c: 0,
      lvl: 6,
      cat: "Өгүүлбэр",
    },
    {
      q: "Уламжлалт эх уншихдаа юуг хамт авч үзэх вэ?",
      mg: null,
      opts: [
        "Утга ба соёлын нөхцөл",
        "Зөвхөн үсэг",
        "Зөвхөн дуу",
        "Зөвхөн өнгө",
      ],
      c: 0,
      lvl: 6,
      cat: "Өгүүлбэр",
    },
    {
      q: "11-р ангийн чадварт аль нь илүү ойр вэ?",
      mg: null,
      opts: [
        "Танин мэдэхүйн эх ойлгох",
        "Зөвхөн үсэг зурах",
        "Зөвхөн тоглоом",
        "Зөвхөн хүснэгт",
      ],
      c: 0,
      lvl: 6,
      cat: "Өгүүлбэр",
    },
    {
      q: "Ёс заншлын эхийг уншихад юуг зөв таних хэрэгтэй вэ?",
      mg: null,
      opts: [
        "Нэр томьёо ба гол санаа",
        "Зөвхөн зураг",
        "Зөвхөн тоо",
        "Зөвхөн өнгө",
      ],
      c: 0,
      lvl: 6,
      cat: "Өгүүлбэр",
    },
  ],

  g12_advanced: [
    {
      q: "12-р ангид аль чадвар онцгой чухал вэ?",
      mg: null,
      opts: [
        "Хөрвүүлэлт ба найруулга",
        "Зөвхөн үсэг таних",
        "Зөвхөн зураг",
        "Зөвхөн тоглоом",
      ],
      c: 0,
      lvl: 6,
      cat: "Өгүүлбэр",
    },
    {
      q: "Кириллээс үндэсний бичигт буулгахдаа юуг хамт бодох вэ?",
      mg: null,
      opts: [
        "Дүрэм, утга, бүтэц",
        "Зөвхөн нэг үсэг",
        "Зөвхөн өнгө",
        "Зөвхөн зураг",
      ],
      c: 0,
      lvl: 6,
      cat: "Өгүүлбэр",
    },
    {
      q: "Найруулан бичихэд юуг анхаарах вэ?",
      mg: null,
      opts: [
        "Өгүүлбэрийн уялдаа",
        "Зөвхөн үсгийн тоо",
        "Зөвхөн зураг",
        "Зөвхөн мөрийн урт",
      ],
      c: 0,
      lvl: 6,
      cat: "Өгүүлбэр",
    },
    {
      q: "Ахисан түвшний дасгалд юу орж болох вэ?",
      mg: null,
      opts: [
        "Хөрвүүлэлт, тайлбар, найруулга",
        "Зөвхөн үсэг будах",
        "Зөвхөн тоглоом",
        "Зөвхөн зураг",
      ],
      c: 0,
      lvl: 6,
      cat: "Өгүүлбэр",
    },
    {
      q: "12-р ангийн төгсгөлийн шалгалт юуг нэгтгэнэ вэ?",
      mg: null,
      opts: [
        "Хөрвүүлэлт, утга ойлголт, бичлэг",
        "Зөвхөн тоо",
        "Зөвхөн зураг",
        "Зөвхөн дуу",
      ],
      c: 0,
      lvl: 6,
      cat: "Өгүүлбэр",
    },
  ],
};

// =====================================================
// Helpers for pages
// =====================================================

export function getLessonsByGrade(grade: number) {
  return LESSONS.filter((lesson) => lesson.grade === grade);
}

export function getArticlesByGrade(grade: number) {
  return ARTICLES.filter((a) => a.t.startsWith(`${grade}-р анги`));
}

export function getWordsByGrade(grade: number) {
  return WORDS.filter((w) => !w.grades || w.grades.includes(grade));
}

export function getMatchPairsByGrade(grade: number) {
  return MATCH_BANK[gradeKey(grade)];
}

export function getSpeedRoundsByGrade(grade: number) {
  return SPEED_BANK[gradeKey(grade)];
}

export function getWriteTargetsByGrade(grade: number) {
  return WRITE_BANK[gradeKey(grade)];
}

export function getSortSentencesByGrade(grade: number) {
  return SORT_BANK[gradeKey(grade)];
}

export function getBalloonQuestionsByGrade(grade: number) {
  return BALLOON_BANK[gradeKey(grade)];
}

export function getFillBlanksByGrade(grade: number) {
  return FILL_BANK[gradeKey(grade)];
}
