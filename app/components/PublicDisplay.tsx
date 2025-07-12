"use client";

import { useEffect, useState } from "react";
import { useAcademic } from "../context/AcademicContext";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  X,
  GraduationCap,
  BookOpen,
} from "lucide-react";

function FadeTransition({
  children,
  triggerKey,
}: {
  children: React.ReactNode;
  triggerKey: any;
}) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setVisible(false);
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, [triggerKey]);
  return (
    <div
      className={`transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

function InfoCard({
  items,
  currentIndex,
  icon: Icon,
  color,
  title,
}: {
  items: any[];
  currentIndex: number;
  icon: any;
  color: string;
  title: string;
}) {
  const current = items[currentIndex];
  if (!current) return null;
  // Determina color secundario para detalles
  const detailColor =
    color === "text-purple-600"
      ? "text-purple-600 bg-purple-50"
      : "text-blue-600 bg-blue-50";
  return (
    <div className="flex flex-col min-h-0 h-full max-h-[650px] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden relative transition-all duration-500">
      {/* Header */}
      <div className="text-center mb-6 pt-8">
        <div
          className={`inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/20`}
        >
          <Icon className={`w-5 h-5 ${color}`} />
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <div
            className={`w-2 h-2 ${color.replace(
              "text-",
              "bg-"
            )} rounded-full animate-pulse`}
          ></div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col justify-between px-8 pb-8">
        <FadeTransition triggerKey={current.id}>
          <div className="flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              {/* Details */}
              <div className="space-y-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                    {current.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {current.description}
                  </p>
                </div>
                <div className="space-y-3">
                  <div
                    className={`flex items-center text-sm rounded-lg px-3 py-2 ${detailColor}`}
                  >
                    <MapPin className={`w-4 h-4 mr-3 ${color}`} />
                    <span className="font-medium text-gray-800">
                      {current.modality}
                    </span>
                  </div>
                  <div
                    className={`flex items-center text-sm rounded-lg px-3 py-2 ${detailColor}`}
                  >
                    <Clock className={`w-4 h-4 mr-3 ${color}`} />
                    <span className="font-medium text-gray-800">
                      {current.duration}
                    </span>
                  </div>
                  <div
                    className={`flex items-center text-sm rounded-lg px-3 py-2 ${detailColor}`}
                  >
                    <Calendar className={`w-4 h-4 mr-3 ${color}`} />
                    <span className="font-medium text-gray-800">
                      {new Date(current.startDate).toLocaleDateString()} -{" "}
                      {new Date(current.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="pt-2">
                  <a
                    href={current.formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:scale-105
                      ${
                        color === "text-purple-600"
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-800 hover:to-purple-900 text-white"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                      }
                    `}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Inscribirse
                  </a>
                </div>
              </div>
              {/* QR Code */}
              <div className="flex justify-center items-center">
                <div className="text-center">
                  <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                    <img
                      src={current.qrCode || "/placeholder.svg"}
                      alt="QR Code"
                      className="w-36 h-36 rounded-xl shadow-lg"
                    />
                  </div>
                  <p className="mt-3 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1">
                    Escanea para inscribirte
                  </p>
                </div>
              </div>
            </div>
            {/* Counter */}
            {items.length > 1 && (
              <div className="text-center pt-4 mt-auto">
                <div className="inline-flex space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2">
                  {items.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? color === "text-purple-600"
                            ? "bg-purple-600 scale-125"
                            : "bg-blue-600 scale-125"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-600 font-medium">
                  {currentIndex + 1} de {items.length}
                </p>
              </div>
            )}
          </div>
        </FadeTransition>
      </div>
    </div>
  );
}

export default function PublicDisplay() {
  const { courses, masters, news, loading } = useAcademic();
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsTimer, setNewsTimer] = useState(0);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [currentMasterIndex, setCurrentMasterIndex] = useState(0);

  // Auto-cycle through courses every 8 seconds
  useEffect(() => {
    if (courses.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentCourseIndex((prev) => (prev + 1) % courses.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [courses.length]);

  // Auto-cycle through masters every 8 seconds
  useEffect(() => {
    if (masters.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentMasterIndex((prev) => (prev + 1) % masters.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [masters.length]);

  // Auto-cycle through news every 15 seconds
  useEffect(() => {
    if (news.length === 0) return;

    const interval = setInterval(() => {
      setShowNewsModal(true);
      setNewsTimer(10);

      const hideTimer = setTimeout(() => {
        setShowNewsModal(false);
        setCurrentNewsIndex((prev) => (prev + 1) % news.length);
      }, 10000);

      return () => clearTimeout(hideTimer);
    }, 15000);

    if (news.length > 0) {
      setShowNewsModal(true);
      setNewsTimer(10);
      const hideTimer = setTimeout(() => {
        setShowNewsModal(false);
        setCurrentNewsIndex((prev) => (prev + 1) % news.length);
      }, 10000);
    }

    return () => clearInterval(interval);
  }, [news.length]);

  // Countdown timer for news modal
  useEffect(() => {
    if (showNewsModal && newsTimer > 0) {
      const timer = setTimeout(() => {
        setNewsTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showNewsModal, newsTimer]);

  const closeNewsModal = () => {
    setShowNewsModal(false);
  };

  const navigateCourse = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentCourseIndex(
        (prev) => (prev - 1 + courses.length) % courses.length
      );
    } else {
      setCurrentCourseIndex((prev) => (prev + 1) % courses.length);
    }
  };

  const navigateMaster = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentMasterIndex(
        (prev) => (prev - 1 + masters.length) % masters.length
      );
    } else {
      setCurrentMasterIndex((prev) => (prev + 1) % masters.length);
    }
  };

  const currentNews = news[currentNewsIndex];
  const currentCourse = courses[currentCourseIndex];
  const currentMaster = masters[currentMasterIndex];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden relative flex flex-col items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* News Modal */}
      {showNewsModal && currentNews && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-[95vw] h-[95vh] flex items-center justify-center overflow-hidden relative">
            <button
              onClick={closeNewsModal}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all duration-200 border border-white/20"
            >
              <X className="w-6 h-6" />
            </button>
            {currentNews.image && (
              <img
                src={currentNews.image || "/placeholder.svg"}
                alt={currentNews.title}
                className="object-contain w-full h-full"
              />
            )}
          </div>
        </div>
      )}

      {/* Main Content - Two Columns */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full py-12">
        {/* Loading Indicator */}
        {loading && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20 flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-gray-700">
                Actualizando datos...
              </span>
            </div>
          </div>
        )}

        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 px-4">
          {/* Cursos */}
          <InfoCard
            items={courses}
            currentIndex={currentCourseIndex}
            icon={BookOpen}
            color="text-blue-600"
            title="Cursos Disponibles"
          />
          {/* Maestrías */}
          <InfoCard
            items={masters}
            currentIndex={currentMasterIndex}
            icon={GraduationCap}
            color="text-purple-600"
            title="Maestrías Disponibles"
          />
        </div>
      </div>
    </div>
  );
}
