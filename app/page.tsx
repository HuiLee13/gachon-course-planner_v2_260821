"use client";

import { useEffect, useMemo, useState } from "react";
import {
  analyzeRequirements,
  COURSES,
  getCreditSummary,
  getDeadlineWarnings,
  recommendCourses,
  type CheckItem,
  type StudentProfile,
  type Track,
} from "@/lib/coursePlanner";

type Filter = "ALL" | "COMMON" | "MAJOR" | "REQUIRED" | "COMPLETED";

function courseBadges(course: (typeof COURSES)[number]) {
  const badges: string[] = [];
  const cat = course.category === "COMMON" ? "공통" : "전공";
  const mark = (value: string) => (value === "REQUIRED" ? "필수" : "선택");

  if (course.developmentVoucher !== "NONE") {
    badges.push(`발달바우처 ${cat} ${mark(course.developmentVoucher)}`);
  }
  if (course.artPsychCounselor !== "NONE") {
    badges.push(`미술심리상담사(가천대) ${cat} ${mark(course.artPsychCounselor)}`);
  }
  if (course.comprehensiveExam !== "NONE") {
    badges.push(`종합시험 ${cat} ${mark(course.comprehensiveExam)}`);
  }
  if (course.graduationExam !== "NONE") {
    badges.push(`졸업시험 ${cat} ${mark(course.graduationExam)}`);
  }
  if (course.proposal !== "NONE") {
    badges.push(`프로포절 ${cat} ${mark(course.proposal)}`);
  }

  return badges;
}

function RequirementItem({ item }: { item: CheckItem }) {
  const pct = Math.min(100, Math.round((item.current / item.required) * 100));

  return (
    <div className="req">
      <div className="req-head">
        <div>
          <strong>{item.title}</strong>
          <div className="small">{item.message}</div>
        </div>
        <span className={`status ${item.completed ? "ok" : "no"}`}>
          {item.completed ? "충족" : "미충족"}
        </span>
      </div>
      <div className="progress">
        <div style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const STORAGE_KEY = "gachon-course-planner-v1";

interface SavedPlannerState {
  semester: 1 | 2 | 3 | 4 | 5;
  track: Track;
  completed: string[];
}

export default function Home() {
  const [semester, setSemester] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [track, setTrack] = useState<Track>("THESIS");
  const [completed, setCompleted] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [storageReady, setStorageReady] = useState(false);

  // 최초 접속 시 이 브라우저에 저장해 둔 이수 정보를 불러온다.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (raw) {
        const saved = JSON.parse(raw) as Partial<SavedPlannerState>;

        if ([1, 2, 3, 4, 5].includes(Number(saved.semester))) {
          setSemester(Number(saved.semester) as 1 | 2 | 3 | 4 | 5);
        }

        if (saved.track === "THESIS" || saved.track === "NON_THESIS") {
          setTrack(saved.track);
        }

        if (Array.isArray(saved.completed)) {
          const validCourseIds = new Set(COURSES.map(course => course.id));
          setCompleted(saved.completed.filter(id => validCourseIds.has(id)));
        }
      }
    } catch (error) {
      console.warn("저장된 이수 정보를 불러오지 못했습니다.", error);
    } finally {
      setStorageReady(true);
    }
  }, []);

  // 사용자가 학차·트랙·이수과목을 바꾸면 자동으로 브라우저에 저장한다.
  useEffect(() => {
    if (!storageReady) return;

    const data: SavedPlannerState = {
      semester,
      track,
      completed,
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("이수 정보를 저장하지 못했습니다.", error);
    }
  }, [semester, track, completed, storageReady]);

  const profile: StudentProfile = {
    currentSemester: semester,
    track,
    completedCourseIds: completed,
  };

  const summary = useMemo(
    () => analyzeRequirements(profile),
    [semester, track, completed],
  );
  const credits = useMemo(() => getCreditSummary(profile), [completed]);
  const warnings = useMemo(
    () => getDeadlineWarnings(profile),
    [semester, track, completed],
  );
  const recommendations = useMemo(
    () => recommendCourses(profile).slice(0, 10),
    [semester, track, completed],
  );

  const completedSet = useMemo(() => new Set(completed), [completed]);

  const visibleCourses = useMemo(() => {
    const q = search.trim().toLowerCase();

    return COURSES.filter((course) => {
      const isCompleted = completedSet.has(course.id);
      const matchesSearch = !q || course.name.toLowerCase().includes(q);

      // 체크한 과목은 '이수한 과목' 필터에서만 보인다.
      if (filter === "COMPLETED") {
        return matchesSearch && isCompleted;
      }

      if (isCompleted) {
        return false;
      }

      const matchesFilter =
        filter === "ALL" ||
        (filter === "COMMON" && course.category === "COMMON") ||
        (filter === "MAJOR" && course.category === "MAJOR") ||
        (filter === "REQUIRED" &&
          [
            course.developmentVoucher,
            course.artPsychCounselor,
            course.comprehensiveExam,
            course.graduationExam,
          ].includes("REQUIRED"));

      return matchesSearch && matchesFilter;
    }).sort((a, b) => a.name.localeCompare(b.name, "ko-KR"));
  }, [search, filter, completedSet]);

  const toggleCourse = (id: string) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((courseId) => courseId !== id) : [...prev, id],
    );
  };

  const requirementGroups = [
    {
      key: "graduation",
      title: "졸업",
      description:
        track === "THESIS"
          ? "논문트랙 · 공통 8학점 이상 / 전공 16학점 이상"
          : "비논문트랙 · 공통 10학점 이상 / 전공 20학점 이상",
      items: summary.graduation,
    },
    {
      key: "developmentVoucher",
      title: "발달바우처",
      description: "공통 필수 포함 2과목 · 전공 필수 3과목 · 전공 선택 6과목",
      items: summary.developmentVoucher,
    },
    {
      key: "artPsychCounselor",
      title: "미술심리상담사(가천대)",
      description: "공통 필수 포함 4과목 · 전공 필수 5과목 · 전공 선택 3과목",
      items: summary.artPsychCounselor,
    },
    {
      key: "comprehensiveExam",
      title: "종합시험",
      description: "4학차 응시 · 3학차까지 공통 선택 1과목 / 전공 필수 2과목 이수",
      items: summary.comprehensiveExam,
    },
    {
      key: "graduationExam",
      title: "졸업시험",
      description: "비논문트랙만 해당 · 5학차 응시 · 4학차까지 전공 필수 3과목 이수",
      items: summary.graduationExam,
      hidden: track === "THESIS",
    },
    {
      key: "proposal",
      title: "프로포절",
      description: "논문트랙만 해당 · 3학차까지 논문작성법/연구방법론/통계학 중 2과목 이수",
      items: summary.proposal,
      hidden: track === "NON_THESIS",
    },
  ].filter((group) => !group.hidden);

  return (
    <main className="container">
      <header className="hero">
        <h1>가천대 미술치료 과목 이수 플래너_260821ver</h1>
        <p>
          과목을 체크하면 졸업·발달바우처·미술심리상담사·시험·프로포절
          요건을 자동으로 계산합니다.
        </p>
        <p className="save-note">
          {storageReady ? "이수 정보는 이 브라우저에 자동 저장됩니다." : "저장된 이수 정보를 불러오는 중입니다."}
        </p>
      </header>

      <section className="card">
        <h2 className="section-title">1. 내 정보</h2>
        <div className="grid2">
          <label className="field">
            <span>현재 학차</span>
            <select
              value={semester}
              onChange={(e) =>
                setSemester(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)
              }
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}학차
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>졸업 트랙</span>
            <select value={track} onChange={(e) => setTrack(e.target.value as Track)}>
              <option value="THESIS">논문트랙</option>
              <option value="NON_THESIS">비논문트랙</option>
            </select>
          </label>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">2. 과목 선택</h2>
        <div className="toolbar">
          <input
            className="search"
            placeholder="과목명 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="secondary-btn" onClick={() => setCompleted([])}>
            전체 해제
          </button>
        </div>

        <div className="filters">
          {(
            [
              ["ALL", "전체"],
              ["COMMON", "공통"],
              ["MAJOR", "전공"],
              ["REQUIRED", "필수 포함 과목"],
              ["COMPLETED", `이수한 과목 (${completed.length})`],
            ] as [Filter, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              className={`filter-btn ${filter === key ? "active" : ""}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="small filter-help">
          체크한 과목은 전체·공통·전공·필수 목록에서 사라지고, ‘이수한 과목’에서만
          확인할 수 있습니다.
        </p>

        <div className="course-list">
          {visibleCourses.length === 0 ? (
            <div className="empty course-empty">
              {filter === "COMPLETED"
                ? "아직 이수한 과목이 없습니다."
                : "현재 조건에 표시할 미이수 과목이 없습니다."}
            </div>
          ) : (
            visibleCourses.map((course) => (
              <label className={`course-item ${course.category === "COMMON" ? "course-common" : "course-major"}`} key={course.id}>
                <input
                  type="checkbox"
                  checked={completedSet.has(course.id)}
                  onChange={() => toggleCourse(course.id)}
                />
                <div>
                  <div className="course-name">{course.name}</div>
                  <div className="meta">
                    {course.category === "COMMON" ? "공통" : "전공"} · {course.credits}
                    학점
                  </div>
                  <div className="badges">
                    {courseBadges(course).map((badge) => (
                      <span className="badge" key={badge}>
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </label>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="section-title">3. 현재 이수 현황</h2>
        <div className="grid4">
          <div className="metric">
            <div className="label">총 이수학점</div>
            <div className="value">{credits.total}</div>
          </div>
          <div className="metric">
            <div className="label">공통 학점</div>
            <div className="value">{credits.common}</div>
          </div>
          <div className="metric">
            <div className="label">전공 학점</div>
            <div className="value">{credits.major}</div>
          </div>
          <div className="metric">
            <div className="label">이수 과목</div>
            <div className="value">{completed.length}</div>
          </div>
        </div>
      </section>

      <section className="card" style={{ marginTop: 18 }}>
        <h2 className="section-title">4. 요건별 판정</h2>

        {warnings.map((warning, index) => (
          <div className="warning" key={`${warning}-${index}`}>
            {warning}
          </div>
        ))}

        <div className="requirement-groups">
          {requirementGroups.map((group) => (
            <section className={`requirement-group requirement-${group.key}`} key={group.key}>
              <div className="requirement-group-head">
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </div>

              <div className="requirement-items">
                {group.items.map((item) => (
                  <RequirementItem item={item} key={item.key} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">5. 추천 수강과목</h2>
        <p className="small">
          여러 요건에 겹쳐 해당하고, 마감 학차가 가까운 과목을 기준으로 최대 10개까지
          표시합니다.
        </p>

        <div style={{ marginTop: 14 }}>
          {recommendations.length === 0 ? (
            <div className="empty">현재 추천할 미이수 과목이 없습니다.</div>
          ) : (
            recommendations.map((rec, index) => (
              <div className={`rec ${rec.course.category === "COMMON" ? "rec-common" : "rec-major"}`} key={rec.course.id}>
                <div className="rec-top">
                  <div>
                    <strong>
                      {index + 1}. {rec.course.name}
                    </strong>
                    <div className="small">
                      {rec.course.category === "COMMON" ? "공통" : "전공"} ·{" "}
                      {rec.course.credits}학점
                    </div>
                  </div>
                  <div className="score">추천점수 {rec.score}</div>
                </div>

                <div className="rec-reasons">
                  {rec.reasons.map((reason) => (
                    <span
                      key={reason}
                      className={`reason ${rec.priority === "URGENT" ? "urgent" : ""}`}
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      <footer className="developer-footer">
      Developed by Hui.
     </footer> 
    </main>
  );
}
