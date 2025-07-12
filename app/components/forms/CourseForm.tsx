"use client"

import { useForm } from "react-hook-form"
import { useAcademic } from "../../context/AcademicContext"
import { X } from "lucide-react"

interface CourseFormData {
  title: string
  description: string
  modality: string
  duration: string
  startDate: string
  endDate: string
  formUrl: string
}

interface CourseFormProps {
  course?: any
  onClose: () => void
}

export default function CourseForm({ course, onClose }: CourseFormProps) {
  const { addCourse, updateCourse, loading } = useAcademic()
  const isEditing = !!course

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CourseFormData>({
    defaultValues: course
      ? {
          title: course.title,
          description: course.description,
          modality: course.modality,
          duration: course.duration,
          startDate: course.startDate,
          endDate: course.endDate,
          formUrl: course.formUrl,
        }
      : {},
  })

  const onSubmit = async (data: CourseFormData) => {
    try {
      if (isEditing) {
        await updateCourse(course.id, data)
      } else {
        await addCourse(data)
      }
      // El formulario se cerrará automáticamente cuando los datos se actualicen
      // gracias a la sincronización del contexto
    } catch (error) {
      console.error("Error saving course:", error)
    }
  }

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      return url.startsWith("https://") || "La URL debe comenzar con https://"
    } catch {
      return "Ingrese una URL válida"
    }
  }

  const validateDateRange = (endDate: string) => {
    const startDate = watch("startDate")
    if (startDate && endDate) {
      return new Date(endDate) > new Date(startDate) || "La fecha de fin debe ser posterior a la fecha de inicio"
    }
    return true
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">{isEditing ? "Editar Curso" : "Nuevo Curso"}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
          <input
            type="text"
            {...register("title", {
              required: "El título es obligatorio",
              minLength: { value: 3, message: "El título debe tener al menos 3 caracteres" },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ingrese el título del curso"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
          <textarea
            {...register("description", {
              required: "La descripción es obligatoria",
              minLength: { value: 10, message: "La descripción debe tener al menos 10 caracteres" },
            })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe el curso"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad *</label>
            <select
              {...register("modality", { required: "La modalidad es obligatoria" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione modalidad</option>
              <option value="Presencial">Presencial</option>
              <option value="Virtual">Virtual</option>
              <option value="Híbrida">Híbrida</option>
            </select>
            {errors.modality && <p className="mt-1 text-sm text-red-600">{errors.modality.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duración *</label>
            <input
              type="text"
              {...register("duration", { required: "La duración es obligatoria" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="ej: 40 horas, 3 meses"
            />
            {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio *</label>
            <input
              type="date"
              {...register("startDate", { required: "La fecha de inicio es obligatoria" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin *</label>
            <input
              type="date"
              {...register("endDate", {
                required: "La fecha de fin es obligatoria",
                validate: validateDateRange,
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL del Formulario *</label>
          <input
            type="url"
            {...register("formUrl", {
              required: "La URL del formulario es obligatoria",
              validate: validateUrl,
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://ejemplo.com/formulario"
          />
          {errors.formUrl && <p className="mt-1 text-sm text-red-600">{errors.formUrl.message}</p>}
          <p className="mt-1 text-xs text-gray-500">Se generará automáticamente un código QR para esta URL</p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting || loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  )
}
