"use client"

import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import { Plus, Edit, Trash2, BookOpen, GraduationCap, Newspaper, UserCircle, Key, LogOut } from "lucide-react"
import { useAcademic } from "../context/AcademicContext"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import CourseForm from "./forms/CourseForm"
import MasterForm from "./forms/MasterForm"
import NewsForm from "./forms/NewsForm"

export default function AdminPanel() {
  const { courses, masters, news, loading, deleteCourse, deleteMaster, deleteNews } = useAcademic()
  const [activeTab, setActiveTab] = useState<"courses" | "masters" | "news" | "perfil">("courses")
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [wasLoading, setWasLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  // Cerrar formulario automáticamente cuando se complete la operación
  useEffect(() => {
    if (wasLoading && !loading && showForm) {
      setShowForm(false)
      setEditingItem(null)
    }
    setWasLoading(loading)
  }, [loading, wasLoading, showForm])

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingItem(null)
  }

  const tabs = [
    { id: "courses", label: "Cursos", icon: BookOpen, count: courses.length },
    { id: "masters", label: "Maestrías", icon: GraduationCap, count: masters.length },
    { id: "news", label: "Noticias", icon: Newspaper, count: news.length },
    { id: "perfil", label: "Perfil", icon: UserCircle, count: 1 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Panel de Administración</h2>
          {loading && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Actualizando...</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{tab.count}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Action Bar */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar {activeTab === "courses" ? "Curso" : activeTab === "masters" ? "Maestría" : "Noticia"}
          </button>

          
        </div>

        {/* Data Table */}
        <div className="p-6">
          {activeTab === "courses" && <CourseTable courses={courses} onEdit={handleEdit} onDelete={deleteCourse} />}
          {activeTab === "masters" && <MasterTable masters={masters} onEdit={handleEdit} onDelete={deleteMaster} />}
          {activeTab === "news" && <NewsTable news={news} onEdit={handleEdit} onDelete={deleteNews} />}
          {activeTab === "perfil" && (
            <div className="min-h-[300px] flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <UserCircle className="w-12 h-12 text-blue-600" />
                  </div>
                  <h1 className="text-2xl font-bold">{session?.user?.name || "Usuario"}</h1>
                  <p className="text-gray-500">{session?.user?.email}</p>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={() => router.push("/perfil/cambiar-clave")}
                    className="w-full flex items-center justify-between p-4 bg-white border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center">
                      <Key className="w-5 h-5 text-blue-600 mr-3" />
                      <span>Cambiar contraseña</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center justify-between p-4 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition mt-8"
                  >
                    <div className="flex items-center">
                      <LogOut className="w-5 h-5 text-red-500 mr-3" />
                      <span className="text-red-500">Cerrar sesión</span>
                    </div>
                    <span className="text-red-300">→</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forms Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            {activeTab === "courses" && <CourseForm course={editingItem} onClose={handleCloseForm} />}
            {activeTab === "masters" && <MasterForm master={editingItem} onClose={handleCloseForm} />}
            {activeTab === "news" && <NewsForm news={editingItem} onClose={handleCloseForm} />}
          </div>
        </div>
      )}
    </div>
  )
}

function CourseTable({ courses, onEdit, onDelete }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Modalidad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fechas</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {courses.map((course: any) => (
            <tr key={course.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{course.title}</div>
                  <div className="text-sm text-gray-500">{course.description.slice(0, 50)}...</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.modality}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.duration}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onClick={() => onEdit(course)} className="text-blue-600 hover:text-blue-900 mr-3">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(course.id)} className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MasterTable({ masters, onEdit, onDelete }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maestría</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Modalidad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fechas</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {masters.map((master: any) => (
            <tr key={master.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{master.title}</div>
                  <div className="text-sm text-gray-500">{master.description.slice(0, 50)}...</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{master.modality}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{master.duration}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(master.startDate).toLocaleDateString()} - {new Date(master.endDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onClick={() => onEdit(master)} className="text-blue-600 hover:text-blue-900 mr-3">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(master.id)} className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function NewsTable({ news, onEdit, onDelete }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Noticia</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha de Publicación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {news.map((item: any) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                  <div className="text-sm text-gray-500">{item.content.slice(0, 100)}...</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(item.publishDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onClick={() => onEdit(item)} className="text-blue-600 hover:text-blue-900 mr-3">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
