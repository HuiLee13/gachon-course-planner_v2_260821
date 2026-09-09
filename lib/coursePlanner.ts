export type Track = "THESIS" | "NON_THESIS";
export type CourseCategory = "COMMON" | "MAJOR";
export type RuleMark = "REQUIRED" | "ELECTIVE" | "NONE";

export interface Course {
  id: string;
  name: string;
  credits: number;
  category: CourseCategory;
  graduation: RuleMark;
  developmentVoucher: RuleMark;
  artPsychCounselor: RuleMark;
  comprehensiveExam: RuleMark;
  graduationExam: RuleMark;
  proposal: RuleMark;
}

export interface StudentProfile {
  currentSemester: 1 | 2 | 3 | 4 | 5;
  track: Track;
  developmentVoucherSelected: boolean;
  artPsychCounselorSelected: boolean;
  completedCourseIds: string[];
}

export interface CheckItem {
  key: string;
  title: string;
  completed: boolean;
  current: number;
  required: number;
  unit: "학점" | "과목";
  deadlineSemester?: number;
  courseIds?: string[];
  message: string;
}

export interface RequirementSummary {
  graduation: CheckItem[];
  developmentVoucher: CheckItem[];
  artPsychCounselor: CheckItem[];
  comprehensiveExam: CheckItem[];
  graduationExam: CheckItem[];
  proposal: CheckItem[];
}

export interface CourseRecommendation {
  course: Course;
  score: number;
  priority: "URGENT" | "HIGH" | "NORMAL";
  reasons: string[];
}

export const COURSES: Course[] = [
  { id:"C001", name:"논문작성법", credits:2, category:"COMMON", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"ELECTIVE" },
  { id:"C002", name:"상담심리학", credits:2, category:"COMMON", graduation:"ELECTIVE", developmentVoucher:"ELECTIVE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"ELECTIVE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C003", name:"심리검사이론 및 실습", credits:2, category:"COMMON", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C004", name:"심리학개론", credits:2, category:"COMMON", graduation:"ELECTIVE", developmentVoucher:"ELECTIVE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"ELECTIVE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C005", name:"연구방법론", credits:2, category:"COMMON", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"ELECTIVE" },
  { id:"C006", name:"의사소통장애연구방법론", credits:2, category:"COMMON", graduation:"NONE", developmentVoucher:"NONE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C007", name:"의사소통장애학개론", credits:2, category:"COMMON", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C008", name:"이상심리학", credits:2, category:"COMMON", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C009", name:"장애아동 부모교육 및 상담", credits:2, category:"COMMON", graduation:"ELECTIVE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C010", name:"장애아동의 이해", credits:2, category:"COMMON", graduation:"REQUIRED", developmentVoucher:"REQUIRED", artPsychCounselor:"REQUIRED", comprehensiveExam:"ELECTIVE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C011", name:"질적연구방법", credits:2, category:"COMMON", graduation:"NONE", developmentVoucher:"NONE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C012", name:"청소년상담", credits:2, category:"COMMON", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C013", name:"통계학", credits:2, category:"COMMON", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"ELECTIVE" },
  { id:"C014", name:"느린학습자인지재활", credits:2, category:"COMMON", graduation:"NONE", developmentVoucher:"NONE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C015", name:"AI연구설계및연구방법론", credits:2, category:"COMMON", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C016", name:"장애아동 진단 및 평가", credits:2, category:"COMMON", graduation:"NONE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C017", name:"아동발달", credits:2, category:"COMMON", graduation:"NONE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C018", name:"재활행정과 정책", credits:2, category:"COMMON", graduation:"NONE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C019", name:"장애인 복지론", credits:2, category:"COMMON", graduation:"NONE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C020", name:"신경과학개론", credits:2, category:"COMMON", graduation:"NONE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C021", name:"안전관리와 응급처치", credits:2, category:"COMMON", graduation:"NONE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C022", name:"윤리와 철학(재활사 윤리)", credits:2, category:"COMMON", graduation:"NONE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C023", name:"보건복지개론", credits:2, category:"COMMON", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C024", name:"미술치료 현장실무", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"REQUIRED", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C025", name:"가족미술치료", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"ELECTIVE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C026", name:"SUPERVISION", credits:2, category:"MAJOR", graduation:"REQUIRED", developmentVoucher:"ELECTIVE", artPsychCounselor:"REQUIRED", comprehensiveExam:"NONE", graduationExam:"REQUIRED", proposal:"NONE" },
  { id:"C027", name:"그림심리진단 및 평가", credits:2, category:"MAJOR", graduation:"REQUIRED", developmentVoucher:"ELECTIVE", artPsychCounselor:"REQUIRED", comprehensiveExam:"REQUIRED", graduationExam:"NONE", proposal:"NONE" },
  { id:"C028", name:"대상관계와 미술치료", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C029", name:"미술매체연구", credits:2, category:"MAJOR", graduation:"REQUIRED", developmentVoucher:"ELECTIVE", artPsychCounselor:"REQUIRED", comprehensiveExam:"NONE", graduationExam:"REQUIRED", proposal:"NONE" },
  { id:"C030", name:"미술심리상담사윤리", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C031", name:"미술치료 사례연구", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"ELECTIVE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C032", name:"미술치료 연구방법", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"ELECTIVE" },
  { id:"C033", name:"미술치료 연구방법 세미나 I", credits:3, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C034", name:"미술치료 연구방법 세미나 II", credits:3, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C035", name:"미술치료 표현기법", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"ELECTIVE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C036", name:"미술치료개론", credits:2, category:"MAJOR", graduation:"REQUIRED", developmentVoucher:"REQUIRED", artPsychCounselor:"REQUIRED", comprehensiveExam:"REQUIRED", graduationExam:"NONE", proposal:"NONE" },
  { id:"C037", name:"미술치료연구동향분석", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"ELECTIVE" },
  { id:"C038", name:"미학", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C039", name:"색채심리학", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"ELECTIVE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C040", name:"아동 및 청소년 미술치료", credits:2, category:"MAJOR", graduation:"REQUIRED", developmentVoucher:"ELECTIVE", artPsychCounselor:"REQUIRED", comprehensiveExam:"NONE", graduationExam:"REQUIRED", proposal:"NONE" },
  { id:"C041", name:"아동발달", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C042", name:"인턴쉽", credits:3, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C043", name:"임상관찰 및 실습", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C044", name:"임상실습 및 슈퍼비전II", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C045", name:"임상실습 및 슈퍼비전I", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C046", name:"장애아동 미술치료", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"REQUIRED", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C047", name:"집단미술치료", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"ELECTIVE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C048", name:"창조적 미술치료", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C049", name:"부모교육 및 상담", credits:2, category:"MAJOR", graduation:"NONE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C050", name:"미술재활세미나", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C051", name:"미술심리학", credits:2, category:"MAJOR", graduation:"NONE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C052", name:"아동미술교육", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C053", name:"미술재활프로그램개발및평가", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C054", name:"학교미술치료", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C055", name:"정신병리와 치료", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C056", name:"이상심리학", credits:2, category:"MAJOR", graduation:"NONE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C057", name:"Practicum Training", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C058", name:"유아동 미술치료", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"ELECTIVE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C059", name:"모래놀이치료", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C060", name:"모래놀이치료실제", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C061", name:"통합예술심리치료", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C062", name:"조형론", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C063", name:"정신의학", credits:2, category:"COMMON", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C064", name:"심신장애인 미술치료", credits:2, category:"MAJOR", graduation:"NONE", developmentVoucher:"NONE", artPsychCounselor:"ELECTIVE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C065", name:"개별연구과제 I", credits:3, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C066", name:"개별연구과제 II", credits:3, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" },
  { id:"C067", name:"미술치료특론", credits:2, category:"MAJOR", graduation:"ELECTIVE", developmentVoucher:"NONE", artPsychCounselor:"NONE", comprehensiveExam:"NONE", graduationExam:"NONE", proposal:"NONE" }
];

const byId = new Map(COURSES.map(course => [course.id, course]));

const completedCourses = (profile: StudentProfile) =>
  profile.completedCourseIds.map(id => byId.get(id)).filter((c): c is Course => Boolean(c));

const sumCredits = (items: Course[], category: CourseCategory) =>
  items.filter(c => c.category === category).reduce((sum, c) => sum + c.credits, 0);

const sumGraduationCredits = (items: Course[], category: CourseCategory) =>
  items
    .filter(c => c.category === category && c.graduation !== "NONE")
    .reduce((sum, c) => sum + c.credits, 0);

const countCompleted = (profile: StudentProfile, candidates: Course[]) => {
  const done = new Set(profile.completedCourseIds);
  return candidates.filter(c => done.has(c.id)).length;
};

const candidates = (
  field: keyof Pick<Course, "developmentVoucher" | "artPsychCounselor" | "comprehensiveExam" | "graduationExam" | "proposal">,
  category?: CourseCategory,
  mark?: RuleMark,
) => COURSES.filter(c => (!category || c.category === category) && (!mark ? c[field] !== "NONE" : c[field] === mark));

const check = (
  key: string,
  title: string,
  current: number,
  required: number,
  unit: "학점" | "과목",
  deadlineSemester?: number,
  courseIds?: string[],
): CheckItem => ({
  key,
  title,
  current,
  required,
  unit,
  deadlineSemester,
  courseIds,
  completed: current >= required,
  message: `${title}: ${current}/${required}${unit}`,
});

export function analyzeRequirements(profile: StudentProfile): RequirementSummary {
  const done = completedCourses(profile);
  const commonCredits = sumGraduationCredits(done, "COMMON");
  const majorCredits = sumGraduationCredits(done, "MAJOR");
  const graduationTarget = profile.track === "THESIS"
    ? { common: 8, major: 16 }
    : { common: 10, major: 20 };

  const voucherCommonRequiredCourses = candidates("developmentVoucher", "COMMON", "REQUIRED");
  const voucherCommonElectiveCourses = candidates("developmentVoucher", "COMMON", "ELECTIVE");
  const voucherMajorRequiredCourses = candidates("developmentVoucher", "MAJOR", "REQUIRED");
  const voucherMajorElectiveCourses = candidates("developmentVoucher", "MAJOR", "ELECTIVE");
  const voucherCommonRequiredTarget = 1;
  const voucherCommonElectiveTarget = 1;

  const certCommonRequiredCourses = candidates("artPsychCounselor", "COMMON", "REQUIRED");
  const certCommonElectiveCourses = candidates("artPsychCounselor", "COMMON", "ELECTIVE");
  const certMajorRequiredCourses = candidates("artPsychCounselor", "MAJOR", "REQUIRED");
  const certMajorElectiveCourses = candidates("artPsychCounselor", "MAJOR", "ELECTIVE");
  const certCommonRequiredTarget = 1;
  const certCommonElectiveTarget = 3;

  const compCommonCourses = candidates("comprehensiveExam", "COMMON", "ELECTIVE");
  const compMajorCourses = candidates("comprehensiveExam", "MAJOR", "REQUIRED");
  const graduationExamCourses = candidates("graduationExam", "MAJOR", "REQUIRED");
  const proposalCourses = COURSES.filter(c => c.proposal !== "NONE");

  const developmentVoucher: CheckItem[] = [
    check("voucher-common-required", "공통필수", countCompleted(profile, voucherCommonRequiredCourses), voucherCommonRequiredTarget, "과목", undefined, voucherCommonRequiredCourses.map(c => c.id)),
    check("voucher-common-elective", "공통선택", countCompleted(profile, voucherCommonElectiveCourses), voucherCommonElectiveTarget, "과목", undefined, voucherCommonElectiveCourses.map(c => c.id)),
    check("voucher-major-required", "전공필수", countCompleted(profile, voucherMajorRequiredCourses), 3, "과목", undefined, voucherMajorRequiredCourses.map(c => c.id)),
    check("voucher-major-elective", "전공선택", countCompleted(profile, voucherMajorElectiveCourses), 6, "과목", undefined, voucherMajorElectiveCourses.map(c => c.id)),
  ];

  const artPsychCounselor: CheckItem[] = [
    check("cert-common-required", "공통필수", countCompleted(profile, certCommonRequiredCourses), certCommonRequiredTarget, "과목", undefined, certCommonRequiredCourses.map(c => c.id)),
    check("cert-common-elective", "공통선택", countCompleted(profile, certCommonElectiveCourses), certCommonElectiveTarget, "과목", undefined, certCommonElectiveCourses.map(c => c.id)),
    check("cert-major-required", "전공필수", countCompleted(profile, certMajorRequiredCourses), 5, "과목", undefined, certMajorRequiredCourses.map(c => c.id)),
    check("cert-major-elective", "전공선택", countCompleted(profile, certMajorElectiveCourses), 3, "과목", undefined, certMajorElectiveCourses.map(c => c.id)),
  ];


  const comprehensiveExam: CheckItem[] = [
    check("comp-common-elective", "공통선택", countCompleted(profile, compCommonCourses), 1, "과목", 3, compCommonCourses.map(c => c.id)),
    check("comp-major-required", "전공필수", countCompleted(profile, compMajorCourses), 2, "과목", 3, compMajorCourses.map(c => c.id)),
  ];

  const graduationExam: CheckItem[] = profile.track === "NON_THESIS"
    ? [check("graduation-exam-major-required", "전공필수", countCompleted(profile, graduationExamCourses), 3, "과목", 4, graduationExamCourses.map(c => c.id))]
    : [];

  const proposal: CheckItem[] = profile.track === "THESIS"
    ? [check("proposal-elective", "인정 과목", countCompleted(profile, proposalCourses), 2, "과목", 4, proposalCourses.map(c => c.id))]
    : [];

  return {
    graduation: [
      check(
        "graduation-common",
        "공통 학점",
        commonCredits,
        graduationTarget.common,
        "학점",
        5,
        COURSES
          .filter(c => c.category === "COMMON" && c.graduation !== "NONE")
          .map(c => c.id),
      ),
      check(
        "graduation-major",
        "전공 학점",
        majorCredits,
        graduationTarget.major,
        "학점",
        5,
        COURSES
          .filter(c => c.category === "MAJOR" && c.graduation !== "NONE")
          .map(c => c.id),
      ),
    ],
    developmentVoucher,
    artPsychCounselor,
    comprehensiveExam,
    graduationExam,
    proposal,
  };
}

function deadlineWeight(currentSemester:number, deadline?:number) {
  if (!deadline) return 0;
  const left = deadline - currentSemester;
  if (left <= 0) return 8;
  if (left === 1) return 5;
  if (left === 2) return 2;
  return 0;
}

export function recommendCourses(profile: StudentProfile): CourseRecommendation[] {
  const done = new Set(profile.completedCourseIds);
  const summary = analyzeRequirements(profile);
  const raw = new Map<string, CourseRecommendation>();

  const add = (course: Course, reason: string, points: number, deadline?: number) => {
    if (done.has(course.id)) return;
    const item = raw.get(course.id) ?? { course, score: 0, priority: "NORMAL" as const, reasons: [] };
    item.score += points + deadlineWeight(profile.currentSemester, deadline);
    if (!item.reasons.includes(reason)) item.reasons.push(reason);
    if (deadline !== undefined) {
      const left = deadline - profile.currentSemester;
      item.priority = left <= 0 ? "URGENT" : left === 1 ? "HIGH" : item.priority;
    }
    raw.set(course.id, item);
  };

  const need = (key: string) => Object.values(summary).flat().find(x => x.key === key && !x.completed);

  // 발달바우처는 사용자가 목표 요건으로 선택한 경우에만 추천 점수에 반영한다.
  if (profile.developmentVoucherSelected) {
    if (need("voucher-common-required")) candidates("developmentVoucher", "COMMON", "REQUIRED").forEach(c => add(c, "발달바우처 공통필수", 10));
    if (need("voucher-common-elective")) candidates("developmentVoucher", "COMMON", "ELECTIVE").forEach(c => add(c, "발달바우처 공통선택", 4));
    if (need("voucher-major-required")) candidates("developmentVoucher", "MAJOR", "REQUIRED").forEach(c => add(c, "발달바우처 전공필수", 10));
    if (need("voucher-major-elective")) candidates("developmentVoucher", "MAJOR", "ELECTIVE").forEach(c => add(c, "발달바우처 전공선택", 4));
  }

  // 미술심리상담사(가천대)도 사용자가 목표 요건으로 선택한 경우에만 추천 점수에 반영한다.
  if (profile.artPsychCounselorSelected) {
    if (need("cert-common-required")) candidates("artPsychCounselor", "COMMON", "REQUIRED").forEach(c => add(c, "미술심리상담사(가천대) 공통필수", 10));
    if (need("cert-common-elective")) candidates("artPsychCounselor", "COMMON", "ELECTIVE").forEach(c => add(c, "미술심리상담사(가천대) 공통선택", 4));
    if (need("cert-major-required")) candidates("artPsychCounselor", "MAJOR", "REQUIRED").forEach(c => add(c, "미술심리상담사(가천대) 전공필수", 10));
    if (need("cert-major-elective")) candidates("artPsychCounselor", "MAJOR", "ELECTIVE").forEach(c => add(c, "미술심리상담사(가천대) 전공선택", 4));
  }


  if (need("comp-common-elective")) candidates("comprehensiveExam", "COMMON", "ELECTIVE").forEach(c => add(c, "종합시험 공통선택", 9, 3));
  if (need("comp-major-required")) candidates("comprehensiveExam", "MAJOR", "REQUIRED").forEach(c => add(c, "종합시험 전공필수", 12, 3));

  if (profile.track === "NON_THESIS" && need("graduation-exam-major-required")) {
    candidates("graduationExam", "MAJOR", "REQUIRED").forEach(c => add(c, "졸업시험 전공필수", 12, 4));
  }

  if (profile.track === "THESIS" && need("proposal-elective")) {
    COURSES.filter(c => c.proposal !== "NONE").forEach(c => add(c, "프로포절 인정 과목", 10, 4));
  }

  const graduationReason = (course: Course) => {
    const category = course.category === "COMMON" ? "공통" : "전공";
    const mark = course.graduation === "REQUIRED" ? "필수" : "선택";
    return `졸업 ${category}${mark}`;
  };

  if (need("graduation-common")) {
    COURSES
      .filter(c => c.category === "COMMON" && c.graduation !== "NONE")
      .forEach(c => add(c, graduationReason(c), 1, 5));
  }

  if (need("graduation-major")) {
    COURSES
      .filter(c => c.category === "MAJOR" && c.graduation !== "NONE")
      .forEach(c => add(c, graduationReason(c), 1, 5));
  }

  // 현재 남아 있는 추천 후보들끼리 상대평가한다.
  // 가장 높은 내부 원점수를 10점으로 두고 나머지는 최고점 대비 비율로 환산한다.
  const remaining = [...raw.values()];
  const maxRawScore = remaining.reduce((max, item) => Math.max(max, item.score), 0);

  return remaining
    .map(item => ({
      ...item,
      score: maxRawScore > 0
        ? Math.round((item.score / maxRawScore) * 100) / 10
        : 0,
    }))
    .sort((a, b) => b.score - a.score || a.course.name.localeCompare(b.course.name, "ko"));
}

export function getCreditSummary(profile: StudentProfile) {
  const done = completedCourses(profile);
  const common = sumCredits(done, "COMMON");
  const major = sumCredits(done, "MAJOR");
  return { common, major, total: common + major };
}

export function getDeadlineWarnings(profile: StudentProfile) {
  const summary = analyzeRequirements(profile);

  const groups: { name: string; items: CheckItem[] }[] = [
    { name: "졸업", items: summary.graduation },
    { name: "발달바우처", items: summary.developmentVoucher },
    { name: "미술심리상담사(가천대)", items: summary.artPsychCounselor },
    { name: "종합시험", items: summary.comprehensiveExam },
    { name: "졸업시험", items: summary.graduationExam },
    { name: "프로포절", items: summary.proposal },
  ];

  return groups.flatMap(group =>
    group.items
      .filter(item => !item.completed && item.deadlineSemester !== undefined)
      .map(item => {
        const d = item.deadlineSemester!;
        const label = `${group.name} ${item.title}`;

        if (profile.currentSemester > d) {
          return `🚨 ${label}: ${d}학차까지 완료해야 하는 요건의 기한이 지났습니다.`;
        }
        if (profile.currentSemester === d) {
          return `🚨 ${label}: 이번 ${d}학차 안에 완료해야 합니다.`;
        }
        if (profile.currentSemester === d - 1) {
          return `⚠️ ${label}: 다음 학차가 완료 기한입니다.`;
        }
        return `ℹ️ ${label}: ${d}학차까지 완료해야 합니다.`;
      })
  );
}

export function validateSemesterCredits(courseIds: string[]) {
  const credits = courseIds.reduce((sum, id) => sum + (byId.get(id)?.credits ?? 0), 0);
  return {
    credits,
    overMaximum: credits > 12,
    scholarshipEligible: credits >= 6 && credits <= 12,
    message: credits > 12
      ? `${credits}학점: 학차당 최대 12학점을 초과했습니다.`
      : credits >= 6
        ? `${credits}학점: 장학금 기준(6학점 이상)을 충족합니다.`
        : `${credits}학점: 장학금 기준인 6학점에 미달합니다.`,
  };
}
