import React from "react";
import {
    CheckCircle2,
    Circle,
    Star,
    GripVertical,
    Sun,
    Target,
    Layers,
    CornerDownRight,
} from "lucide-react";
import ProgressBar from "./ui/ProgressBar";

const TaskItem = ({
    task,
    projects,
    goals,
    onToggle,
    onClick,
    onToggleFavorite,
    showContextTags = true,
    showTodayStatus = false,
    isDraggable = false,
    onDragStart,
    onDragOver,
    onDrop,
    isDragging,
    customActionIcon,
}) => {
    const progress =
        !task.steps || task.steps.length === 0
            ? null
            : {
                current: task.steps.filter((s) => s.completed).length,
                total: task.steps.length,
            };

    const nextStep = task.steps?.find((s) => !s.completed);
    const project = task.projectId
        ? projects.find((p) => p.id === task.projectId)
        : null;
    const goal = project ? goals.find((g) => g.id === project.goalId) : null;

    return (
        <div
            className={`border-b border-slate-100 last:border-0 p-4 transition-colors ${task.completed ? "opacity-50 bg-slate-50/50" : "hover:bg-slate-50"
                } ${isDragging ? "opacity-50 bg-slate-100" : ""}`}
            draggable={isDraggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <div className="flex flex-col gap-2">
                {/* Row 1: Checkbox + Title + Star/Action + Drag */}
                <div className="flex items-start gap-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle(task.id);
                        }}
                        className={`shrink-0 transition-colors ${task.completed
                                ? "text-indigo-500"
                                : "text-slate-300 hover:text-indigo-500"
                            }`}
                    >
                        {task.completed ? (
                            <CheckCircle2 className="w-6 h-6" />
                        ) : (
                            <Circle className="w-6 h-6" />
                        )}
                    </button>

                    <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => onClick(task)}
                    >
                        <span
                            className={`font-medium text-base truncate block ${task.completed
                                    ? "line-through text-slate-400"
                                    : "text-slate-800"
                                }`}
                        >
                            {task.title}
                        </span>
                    </div>

                    {customActionIcon ? (
                        <div onClick={(e) => e.stopPropagation()}>{customActionIcon}</div>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(task.id);
                            }}
                            className="focus:outline-none transition-transform active:scale-90 p-1 rounded-full hover:bg-slate-100 shrink-0"
                        >
                            <Star
                                className={`w-5 h-5 ${task.isFavorite
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-slate-300"
                                    }`}
                            />
                        </button>
                    )}

                    {isDraggable && (
                        <div className="mt-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 shrink-0">
                            <GripVertical className="w-4 h-4" />
                        </div>
                    )}
                </div>

                {/* Row 2: Chips (Aligned fully Left) */}
                <div
                    className="flex flex-wrap gap-2 items-center cursor-pointer"
                    onClick={() => onClick(task)}
                >
                    {/* "Hoy" Chip (Hidden in today view by prop control, shown in others) */}
                    {showTodayStatus && task.status === "active" && !task.completed && (
                        <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded border border-orange-100 font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                            <Sun className="w-3 h-3" /> Hoy
                        </span>
                    )}

                    {/* Context Chips */}
                    {showContextTags && project && (
                        <>
                            {goal && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-bold uppercase tracking-wider flex items-center gap-1 max-w-full truncate">
                                    <Target className="w-3 h-3 shrink-0" /> {goal.title}
                                </span>
                            )}
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 font-bold uppercase tracking-wider flex items-center gap-1 max-w-full truncate">
                                <Layers className="w-3 h-3 shrink-0" /> {project.title}
                            </span>
                        </>
                    )}
                </div>

                {/* Row 3: Next Step & Progress */}
                <div className="pl-9 cursor-pointer" onClick={() => onClick(task)}>
                    {!task.completed && nextStep && (
                        <div className="flex items-center gap-1.5 mb-1.5 text-sm text-indigo-600">
                            <CornerDownRight className="w-3.5 h-3.5 shrink-0" />
                            <span className="font-medium truncate">{nextStep.title}</span>
                        </div>
                    )}
                    {progress && (
                        <div className="flex items-center gap-2 w-full">
                            <ProgressBar
                                current={progress.current}
                                total={progress.total}
                                className="flex-1"
                            />
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                                {progress.current}/{progress.total}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskItem;
