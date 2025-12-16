import React from "react";
import {
  Inbox,
  Layout,
  Target,
  Layers,
  Plus,
  Gift,
  Settings,
  Star,
  CheckCircle2,
  Filter,
  PauseCircle,
} from "lucide-react";

import { useLifeOS } from "./hooks/useLifeOS";

import Card from "./components/ui/Card";
import ProgressBar from "./components/ui/ProgressBar";

import TaskItem from "./components/TaskItem";
import ProjectCard from "./components/ProjectCard";
import InboxBanner from "./components/InboxBanner";

import ProcessModal from "./components/modals/ProcessModal";
import TaskDetailsModal from "./components/modals/TaskDetailsModal";
import GoalDetailsModal from "./components/modals/GoalDetailsModal";
import AddGoalModal from "./components/modals/AddGoalModal";
import CategoryManagerModal from "./components/modals/CategoryManagerModal";
import {
  DeleteConfirmationModal,
  DeleteProjectConfirmationModal,
  DeleteCategoryConfirmationModal,
  ResetConfirmModal,
  ImportConfirmModal,
} from "./components/modals/DeleteModals";
import SystemExplanationModal from "./components/modals/SystemExplanationModal";

// UX Helper for Focus (used in inline form)
const handleInputFocus = (e) => {
  setTimeout(() => {
    e.target.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 300);
};

export default function LifeOS() {
  const {
    data,
    setData, // Exposed for direct manipulation
    view,
    setView,
    todayFilter,
    setTodayFilter,
    isProcessModalOpen,
    setIsProcessModalOpen,
    processingTask,
    setProcessingTask,
    goalModal,
    setGoalModal,
    selectedTask,
    setSelectedTask,
    isAddGoalModalOpen,
    setIsAddGoalModalOpen,
    taskToDelete,
    setTaskToDelete,
    projectToDelete,
    setProjectToDelete,
    showResetConfirm,
    setShowResetConfirm,
    pendingImportData,
    setPendingImportData,
    isCategoryManagerOpen,
    setIsCategoryManagerOpen,
    categoryToDelete,
    setCategoryToDelete,
    isSystemExplanationOpen,
    setIsSystemExplanationOpen,
    actions,
  } = useLifeOS();

  // Deconstruct actions for easier usage
  const {
    addTask,
    updateTask,
    toggleTask,
    toggleFavorite,
    requestDeleteTask,
    confirmDeleteTask,
    addStep,
    updateStep,
    deleteStep,
    reorderSteps,
    reorderProjectTasks,
    addGoal,
    updateGoal,
    addProject,
    updateProject,
    requestDeleteProject,
    confirmDeleteProject,
    addCategory,
    updateCategory,
    requestDeleteCategory,
    confirmDeleteCategory,
    processTaskAction,
    getGoalProgress,
    handleExport,
    confirmImport,
    requestHardReset,
    confirmHardReset,
    getFilteredTasks,
  } = actions;

  // Custom logic to add a task directly to a project
  const handleAddTaskToProject = (projectId, title) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      type: "project",
      projectId: projectId,
      status: "pending",
      completed: false,
      steps: [],
      isFavorite: false,
    };
    setData((prev) => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  // Logic to handle file import request (FileReader)
  const handleImportRequest = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        setPendingImportData(importedData);
      } catch (error) {
        alert("Error al leer archivo.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-32 md:pb-12">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-3 shadow-sm">
        <div className="max-w-xl mx-auto flex gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const val = e.target.elements.title.value.trim();
              if (val) {
                addTask(val);
                e.target.reset();
              }
            }}
            className="flex-1 relative"
          >
            <input
              onFocus={handleInputFocus}
              name="title"
              type="text"
              placeholder="¿Qué tienes en mente?"
              className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400 focus:outline-none"
              autoComplete="off"
            />
            <Inbox className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
          </form>
          <button
            onClick={() => setIsCategoryManagerOpen(true)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      <main className="max-w-xl mx-auto px-4 py-6">
        <InboxBanner data={data} view={view} onProcess={() => setIsProcessModalOpen(true)} />

        {view === "today" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col gap-2 mb-2">
              <header className="flex items-baseline justify-between gap-2">
                <h2 className="text-2xl font-bold text-slate-900">Hoy</h2>
                <span className="text-slate-400 text-sm">
                  {
                    data.tasks.filter(
                      (t) => t.status === "active" && !t.completed
                    ).length
                  }{" "}
                  activas
                </span>
              </header>
              {/* Filtros - Aligned Right */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full justify-start md:justify-end">
                {[
                  { id: "all", label: "Todo" },
                  {
                    id: "favorites",
                    label: "Favoritas",
                    icon: <Star className="w-3 h-3" />,
                  },
                  {
                    id: "project",
                    label: "Proyectos",
                    icon: <Layers className="w-3 h-3" />,
                  },
                  {
                    id: "normal",
                    label: "Simples",
                    icon: <CheckCircle2 className="w-3 h-3" />,
                  },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setTodayFilter(f.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${todayFilter === f.id
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    {f.icon} {f.label}
                  </button>
                ))}
              </div>
            </div>

            <Card className="overflow-hidden divide-y divide-slate-100">
              {getFilteredTasks()
                .sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite))
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    projects={data.projects}
                    goals={data.goals}
                    onToggle={toggleTask}
                    onClick={(t) => setSelectedTask(t)}
                    onToggleFavorite={toggleFavorite}
                    showTodayStatus={false}
                  />
                ))}
              {getFilteredTasks().length === 0 && (
                <div className="p-8 text-center text-slate-400">
                  <Filter className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p>No hay tareas con este filtro.</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {view === "projects" && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Proyectos Activos
            </h2>
            {data.projects
              .filter((p) => p.status === "active")
              .map((p) => {
                const pGoal = data.goals.find((g) => g.id === p.goalId);
                const projectTasks = data.tasks.filter(
                  (t) => t.projectId === p.id && t.status !== "deleted"
                );
                const sortedTasks = [
                  ...projectTasks.filter((t) => !t.completed),
                  ...projectTasks.filter((t) => t.completed),
                ];

                return (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    goal={pGoal}
                    tasks={sortedTasks}
                    onUpdateProject={(updates) => updateProject(p.id, updates)}
                    onDeleteProject={() => requestDeleteProject(p.id)}
                    onToggleStatus={() =>
                      updateProject(p.id, {
                        status: p.status === "active" ? "incubator" : "active",
                      })
                    }
                    onAddTask={(title) => handleAddTaskToProject(p.id, title)}
                    onTaskToggle={toggleTask}
                    onTaskClick={(t) => setSelectedTask(t)}
                    onTaskFavorite={toggleFavorite}
                    onReorderTasks={(from, to) =>
                      reorderProjectTasks(p.id, from, to)
                    }
                  />
                );
              })}

            {data.projects.filter((p) => p.status === "active").length ===
              0 && (
                <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                  <p>No hay proyectos activos.</p>
                  <p className="text-xs mt-1">
                    Activa proyectos desde tus Metas.
                  </p>
                </div>
              )}
          </div>
        )}

        {view === "goals" && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Metas</h2>
            {data.goals.map((g) => {
              const progress = getGoalProgress(g.id);
              return (
                <Card
                  key={g.id}
                  className="p-6 cursor-pointer hover:border-indigo-300 relative"
                >
                  <div onClick={() => setGoalModal(g.id)}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-800 pr-4">
                        {g.title}
                      </h3>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {g.category && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded-full border border-slate-200">
                            {g.category}
                          </span>
                        )}
                        {g.status === "incubator" && (
                          <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-1 rounded-full font-bold uppercase tracking-wide flex items-center gap-1">
                            <PauseCircle className="w-3 h-3" /> Incubadora
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                      {g.description}
                    </p>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-400 ml-auto">
                        {progress.current}/{progress.total} tareas
                      </span>
                    </div>
                    <ProgressBar
                      current={progress.current}
                      total={progress.total}
                    />
                  </div>
                </Card>
              );
            })}
            <button
              onClick={() => setIsAddGoalModalOpen(true)}
              className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-bold hover:border-indigo-400 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100"
            >
              <Plus className="w-5 h-5" /> Nueva Meta
            </button>
          </div>
        )}

        {view === "wishes" && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Deseos</h2>
            <Card className="divide-y divide-slate-100">
              {data.tasks
                .filter((t) => t.status === "wish")
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    projects={data.projects}
                    goals={data.goals}
                    onToggle={toggleTask}
                    onClick={(t) => setSelectedTask(t)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              {data.tasks.filter((t) => t.status === "wish").length === 0 && (
                <div className="p-8 text-center text-slate-400">
                  <p>Sin deseos.</p>
                </div>
              )}
            </Card>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 z-40">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <button
            onClick={() => setView("today")}
            className={`flex flex-col items-center gap-1 ${view === "today" ? "text-indigo-600" : "text-slate-400"
              }`}
          >
            <Layout className="w-6 h-6" />
            <span className="text-[10px] font-bold">Hoy</span>
          </button>
          <button
            onClick={() => setView("projects")}
            className={`flex flex-col items-center gap-1 ${view === "projects" ? "text-indigo-600" : "text-slate-400"
              }`}
          >
            <Layers className="w-6 h-6" />
            <span className="text-[10px] font-bold">Proyectos</span>
          </button>
          <div
            className="-mt-8 bg-indigo-600 rounded-full p-4 shadow-lg shadow-indigo-300 border-4 border-slate-50 cursor-pointer"
            onClick={() =>
              document.querySelector('input[name="title"]').focus()
            }
          >
            <Plus className="w-6 h-6 text-white" />
          </div>
          <button
            onClick={() => setView("goals")}
            className={`flex flex-col items-center gap-1 ${view === "goals" ? "text-indigo-600" : "text-slate-400"
              }`}
          >
            <Target className="w-6 h-6" />
            <span className="text-[10px] font-bold">Metas</span>
          </button>
          <button
            onClick={() => setView("wishes")}
            className={`flex flex-col items-center gap-1 ${view === "wishes" ? "text-indigo-600" : "text-slate-400"
              }`}
          >
            <Gift className="w-6 h-6" />
            <span className="text-[10px] font-bold">Deseos</span>
          </button>
        </div>
      </nav>

      <ProcessModal
        isOpen={isProcessModalOpen}
        onClose={() => setIsProcessModalOpen(false)}
        data={data}
        processingTask={processingTask}
        setProcessingTask={setProcessingTask}
        toggleTask={toggleTask}
        setSelectedTask={setSelectedTask}
        toggleFavorite={toggleFavorite}
        processTaskAction={processTaskAction}
      />

      <TaskDetailsModal
        task={selectedTask ? data.tasks.find(t => t.id === selectedTask.id) : null}
        data={data}
        updateTask={updateTask}
        toggleTask={toggleTask}
        toggleFavorite={toggleFavorite}
        onClose={() => setSelectedTask(null)}
        updateStep={updateStep}
        deleteStep={deleteStep}
        addStep={addStep}
        reorderSteps={reorderSteps}
        requestDeleteTask={requestDeleteTask}
      />

      <GoalDetailsModal
        goalId={goalModal}
        onClose={() => setGoalModal(null)}
        data={data}
        updateGoal={updateGoal}
        updateProject={updateProject}
        requestDeleteProject={requestDeleteProject}
        addProject={addProject}
        addTaskToProject={handleAddTaskToProject}
        toggleTask={toggleTask}
        setSelectedTask={setSelectedTask}
        toggleFavorite={toggleFavorite}
        reorderProjectTasks={reorderProjectTasks}
      />

      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
        data={data}
        addGoal={addGoal}
        onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
      />

      {taskToDelete && (
        <DeleteConfirmationModal
          onDelete={confirmDeleteTask}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
      {projectToDelete && (
        <DeleteProjectConfirmationModal
          onDelete={confirmDeleteProject}
          onCancel={() => setProjectToDelete(null)}
        />
      )}
      {categoryToDelete && (
        <DeleteCategoryConfirmationModal
          onDelete={confirmDeleteCategory}
          onCancel={() => setCategoryToDelete(null)}
        />
      )}

      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        data={data}
        addCategory={addCategory}
        updateCategory={updateCategory}
        requestDeleteCategory={requestDeleteCategory}
        handleExport={handleExport}
        handleImportRequest={handleImportRequest}
        requestHardReset={requestHardReset}
        onOpenSystemExplanation={() => setIsSystemExplanationOpen(true)}
      />

      {showResetConfirm && (
        <ResetConfirmModal
          onConfirm={confirmHardReset}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
      {pendingImportData && (
        <ImportConfirmModal
          onConfirm={confirmImport}
          onCancel={() => setPendingImportData(null)}
        />
      )}

      <SystemExplanationModal
        isOpen={isSystemExplanationOpen}
        onClose={() => setIsSystemExplanationOpen(false)}
      />
    </div>
  );
}
