import { useCallback, useEffect, useState } from "react";
import api from "./api";
import Auth from "./Auth";
import Certificates from "./Certificates";
import "./App.css";
import Roadmap from "./Roadmap";

const ROLE_REQUIREMENTS = {
  "Full Stack Developer": {
    Java: 8, Python: 7, SQL: 8, React: 9, "Spring Boot": 9,
    "Data Structures and Algorithms": 8, HTML: 9, CSS: 9,
  },
  "Java Developer": {
    Java: 10, Python: 3, SQL: 8, React: 3, "Spring Boot": 9,
    "Data Structures and Algorithms": 9, HTML: 3, CSS: 3,
  },
  "Python Developer": {
    Java: 3, Python: 10, SQL: 8, React: 3, "Spring Boot": 3,
    "Data Structures and Algorithms": 8, HTML: 3, CSS: 3,
  },
  "Frontend Developer": {
    Java: 2, Python: 2, SQL: 6, React: 9, "Spring Boot": 1,
    "Data Structures and Algorithms": 7, HTML: 9, CSS: 9,
  },
  "Data Analyst": {
    Java: 2, Python: 9, SQL: 10, React: 2, "Spring Boot": 2,
    "Data Structures and Algorithms": 7, HTML: 4, CSS: 4,
  },
};

const ROLES = Object.keys(ROLE_REQUIREMENTS);

const PAGES = [
  { id: "dashboard", label: "Dashboard", title: "Student Dashboard", icon: "▦" },
  { id: "skills", label: "My Skills", title: "My Skills", icon: "◈" },
  { id: "gap", label: "Skill Gap Analysis", title: "Skill Gap Analysis", icon: "◉" },
  { id: "roadmap", label: "Learning Roadmap", title: "Learning Roadmap", icon: "☷" },
  { id: "assessments", label: "Assessments", title: "Assessments", icon: "✓" },
  { id: "certificates", label: "My Certificates", title: "My Certificates", icon: "🏆" },
];

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

const normalizeLevel = (value, fallback = 0) => {
  const level = Number(value);
  return Number.isFinite(level) && level >= 0 && level <= 10
    ? level
    : fallback;
};

const sameObject = (first, second) => {
  const firstKeys = Object.keys(first);
  const secondKeys = Object.keys(second);

  return (
    firstKeys.length === secondKeys.length &&
    secondKeys.every((key) => first[key] === second[key])
  );
};

const getAssessmentSkillId = (assessment) =>
  assessment?.skillId ?? assessment?.skill?.id;

const levelFromPercentage = (percentage) => {
  const value = Number(percentage);
  if (!Number.isFinite(value)) return null;
  return Math.round(Math.max(0, Math.min(10, value / 10)));
};

const getResultDateValue = (result) =>
  result?.submittedAt ||
  result?.takenAt ||
  result?.attemptDate ||
  result?.createdAt ||
  null;

const getResultTime = (result) => {
  const time = Date.parse(getResultDateValue(result) || "");
  return Number.isFinite(time) ? time : 0;
};

const formatResultDate = (result) => {
  const raw = getResultDateValue(result);
  if (!raw) return "—";
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem("token"))
  );

  const [studentName, setStudentName] = useState(
    () => localStorage.getItem("studentName") || ""
  );

  const [selectedRole, setSelectedRole] = useState(() => {
    const savedRole = localStorage.getItem("selectedRole");
    return ROLES.includes(savedRole) ? savedRole : "Full Stack Developer";
  });

  const [skills, setSkills] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [roleRequirements, setRoleRequirements] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [currentLevel, setCurrentLevel] = useState("1");
  const [targetLevel, setTargetLevel] = useState("8");
  const [editCurrentLevel, setEditCurrentLevel] = useState("1");
  const [editTargetLevel, setEditTargetLevel] = useState("8");

  // Assessment state
  const [assessments, setAssessments] = useState([]);
  const [assessmentResults, setAssessmentResults] = useState([]);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [assessmentSubmitting, setAssessmentSubmitting] = useState(false);
  const [latestAssessmentResult, setLatestAssessmentResult] = useState(null);
  const [assessmentSkillId, setAssessmentSkillId] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/skills");
      const skillData = Array.isArray(response.data) ? response.data : [];

      setSkills(
        skillData.map((skill) => ({
          id: skill.id,
          name: skill.name || skill.skillName,
          requiredLevel: normalizeLevel(skill.requiredLevel, 5),
          category: skill.category || "General",
        }))
      );

      const studentId = localStorage.getItem("studentId");

      if (!studentId) {
        setMySkills([]);
        setError("Your student ID is missing. Please log out and log in again.");
        return;
      }

      const studentSkillsResponse = await api.get(
        `/student-skills/${studentId}`,
        getAuthConfig()
      );

      setMySkills(
        Array.isArray(studentSkillsResponse.data)
          ? studentSkillsResponse.data
          : []
      );
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError(
        [401, 403].includes(err.response?.status)
          ? "Your session may have expired. Please log out and log in again."
          : "Unable to load your skills. Please check the backend and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAssessmentData = useCallback(async () => {
    const studentId = localStorage.getItem("studentId");

    if (!studentId || !localStorage.getItem("token")) {
      setAssessments([]);
      setAssessmentResults([]);
      return;
    }

    try {
      setAssessmentLoading(true);

      const [assessmentResponse, resultResponse] = await Promise.all([
        api.get("/assessments", getAuthConfig()),
        api.get(
          `/assessments/results/student/${studentId}`,
          getAuthConfig()
        ),
      ]);

      setAssessments(
        Array.isArray(assessmentResponse.data)
          ? assessmentResponse.data
          : []
      );

      setAssessmentResults(
        Array.isArray(resultResponse.data) ? resultResponse.data : []
      );
    } catch (err) {
      console.error("Error loading assessments:", err);
      setError(
        [401, 403].includes(err.response?.status)
          ? "Your session may have expired. Please log in again."
          : "Unable to load assessments. Please check the assessment API."
      );
    } finally {
      setAssessmentLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedRole", selectedRole);
  }, [selectedRole]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activePage]);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    fetchDashboardData();
    fetchAssessmentData();
  }, [isLoggedIn, fetchDashboardData, fetchAssessmentData]);

  useEffect(() => {
    let cancelled = false;

    if (!isLoggedIn || skills.length === 0) {
      setRoleRequirements((previous) =>
        Object.keys(previous).length === 0 ? previous : {}
      );

      return () => {
        cancelled = true;
      };
    }

    const defaults = ROLE_REQUIREMENTS[selectedRole] || {};
    const fallbackRequirements = {};

    skills.forEach((skill) => {
      fallbackRequirements[Number(skill.id)] =
        defaults[skill.name] !== undefined
          ? defaults[skill.name]
          : skill.requiredLevel;
    });

    setRoleRequirements((previous) =>
      sameObject(previous, fallbackRequirements)
        ? previous
        : fallbackRequirements
    );

    const fetchRequirements = async () => {
      try {
        const response = await api.get(
          `/role-requirements/${encodeURIComponent(selectedRole)}`,
          getAuthConfig()
        );

        if (cancelled) return;

        const requirements = { ...fallbackRequirements };
        const items = Array.isArray(response.data) ? response.data : [];

        items.forEach((item) => {
          const skillId = item.skill?.id ?? item.skillId;
          const level = Number(item.requiredLevel);

          if (
            skillId != null &&
            Number.isFinite(level) &&
            level >= 0 &&
            level <= 10
          ) {
            requirements[Number(skillId)] = level;
          }
        });

        if (!cancelled) {
          setRoleRequirements((previous) =>
            sameObject(previous, requirements) ? previous : requirements
          );
        }
      } catch (err) {
        console.warn("Unable to load role requirements; using defaults.", err);

        if (!cancelled) {
          setRoleRequirements((previous) =>
            sameObject(previous, fallbackRequirements)
              ? previous
              : fallbackRequirements
          );
        }
      }
    };

    fetchRequirements();

    return () => {
      cancelled = true;
    };
  }, [selectedRole, isLoggedIn, skills]);

  const getSkillDetails = (skillId) =>
    skills.find((skill) => Number(skill.id) === Number(skillId));

  const getRequiredLevel = (skillId) => {
    const skill = getSkillDetails(skillId);
    if (!skill) return 5;

    const apiLevel = roleRequirements[Number(skillId)];
    if (apiLevel !== undefined) return normalizeLevel(apiLevel, 5);

    const defaults = ROLE_REQUIREMENTS[selectedRole] || {};
    return normalizeLevel(defaults[skill.name] ?? skill.requiredLevel, 5);
  };

  const isSkillAdded = (skillId) =>
    mySkills.some((item) => Number(item.skillId) === Number(skillId));

  const availableSkills = skills.filter((skill) => !isSkillAdded(skill.id));

  // Assessment helpers
  const getAssessmentForSkill = (skillId) =>
    skillId === "" || skillId == null
      ? undefined
      : assessments.find(
          (assessment) =>
            Number(getAssessmentSkillId(assessment)) === Number(skillId)
        );

  const getResultsForAssessment = (assessmentId) =>
    assessmentResults
      .filter((result) => Number(result.assessmentId) === Number(assessmentId))
      .sort(
        (first, second) =>
          getResultTime(second) - getResultTime(first) ||
          Number(second.id ?? 0) - Number(first.id ?? 0)
      );

  const getLatestResultForSkill = (skillId) => {
    const assessment = getAssessmentForSkill(skillId);
    if (!assessment) return null;

    if (
      latestAssessmentResult &&
      Number(latestAssessmentResult.assessmentId) === Number(assessment.id)
    ) {
      return latestAssessmentResult;
    }

    return getResultsForAssessment(assessment.id)[0] || null;
  };

  const validateLevels = (current, target) => {
    if (
      !Number.isInteger(current) ||
      !Number.isInteger(target) ||
      current < 0 ||
      current > 10 ||
      target < 0 ||
      target > 10
    ) {
      setError("Skill levels must be whole numbers between 0 and 10.");
      return false;
    }

    return true;
  };

  const handleLogin = (student) => {
    const name =
      student?.name || localStorage.getItem("studentName") || "Student";

    setStudentName(name);
    localStorage.setItem("studentName", name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    [
      "token",
      "studentId",
      "studentName",
      "studentEmail",
    ].forEach((key) => localStorage.removeItem(key));

    setStudentName("");
    setMySkills([]);
    setSkills([]);
    setRoleRequirements({});
    setAssessments([]);
    setAssessmentResults([]);
    setActiveAssessment(null);
    setAssessmentQuestions([]);
    setSelectedAnswers({});
    setLatestAssessmentResult(null);
    setAssessmentSkillId(null);
    setActivePage("dashboard");
    setIsLoggedIn(false);
    setShowAddForm(false);
    setEditingSkillId(null);
    setSelectedSkillId("");
    setError("");
    setMessage("");
  };

  const handleSkillSelection = (event) => {
    const skillId = event.target.value;
    setSelectedSkillId(skillId);

    if (skillId) setTargetLevel(String(getRequiredLevel(skillId)));
  };

  const handleAddSkill = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const studentId = localStorage.getItem("studentId");

    if (!studentId) {
      setError("Student ID is missing. Please log in again.");
      return;
    }

    if (!selectedSkillId) {
      setError("Please select a skill.");
      return;
    }

    if (isSkillAdded(selectedSkillId)) {
      setError("You have already added this skill.");
      return;
    }

    const current = Number(currentLevel);
    const target = Number(targetLevel);

    if (!validateLevels(current, target)) return;

    try {
      setSaving(true);

      await api.post(
        "/student-skills",
        {
          studentId: Number(studentId),
          skillId: Number(selectedSkillId),
          currentLevel: current,
          targetLevel: target,
        },
        getAuthConfig()
      );

      setMessage("Skill added successfully!");
      setSelectedSkillId("");
      setCurrentLevel("1");
      setTargetLevel("8");
      setShowAddForm(false);

      await fetchDashboardData();
    } catch (err) {
      console.error("Error adding skill:", err);

      if ([401, 403].includes(err.response?.status)) {
        setError("Your session may have expired. Please log in again.");
      } else if (err.response?.status === 409) {
        setError("This skill has already been added.");
      } else {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Unable to save the skill."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (item) => {
    setEditingSkillId(item.skillId);
    setEditCurrentLevel(String(normalizeLevel(item.currentLevel)));
    setEditTargetLevel(String(getRequiredLevel(item.skillId)));
    setShowAddForm(false);
    setError("");
    setMessage("");
  };

  const handleCancelEdit = () => {
    setEditingSkillId(null);
    setEditCurrentLevel("1");
    setEditTargetLevel("8");
    setError("");
  };

  const handleUpdateSkill = async (event, item) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const current = Number(editCurrentLevel);
    const target = Number(editTargetLevel);

    if (!validateLevels(current, target)) return;

    const studentId = localStorage.getItem("studentId");

    if (!studentId) {
      setError("Student ID is missing. Please log in again.");
      return;
    }

    try {
      setSaving(true);

      await api.put(
        `/student-skills/${studentId}/${item.skillId}`,
        {
          studentId: Number(studentId),
          skillId: Number(item.skillId),
          currentLevel: current,
          targetLevel: target,
        },
        getAuthConfig()
      );

      setEditingSkillId(null);
      setMessage("Skill updated successfully!");

      await fetchDashboardData();
    } catch (err) {
      console.error("Error updating skill:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to update the skill."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (item) => {
    const skill = getSkillDetails(item.skillId);
    const skillName = skill?.name || `Skill ${item.skillId}`;

    if (
      !window.confirm(
        `Are you sure you want to delete "${skillName}" from your skills?`
      )
    ) {
      return;
    }

    const studentId = localStorage.getItem("studentId");

    if (!studentId) {
      setError("Student ID is missing. Please log in again.");
      return;
    }

    setError("");
    setMessage("");

    try {
      setSaving(true);

      await api.delete(
        `/student-skills/${studentId}/${item.skillId}`,
        getAuthConfig()
      );

      setMySkills((previous) =>
        previous.filter(
          (saved) => Number(saved.skillId) !== Number(item.skillId)
        )
      );

      if (Number(editingSkillId) === Number(item.skillId)) {
        setEditingSkillId(null);
      }

      setMessage(`${skillName} deleted successfully!`);
      await fetchDashboardData();
    } catch (err) {
      console.error("Error deleting skill:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to delete the skill."
      );
    } finally {
      setSaving(false);
    }
  };

  // Assessment actions
  const handleStartAssessment = async (assessment) => {
    setError("");
    setMessage("");
    setLatestAssessmentResult(null);
    setSelectedAnswers({});
    setAssessmentQuestions([]);
    setActiveAssessment(null);
    setAssessmentSkillId(Number(getAssessmentSkillId(assessment)));

    try {
      setAssessmentLoading(true);

      const response = await api.get(
        `/assessments/${assessment.id}/questions`,
        getAuthConfig()
      );

      const questions = Array.isArray(response.data) ? response.data : [];

      if (questions.length === 0) {
        setError("This assessment does not have any questions yet.");
        return;
      }

      setAssessmentQuestions(questions);
      setActiveAssessment(assessment);

      window.setTimeout(() => {
        document.getElementById("assessment-section")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 0);
    } catch (err) {
      console.error("Unable to load assessment questions:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load questions. Please check your session and backend."
      );
    } finally {
      setAssessmentLoading(false);
    }
  };

  const handleCheckLevel = (skillId) => {
    setError("");
    setMessage("");

    const skillName = getSkillDetails(skillId)?.name || "this skill";
    const assessment = getAssessmentForSkill(skillId);

    if (!assessment) {
      setError(
        `No assessment is linked to ${skillName} yet. Check the assessment's skill_id in your database.`
      );
      return;
    }

    setActiveAssessment(null);
    setAssessmentQuestions([]);
    setSelectedAnswers({});
    setLatestAssessmentResult(null);
    setAssessmentSkillId(Number(skillId));
    setActivePage("assessments");
  };

  const handleStartAssessmentFromForm = async () => {
    const assessment = getAssessmentForSkill(selectedSkillId);

    if (!assessment) {
      setError("No assessment is linked to this skill yet.");
      return;
    }

    setActivePage("assessments");
    await handleStartAssessment(assessment);
  };

  const handleAnswerChange = (questionId, option) => {
    setSelectedAnswers((previous) => ({
      ...previous,
      [questionId]: option,
    }));
  };

  const handleSubmitAssessment = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const studentId = localStorage.getItem("studentId");

    if (!studentId) {
      setError("Student ID is missing. Please log in again.");
      return;
    }

    if (!activeAssessment || assessmentQuestions.length === 0) {
      setError("Please start an assessment first.");
      return;
    }

    const unanswered = assessmentQuestions.filter(
      (question) => !selectedAnswers[question.id]
    );

    if (unanswered.length > 0) {
      setError(
        `Please answer all questions. ${unanswered.length} question(s) remain.`
      );
      return;
    }

    try {
      setAssessmentSubmitting(true);

      const response = await api.post(
        "/assessments/submit",
        {
          studentId: Number(studentId),
          assessmentId: Number(activeAssessment.id),
          answers: selectedAnswers,
        },
        getAuthConfig()
      );

      const submittedSkillId = getAssessmentSkillId(activeAssessment);
      const submittedSkillName =
        getSkillDetails(submittedSkillId)?.name || "skill";

      const result = {
        ...response.data,
        assessmentId: response.data?.assessmentId ?? activeAssessment.id,
      };

      const measuredLevel = levelFromPercentage(result.percentage);

      const addingThisSkill =
        showAddForm &&
        selectedSkillId &&
        Number(selectedSkillId) === Number(submittedSkillId);

      setLatestAssessmentResult(result);
      setActiveAssessment(null);
      setAssessmentQuestions([]);
      setSelectedAnswers({});

      if (addingThisSkill && measuredLevel !== null) {
        setCurrentLevel(String(measuredLevel));
        setActivePage("skills");
        setMessage(
          `Assessment submitted! You scored ${result.score}/${result.totalQuestions}. Your ${submittedSkillName} level (${measuredLevel}/10) is filled in below. Click Save Skill to add it.`
        );
      } else {
        setMessage(
          `${submittedSkillName} assessment submitted! You scored ${result.score}/${result.totalQuestions} (${Number(
            result.percentage ?? 0
          ).toFixed(2)}%).`
        );
      }

      await fetchAssessmentData();
      window.dispatchEvent(new Event("certificates-updated"));
    } catch (err) {
      console.error("Unable to submit assessment:", err);
      setError(
        err.response?.data?.message ||
          "Unable to submit your assessment. Please try again."
      );
    } finally {
      setAssessmentSubmitting(false);
    }
  };

  const handleCancelAssessment = () => {
    if (
      !window.confirm(
        "Leave this assessment? Your selected answers will be lost."
      )
    ) {
      return;
    }

    setActiveAssessment(null);
    setAssessmentQuestions([]);
    setSelectedAnswers({});
    setLatestAssessmentResult(null);
    setError("");
  };

  const averageSkill =
    mySkills.length > 0
      ? Math.round(
          (mySkills.reduce(
            (total, item) => total + normalizeLevel(item.currentLevel),
            0
          ) /
            mySkills.length) *
            10
        )
      : 0;

  const averageGap =
    mySkills.length > 0
      ? Math.round(
          (mySkills.reduce(
            (total, item) =>
              total +
              Math.max(
                0,
                getRequiredLevel(item.skillId) -
                  normalizeLevel(item.currentLevel)
              ),
            0
          ) /
            mySkills.length) *
            10
        )
      : 0;

  const difficultSkills = mySkills.filter(
    (item) =>
      getRequiredLevel(item.skillId) >
      normalizeLevel(item.currentLevel)
  );

  const chosenSkill =
    assessmentSkillId != null
      ? getSkillDetails(assessmentSkillId)
      : null;

  const chosenAssessment =
    assessmentSkillId != null
      ? getAssessmentForSkill(assessmentSkillId)
      : null;

  const chosenSkillName = chosenSkill?.name || "Skill";

  const chosenResult =
    chosenAssessment &&
    latestAssessmentResult &&
    Number(latestAssessmentResult.assessmentId) ===
      Number(chosenAssessment.id)
      ? latestAssessmentResult
      : null;

  const chosenMeasuredLevel = chosenResult
    ? levelFromPercentage(chosenResult.percentage)
    : null;

  const formSkill = selectedSkillId
    ? getSkillDetails(selectedSkillId)
    : null;

  const formAssessment = selectedSkillId
    ? getAssessmentForSkill(selectedSkillId)
    : null;

  const sortedResults = [...assessmentResults].sort(
    (first, second) =>
      getResultTime(second) - getResultTime(first) ||
      Number(second.id ?? 0) - Number(first.id ?? 0)
  );

  const hasResultDates = sortedResults.some((result) =>
    Boolean(getResultDateValue(result))
  );

  const currentPage =
    PAGES.find((page) => page.id === activePage) || PAGES[0];

  const answeredCount = assessmentQuestions.filter(
    (question) => selectedAnswers[question.id]
  ).length;

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <h2>SkillTrack</h2>
            <p>Student Analyzer</p>
          </div>
        </div>

        <p className="menu-title">MAIN MENU</p>

        <nav>
          {PAGES.map((page) => (
            <button
              type="button"
              key={page.id}
              className={`nav-item ${
                activePage === page.id ? "active" : ""
              }`}
              aria-current={activePage === page.id ? "page" : undefined}
              onClick={() => setActivePage(page.id)}
            >
              <span>{page.icon}</span> {page.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-icon">?</div>
          <div>
            <h4>Need help?</h4>
            <p>Keep learning every day!</p>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Pages / {currentPage.label}</p>
            <h2>{currentPage.title}</h2>
          </div>

          <div className="profile">
            <div className="notification">♧</div>
            <div className="avatar">
              {(studentName.trim().charAt(0) || "S").toUpperCase()}
            </div>
            <div>
              <h4>{studentName.trim() || "Student"}</h4>
              <p>IT Student</p>
            </div>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {activePage === "dashboard" && (
          <section className="welcome">
            <div>
              <p className="welcome-label">YOUR LEARNING JOURNEY</p>
              <h1>Welcome back, {studentName.trim() || "Student"}! 👋</h1>
              <p>
                Discover your skill gaps and build the skills needed for your
                dream career.
              </p>

              <div className="welcome-form">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={studentName}
                  onChange={(event) => {
                    const name = event.target.value;
                    setStudentName(name);
                    localStorage.setItem("studentName", name);
                  }}
                />

                <select
                  value={selectedRole}
                  onChange={(event) => {
                    setSelectedRole(event.target.value);
                    setEditingSkillId(null);
                    setError("");
                    setMessage("");
                  }}
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="welcome-art">
              <div className="art-circle">
                <span>🎯</span>
              </div>
              <div className="floating-card">🚀 Keep growing!</div>
            </div>
          </section>
        )}

        {error && (
          <div className="alert alert-error" role="alert">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {message && (
          <div className="alert alert-success" role="status">
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              ✕
            </button>
          </div>
        )}

        {activePage === "dashboard" && (
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">◈</div>
              <p>Total Skills</p>
              <h2>{loading ? "..." : skills.length}</h2>
              <span className="stat-note">Skills from database</span>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">✓</div>
              <p>Current Skill Level</p>
              <h2>{loading ? "..." : `${averageSkill}%`}</h2>
              <span className="stat-note">Based on your added skills</span>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">↗</div>
              <p>Average Skill Gap</p>
              <h2>{loading ? "..." : `${averageGap}%`}</h2>
              <span className="stat-note">
                Based on {selectedRole} requirements
              </span>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue">☆</div>
              <p>Career Goal</p>
              <h2 className="career-stat">Developer</h2>
              <span className="stat-note">{selectedRole}</span>
            </div>
          </section>
        )}

        {(activePage === "skills" || activePage === "gap") && (
          <section className="content-grid page-single">
            {activePage === "skills" && (
              <div className="panel skills-panel" id="skills">
                <div className="panel-heading">
                  <div>
                    <h3>My Technical Skills</h3>
                    <p>
                      Add, edit, or delete skills and compare your current
                      level with your selected role.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => {
                      setShowAddForm((previous) => !previous);
                      setEditingSkillId(null);
                      setError("");
                      setMessage("");
                    }}
                    disabled={loading || saving}
                  >
                    {showAddForm ? "Cancel" : "+ Add Skill"}
                  </button>
                </div>

                {showAddForm && (
                  <form onSubmit={handleAddSkill} className="skill-form">
                    <h4>Add a Technical Skill</h4>

                    <div className="form-field">
                      <label htmlFor="skillSelect">Select Skill</label>
                      <select
                        id="skillSelect"
                        value={selectedSkillId}
                        onChange={handleSkillSelection}
                        required
                      >
                        <option value="">Choose a skill</option>
                        {availableSkills.map((skill) => (
                          <option key={skill.id} value={skill.id}>
                            {skill.name} (required{" "}
                            {getRequiredLevel(skill.id)}/10)
                          </option>
                        ))}
                      </select>
                    </div>

                    {availableSkills.length === 0 && (
                      <p>You have added all available skills!</p>
                    )}

                    {formSkill && (
                      <div className="level-check-box">
                        <div>
                          <h4>Check your {formSkill.name} level</h4>
                          <p>
                            {formAssessment
                              ? `Not sure which level to choose? Take the short ${formSkill.name} assessment and your current level will be filled in for you.`
                              : `The ${formSkill.name} assessment is not available yet, so please choose your level manually.`}
                          </p>
                        </div>

                        <button
                          type="button"
                          className="primary-button"
                          onClick={handleStartAssessmentFromForm}
                          disabled={assessmentLoading || !formAssessment}
                        >
                          {assessmentLoading ? "Loading..." : "Start Assessment"}
                        </button>
                      </div>
                    )}

                    <div className="form-grid">
                      <div className="form-field form-box">
                        <label htmlFor="currentLevel">
                          Current Level (0–10)
                        </label>
                        <select
                          id="currentLevel"
                          value={currentLevel}
                          onChange={(event) =>
                            setCurrentLevel(event.target.value)
                          }
                          required
                        >
                          {Array.from({ length: 11 }, (_, index) => (
                            <option key={index} value={index}>
                              {index}/10
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-field form-box">
                        <label htmlFor="targetLevel">
                          Target Level for {selectedRole} (0–10)
                        </label>
                        <select
                          id="targetLevel"
                          value={targetLevel}
                          onChange={(event) =>
                            setTargetLevel(event.target.value)
                          }
                          required
                        >
                          {Array.from({ length: 11 }, (_, index) => (
                            <option key={index} value={index}>
                              {index}/10
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="primary-button"
                      disabled={saving || availableSkills.length === 0}
                    >
                      {saving ? "Saving..." : "Save Skill"}
                    </button>
                  </form>
                )}

                <div className="legend">
                  <span>
                    <i className="legend-current" /> Current level
                  </span>
                  <span>
                    <i className="legend-required" /> Role-required level
                  </span>
                </div>

                {loading && <p>Loading your skills...</p>}

                {!loading && mySkills.length === 0 && (
                  <div className="empty-state">
                    <p>
                      You have not added any skills yet. Start by selecting the
                      Add Skill button.
                    </p>
                    {!showAddForm && (
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() => setShowAddForm(true)}
                      >
                        + Add Your First Skill
                      </button>
                    )}
                  </div>
                )}

                {!loading &&
                  mySkills.map((item) => {
                    const skill = getSkillDetails(item.skillId);
                    const skillName = skill?.name || `Skill ${item.skillId}`;
                    const current = normalizeLevel(item.currentLevel);
                    const target = getRequiredLevel(item.skillId);
                    const gap = Math.max(0, target - current);
                    const isEditing =
                      Number(editingSkillId) === Number(item.skillId);
                    const skillAssessment = getAssessmentForSkill(item.skillId);
                    const skillLatestResult = getLatestResultForSkill(
                      item.skillId
                    );
                    const skillMeasuredLevel = skillLatestResult
                      ? levelFromPercentage(skillLatestResult.percentage)
                      : null;

                    return (
                      <div
                        className="skill-row"
                        key={item.id ?? item.skillId}
                      >
                        <div className="skill-label">
                          <span>{skillName}</span>
                          <span>
                            {current * 10}% / {target * 10}%
                          </span>
                        </div>

                        <div className="progress-track">
                          <div
                            className="progress-required"
                            style={{ width: `${target * 10}%` }}
                          />
                          <div
                            className="progress-current"
                            style={{ width: `${current * 10}%` }}
                          />
                        </div>

                        <div className="skill-actions">
                          <span className="skill-info">
                            Current: {current}/10 | Required for {selectedRole}:{" "}
                            {target}/10 | Gap: {gap}
                          </span>

                          <div className="skill-buttons">
                            {skillAssessment && (
                              <button
                                type="button"
                                className="primary-button small-button"
                                onClick={() =>
                                  handleCheckLevel(item.skillId)
                                }
                                disabled={assessmentLoading}
                                title={`Take the ${skillName} assessment`}
                              >
                                {assessmentLoading
                                  ? "Loading..."
                                  : "Check My Level"}
                              </button>
                            )}

                            {!isEditing && (
                              <>
                                <button
                                  type="button"
                                  className="small-button outline-button"
                                  onClick={() => handleEditClick(item)}
                                  disabled={saving}
                                >
                                  ✏️ Edit
                                </button>

                                <button
                                  type="button"
                                  className="small-button outline-button"
                                  onClick={() => handleDeleteSkill(item)}
                                  disabled={saving}
                                >
                                  🗑️ Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {skillLatestResult && (
                          <div className="level-box">
                            <div className="level-box-header">
                              <h4>Your Assessed {skillName} Level</h4>
                              <span
                                className={`level-badge ${
                                  skillLatestResult.resultStatus === "PASS"
                                    ? "pass"
                                    : "fail"
                                }`}
                              >
                                {skillLatestResult.resultStatus}
                              </span>
                            </div>

                            <div className="level-box-grid">
                              <div className="level-cell">
                                <span className="level-cell-label">
                                  Current Level
                                </span>
                                <strong className="level-cell-value">
                                  {skillMeasuredLevel ?? "—"}/10
                                </strong>
                              </div>

                              <div className="level-cell">
                                <span className="level-cell-label">Score</span>
                                <strong className="level-cell-value">
                                  {skillLatestResult.score}/
                                  {skillLatestResult.totalQuestions}
                                </strong>
                              </div>

                              <div className="level-cell">
                                <span className="level-cell-label">
                                  Percentage
                                </span>
                                <strong className="level-cell-value">
                                  {Number(
                                    skillLatestResult.percentage ?? 0
                                  ).toFixed(2)}
                                  %
                                </strong>
                              </div>
                            </div>
                          </div>
                        )}

                        {isEditing && (
                          <form
                            className="skill-form"
                            onSubmit={(event) =>
                              handleUpdateSkill(event, item)
                            }
                          >
                            <h4>Edit Skill</h4>

                            <div className="form-grid">
                              <div className="form-field form-box">
                                <label
                                  htmlFor={`edit-current-${item.skillId}`}
                                >
                                  Current Level (0–10)
                                </label>
                                <select
                                  id={`edit-current-${item.skillId}`}
                                  value={editCurrentLevel}
                                  onChange={(event) =>
                                    setEditCurrentLevel(event.target.value)
                                  }
                                  required
                                >
                                  {Array.from({ length: 11 }, (_, index) => (
                                    <option key={index} value={index}>
                                      {index}/10
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="form-field form-box">
                                <label
                                  htmlFor={`edit-target-${item.skillId}`}
                                >
                                  Required Level for {selectedRole} (0–10)
                                </label>
                                <select
                                  id={`edit-target-${item.skillId}`}
                                  value={editTargetLevel}
                                  onChange={(event) =>
                                    setEditTargetLevel(event.target.value)
                                  }
                                  required
                                >
                                  {Array.from({ length: 11 }, (_, index) => (
                                    <option key={index} value={index}>
                                      {index}/10
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="primary-button"
                              disabled={saving}
                            >
                              {saving ? "Saving..." : "Save Changes"}
                            </button>

                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              disabled={saving}
                            >
                              Cancel
                            </button>
                          </form>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}

            {activePage === "gap" && (
              <div className="panel gap-panel" id="gap">
                <div className="panel-heading">
                  <div>
                    <h3>Skill Gap Overview</h3>
                    <p>Your improvement opportunities for {selectedRole}.</p>
                  </div>
                </div>

                <div className="gap-circle">
                  <div>
                    <h2>{loading ? "..." : `${averageGap}%`}</h2>
                    <p>Average gap</p>
                  </div>
                </div>

                <div className="gap-message">
                  <span>💡</span>
                  <div>
                    <h4>
                      {difficultSkills.length > 0
                        ? "Skills to improve"
                        : "Keep improving!"}
                    </h4>
                    <p>
                      {mySkills.length === 0
                        ? "Add your skills to see your skill gap analysis."
                        : difficultSkills.length > 0
                          ? `You have ${difficultSkills.length} skill(s) below the required level for ${selectedRole}.`
                          : "Your current levels have reached the selected role's requirements. Keep learning!"}
                    </p>
                  </div>
                </div>

                {difficultSkills.length > 0 && (
                  <div>
                    <h4>Skills needing improvement</h4>
                    {difficultSkills.map((item) => {
                      const skill = getSkillDetails(item.skillId);
                      const gap = Math.max(
                        0,
                        getRequiredLevel(item.skillId) -
                          normalizeLevel(item.currentLevel)
                      );

                      return (
                        <p key={item.id ?? item.skillId}>
                          • {skill?.name || `Skill ${item.skillId}`} — {gap}{" "}
                          level(s) to improve
                        </p>
                      );
                    })}
                  </div>
                )}

                <button
                  type="button"
                  className="primary-button"
                  onClick={() => setActivePage("roadmap")}
                >
                  View Learning Roadmap →
                </button>
              </div>
            )}
          </section>
        )}
        {activePage === "roadmap" && (
          <section className="panel roadmap-panel" id="roadmap">
            <Roadmap
              selectedRole={selectedRole}
              mySkills={mySkills}
              skills={skills}
              roleRequirements={roleRequirements}
            />
          </section>
        )}
       
        {activePage === "assessments" && (
          <>
            {!chosenAssessment && (
              <section className="panel roadmap-panel" id="assessment-section">
                <div className="panel-heading">
                  <div>
                    <h3>Assessments</h3>
                    <p>Choose a skill in My Skills to check your level.</p>
                  </div>
                </div>

                <div className="empty-state">
                  <p>
                    Pick any skill in My Skills and click Check My Level to open
                    its assessment.
                  </p>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => setActivePage("skills")}
                  >
                    Go to My Skills
                  </button>
                </div>
              </section>
            )}

            {chosenAssessment && (
              <section className="panel roadmap-panel" id="assessment-section">
                <div className="panel-heading">
                  <div>
                    <h3>{chosenSkillName} Assessment</h3>
                    <p>
                      Take this short assessment to measure your {chosenSkillName}{" "}
                      level.
                    </p>
                  </div>
                </div>

                {activeAssessment ? (
                  <form
                    onSubmit={handleSubmitAssessment}
                    className="assessment-box"
                  >
                    <div className="assessment-intro">
                      <h3>{activeAssessment.title}</h3>
                      <p>{activeAssessment.description}</p>

                      <div className="assessment-progress">
                        <div
                          className="assessment-progress-fill"
                          style={{
                            width: `${
                              assessmentQuestions.length > 0
                                ? (answeredCount / assessmentQuestions.length) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>

                      <p className="assessment-count">
                        Answered: {answeredCount}/{assessmentQuestions.length}
                      </p>
                    </div>

                    <div className="questions-box">
                      {assessmentQuestions.map((question, index) => (
                        <div className="question-card" key={question.id}>
                          <div className="question-header">
                            <span className="question-number">
                              Q{index + 1}
                            </span>
                            <h4>{question.questionText}</h4>
                          </div>

                          <div className="options-list">
                            {["A", "B", "C", "D"].map((option) => {
                              const isSelected =
                                selectedAnswers[question.id] === option;

                              return (
                                <label
                                  className={`answer-option ${
                                    isSelected ? "answer-selected" : ""
                                  }`}
                                  key={option}
                                >
                                  <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    value={option}
                                    checked={isSelected}
                                    onChange={() =>
                                      handleAnswerChange(question.id, option)
                                    }
                                  />
                                  <span className="option-letter">
                                    {option}
                                  </span>
                                  <span className="option-text">
                                    {question[`option${option}`]}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="assessment-actions">
                      <button
                        type="submit"
                        className="primary-button"
                        disabled={assessmentSubmitting}
                      >
                        {assessmentSubmitting
                          ? "Submitting..."
                          : "Submit Assessment"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelAssessment}
                        disabled={assessmentSubmitting}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    {assessmentLoading && (
                      <p>Loading {chosenSkillName} assessment...</p>
                    )}

                    {!assessmentLoading && (
                      <div className="roadmap-item">
                        <div className="roadmap-number">
                          {chosenSkillName.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <h4>{chosenAssessment.title}</h4>
                          <p>{chosenAssessment.description}</p>
                          <p>
                            Questions: {chosenAssessment.totalQuestions} |
                            Passing score: {chosenAssessment.passingScore}%
                          </p>
                        </div>

                        <button
                          type="button"
                          className="primary-button"
                          onClick={() =>
                            handleStartAssessment(chosenAssessment)
                          }
                        >
                          Start Assessment
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {chosenResult && (
                  <div
                    className={`level-box ${
                      chosenResult.resultStatus === "PASS"
                        ? "result-pass"
                        : "result-fail"
                    }`}
                    role="status"
                  >
                    <div className="level-box-header">
                      <h4>Your {chosenSkillName} Assessment Result</h4>
                      <span
                        className={`level-badge ${
                          chosenResult.resultStatus === "PASS" ? "pass" : "fail"
                        }`}
                      >
                        {chosenResult.resultStatus}
                      </span>
                    </div>

                    <div className="level-box-grid">
                      <div className="level-cell">
                        <span className="level-cell-label">Current Level</span>
                        <strong className="level-cell-value">
                          {chosenMeasuredLevel ?? "—"}/10
                        </strong>
                      </div>

                      <div className="level-cell">
                        <span className="level-cell-label">Score</span>
                        <strong className="level-cell-value">
                          {chosenResult.score}/{chosenResult.totalQuestions}
                        </strong>
                      </div>

                      <div className="level-cell">
                        <span className="level-cell-label">Percentage</span>
                        <strong className="level-cell-value">
                          {Number(chosenResult.percentage ?? 0).toFixed(2)}%
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            <section className="panel roadmap-panel" id="assessment-history">
              <div className="panel-heading">
                <div>
                  <h3>Assessment History</h3>
                  <p>
                    All your previous attempts across every skill, newest first.
                  </p>
                </div>
              </div>

              {sortedResults.length === 0 ? (
                <p>No assessment results yet.</p>
              ) : (
                <div className="table-wrapper">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Skill</th>
                        {hasResultDates && <th>Date</th>}
                        <th>Score</th>
                        <th>Percentage</th>
                        <th>Level</th>
                        <th>Result</th>
                      </tr>
                    </thead>

                    <tbody>
                      {sortedResults.map((result, index) => {
                        const resultAssessment = assessments.find(
                          (assessment) =>
                            Number(assessment.id) ===
                            Number(result.assessmentId)
                        );

                        const resultSkill = getSkillDetails(
                          getAssessmentSkillId(resultAssessment)
                        );

                        const passed = result.resultStatus === "PASS";

                        return (
                          <tr
                            key={
                              result.id ??
                              `${result.assessmentId}-${index}`
                            }
                          >
                            <td>
                              {resultSkill?.name ||
                                resultAssessment?.title ||
                                "Assessment"}
                            </td>
                            {hasResultDates && (
                              <td>{formatResultDate(result)}</td>
                            )}
                            <td>
                              {result.score}/{result.totalQuestions}
                            </td>
                            <td>
                              {Number(result.percentage ?? 0).toFixed(2)}%
                            </td>
                            <td>
                              {levelFromPercentage(result.percentage) ?? "—"}/10
                            </td>
                            <td>
                              <span
                                className={`level-badge ${
                                  passed ? "pass" : "fail"
                                }`}
                              >
                                {result.resultStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {/* My Certificates page */}
        {activePage === "certificates" && (
          <section className="panel roadmap-panel">
            <Certificates />
          </section>
        )}

        <footer className="app-footer">
          <p>© 2026 SkillTrack · Student Skill Gap Analyzer</p>
          <p>Learn today. Grow tomorrow. ✨</p>
        </footer>
      </main>
    </div>
  );
}

export default App;