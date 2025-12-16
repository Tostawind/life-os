import React, { useState, useRef, useEffect } from "react";
import {
    PlayCircle,
    PauseCircle,
    Target,
    CornerDownRight,
    MoreHorizontal,
    Archive,
    Trash2,
    Plus,
} from "lucide-react";
import AutoSaveInput from "./ui/AutoSaveInput";
import ProgressBar from "./ui/ProgressBar";
import TaskItem from "./TaskItem";

// Handle input focus helper needs to be available here too, imported or redefined
const handleInputFocus = (e) => {
    setTimeout(() => {
        e.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
};

const ProjectCard = ({
    project,
    tasks,
    goal,
    onUpdateProject,
    onDeleteProject,
    onToggleStatus,
    onAddTask,
    onTaskToggle,
    onTaskClick,
    onTaskFavorite,
    onReorderTasks,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [draggingTaskIndex, setDraggingTaskIndex] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const progress = {
        current: tasks.filter((t) => t.completed).length,
        total: tasks.length,
    };

    const isActive = project.status === "active";
    const nextStep = tasks.find((t) => !t.completed);

    const handleDragStart = (e, index) => {
        setDraggingTaskIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, index) => {
        e.preventDefault();
        if (draggingTaskIndex === null) return;
        onReorderTasks(draggingTaskIndex, index);
        setDraggingTaskIndex(null);
    };

    return (
        <div
            className={`bg-white rounded-xl border shadow-sm mb-6 last:mb-0 transition-colors ${isActive ? "border-slate-200" : "border-slate-100 bg-slate-50/50"
                }`}
        >
            {/* Header Clickable */}
            <div
                className={`p-4 bg-slate-50 border-slate-200 flex justify-between items-start cursor-pointer hover:bg-slate-100/50 transition-colors ${isExpanded ? "border-b rounded-t-xl" : "rounded-xl"
                    }`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex-1 mr-4 min-w-0">
                    {/* Project Title Row */}
                    <div className="flex items-center gap-2 mb-1">
                        {isActive ? (
                            <PlayCircle
                                className="w-4 h-4 text-emerald-500 shrink-0"
                                title="Proyecto Activo"
                            />
                        ) : (
                            <PauseCircle
                                className="w-4 h-4 text-slate-400 shrink-0"
                                title="Proyecto en Incubadora"
                            />
                        )}

                        <AutoSaveInput
                            value={project.title}
                            onSave={(val) => onUpdateProject({ title: val })}
                            className={`font-bold w-full text-base bg-transparent p-0 border-none truncate ${isActive ? "text-slate-700" : "text-slate-500"
                                }`}
                            placeholder="Nombre del proyecto..."
                        />
                    </div>

                    {/* Goal Chip (Debajo del título) */}
                    {goal && (
                        <div className="mb-2">
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                                <Target className="w-3 h-3 shrink-0" /> {goal.title}
                            </span>
                        </div>
                    )}

                    {/* Siguiente Paso (Solo visible si está colapsado) */}
                    {!isExpanded && nextStep && isActive && (
                        <div className="flex items-center gap-1.5 mb-3 mt-1 text-sm text-indigo-600 pl-6">
                            <CornerDownRight className="w-3.5 h-3.5 shrink-0" />
                            <span className="font-medium truncate">{nextStep.title}</span>
                        </div>
                    )}

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 w-full mt-1">
                        <ProgressBar
                            current={progress.current}
                            total={progress.total}
                            className="flex-1"
                        />
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {progress.current}/{progress.total}
                        </span>
                    </div>
                </div>

                {/* Menu */}
                <div
                    className="relative shrink-0"
                    ref={menuRef}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-xl z-20 overflow-hidden min-w-[170px] animate-in fade-in zoom-in duration-100">
                            <button
                                onClick={() => {
                                    onToggleStatus();
                                    setShowMenu(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-50 whitespace-nowrap"
                            >
                                {isActive ? (
                                    <>
                                        {" "}
                                        <Archive className="w-3.5 h-3.5" /> Mover a Incubadora{" "}
                                    </>
                                ) : (
                                    <>
                                        {" "}
                                        <PlayCircle className="w-3.5 h-3.5" /> Activar Proyecto{" "}
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    onDeleteProject();
                                    setShowMenu(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Eliminar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Task List & Form (Collapsible) */}
            {isExpanded && (
                <div
                    className={`divide-y divide-slate-100 animate-in slide-in-from-top-2 duration-200 ${!isActive ? "opacity-60" : ""
                        }`}
                >
                    {tasks.map((task, index) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            projects={[]}
                            goals={[]}
                            onToggle={onTaskToggle}
                            onClick={onTaskClick}
                            onToggleFavorite={onTaskFavorite}
                            showContextTags={false}
                            showTodayStatus={true}
                            // Drag Props
                            isDraggable={true}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            isDragging={draggingTaskIndex === index}
                        />
                    ))}

                    {/* Formulario */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const val = e.target.elements.taskTitle.value.trim();
                            if (val) {
                                onAddTask(val);
                                e.target.reset();
                            }
                        }}
                        className="flex items-center gap-3 p-4 opacity-60 focus-within:opacity-100 transition-opacity hover:bg-slate-50 rounded-b-xl"
                    >
                        <Plus className="w-5 h-5 text-slate-400 shrink-0" />
                        <input
                            name="taskTitle"
                            placeholder="Añadir tarea al proyecto..."
                            className="bg-transparent text-sm focus:outline-none w-full placeholder-slate-400 truncate"
                            autoComplete="off"
                            onFocus={handleInputFocus}
                        />
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProjectCard;
