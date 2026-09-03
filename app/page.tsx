"use client";

import { useEffect, useMemo, useState } from "react";
import {
  analyzeRequirements,
  COURSES,
  getCreditSummary,
  recommendCourses,
  type CheckItem,
  type StudentProfile,
  type Track,
} from "@/lib/coursePlanner";

type Semester = 1 | 2 | 3 | 4 | 5;
type Filter =
  | "ALL"
  | "COMMON"
  | "MAJOR"
  | "REQUIRED"
  | "COMPLETED"
  | "VOUCHER"
  | "CERT"
  | "COMP"
  | "GRAD_EXAM"
  | "PROPOSAL";

function courseBadges(course: (typeof COURSES)[number]) {
  const badges: string[] = [];
  const cat = course.category === "COMMON" ? "공통" : "전공";
  const mark = (value: string) => (value === "REQUIRED" ? "필수" : "선택");

  if (course.developmentVoucher !== "NONE") badges.push(`발달바우처 ${cat}${mark(course.developmentVoucher)}`);
  if (course.artPsychCounselor !== "NONE") badges.push(`미술심리상담사(가천대) ${cat}${mark(course.artPsychCounselor)}`);
  if (course.comprehensiveExam !== "NONE") badges.push(`종합시험 ${cat}${mark(course.comprehensiveExam)}`);
  if (course.graduationExam !== "NONE") badges.push(`졸업시험 ${cat}${mark(course.graduationExam)}`);
  if (course.proposal !== "NONE") badges.push(`프로포절 ${cat}${mark(course.proposal)}`);
  return badges;
}

function requirementColorClass(text: string) {
  if (text.includes("발달바우처")) return "requirement-color-voucher";
  if (text.includes("미술심리상담사")) return "requirement-color-counselor";
  if (text.includes("종합시험")) return "requirement-color-comprehensive";
  if (text.includes("프로포절")) return "requirement-color-proposal";
  if (text.includes("졸업시험")) return "requirement-color-graduation-exam";
  if (text.includes("졸업")) return "requirement-color-graduation";
  return "";
}

function CompactStatus({ completed }: { completed: boolean }) {
  return <span className={`compact-status ${completed ? "ok" : "no"}`}>{completed ? "충족" : "미충족"}</span>;
}

function RequirementItem({ item, completedSet, showCourses }: { item: CheckItem; completedSet: Set<string>; showCourses: boolean }) {
  const pct = item.required === 0 ? 100 : Math.min(100, Math.round((item.current / item.required) * 100));
  const courseItems = (item.courseIds ?? [])
    .map(id => COURSES.find(course => course.id === id))
    .filter((course): course is (typeof COURSES)[number] => Boolean(course))
    .sort((a, b) => a.name.localeCompare(b.name, "ko-KR"));

  return (
    <div className="req">
      <div className="req-head">
        <div>
          <strong>{item.title}</strong>
          <div className="small">{item.message}</div>
        </div>
        <span className={`status ${item.completed ? "ok" : "no"}`}>{item.completed ? "충족" : "미충족"}</span>
      </div>
      <div className="progress"><div style={{ width: `${pct}%` }} /></div>

      {showCourses && courseItems.length > 0 && (
        <div className="requirement-course-area">
          <div className="requirement-course-label">이수 대상 과목</div>
          <div className="requirement-course-list">
            {courseItems.map(course => {
              const done = completedSet.has(course.id);
              return <span className={`requirement-course ${done ? "done" : ""}`} key={course.id}>{done ? "✓ " : ""}{course.name}</span>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const STORAGE_KEY = "gachon-course-planner-v2";

interface SavedPlannerState {
  semester: Semester;
  selectedSemesters?: Semester[];
  track: Track;
  developmentVoucherSelected?: boolean;
  artPsychCounselorSelected?: boolean;
  completed: string[];
  courseSemesters?: Partial<Record<string, Semester>>;
}

export default function Home() {
  const [selectedSemesters, setSelectedSemesters] = useState<Semester[]>([1]);
  const semester = selectedSemesters.length > 0 ? Math.max(...selectedSemesters) as Semester : 1;
  const [track, setTrack] = useState<Track>("THESIS");
  const [developmentVoucherSelected, setDevelopmentVoucherSelected] = useState(false);
  const [artPsychCounselorSelected, setArtPsychCounselorSelected] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [courseSemesters, setCourseSemesters] = useState<Partial<Record<string, Semester>>>({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem("gachon-course-planner-v1");
      if (raw) {
        const saved = JSON.parse(raw) as Partial<SavedPlannerState>;
        const savedSemester = [1,2,3,4,5].includes(Number(saved.semester)) ? Number(saved.semester) as Semester : 1;
        const restoredSemesters = Array.isArray(saved.selectedSemesters)
          ? saved.selectedSemesters.filter((value): value is Semester => [1,2,3,4,5].includes(Number(value)))
          : [];
        setSelectedSemesters(restoredSemesters.length > 0 ? Array.from(new Set(restoredSemesters)).sort((a, b) => a - b) : [savedSemester]);
        if (saved.track === "THESIS" || saved.track === "NON_THESIS") setTrack(saved.track);
        if (typeof saved.developmentVoucherSelected === "boolean") {
          setDevelopmentVoucherSelected(saved.developmentVoucherSelected);
        }
        if (typeof saved.artPsychCounselorSelected === "boolean") {
          setArtPsychCounselorSelected(saved.artPsychCounselorSelected);
        }

        if (Array.isArray(saved.completed)) {
          const validIds = new Set(COURSES.map(course => course.id));
          const validCompleted = saved.completed.filter(id => validIds.has(id));
          setCompleted(validCompleted);
          const restored: Partial<Record<string, Semester>> = {};
          validCompleted.forEach(id => {
            const stored = saved.courseSemesters?.[id];
            if ([1,2,3,4,5].includes(Number(stored))) restored[id] = Number(stored) as Semester;
          });
          setCourseSemesters(restored);
        }
      }
    } catch (error) {
      console.warn("저장된 이수 정보를 불러오지 못했습니다.", error);
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    const data: SavedPlannerState = { semester, selectedSemesters, track, developmentVoucherSelected, artPsychCounselorSelected, completed, courseSemesters };
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch (error) { console.warn("이수 정보를 저장하지 못했습니다.", error); }
  }, [semester, selectedSemesters, track, developmentVoucherSelected, artPsychCounselorSelected, completed, courseSemesters, storageReady]);

  const profile: StudentProfile = {
    currentSemester: semester,
    track,
    developmentVoucherSelected,
    artPsychCounselorSelected,
    completedCourseIds: completed,
  };
  const summary = useMemo(() => analyzeRequirements(profile), [semester, track, developmentVoucherSelected, artPsychCounselorSelected, completed]);
  const credits = useMemo(() => getCreditSummary(profile), [completed]);
  const recommendations = useMemo(() => recommendCourses(profile).slice(0, 10), [semester, track, developmentVoucherSelected, artPsychCounselorSelected, completed]);
  const completedSet = useMemo(() => new Set(completed), [completed]);

  const visibleCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return COURSES.filter(course => {
      const isCompleted = completedSet.has(course.id);
      const matchesSearch = !q || course.name.toLowerCase().includes(q);
      if (filter === "COMPLETED") return matchesSearch && isCompleted;
      if (isCompleted) return false;

      const matchesFilter =
        filter === "ALL" ||
        (filter === "COMMON" && course.category === "COMMON") ||
        (filter === "MAJOR" && course.category === "MAJOR") ||
        (filter === "REQUIRED" && [course.developmentVoucher, course.artPsychCounselor, course.comprehensiveExam, course.graduationExam].includes("REQUIRED")) ||
        (filter === "VOUCHER" && course.developmentVoucher !== "NONE") ||
        (filter === "CERT" && course.artPsychCounselor !== "NONE") ||
        (filter === "COMP" && course.comprehensiveExam !== "NONE") ||
        (filter === "GRAD_EXAM" && course.graduationExam !== "NONE") ||
        (filter === "PROPOSAL" && course.proposal !== "NONE");
      return matchesSearch && matchesFilter;
    }).sort((a, b) => {
      // 1차: 공통 → 전공, 2차: 각 그룹 안에서 과목명 가나다순
      if (a.category !== b.category) {
        return a.category === "COMMON" ? -1 : 1;
      }
      return a.name.localeCompare(b.name, "ko-KR");
    });
  }, [search, filter, completedSet]);

  const showCategorySections = !["COMMON", "MAJOR"].includes(filter);
  const commonVisibleCourses = useMemo(() => visibleCourses.filter(course => course.category === "COMMON"), [visibleCourses]);
  const majorVisibleCourses = useMemo(() => visibleCourses.filter(course => course.category === "MAJOR"), [visibleCourses]);

  const renderCourseItem = (course: (typeof COURSES)[number]) => {
    const isCompleted = completedSet.has(course.id);
    return (
      <div className={`course-item ${course.category === "COMMON" ? "course-common" : "course-major"}`} key={course.id}>
        <input type="checkbox" aria-label={`${course.name} 이수 여부`} checked={isCompleted} onChange={() => toggleCourse(course.id)} />
        <div className="course-content">
          <div className="course-name-row">
            <div>
              <div className="course-name">{course.name}</div>
              <div className="meta">{course.category === "COMMON" ? "공통" : "전공"} · {course.credits}학점</div>
            </div>
            {isCompleted && (
              <label className="semester-picker">
                <span>이수 학차</span>
                <select value={courseSemesters[course.id] ?? ""} onChange={e => changeCourseSemester(course.id, e.target.value)}>
                  <option value="">학차 선택</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}학차</option>)}
                </select>
              </label>
            )}
          </div>
          <div className="badges">{courseBadges(course).map(badge => <span className={`badge ${requirementColorClass(badge)}`} key={badge}>{badge}</span>)}</div>
        </div>
      </div>
    );
  };

  const toggleCourse = (id: string) => {
    setCompleted(prev => {
      if (prev.includes(id)) {
        setCourseSemesters(current => {
          const next = { ...current }; delete next[id]; return next;
        });
        return prev.filter(courseId => courseId !== id);
      }
      setCourseSemesters(current => ({ ...current, [id]: semester }));
      return [...prev, id];
    });
  };

  const changeCourseSemester = (id: string, value: string) => {
    const nextSemester = Number(value) as Semester;
    if (![1,2,3,4,5].includes(nextSemester)) return;
    setCourseSemesters(current => ({ ...current, [id]: nextSemester }));
  };

  const toggleSemesterSelection = (target: Semester) => {
    setSelectedSemesters(current =>
      current.includes(target)
        ? current.filter(item => item !== target)
        : [...current, target].sort((a, b) => a - b)
    );
  };

  const clearCompleted = () => { setCompleted([]); setCourseSemesters({}); };

  const findRequirement = (items: CheckItem[], key: string) => items.find(item => item.key === key);
  const itemCompleted = (items: CheckItem[], key: string) => Boolean(findRequirement(items, key)?.completed);

  const requirementGroups = [
    {
      key:"graduation",
      title:"졸업",
      titleNote: track === "THESIS" ? "논문트랙" : "비논문트랙",
      description: track === "THESIS"
        ? <><span>공통 8학점 이상 <CompactStatus completed={itemCompleted(summary.graduation, "graduation-common")} /></span><span className="summary-separator">·</span><span>전공 16학점 이상 <CompactStatus completed={itemCompleted(summary.graduation, "graduation-major")} /></span></>
        : <><span>공통 10학점 이상 <CompactStatus completed={itemCompleted(summary.graduation, "graduation-common")} /></span><span className="summary-separator">·</span><span>전공 20학점 이상 <CompactStatus completed={itemCompleted(summary.graduation, "graduation-major")} /></span></>,
      items:summary.graduation,
    },
    {
      key:"developmentVoucher",
      title:"발달바우처",
      description:<><span>공통필수 1과목 <CompactStatus completed={itemCompleted(summary.developmentVoucher, "voucher-common-required")} /></span><span className="summary-separator">·</span><span>공통선택 1과목 <CompactStatus completed={itemCompleted(summary.developmentVoucher, "voucher-common-elective")} /></span><span className="summary-separator">·</span><span>전공필수 3과목 <CompactStatus completed={itemCompleted(summary.developmentVoucher, "voucher-major-required")} /></span><span className="summary-separator">·</span><span>전공선택 6과목 <CompactStatus completed={itemCompleted(summary.developmentVoucher, "voucher-major-elective")} /></span></>,
      items:summary.developmentVoucher,
      hidden:!developmentVoucherSelected,
    },
    {
      key:"artPsychCounselor",
      title:"미술심리상담사(가천대)",
      description:<><span>공통필수 1과목 <CompactStatus completed={itemCompleted(summary.artPsychCounselor, "cert-common-required")} /></span><span className="summary-separator">·</span><span>공통선택 3과목 <CompactStatus completed={itemCompleted(summary.artPsychCounselor, "cert-common-elective")} /></span><span className="summary-separator">·</span><span>전공필수 5과목 <CompactStatus completed={itemCompleted(summary.artPsychCounselor, "cert-major-required")} /></span><span className="summary-separator">·</span><span>전공선택 3과목 <CompactStatus completed={itemCompleted(summary.artPsychCounselor, "cert-major-elective")} /></span></>,
      items:summary.artPsychCounselor,
      hidden:!artPsychCounselorSelected,
    },
    {
      key:"comprehensiveExam",
      title:"종합시험",
      titleNote:"4학차 응시",
      description:<><span>3학차까지 공통선택 1과목 <CompactStatus completed={itemCompleted(summary.comprehensiveExam, "comp-common-elective")} /></span><span className="summary-separator">·</span><span>전공필수 2과목 <CompactStatus completed={itemCompleted(summary.comprehensiveExam, "comp-major-required")} /></span></>,
      items:summary.comprehensiveExam,
    },
    {
      key:"graduationExam",
      title:"졸업시험",
      titleNote:"비논문트랙만 해당 · 5학차 응시",
      description:<><span>4학차까지 전공필수 3과목 <CompactStatus completed={itemCompleted(summary.graduationExam, "graduation-exam-major-required")} /></span></>,
      items:summary.graduationExam,
      hidden:track === "THESIS",
    },
    {
      key:"proposal",
      title:"프로포절",
      titleNote:"논문트랙만 해당",
      description:<><span>4학차까지 논문작성법/연구방법론/통계학 중 2과목 <CompactStatus completed={itemCompleted(summary.proposal, "proposal-common-elective")} /></span></>,
      items:summary.proposal,
      hidden:track === "NON_THESIS",
    },
  ].filter(group => !group.hidden);

  const baseFilters: [Filter,string][] = [
    ["ALL","전체"], ["COMMON","공통"], ["MAJOR","전공"], ["REQUIRED","필수 포함 과목"], ["COMPLETED",`이수한 과목 (${completed.length})`],
  ];
  const requirementFilters: [Filter,string][] = [
    ["VOUCHER","발달바우처"],
    ["CERT","미술심리상담사(가천대)"],
    ["COMP","종합시험"],
    ["PROPOSAL","프로포절"],
    ["GRAD_EXAM","졸업시험"],
  ];

  const highestSelectedSemester = selectedSemesters.length
    ? Math.max(...selectedSemesters)
    : null;


  return (
    <main className="container">
      <header className="hero">
        <h1>가천대 미술치료전공 과목 이수 플래너_260902ver</h1>
      </header>

      <details className="card profile-card" open>
        <summary className="profile-card-summary">
          <h2 className="section-title">1. 내 정보</h2>
          <div className="profile-summary-values">
            {highestSelectedSemester ? (
              <span className="goal-option semester-option semester-choice selected profile-summary-button">
                <input type="checkbox" checked readOnly tabIndex={-1} />
                <span>{highestSelectedSemester}학차</span>
              </span>
            ) : (
              <span className="profile-summary-empty">학차 미선택</span>
            )}

            {developmentVoucherSelected && (
              <span className="goal-option checkbox-option development-option selected profile-summary-button">
                <input type="checkbox" checked readOnly tabIndex={-1} />
                <span>발달바우처</span>
              </span>
            )}

            {artPsychCounselorSelected && (
              <span className="goal-option checkbox-option counselor-option selected profile-summary-button">
                <input type="checkbox" checked readOnly tabIndex={-1} />
                <span>미술심리상담사(가천대)</span>
              </span>
            )}

            {!developmentVoucherSelected && !artPsychCounselorSelected && (
              <span className="profile-summary-empty">목표 요건 미선택</span>
            )}

            <span className={`goal-option ${track === "THESIS" ? "thesis-option" : "non-thesis-option"} selected profile-summary-button`}>
              <input type="radio" checked readOnly tabIndex={-1} />
              <span>{track === "THESIS" ? "논문" : "비논문"}</span>
            </span>
          </div>
        </summary>

        <div className="profile-card-content">
          <div className="small profile-info-guide">
            <span>정보를 입력하고 과목을 체크하면 요건의 충족 여부를 자동으로 계산하고 수강 과목을 추천합니다.</span>
            <span>{storageReady ? "입력한 정보는 현재 브라우저에 저장됩니다. 다만, 브라우저 변경 시 다시 입력이 필요합니다." : "저장된 이수 정보를 불러오는 중입니다."}</span>
          </div>

          <div className="profile-info-list">
            <div className="profile-info-section">
              <div className="profile-info-heading">1) 학차 선택</div>
              <p className="profile-info-subguide">현재 학차를 포함하여 이전 학차까지 모두 선택</p>
              <div className="semester-options-inline">
                {([1,2,3,4,5] as Semester[]).map(n => (
                  <label className={`goal-option semester-option semester-choice ${selectedSemesters.includes(n) ? "selected" : ""}`} key={n}>
                    <input type="checkbox" checked={selectedSemesters.includes(n)} onChange={() => toggleSemesterSelection(n)} />
                    <span>{n}학차</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="profile-info-section">
              <div className="profile-info-heading">2) 목표 요건</div>
              <p className="profile-info-subguide">선택 시 요건 별 판정과 추천 수강과목에 반영</p>
              <div className="goal-options-inline">
                <label className={`goal-option checkbox-option development-option ${developmentVoucherSelected ? "selected" : ""}`}>
                  <input
                    type="checkbox"
                    checked={developmentVoucherSelected}
                    onChange={e => setDevelopmentVoucherSelected(e.target.checked)}
                  />
                  <span>발달바우처</span>
                </label>
                <label className={`goal-option checkbox-option counselor-option ${artPsychCounselorSelected ? "selected" : ""}`}>
                  <input
                    type="checkbox"
                    checked={artPsychCounselorSelected}
                    onChange={e => setArtPsychCounselorSelected(e.target.checked)}
                  />
                  <span>미술심리상담사(가천대)</span>
                </label>
              </div>
            </div>

            <div className="profile-info-section">
              <div className="profile-info-heading">3) 졸업 트랙 요건</div>
              <p className="profile-info-subguide">선택 시 프로포절/졸업시험 요건 반영</p>
              <div className="track-options-inline">
                <label className={`goal-option thesis-option ${track === "THESIS" ? "selected" : ""}`}>
                  <input type="radio" name="graduation-track" value="THESIS" checked={track === "THESIS"} onChange={() => setTrack("THESIS")} />
                  <span>논문</span>
                </label>
                <label className={`goal-option non-thesis-option ${track === "NON_THESIS" ? "selected" : ""}`}>
                  <input type="radio" name="graduation-track" value="NON_THESIS" checked={track === "NON_THESIS"} onChange={() => setTrack("NON_THESIS")} />
                  <span>비논문</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </details>

      <section className="card">
        <h2 className="section-title">2. 과목 선택</h2>
        <div className="toolbar"><input className="search" placeholder="과목명 검색" value={search} onChange={e => setSearch(e.target.value)} /></div>
        <div className="small filter-help filter-help-lines">
          <span>체크한 과목은 ‘이수한 과목’에서만 보이며, 해당 필터에서 이수 학차를 확인·변경할 수 있습니다.</span>
          <span>새로 체크한 과목은 선택한 학차 중 가장 높은 학차로 우선 기록됩니다.</span>
        </div>

        <div className="filter-label">기본 필터</div>
        <div className="filters basic-filter-row">{baseFilters.map(([key,label]) => <button key={key} className={`filter-btn ${filter === key ? "active" : ""}`} onClick={() => setFilter(key)}>{label}</button>)}<button className="clear-all-btn" onClick={clearCompleted}>전체 해제</button></div>
        <div className="filter-label">요건 별 과목</div>
        <div className="filters">{requirementFilters.map(([key,label]) => <button key={key} className={`filter-btn ${filter === key ? "active" : ""}`} onClick={() => setFilter(key)}>{label}</button>)}</div>


        {visibleCourses.length === 0 ? (
          <div className="empty course-empty">{filter === "COMPLETED" ? "아직 이수한 과목이 없습니다." : "현재 조건에 표시할 미이수 과목이 없습니다."}</div>
        ) : showCategorySections ? (
          <div className="course-category-sections">
            {commonVisibleCourses.length > 0 && (
              <details className="course-category-section" open>
                <summary className="course-category-heading">
                  <span>공통</span>
                  <span className="course-category-count">{commonVisibleCourses.length}과목</span>
                </summary>
                <div className="course-list course-list-grouped">{commonVisibleCourses.map(renderCourseItem)}</div>
              </details>
            )}
            {majorVisibleCourses.length > 0 && (
              <details className="course-category-section" open>
                <summary className="course-category-heading">
                  <span>전공</span>
                  <span className="course-category-count">{majorVisibleCourses.length}과목</span>
                </summary>
                <div className="course-list course-list-grouped">{majorVisibleCourses.map(renderCourseItem)}</div>
              </details>
            )}
          </div>
        ) : (
          <div className="course-list">{visibleCourses.map(renderCourseItem)}</div>
        )}
      </section>

      <section className="card"><h2 className="section-title">3. 현재 이수 현황</h2><div className="grid4"><div className="metric"><div className="label">총 이수학점</div><div className="value">{credits.total}</div></div><div className="metric"><div className="label">공통 학점</div><div className="value">{credits.common}</div></div><div className="metric"><div className="label">전공 학점</div><div className="value">{credits.major}</div></div><div className="metric"><div className="label">이수 과목</div><div className="value">{completed.length}</div></div></div></section>

      <section className="card" style={{marginTop:18}}><h2 className="section-title">4. 요건 별 판정</h2>
        <div className="requirement-groups">
          {requirementGroups.map(group => (
            <details className={`requirement-group requirement-${group.key}`} key={group.key} open>
              <summary className="requirement-group-head">
                <div>
                  <h3>{group.title}{group.titleNote ? <> <span className="requirement-title-note">({group.titleNote})</span></> : null}</h3>
                  <p className="requirement-summary">{group.description}</p>
                </div>
              </summary>
              <div className="requirement-items">
                {group.items.map(item => <RequirementItem item={item} completedSet={completedSet} showCourses={group.key !== "graduation"} key={item.key} />)}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="card recommendation-section"><h2 className="section-title">5. 추천 수강과목</h2><p className="small recommendation-guide">위에서 선택한 목표와 수강한 과목에 따라 맞춤으로 추천 과목 리스트가 결정됩니다.</p>
        <div className="recommendation-list">{recommendations.length === 0 ? <div className="empty">현재 추천할 미이수 과목이 없습니다.</div> : recommendations.map((rec,index) => <div className={`rec ${rec.course.category === "COMMON" ? "rec-common" : "rec-major"}`} key={rec.course.id}><div className="rec-top"><div><strong>{index+1}. {rec.course.name}</strong><div className="small">{rec.course.category === "COMMON" ? "공통" : "전공"} · {rec.course.credits}학점</div></div><div className="score">추천점수 <strong>{rec.score.toFixed(1)}</strong> / 10</div></div><div className="rec-reasons">{rec.reasons.map(reason => <span key={reason} className={`reason ${requirementColorClass(reason)} ${rec.priority === "URGENT" ? "urgent" : ""}`}>{reason}</span>)}</div></div>)}</div>
      </section>

      <footer className="developer-footer">Designed &amp; Developed by Hui</footer>
    </main>
  );
}
