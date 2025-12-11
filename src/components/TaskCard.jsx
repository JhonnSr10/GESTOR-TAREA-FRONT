
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Trash2, Edit2, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ProgressBar';
import ProgressSlider from '@/components/ProgressSlider';

const TaskCard = ({ task, onToggle, onEdit, onDelete, onProgressChange }) => {
  const [showSlider, setShowSlider] = useState(false);

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-orange-100 text-orange-800',
    low: 'bg-blue-100 text-blue-800',
  };

  const categoryColors = {
    work: 'bg-purple-100 text-purple-800',
    personal: 'bg-green-100 text-green-800',
    shopping: 'bg-pink-100 text-pink-800',
    health: 'bg-red-100 text-red-800',
    other: 'bg-indigo-100 text-indigo-800',
  };

  const handleProgressChange = (newProgress) => {
    onProgressChange(task.id, newProgress);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className={`bg-white rounded-xl p-5 border ${
        task.completed ? 'border-green-300' : 'border-slate-200'
      } shadow-sm transition-all flex flex-col`}
    >
      <div className="flex-grow">
        <div className="flex items-start gap-4 mb-3">
          <button
            onClick={() => onToggle(task.id)}
            className="mt-1 transition-transform hover:scale-110 flex-shrink-0"
          >
            {task.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className="w-6 h-6 text-slate-400" />
            )}
          </button>

          <div className="flex-1">
            <h3 className={`font-bold mb-1 text-slate-800 ${task.completed ? 'line-through text-slate-400' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-sm mb-3 ${task.completed ? 'text-slate-400' : 'text-slate-500'}`}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className="pl-10 space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[task.category]}`}>
              {task.category}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
              Prioridad {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
            </span>
          </div>

          {task.dueDate && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              <span>{new Date(task.dueDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          )}

          {/* Individual Progress Section */}
          <div className="mb-3 pt-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-slate-600">Progreso</span>
              </div>
              <span className="text-sm font-bold text-slate-800">{task.progress || 0}%</span>
            </div>
            <ProgressBar progress={task.progress || 0} size="small" />
            
            {!task.completed && (
              <button
                onClick={() => setShowSlider(!showSlider)}
                className="text-xs text-blue-600 hover:text-blue-800 mt-2 transition-colors font-medium"
              >
                {showSlider ? 'Ocultar' : 'Ajustar progreso'}
              </button>
            )}

            {showSlider && !task.completed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
              >
                <ProgressSlider
                  value={task.progress || 0}
                  onChange={handleProgressChange}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-slate-100 mt-4">
        <Button
          onClick={() => onEdit(task)}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Editar
        </Button>
        <Button
          onClick={() => onDelete(task.id)}
          variant="outline"
          size="sm"
          className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 hover:border-red-300"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Eliminar
        </Button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
