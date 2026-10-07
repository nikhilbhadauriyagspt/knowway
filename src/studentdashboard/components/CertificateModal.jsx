import React, { useRef, useState } from "react";
import { X, Download, Printer, CheckCircle2, ShieldCheck, Share2, Award, Sparkles, QrCode } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CertificateModal({ certificate, onClose }) {
  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!certificate) return null;

  const studentName = certificate.student_name || "Certified Learner";
  const courseTitle = certificate.course_title || certificate.title || "Professional Skill Masterclass";
  const certId = certificate.certificate_no || certificate.id || "KW-2026-CERT";
  const score = certificate.score || 100;
  const issueDate = certificate.issued_at
    ? new Date(certificate.issued_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : certificate.date || "October 2026";

  // Download PDF using html2canvas and jsPDF
  const handleDownloadPdf = async () => {
    if (!certificateRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      const element = certificateRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: "#FFFFFF",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`KnowWay-Certificate-${certId}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      // Fallback to print
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  // Direct Print via window.print()
  const handlePrint = () => {
    window.print();
  };

  const handleCopyVerification = () => {
    const link = `${window.location.origin}/courses?verify=${certId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      {/* Container Box */}
      <div className="w-full max-w-4xl bg-white dark:bg-[#131926] rounded-[32px] border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col my-auto print:border-0 print:shadow-none print:max-w-none print:w-full print:rounded-0">
        
        {/* Modal Top Action Bar (Hidden in Print) */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-[#F8FAFD] dark:bg-[#0E131F] print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#035BE3]" />
            <span className="text-xs font-bold text-[#161B29] dark:text-white uppercase tracking-wider">
              Accredited Certificate of Achievement
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyVerification}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition flex items-center gap-1.5 cursor-pointer"
              title="Copy verification link"
            >
              <Share2 size={13} />
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#F0F4FF] dark:bg-blue-950/60 text-[#035BE3] dark:text-blue-300 hover:bg-blue-100 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={14} />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-5 py-1.5 rounded-full text-xs font-bold bg-[#035BE3] hover:bg-[#024bc0] text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-[#035BE3]/30 disabled:opacity-50"
            >
              <Download size={14} />
              <span>{isDownloading ? "Generating PDF..." : "Download PDF"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer ml-2"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas Canvas */}
        <div className="p-4 sm:p-8 flex items-center justify-center bg-gray-100 dark:bg-[#0A0E17] print:p-0 print:bg-white">
          <div
            ref={certificateRef}
            id="printable-certificate"
            className="w-full max-w-[840px] aspect-[1.414/1] bg-white text-[#0F172A] p-6 sm:p-10 relative overflow-hidden rounded-[16px] shadow-lg print:shadow-none print:rounded-none print:w-full print:max-w-none print:p-8 border-[10px] border-[#0A1A3B]"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(3,91,227,0.03) 0%, rgba(255,255,255,1) 80%)`,
            }}
          >
            {/* Ornate Inner Double Border */}
            <div className="absolute inset-3 sm:inset-4 border-2 border-dashed border-[#D4AF37]/70 pointer-events-none rounded-[8px]" />

            {/* Corner Gold Flourishes */}
            <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none" />
            <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none" />
            <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none" />
            <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none" />

            <div className="relative z-10 h-full flex flex-col justify-between text-center py-2 sm:py-4 px-3 sm:px-6">
              
              {/* Header with Logo */}
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#035BE3] text-white flex items-center justify-center font-black text-base shadow-sm">
                      K
                    </div>
                    <span className="text-xl font-black tracking-tight text-[#0F172A]">
                      KNOW<span className="text-[#035BE3]">WAY</span>
                    </span>
                  </div>
                </div>

                <p className="text-[9px] sm:text-[10px] uppercase font-extrabold tracking-[5px] text-[#035BE3]">
                  Institute of Practical Digital Skills & Acceleration
                </p>
                
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A1A3B] tracking-wide uppercase mt-2 font-serif">
                  Certificate of Excellence
                </h1>
                
                <p className="text-[11px] sm:text-xs text-[#64748B] font-medium tracking-wide">
                  THIS IS OFFICIALLY PRESENTED TO
                </p>
              </div>

              {/* Student Name */}
              <div className="my-2">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#035BE3] font-serif border-b-2 border-[#D4AF37]/50 inline-block px-8 pb-1 tracking-tight">
                  {studentName}
                </h2>
              </div>

              {/* Course Title & Statement */}
              <div className="space-y-1.5 max-w-xl mx-auto">
                <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                  for demonstrating outstanding competence and successfully passing the comprehensive final assessment with a score of{" "}
                  <strong className="text-[#0A1A3B] font-bold">{score}%</strong> in
                </p>
                <h3 className="text-base sm:text-lg lg:text-xl font-black text-[#0A1A3B] tracking-tight">
                  {courseTitle}
                </h3>
              </div>

              {/* Footer Credentials & Signatures */}
              <div className="mt-4 pt-4 border-t border-gray-200/80 grid grid-cols-3 items-end gap-2 text-left">
                {/* Left: Verification & Date */}
                <div className="space-y-0.5">
                  <p className="text-[10px] text-[#64748B] font-semibold">
                    Date of Issue: <span className="text-[#0F172A] font-bold">{issueDate}</span>
                  </p>
                  <p className="text-[9.5px] font-mono text-[#035BE3] font-bold tracking-wider">
                    ID: {certId}
                  </p>
                  <div className="flex items-center gap-1 text-[9px] text-emerald-700 font-bold">
                    <ShieldCheck size={11} />
                    <span>Verified Credential</span>
                  </div>
                </div>

                {/* Center: Official Golden Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#B38728] via-[#FBF5B7] to-[#DAA520] p-1 shadow-md flex items-center justify-center border-2 border-[#8A6615]">
                    <div className="w-full h-full rounded-full bg-[#0A1A3B] flex flex-col items-center justify-center text-white text-center p-1">
                      <Award size={16} className="text-[#FBF5B7]" />
                      <span className="text-[6.5px] font-black uppercase tracking-wider text-[#FBF5B7] leading-none mt-0.5">
                        OFFICIAL SEAL
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Instructor / Director Signature */}
                <div className="text-right space-y-0.5">
                  <div className="font-serif italic text-lg sm:text-xl text-[#0A1A3B] font-bold -mb-1">
                    Nikhil S.
                  </div>
                  <div className="w-32 ml-auto border-b border-gray-400" />
                  <p className="text-[10px] font-bold text-[#0F172A]">Academic Director</p>
                  <p className="text-[8.5px] text-[#64748B]">KnowWay Global Academy</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Print Stylesheet Hook */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-certificate, #printable-certificate * {
              visibility: visible;
            }
            #printable-certificate {
              position: fixed;
              left: 0;
              top: 0;
              width: 100vw;
              height: 100vh;
              margin: 0;
              padding: 20mm !important;
              box-shadow: none;
              border: 8px solid #0A1A3B !important;
            }
          }
        `}} />
      </div>
    </div>
  );
}
