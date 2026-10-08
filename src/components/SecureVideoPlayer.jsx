import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Play,
  Pause,
  AlertTriangle,
  EyeOff,
} from "lucide-react";
import { getUserData } from "../services/api";

export default function SecureVideoPlayer({
  src,
  poster,
  title = "Lecture Video",
  isUnlocked = false,
  securityConfig = {},
  onEnded,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Authenticated student data for watermark
  const currentUser = useMemo(() => {
    return (
      getUserData() || {
        name: "Verified Student",
        student_id: "KW-STUDENT",
        email: "student@knowway.in",
      }
    );
  }, []);

  // Settings parsing from Admin
  const enableWatermark = securityConfig?.enable_moving_watermark !== "false";
  const opacityVal = (Number(securityConfig?.watermark_opacity) || 25) / 100;
  const intervalSec = Number(securityConfig?.watermark_interval) || 8;
  const showName = securityConfig?.watermark_show_name !== "false";
  const showStudentId = securityConfig?.watermark_show_student_id !== "false";
  const showEmail = securityConfig?.watermark_show_email !== "false";
  const showTimestamp = securityConfig?.watermark_show_timestamp !== "false";

  const enableDevToolsShield = securityConfig?.enable_devtools_shield !== "false";
  const enableScreenCapProtection = securityConfig?.enable_screen_capture_protection !== "false";

  // Dynamic moving watermark position state (percentage 10% - 85%)
  const [watermarkPos, setWatermarkPos] = useState({ top: "20%", left: "25%" });
  const [currentTimestamp, setCurrentTimestamp] = useState(new Date().toLocaleTimeString());

  // Screen capture & tab blur protection states
  const [isScreenProtected, setIsScreenProtected] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  // 1. Moving Watermark Timer
  useEffect(() => {
    if (!enableWatermark) return;

    const moveWatermark = () => {
      // Random coordinates that avoid getting clipped on edges
      const randomTop = Math.floor(Math.random() * 65) + 12; // 12% to 77%
      const randomLeft = Math.floor(Math.random() * 60) + 10; // 10% to 70%
      setWatermarkPos({ top: `${randomTop}%`, left: `${randomLeft}%` });
      setCurrentTimestamp(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };

    const timer = setInterval(moveWatermark, intervalSec * 1000);
    return () => clearInterval(timer);
  }, [enableWatermark, intervalSec]);

  // 2. DevTools Keyboard Shortcut Shield
  useEffect(() => {
    if (!enableDevToolsShield) return;

    const handleKeyDown = (e) => {
      // Block F12
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning("Developer Tools inspection is restricted on video player.");
        return false;
      }

      // Block Ctrl+Shift+I / Cmd+Option+I (Inspect Element)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "C" || e.key === "c" || e.key === "J" || e.key === "j")) {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning("Code inspection is restricted on copyrighted course content.");
        return false;
      }

      // Block Ctrl+U / Cmd+U (View Source) & Ctrl+S (Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U" || e.key === "s" || e.key === "S")) {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning("Page source saving is restricted.");
        return false;
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [enableDevToolsShield]);

  // 3. Tab Visibility & Screen Capture Shield (Blurs video when unfocused or screen recorded)
  useEffect(() => {
    if (!enableScreenCapProtection) return;

    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === "hidden") {
        setIsScreenProtected(true);
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      } else {
        // Return focus
        setIsScreenProtected(false);
      }
    };

    const handleWindowBlur = () => {
      setIsScreenProtected(true);
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    };

    const handleWindowFocus = () => {
      setIsScreenProtected(false);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [enableScreenCapProtection]);

  const triggerWarning = (msg) => {
    setWarningMessage(msg);
    setShowWarningToast(true);
    setTimeout(() => setShowWarningToast(false), 3500);
  };

  const handleContextMenu = (e) => {
    if (enableDevToolsShield) {
      e.preventDefault();
      triggerWarning("Right-click & context menu downloading is disabled.");
    }
  };

  const hasTriggeredEndRef = useRef(false);
  useEffect(() => {
    hasTriggeredEndRef.current = false;
  }, [src]);

  const handleTimeUpdate = () => {
    if (videoRef.current && onEnded && !hasTriggeredEndRef.current) {
      const { currentTime, duration } = videoRef.current;
      if (duration > 0 && currentTime / duration >= 0.92) {
        hasTriggeredEndRef.current = true;
        onEnded();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onContextMenu={handleContextMenu}
      className="relative w-full h-full bg-[#0B0F17] flex items-center justify-center overflow-hidden select-none group"
      style={{ WebkitUserSelect: "none" }}
    >
      {/* Warning Toast */}
      {showWarningToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-red-600/90 text-white text-xs font-bold flex items-center gap-2 shadow-xl border border-red-400/30 animate-in fade-in slide-in-from-top-2 duration-150">
          <ShieldAlert size={15} className="shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* HTML5 VIDEO TAG */}
      {isUnlocked && src ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          disableRemotePlayback
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            hasTriggeredEndRef.current = true;
            if (onEnded) onEnded();
          }}
          onContextMenu={handleContextMenu}
          className={`w-full h-full object-contain transition-all duration-300 ${
            isScreenProtected ? "filter blur-2xl opacity-10" : ""
          }`}
        />
      ) : (
        /* Fallback Locked / Placeholder */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white">
          <Lock size={32} className="text-amber-400 mb-2" />
          <h3 className="text-base font-bold">{title}</h3>
          <p className="text-xs text-gray-400 mt-1">Enroll in course to unlock full HD video stream.</p>
        </div>
      )}

      {/* ======================================================== */}
      {/* LEVEL 1: DYNAMIC MOVING ANTI-PIRACY WATERMARK OVERLAY */}
      {/* ======================================================== */}
      {isUnlocked && enableWatermark && (
        <div
          className="pointer-events-none absolute z-30 transition-all duration-1000 ease-in-out select-none"
          style={{
            top: watermarkPos.top,
            left: watermarkPos.left,
            opacity: opacityVal,
          }}
        >
          <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-xs border border-white/20 text-white font-mono text-[11px] leading-tight space-y-0.5 shadow-2xl">
            {showName && (
              <div className="font-bold tracking-wide text-amber-300">
                {currentUser.name || "Student"}
              </div>
            )}
            <div className="flex items-center gap-2 text-[10px] text-gray-200">
              {showStudentId && <span>ID: {currentUser.student_id || "KW-STUDENT"}</span>}
              {showTimestamp && <span>• {currentTimestamp}</span>}
            </div>
            {showEmail && (
              <div className="text-[9px] text-gray-400 truncate max-w-[200px]">
                {currentUser.email || "Registered Student"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LEVEL 3: SCREEN CAPTURE / TAB-SWITCH PROTECTION BLUR SHIELD */}
      {/* ======================================================== */}
      {isUnlocked && enableScreenCapProtection && isScreenProtected && (
        <div
          onClick={() => setIsScreenProtected(false)}
          className="absolute inset-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white space-y-3 cursor-pointer animate-in fade-in duration-200"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg">
            <EyeOff size={28} />
          </div>
          <div>
            <h4 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
              <ShieldCheck size={18} className="text-emerald-400" /> DRM Stream Protection Active
            </h4>
            <p className="text-xs text-gray-300 mt-1 max-w-md mx-auto leading-relaxed">
              Video playback was paused to prevent unauthorized background capture and recording.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsScreenProtected(false)}
            className="px-5 py-2 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition shadow-lg cursor-pointer"
          >
            Click to Resume Playback
          </button>
        </div>
      )}

      {/* DRM Security Status Pill Badge */}
      <div className="absolute bottom-3 right-3 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs border border-white/10 text-[10px] font-bold text-emerald-400 flex items-center gap-1 shadow-md">
          <ShieldCheck size={12} /> DRM Protected
        </span>
      </div>
    </div>
  );
}
