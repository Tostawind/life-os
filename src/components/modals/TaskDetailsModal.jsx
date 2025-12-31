import React, { useState } from "react";
import {
    CheckCircle2,
    X,
    Star,
    Trash2,
    Plus,
    Inbox,
    Sun,
    Layers,
    Target,
} from "lucide-react";
import AutoSaveInput from "../ui/AutoSaveInput";
import ProgressBar from "../ui/ProgressBar";
import StepItem from "../StepItem";

// UX Helper for Focus
const handleInputFocus = (e) => {
    setTimeout(() => {
        e.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
};

const TaskDetailsModal = ({
    task,
    data,
    updateTask,
    toggleTask,
    toggleFavorite,
    onClose,
    updateStep,
    deleteStep,
    addStep,
    reorderSteps,
    requestDeleteTask,
}) => {
    if (!task) return null;

    const [draggingStepIndex, setDraggingStepIndex] = useState(null);
    const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);

    const progress =
        !task.steps || task.steps.length === 0
            ? null
            : {
                current: task.steps.filter((s) => s.completed).length,
                total: task.steps.length,
            };

    const project = task.projectId
        ? data.projects.find((p) => p.id === task.projectId)
        : null;
    const goal = project ? data.goals.find((g) => g.id === project.goalId) : null;

    const handleDragStart = (e, index) => {
        setDraggingStepIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, index) => {
        e.preventDefault();
        if (draggingStepIndex === null) return;
        reorderSteps(task.id, draggingStepIndex, index);
        setDraggingStepIndex(null);
    };

    const handleMoveToProject = (projectId) => {
        // If it was in inbox, move to pending (project backlog).
        // If it was active (My Day), keep it active but associate with project.
        const newStatus = task.status === "inbox" ? "pending" : task.status;
        updateTask(task.id, { projectId, status: newStatus });
        setIsProjectSelectorOpen(false);
    };

    const handleRemoveFromProject = () => {
        updateTask(task.id, { projectId: null, status: "inbox" });
    };

    const renderProjectSelector = () => {
        // Group projects by goal
        const projectsByGoal = data.projects.reduce((acc, project) => {
            const goalId = project.goalId || 'uncategorized';
            if (!acc[goalId]) acc[goalId] = [];
            acc[goalId].push(project);
            return acc;
        }, {});

        return (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-700">Seleccionar Proyecto</h4>
                    <button
                        onClick={() => setIsProjectSelectorOpen(false)}
                        className="text-xs text-slate-500 hover:text-slate-800"
                    >
                        Cancelar
                    </button>
                </div>
                <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
                    {data.goals.map(goal => {
                        const goalProjects = projectsByGoal[goal.id];
                        if (!goalProjects || goalProjects.length === 0) return null;

                        return (
                            <div key={goal.id} className="space-y-1">
                                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 sticky top-0 bg-white/90 backdrop-blur-sm z-10 py-1">
                                    {goal.title}
                                </h5>
                                {goalProjects.map(project => (
                                    <button
                                        key={project.id}
                                        onClick={() => handleMoveToProject(project.id)}
                                        className="w-full flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left group"
                                    >
                                        <Layers className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                        <span className="truncate font-medium text-sm leading-tight">{project.title}</span>
                                    </button>
                                ))}
                            </div>
                        );
                    })}

                    {/* Handle projects without existing goal if any */}
                    {projectsByGoal['uncategorized'] && projectsByGoal['uncategorized'].length > 0 && (
                        <div className="space-y-1">
                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Sin Meta</h5>
                            {projectsByGoal['uncategorized'].map(project => (
                                <button
                                    key={project.id}
                                    onClick={() => handleMoveToProject(project.id)}
                                    className="w-full flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left group"
                                >
                                    <Layers className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                    <span className="truncate font-medium text-sm leading-tight">{project.title}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {data.projects.length === 0 && (
                        <p className="text-sm text-slate-400 p-2 text-center">No hay proyectos</p>
                    )}
                </div>
            </div>
        );
    };

    const renderActionButton = () => {
        if (isProjectSelectorOpen) return renderProjectSelector();

        if (task.projectId) {
            return (
                <div className="space-y-2">
                    <button
                        onClick={() =>
                            updateTask(task.id, {
                                status: task.status === "active" ? "pending" : "active",
                            })
                        }
                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${task.status === "active"
                            ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        {task.status === "active" ? (
                            <>
                                {" "}
                                <Sun className="w-5 h-5 fill-indigo-600" /> Quitar de "Mi Día"{" "}
                            </>
                        ) : (
                            <>
                                {" "}
                                <Sun className="w-5 h-5" /> Añadir a "Mi Día"{" "}
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleRemoveFromProject}
                        className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors bg-slate-100 text-slate-500 hover:bg-slate-200"
                    >
                        <Inbox className="w-5 h-5" /> Mover al Baúl
                    </button>
                </div>
            );
        }
        if (task.status === "wish") {
            return (
                <button
                    onClick={() => updateTask(task.id, { status: "active" })}
                    className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    <Sun className="w-5 h-5" /> Activar Tarea
                </button>
            );
        }
        return (
            <div className="space-y-2">
                <button
                    onClick={() =>
                        updateTask(task.id, {
                            status: task.status === "active" ? "inbox" : "active",
                        })
                    }
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${task.status === "active"
                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                >
                    {task.status === "active" ? (
                        <>
                            {" "}
                            <Inbox className="w-5 h-5" /> Mover al Baúl{" "}
                        </>
                    ) : (
                        <>
                            {" "}
                            <Sun className="w-5 h-5" /> Activar Tarea{" "}
                        </>
                    )}
                </button>
                <button
                    onClick={() => setIsProjectSelectorOpen(true)}
                    className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors bg-white border-2 border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200"
                >
                    <Layers className="w-5 h-5" /> Mover a Proyecto
                </button>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90dvh] animate-in zoom-in duration-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                    <div className="flex-1 mr-4 flex items-start gap-3 min-w-0">
                        <button
                            onClick={() => toggleTask(task.id)}
                            className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors mt-1 ${task.completed
                                ? "bg-indigo-500 border-indigo-500 text-white"
                                : "border-slate-300 hover:border-indigo-400"
                                }`}
                        >
                            {task.completed && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <div className="w-full">
                            <AutoSaveInput
                                value={task.title}
                                onSave={(val) => updateTask(task.id, { title: val })}
                                className={`text-xl font-bold w-full bg-transparent p-0 border-none focus:ring-0 placeholder-slate-400 break-words ${task.completed
                                    ? "text-slate-400 line-through"
                                    : "text-slate-800"
                                    }`}
                                placeholder="Título de la tarea..."
                            />
                            {(project || goal) && (
                                <div className="flex flex-wrap gap-2 mt-1.5">
                                    {goal && (
                                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-bold uppercase tracking-wider flex items-start gap-1 max-w-full break-words text-left">
                                            <Target className="w-3 h-3 shrink-0 mt-[0.15rem]" /> <span className="flex-1">{goal.title}</span>
                                        </span>
                                    )}
                                    {project && (
                                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 font-bold uppercase tracking-wider flex items-start gap-1 max-w-full break-words text-left">
                                            <Layers className="w-3 h-3 shrink-0 mt-[0.15rem]" /> <span className="flex-1">{project.title}</span>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => toggleFavorite(task.id)}
                            className="focus:outline-none transition-transform active:scale-90"
                        >
                            <Star
                                className={`w-6 h-6 ${task.isFavorite
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-300"
                                    }`}
                            />
                        </button>
                        <button
                            onClick={() => {
                                onClose();
                                setIsProjectSelectorOpen(false);
                            }}
                            className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6 overflow-y-auto pb-40">
                    {progress && (
                        <div className="mb-6">
                            <div className="flex justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                                <span>Progreso</span>
                                <span>
                                    {progress.current}/{progress.total}
                                </span>
                            </div>
                            <ProgressBar
                                current={progress.current}
                                total={progress.total}
                            />
                        </div>
                    )}
                    <div className="space-y-1 mb-6">
                        {task.steps &&
                            task.steps.map((step, index) => (
                                <StepItem
                                    key={step.id}
                                    step={step}
                                    index={index + 1}
                                    onUpdate={(updates) => updateStep(task.id, step.id, updates)}
                                    onDelete={() => deleteStep(task.id, step.id)}
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDrop={(e) => handleDrop(e, index)}
                                    isDragging={draggingStepIndex === index}
                                />
                            ))}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const val = e.target.elements.stepTitle.value.trim();
                                if (val) {
                                    addStep(task.id, val);
                                    e.target.reset();
                                }
                            }}
                            className="flex items-center gap-3 py-2 mt-2 opacity-60 focus-within:opacity-100 transition-opacity"
                        >
                            <Plus className="w-5 h-5 text-slate-400 shrink-0" />
                            <input
                                onFocus={handleInputFocus}
                                name="stepTitle"
                                placeholder="Añadir paso siguiente..."
                                className="bg-transparent text-sm focus:outline-none w-full placeholder-slate-400 border-b border-transparent focus:border-indigo-200 pb-1"
                            />
                        </form>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                        {renderActionButton()}
                        <button
                            onClick={() => requestDeleteTask(task.id)}
                            className="w-full py-3 rounded-xl font-bold text-rose-600 hover:bg-rose-50 flex items-center justify-center gap-2 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" /> Eliminar Tarea
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsModal;
