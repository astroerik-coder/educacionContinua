"use client";

import { useForm } from "react-hook-form";
import { useAcademic } from "../../context/AcademicContext";
import { X } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface NewsFormData {
  title: string;
  content: string;
  publishDate: string;
  endDate: string;
  image?: string;
}

interface NewsFormProps {
  news?: any;
  onClose: () => void;
}

export default function NewsForm({ news, onClose }: NewsFormProps) {
  const { addNews, updateNews, loading } = useAcademic();
  const isEditing = !!news;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(news?.image);
  const [fileSelected, setFileSelected] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<NewsFormData>({
    defaultValues: news
      ? {
          title: news.title,
          content: news.content,
          image: news.image,
          endDate: news.endDate,
          publishDate: news.publishDate,
        }
      : {},
  });

  // Actualiza la previsualización cuando cambia la URL de imagen
  useEffect(() => {
    const url = watch("image");
    if (!fileSelected) {
      if (url && /^https?:\/\//.test(url)) {
        setPreview(url);
      } else if (!url) {
        setPreview(undefined);
      }
    }
  }, [watch("image"), fileSelected]);

  // Maneja la carga de archivo y lo convierte a base64
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileSelected(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("image", reader.result as string, { shouldValidate: true });
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFileSelected(false);
      setPreview(undefined);
    }
  };

  const onSubmit = async (data: NewsFormData) => {
    try {
      if (isEditing) {
        await updateNews(news.id, data);
      } else {
        await addNews(data);
      }
      // El formulario se cerrará automáticamente cuando los datos se actualicen
    } catch (error) {
      console.error("Error saving news:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          {isEditing ? "Editar Noticia" : "Nueva Noticia"}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            {...register("title", {
              required: "El título es obligatorio",
              minLength: {
                value: 3,
                message: "El título debe tener al menos 3 caracteres",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Ingrese el título de la noticia"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contenido *
          </label>
          <textarea
            {...register("content", {
              required: "El contenido es obligatorio",
              minLength: {
                value: 10,
                message: "El contenido debe tener al menos 10 caracteres",
              },
            })}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Escriba el contenido de la noticia"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.content.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Publicación *
          </label>
          <input
            type="date"
            {...register("publishDate", {
              required: "La fecha de publicación es obligatoria",
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
          {errors.publishDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.publishDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Finalización (opcional)
          </label>
          <input
            type="date"
            {...register("endDate", {
              validate: (value) => {
                if (!value) return true; // Es opcional
                const publishDate = watch("publishDate");
                if (publishDate && value) {
                  return (
                    new Date(value) > new Date(publishDate) ||
                    "La fecha de finalización debe ser posterior a la fecha de publicación"
                  );
                }
                return true;
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Fecha hasta la cual se mostrará la noticia (dejar vacío para mostrar
            indefinidamente)
          </p>
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.endDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagen (opcional)
          </label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            onChange={handleFileChange}
          />
          <p className="mt-1 text-xs text-gray-500">
            Puedes subir una imagen o ingresar una URL abajo
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL de Imagen (opcional)
          </label>
          <input
            type="url"
            {...register("image")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          <p className="mt-1 text-xs text-gray-500">
            URL de una imagen para acompañar la noticia (se usará solo si no
            subes archivo)
          </p>
        </div>

        {preview && (
          <div className="mt-2">
            <span className="block text-xs text-gray-500 mb-1">
              Previsualización:
            </span>
            <img
              src={preview}
              alt="Previsualización"
              className="max-h-40 rounded shadow"
            />
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => { setPreview(undefined); setFileSelected(false); onClose(); }}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            aria-label="Cancelar y cerrar formulario"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting || loading
              ? "Guardando..."
              : isEditing
              ? "Actualizar"
              : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
}
