import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, User, Users, ListTodo, Activity, CheckCircle2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ProgressBar';

const TeamProgressPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  
  // Mock data for team members
  const teamMembers = [
    { name: 'Administrador (Tú)', handle: '@admin', avatar: '/path/to/avatar1.png' },
    { name: 'Ana García', handle: '@anagarcia', avatar: '/path/to/avatar2.png' },
    { name: 'Carlos Pérez', handle: '@carlosp', avatar: '/path/to/avatar3.png' },
  ];

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      // In a real app, you would fetch tasks for the whole team. Here we use all local tasks.
      const allTasks = JSON.parse(savedTasks);
      
      // Let's distribute tasks for demo purposes.
      const distributedTasks = allTasks.map((task, index) => ({
        ...task,
        owner: teamMembers[index % teamMembers.length].name,
        ownerHandle: teamMembers[index % teamMembers.length].handle,
      }));
      setTasks(distributedTasks);
    }
  }, []);

  const getStatsForMember = (handle) => {
    const memberTasks = tasks.filter(t => t.ownerHandle === handle);
    const completedTasks = memberTasks.filter(t => t.completed).length;
    const progress = memberTasks.length > 0 
      ? Math.round(memberTasks.reduce((sum, task) => sum + (task.progress || 0), 0) / memberTasks.length)
      : 0;
    return {
      total: memberTasks.length,
      completed: completedTasks,
      progress: progress,
    };
  };

  const myStats = getStatsForMember('@admin');
  
  const groupStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
    progress: tasks.length > 0
      ? Math.round(tasks.reduce((sum, task) => sum + (task.progress || 0), 0) / tasks.length)
      : 0,
  };

  const getProgressColorClass = (progress) => {
    if (progress === 100) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };
  
  const getIconBgColorClass = (progress) => {
    if (progress === 100) return 'bg-green-500';
    return 'bg-blue-500';
  };
  
  const groupProgressColorClass = groupStats.progress === 100 ? 'bg-green-100 text-green-800 border-green-200' : 'bg-green-100/70 text-green-900 border-green-200';
  const groupIconBgColorClass = groupStats.progress === 100 ? 'bg-green-500' : 'bg-green-500';

  return (
    <>
      <Helmet>
        <title>Progreso del Equipo - Gestor de Tareas</title>
        <meta name="description" content="Visualiza el avance individual y grupal de tu equipo." />
      </Helmet>
      <div className="min-h-screen p-4 md:p-8 bg-slate-100 text-slate-800">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Button variant="ghost" onClick={() => navigate('/')} className="mb-6 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>

            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-900">Progreso del Equipo</h1>
            </div>
            <p className="text-slate-500 ml-11 mb-8">Visualiza el avance individual y grupal</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className={`rounded-xl p-6 mb-6 border ${getProgressColorClass(myStats.progress)}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg text-white ${getIconBgColorClass(myStats.progress)}`}>
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Mi Progreso</h2>
                  <p className="text-sm ">{myStats.completed} de {myStats.total} tareas completadas</p>
                </div>
              </div>
              <ProgressBar progress={myStats.progress} size="medium" />
              <p className="text-sm mt-2 font-medium">{myStats.progress}% completado</p>
            </div>

            <div className={`rounded-xl p-6 mb-6 border ${groupProgressColorClass}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg text-white ${groupIconBgColorClass}`}>
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Progreso Grupal</h2>
                  <p className="text-sm">{groupStats.completed} de {groupStats.total} tareas completadas por el equipo</p>
                </div>
              </div>
              <ProgressBar progress={groupStats.progress} size="medium" />
              <p className="text-sm mt-2 font-medium">{groupStats.progress}% completado</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <ListTodo className="w-7 h-7 text-slate-500" />
                <div>
                  <p className="text-slate-500">Total</p>
                  <p className="text-2xl font-bold text-slate-900">{groupStats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <Activity className="w-7 h-7 text-blue-500" />
                <div>
                  <p className="text-blue-500">Activas</p>
                  <p className="text-2xl font-bold text-slate-900">{groupStats.active}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-7 h-7 text-green-500" />
                <div>
                  <p className="text-green-500">Completadas</p>
                  <p className="text-2xl font-bold text-slate-900">{groupStats.completed}</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-slate-600" />
              <h3 className="text-xl font-bold text-slate-900">Progreso por Persona</h3>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2">
              {teamMembers.map(member => {
                const memberStats = getStatsForMember(member.handle);
                return (
                  <div key={member.handle} className="p-4 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold text-slate-800">{member.name}</p>
                        <p className="text-sm text-slate-500">{member.handle}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-700">{memberStats.progress}%</p>
                        <p className="text-sm text-slate-500">{memberStats.completed}/{memberStats.total} tareas</p>
                      </div>
                    </div>
                    <ProgressBar progress={memberStats.progress} size="small" />
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TeamProgressPage;