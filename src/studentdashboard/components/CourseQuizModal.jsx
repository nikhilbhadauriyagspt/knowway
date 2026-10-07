import React, { useState, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Clock, Award, ArrowRight, RotateCcw, Sparkles, HelpCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { getCourseQuizApi, submitCourseQuizApi } from "../../services/api";

export default function CourseQuizModal({ course, user, onClose, onPassCertificate }) {
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { isPassed, score, certificate, message }

  const courseId = course?.id || course?.slug;

  // 1. Fetch Quiz for this Course
  useEffect(() => {
    let isMounted = true;
    const loadQuiz = async () => {
      setLoading(true);
      try {
        const res = await getCourseQuizApi(courseId);
        if (isMounted && res?.success && res.quiz?.questions) {
          setQuizData(res.quiz);
          setTimeLeft((res.quiz.time_limit_minutes || 15) * 60);
        }
      } catch (err) {
        console.warn("Could not load quiz from backend:", err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (courseId) loadQuiz();
    return () => { isMounted = false; };
  }, [courseId]);

  // 2. Countdown Timer
  useEffect(() => {
    if (!quizData || result || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizData, result, timeLeft]);

  // Format Timer mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  };

  const handleSelectOption = (questionId, optionLetter) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionLetter,
    }));
  };

  // Submit Quiz
  const handleSubmitQuiz = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await submitCourseQuizApi(courseId, selectedAnswers, user?.name);
      if (res?.success) {
        setResult(res);
        if (res.isPassed) {
          // Trigger Confetti!
          try {
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (_) {}
        }
      } else {
        alert(res?.message || "Failed to submit assessment.");
      }
    } catch (err) {
      console.error("Quiz submission error:", err);
      alert("Submission error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const questions = quizData?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-[#131926] text-[#141A29] dark:text-[#E2E8F0] rounded-[32px] border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col my-auto relative animate-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-[#F8FAFD] dark:bg-[#0E131F]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#035BE3]/10 text-[#035BE3] flex items-center justify-center shrink-0">
              <Award size={16} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold truncate max-w-[280px] sm:max-w-md">
                {course?.title || "Course Final Assessment"}
              </h3>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                Passing Score: 60% &bull; Certification Exam
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!result && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold">
                <Clock size={13} />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#035BE3] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#64748B] font-medium">Preparing course assessment questions...</p>
            </div>
          ) : result ? (
            /* Result Screen */
            <div className="text-center py-6 space-y-6">
              <div
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
                  result.isPassed
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600"
                    : "bg-red-100 dark:bg-red-950/60 text-red-600"
                }`}
              >
                {result.isPassed ? <CheckCircle2 size={42} /> : <AlertCircle size={42} />}
              </div>

              <div className="space-y-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    result.isPassed
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
                      : "bg-red-50 dark:bg-red-950/40 text-red-600"
                  }`}
                >
                  {result.isPassed ? "Assessment Passed 🎉" : "Assessment Needs Revision"}
                </span>

                <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  {result.isPassed ? "Congratulations, Certified!" : "Keep Learning & Try Again"}
                </h2>

                <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                  {result.message}
                </p>
              </div>

              {/* Score Box */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto p-4 rounded-2xl bg-[#F8FAFD] dark:bg-[#0E131F] border border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-[10px] text-[#64748B] font-medium">Score Achieved</p>
                  <p className="text-lg font-black text-[#035BE3]">{result.score}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#64748B] font-medium">Correct Answers</p>
                  <p className="text-lg font-black text-emerald-600">
                    {result.correctCount} / {result.totalQuestions}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-[#64748B] font-medium">Passing Mark</p>
                  <p className="text-lg font-black text-[#141A29] dark:text-white">60%</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {result.isPassed && result.certificate ? (
                  <button
                    onClick={() => {
                      onClose();
                      if (onPassCertificate) onPassCertificate(result.certificate);
                    }}
                    className="px-6 py-3 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-[#035BE3]/30 cursor-pointer"
                  >
                    <Award size={16} />
                    <span>View & Download Certificate</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setResult(null);
                      setSelectedAnswers({});
                      setCurrentQuestionIndex(0);
                      setTimeLeft(15 * 60);
                    }}
                    className="px-6 py-3 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw size={15} />
                    <span>Retake Assessment</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : currentQuestion ? (
            /* Question Interactive Screen */
            <div className="space-y-6">
              {/* Progress & Counter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#035BE3]">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                  <span className="text-[#64748B] dark:text-[#94A3B8]">
                    {answeredCount} Answered
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-[#035BE3] transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="pt-2">
                <h4 className="text-base sm:text-lg font-bold leading-relaxed">
                  {currentQuestion.question}
                </h4>
              </div>

              {/* Options Radio List */}
              <div className="space-y-2.5">
                {[
                  { key: "A", text: currentQuestion.option_a },
                  { key: "B", text: currentQuestion.option_b },
                  { key: "C", text: currentQuestion.option_c },
                  { key: "D", text: currentQuestion.option_d },
                ]
                  .filter((opt) => Boolean(opt.text))
                  .map((opt) => {
                    const isSelected = selectedAnswers[currentQuestion.id] === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleSelectOption(currentQuestion.id, opt.key)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 flex items-center gap-3.5 cursor-pointer ${
                          isSelected
                            ? "bg-blue-50/80 dark:bg-blue-950/40 border-[#035BE3] text-[#035BE3] dark:text-blue-300 font-bold shadow-xs"
                            : "bg-white dark:bg-[#0E131F] border-gray-200 dark:border-gray-800 hover:border-[#035BE3]/40 text-[#141A29] dark:text-[#E2E8F0]"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            isSelected
                              ? "bg-[#035BE3] text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-[#64748B]"
                          }`}
                        >
                          {opt.key}
                        </div>
                        <span className="text-xs sm:text-sm">{opt.text}</span>
                      </button>
                    );
                  })}
              </div>

              {/* Bottom Pagination & Submit */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#64748B] hover:text-[#141A29] dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, totalQuestions - 1))}
                    className="px-5 py-2.5 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight size={13} />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting || answeredCount === 0}
                    onClick={handleSubmitQuiz}
                    className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/30 disabled:opacity-50"
                  >
                    <span>{submitting ? "Grading..." : "Submit Final Assessment"}</span>
                    <CheckCircle2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
