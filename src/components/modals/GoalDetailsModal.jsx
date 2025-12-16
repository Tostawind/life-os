import React, { useState } from "react";
import { Target, X, Plus } from "lucide-react";
import Card from "../ui/Card";
import AutoSaveInput from "../ui/AutoSaveInput";
import ProjectCard from "../ProjectCard";

const GoalDetailsModal = ({
    goalId,
    onClose,
    data,
    updateGoal,
    updateProject,
    requestDeleteProject,
    addProject, // This adds a NEW project to the goal
    addTaskToProject, // NEW PROP needed
    toggleTask,
    setSelectedTask,
    toggleFavorite,
    reorderProjectTasks,
}) => {
    if (!goalId) return null;
    const goal = data.goals.find((g) => g.id === goalId);
    const goalProjects = data.projects.filter((p) => p.goalId === goalId);
    const [isAddingProject, setIsAddingProject] = useState(false);

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
            <div className="bg-slate-50 w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[85vh] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
                <div className="bg-white p-6 rounded-t-2xl border-b border-slate-200 flex justify-between items-start shrink-0">
                    <div className="flex-1 mr-4 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Target className="w-5 h-5 text-indigo-600 shrink-0 hidden md:block" />
                                <Target className="w-5 h-5 text-indigo-600 shrink-0 md:hidden" />
                                <AutoSaveInput
                                    value={goal.title}
                                    onSave={(val) => updateGoal(goal.id, { title: val })}
                                    className="text-xl md:text-2xl font-bold text-slate-800 bg-transparent border-none p-0 w-full"
                                />
                            </div>
                            <div className="relative shrink-0 w-fit md:w-auto">
                                <select
                                    value={goal.category || ""}
                                    onChange={(e) =>
                                        updateGoal(goal.id, { category: e.target.value })
                                    }
                                    className="appearance-none pl-3 pr-8 py-1.5 text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-600 rounded-full border border-slate-200 hover:bg-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer w-full"
                                >
                                    {data.categories.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                    <option value="Sin Categoría">Sin Categoría</option>
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>
                        </div>
                        <AutoSaveInput
                            value={goal.description}
                            onSave={(val) => updateGoal(goal.id, { description: val })}
                            className="text-slate-500 w-full bg-transparent border-none p-0"
                            placeholder="Descripción de la meta..."
                        />
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full"
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
                    {goalProjects.map((project) => {
                        const projectTasks = data.tasks.filter(
                            (t) => t.projectId === project.id && t.status !== "deleted"
                        );
                        const sortedTasks = [
                            ...projectTasks.filter((t) => !t.completed),
                            ...projectTasks.filter((t) => t.completed),
                        ];

                        return (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                tasks={sortedTasks}
                                onUpdateProject={(updates) =>
                                    updateProject(project.id, updates)
                                }
                                onDeleteProject={() => requestDeleteProject(project.id)}
                                onToggleStatus={() =>
                                    updateProject(project.id, {
                                        status:
                                            project.status === "active" ? "incubator" : "active",
                                    })
                                }
                                onAddTask={(title) => addTaskToProject(project.id, title)}
                                onTaskToggle={toggleTask}
                                onTaskClick={(t) => setSelectedTask(t)}
                                onTaskFavorite={toggleFavorite}
                                onReorderTasks={(from, to) =>
                                    reorderProjectTasks(project.id, from, to)
                                }
                            />
                        );
                    })}

                    {isAddingProject ? (
                        <Card className="p-4 animate-in fade-in">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const val = e.target.elements.projTitle.value.trim();
                                    if (val) {
                                        addProject(val, goal.id);
                                        setIsAddingProject(false);
                                    }
                                }}
                            >
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                                    Nuevo Proyecto
                                </label>
                                <div className="flex flex-col md:flex-row gap-2">
                                    <input
                                        name="projTitle"
                                        autoFocus
                                        placeholder="Nombre del proyecto..."
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full"
                                    />
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            type="submit"
                                            className="flex-1 md:flex-none bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700"
                                        >
                                            Crear
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingProject(false)}
                                            className="flex-1 md:flex-none bg-white border border-slate-200 text-slate-500 px-4 py-2 rounded-lg font-bold hover:bg-slate-50"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </Card>
                    ) : (
                        <button
                            onClick={() => setIsAddingProject(true)}
                            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-bold hover:border-indigo-400 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> Añadir Nuevo Proyecto
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GoalDetailsModal;
