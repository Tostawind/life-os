import React, { useState } from "react";
import {
    CheckCircle2,
    X,
    Star,
    Trash2,
    Plus,
    Inbox,
    Sun,
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

    const progress =
        !task.steps || task.steps.length === 0
            ? null
            : {
                current: task.steps.filter((s) => s.completed).length,
                total: task.steps.length,
            };

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

    const renderActionButton = () => {
        if (task.projectId) {
            return (
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
        );
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90dvh] animate-in zoom-in duration-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                    <div className="flex-1 mr-4 flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => toggleTask(task.id)}
                            className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${task.completed
                                ? "bg-indigo-500 border-indigo-500 text-white"
                                : "border-slate-300 hover:border-indigo-400"
                                }`}
                        >
                            {task.completed && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <AutoSaveInput
                            value={task.title}
                            onSave={(val) => updateTask(task.id, { title: val })}
                            className={`text-xl font-bold w-full bg-transparent p-0 border-none focus:ring-0 placeholder-slate-400 truncate ${task.completed
                                ? "text-slate-400 line-through"
                                : "text-slate-800"
                                }`}
                            placeholder="Título de la tarea..."
                        />
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
                            onClick={onClose}
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
