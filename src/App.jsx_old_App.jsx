
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle, ListTodo, Activity, CheckCircle2, TrendingUp, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import TaskModal from '@/components/TaskModal';
import TaskCard from '@/components/TaskCard';
import ProgressBar from '@/components/ProgressBar';
import { crearTarea } from './lib/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showGlobalProgress, setShowGlobalProgress] = useState(true);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = async (taskData) => {
    try {
      // Formatear los datos para la API
      const tareaApi = {
        titulo: taskData.titulo,
        descripcion: taskData.descripcion,
        categoria_id: taskData.categoria_id || 0,
        prioridad_id: taskData.prioridad_id || 0,
        miembro_id: taskData.miembro_id || 0,
        estado: 'pendiente',
        fecha_limite: taskData.fecha_limite || new Date().toISOString(),
      };
      const nuevaTarea = await crearTarea(tareaApi);
      // Puedes ajustar el objeto según la respuesta de la API
      setTasks([{ ...nuevaTarea, completed: false, progress: 0, createdAt: new Date().toISOString() }, ...tasks]);
      toast({
        title: "¡Tarea creada! 🎉",
        description: "Tu nueva tarea ha sido añadida exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error al crear tarea",
        description: error.message || "No se pudo crear la tarea.",
        variant: "destructive",
      });
    }
  };

  const updateTask = (taskData) => {
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? { ...task, ...taskData } : task
    ));
    toast({
      title: "¡Tarea actualizada! ✨",
      description: "Los cambios han sido guardados.",
    });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Tarea eliminada 🗑️",
      description: "La tarea ha sido eliminada correctamente.",
    });
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { 
        ...task, 
        completed: !task.completed,
        progress: !task.completed ? 100 : task.progress 
      } : task
    ));
  };

  const updateTaskProgress = (id, progress) => {
    setTasks(tasks.map(task =>
      task.id === id ? { 
        ...task, 
        progress,
        completed: progress === 100 
      } : task
    ));
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  };

  const globalProgress = tasks.length > 0 
    ? Math.round((tasks.reduce((sum, task) => sum + (task.progress || 0), 0) / tasks.length))
    : 0;

  return (
    <>
      <Helmet>
        <title>Gestor de Tareas - Organiza tu día</title>
        <meta name="description" content="Gestiona tus tareas de manera eficiente con nuestro gestor de tareas moderno y fácil de usar." />
      </Helmet>

      <div className="min-h-screen p-4 md:p-8 bg-slate-100 text-slate-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between mb-8 gap-4"
          >
            <div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-slate-900">
                  Gestor de Tareas
                </h1>
              </div>
              <p className="text-slate-500 ml-11">
                Bienvenido, <span className="font-bold">Administrador</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowGlobalProgress(!showGlobalProgress)}>
                Ver Progreso
              </Button>
              <Button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white hover:bg-slate-800">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Tarea
              </Button>
              <Button variant="outline" onClick={() => toast({ title: "🚧 ¡Función no implementada!", description: "¡Podrás solicitar esta función en tu próximo prompt! 🚀" })}>
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </motion.header>

          {/* Global Progress Card */}
          <AnimatePresence>
            {showGlobalProgress && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl p-6 mb-6 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Progreso Global</h2>
                      <p className="text-slate-500 text-sm">Todas tus tareas combinadas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-900">{globalProgress}%</p>
                    <p className="text-slate-500 text-sm">{stats.completed} de {stats.total} completadas</p>
                  </div>
                </div>
                <ProgressBar progress={globalProgress} size="large" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
          >
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <ListTodo className="w-8 h-8 text-slate-500" />
                <div>
                  <p className="text-slate-500">Total</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-blue-500/50 shadow-sm">
              <div className="flex items-center gap-4">
                <Activity className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-blue-500">Activas</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.pending}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-green-500/50 shadow-sm">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-green-500">Completadas</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.completed}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-2 mb-6 flex items-center gap-2 border border-slate-200 shadow-sm"
          >
            <button onClick={() => setFilter('all')} className={`flex-1 p-2 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}>
              Todas ({stats.total})
            </button>
            <button onClick={() => setFilter('pending')} className={`flex-1 p-2 rounded-md text-sm font-medium transition-colors ${filter === 'pending' ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}>
              Activas ({stats.pending})
            </button>
            <button onClick={() => setFilter('completed')} className={`flex-1 p-2 rounded-md text-sm font-medium transition-colors ${filter === 'completed' ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}>
              Completadas ({stats.completed})
            </button>
          </motion.div>

          {/* Tasks Grid */}
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-700">No hay tareas. ¡Comienza agregando una nueva!</h3>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={toggleComplete}
                    onEdit={openEditModal}
                    onDelete={deleteTask}
                    onProgressChange={updateTaskProgress}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        <TaskModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={editingTask ? updateTask : addTask}
          task={editingTask}
        />

        <Toaster />
      </div>
    </>
  );
}

export default App;
