import axios from 'axios';

const API_URL = 'http://localhost:8000/api/tareas/';

/**
 * Crea una nueva tarea en la API.
 * @param {Object} tarea - Los datos de la tarea a crear.
 * @param {string} tarea.titulo
 * @param {string} tarea.descripcion
 * @param {number} tarea.categoria_id
 * @param {number} tarea.prioridad_id
 * @param {number} tarea.miembro_id
 * @param {string} tarea.estado
 * @param {string} tarea.fecha_limite - Fecha en formato ISO (ej: '2025-12-11T00:37:57.695Z')
 * @returns {Promise<Object>} Respuesta de la API
 */
export async function crearTarea(tarea) {
  try {
    const response = await axios.post(API_URL, tarea);
    return response.data;
  } catch (error) {
    throw error;
  }
}
