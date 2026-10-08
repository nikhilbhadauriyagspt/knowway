import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, LogOut, ArrowRight, ShieldAlert } from "lucide-react";
import { getUserProfileApi, clearUserSession, isUserAuthenticated } from "../services/api";

export default function SessionHeartbeatMonitor() {
  const navigate = useNavigate();
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(null);

  useEffect(() => {
    let isChecking = false;

    const checkSession = async () => {
      if (!isUserAuthenticated() || isChecking || sessionExpiredNotice) return;
      isChecking = true;

      try {
        await getUserProfileApi();
      } catch (err) {
        if (err?.code === "SESSION_EXPIRED_ANOTHER_DEVICE" || err?.status === 401) {
          if (err?.code === "SESSION_EXPIRED_ANOTHER_DEVICE") {
            clearUserSession();
            setSessionExpiredNotice(
              err.message ||
                "Your account was logged in from another browser or device. This session has ended."
            );
          }
        }
      } finally {
        isChecking = false;
      }
    };

    // 1. Listen for global session terminated events dispatched by apiRequest
    const handleTerminatedEvent = (e) => {
      clearUserSession();
      setSessionExpiredNotice(
        e?.detail?.message ||
          "Your account was logged in from another browser or device. This session has ended."
      );
    };

    window.addEventListener("knowway_session_terminated", handleTerminatedEvent);

    // 2. Immediate check when tab is focused / un-minimized
    const handleFocus = () => {
      checkSession();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    // 3. Periodic heartbeat check every 6 seconds
    const interval = setInterval(() => {
      checkSession();
    }, 6000);

    return () => {
      window.removeEventListener("knowway_session_terminated", handleTerminatedEvent);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
      clearInterval(interval);
    };
  }, [sessionExpiredNotice]);

  if (!sessionExpiredNotice) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-2xl text-center space-y-4">
        {/* Warning Badge */}
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle size={28} />
        </div>

        <div>
          <h3 className="text-lg font-black text-[#0F172A]">
            Logged Out on This Device
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            Account was accessed from another browser or device
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 leading-relaxed text-left flex items-start gap-2.5">
          <LogOut size={16} className="shrink-0 text-amber-700 mt-0.5" />
          <span>
            {sessionExpiredNotice ||
              "Your account is now active on another session. This browser has been automatically logged out for your security."}
          </span>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setSessionExpiredNotice(null);
              navigate("/login", { replace: true });
            }}
            className="w-full h-11 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <span>Log In on This Device</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
