"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import QRCode from "qrcode";

export interface Course {
  id: string;
  title: string;
  description: string;
  modality: string;
  duration: string;
  startDate: string;
  endDate: string;
  formUrl: string;
  qrCode: string;
  createdAt: string;
}

export interface Master {
  id: string;
  title: string;
  description: string;
  modality: string;
  duration: string;
  startDate: string;
  endDate: string;
  formUrl: string;
  qrCode: string;
  createdAt: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  image?: string;
  publishDate: string;
  endDate?: string;
  createdAt: string;
}

interface AcademicContextType {
  courses: Course[];
  masters: Master[];
  news: News[];
  loading: boolean;
  refreshData: () => Promise<void>;
  addCourse: (course: Omit<Course, "id" | "qrCode" | "createdAt">) => void;
  updateCourse: (
    id: string,
    course: Omit<Course, "id" | "qrCode" | "createdAt">
  ) => void;
  deleteCourse: (id: string) => void;
  addMaster: (master: Omit<Master, "id" | "qrCode" | "createdAt">) => void;
  updateMaster: (
    id: string,
    master: Omit<Master, "id" | "qrCode" | "createdAt">
  ) => void;
  deleteMaster: (id: string) => void;
  addNews: (news: Omit<News, "id" | "createdAt">) => void;
  updateNews: (id: string, news: Omit<News, "id" | "createdAt">) => void;
  deleteNews: (id: string) => void;
}

const AcademicContext = createContext<AcademicContextType | undefined>(
  undefined
);

const API = {
  courses: "/api/courses",
  masters: "/api/masters",
  news: "/api/news",
};

export function AcademicProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Función para filtrar noticias expiradas
  const filterExpiredNews = (newsArray: News[]): News[] => {
    const currentDate = new Date();
    return newsArray.filter(news => {
      if (!news.endDate) return true; // Si no hay fecha de fin, siempre se muestra
      const endDate = new Date(news.endDate);
      return endDate > currentDate; // Solo mostrar si la fecha de fin es posterior a hoy
    });
  };

  // Cargar datos desde la base de datos al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesRes, mastersRes, newsRes] = await Promise.all([
          fetch(API.courses),
          fetch(API.masters),
          fetch(API.news)
        ]);

        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setCourses(coursesData);
        }

        if (mastersRes.ok) {
          const mastersData = await mastersRes.json();
          setMasters(mastersData);
        }

        if (newsRes.ok) {
          const newsData = await newsRes.json();
          setNews(filterExpiredNews(newsData));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateQRCode = async (url: string): Promise<string> => {
    // Genera un QR real usando la librería 'qrcode'
    try {
      return await QRCode.toDataURL(url, { width: 200, margin: 2 });
    } catch (err) {
      // Si hay error, retorna un placeholder
      return "/placeholder.svg";
    }
  };

  // Funciones CRUD centralizadas
  const addCourse = async (courseData: Omit<Course, "id" | "qrCode" | "createdAt">) => {
    try {
      const qrCode = await generateQRCode(courseData.formUrl);
      const res = await fetch(API.courses, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...courseData, qrCode }),
      });
      if (res.ok) {
        // Recargar datos para asegurar sincronización
        await refreshData();
      }
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const updateCourse = async (id: string, courseData: Omit<Course, "id" | "qrCode" | "createdAt">) => {
    try {
      const qrCode = await generateQRCode(courseData.formUrl);
      const res = await fetch(`${API.courses}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...courseData, qrCode }),
      });
      if (res.ok) {
        // Recargar datos para asegurar sincronización
        await refreshData();
      }
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const res = await fetch(`${API.courses}/${id}`, { method: "DELETE" });
      if (res.ok) {
        // Recargar datos para asegurar sincronización
        await refreshData();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const addMaster = async (masterData: Omit<Master, "id" | "qrCode" | "createdAt">) => {
    try {
      const qrCode = await generateQRCode(masterData.formUrl);
      const res = await fetch(API.masters, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...masterData, qrCode }),
      });
      if (res.ok) {
        // Recargar datos para asegurar sincronización
        await refreshData();
      }
    } catch (error) {
      console.error('Error adding master:', error);
    }
  };

  const updateMaster = async (id: string, masterData: Omit<Master, "id" | "qrCode" | "createdAt">) => {
    try {
      const qrCode = await generateQRCode(masterData.formUrl);
      const res = await fetch(`${API.masters}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...masterData, qrCode }),
      });
      if (res.ok) {
        // Recargar datos para asegurar sincronización
        await refreshData();
      }
    } catch (error) {
      console.error('Error updating master:', error);
    }
  };

  const deleteMaster = async (id: string) => {
    try {
      const res = await fetch(`${API.masters}/${id}`, { method: "DELETE" });
      if (res.ok) {
        // Recargar datos para asegurar sincronización
        await refreshData();
      }
    } catch (error) {
      console.error('Error deleting master:', error);
    }
  };

  const addNews = async (newsData: Omit<News, "id" | "createdAt">) => {
    try {
      const res = await fetch(API.news, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsData),
      });
      if (res.ok) {
        // Recargar datos para asegurar sincronización
        await refreshData();
      }
    } catch (error) {
      console.error('Error adding news:', error);
    }
  };

  const updateNews = async (id: string, newsData: Omit<News, "id" | "createdAt">) => {
    try {
      const res = await fetch(`${API.news}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsData),
      });
      if (res.ok) {
        // Recargar datos para asegurar sincronización
        await refreshData();
      }
    } catch (error) {
      console.error('Error updating news:', error);
    }
  };

  const deleteNews = async (id: string) => {
    try {
      const res = await fetch(`${API.news}/${id}`, { method: "DELETE" });
      if (res.ok) {
        // Recargar datos para asegurar sincronización
        await refreshData();
      }
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const [coursesRes, mastersRes, newsRes] = await Promise.all([
        fetch(API.courses),
        fetch(API.masters),
        fetch(API.news)
      ]);

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      }

      if (mastersRes.ok) {
        const mastersData = await mastersRes.json();
        setMasters(mastersData);
      }

      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNews(filterExpiredNews(newsData));
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AcademicContext.Provider
      value={{
        courses,
        masters,
        news,
        loading,
        refreshData,
        addCourse,
        updateCourse,
        deleteCourse,
        addMaster,
        updateMaster,
        deleteMaster,
        addNews,
        updateNews,
        deleteNews,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
}

export function useAcademic() {
  const context = useContext(AcademicContext);
  if (context === undefined) {
    throw new Error("useAcademic must be used within an AcademicProvider");
  }
  return context;
}
