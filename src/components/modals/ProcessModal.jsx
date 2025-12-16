import React from "react";
import { Inbox, CheckCircle2, ArrowRight, X, Zap, Gift } from "lucide-react";
import Card from "../ui/Card";
import TaskItem from "../TaskItem";

const ProcessModal = ({
    isOpen,
    onClose,
    data,
    processingTask,
    setProcessingTask,
    toggleTask,
    setSelectedTask,
    toggleFavorite,
    processTaskAction,
}) => {
    if (!isOpen) return null;

    const projectsByGoal = data.goals
        .map((g) => ({
            goal: g,
            projects: data.projects.filter((p) => p.goalId === g.id),
        }))
        .filter((group) => group.projects.length > 0);
    const inboxTasks = data.tasks.filter((t) => t.status === "inbox");

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg p-6 animate-in zoom-in duration-200 flex flex-col max-h-[85vh]">
                <div className="flex justify-between items-center mb-4 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Inbox className="w-5 h-5 text-indigo-600" />
                            <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
                                {inboxTasks.length}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Baúl</h3>
                    </div>
                    <button
                        onClick={() => {
                            onClose();
                            setProcessingTask(null);
                        }}
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
                {!processingTask ? (
                    <>
                        {inboxTasks.length === 0 ? (
                            <div className="py-10 text-center text-slate-400">
                                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                <p>Baúl vacío.</p>
                            </div>
                        ) : (
                            <div className="space-y-2 overflow-y-auto pr-1 pb-20">
                                {inboxTasks.map((t) => (
                                    <TaskItem
                                        key={t.id}
                                        task={t}
                                        projects={[]}
                                        goals={[]}
                                        onToggle={toggleTask}
                                        onClick={(t) => setSelectedTask(t)} // Edit on Click
                                        onToggleFavorite={toggleFavorite}
                                        showContextTags={false}
                                        showTodayStatus={false}
                                        customActionIcon={
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setProcessingTask(t);
                                                }} // Process on Arrow Click
                                                className="p-1 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                                            >
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col h-full overflow-hidden">
                        <div className="mb-6 bg-slate-50 p-5 rounded-xl border border-slate-200 text-center shrink-0">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Procesando
                            </p>
                            <p className="text-slate-800 text-lg font-medium leading-tight">
                                "{processingTask.title}"
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-1">
                            <button
                                onClick={() =>
                                    processTaskAction(processingTask.id, "immediate")
                                }
                                className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group text-left shrink-0"
                            >
                                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-700">
                                        Tarea Inmediata
                                    </span>
                                    <span className="text-xs text-slate-500">Hoy.</span>
                                </div>
                            </button>
                            <button
                                onClick={() => processTaskAction(processingTask.id, "wish")}
                                className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition-all group text-left shrink-0"
                            >
                                <div className="bg-amber-100 text-amber-600 p-2 rounded-lg">
                                    <Gift className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-700">Deseo</span>
                                    <span className="text-xs text-slate-500">Algún día.</span>
                                </div>
                            </button>
                            <div className="space-y-2 mt-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 sticky top-0 bg-white z-10 py-1">
                                    Mover a Proyecto
                                </p>
                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    {projectsByGoal.map((group) => (
                                        <div key={group.goal.id}>
                                            <div className="bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                                {group.goal.title}
                                            </div>
                                            <div className="divide-y divide-slate-100 border-b border-slate-200 last:border-0">
                                                {group.projects.map((p) => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() =>
                                                            processTaskAction(processingTask.id, "project", {
                                                                projectId: p.id,
                                                            })
                                                        }
                                                        className="w-full text-left p-3 hover:bg-slate-50 text-sm flex items-center justify-between group bg-white"
                                                    >
                                                        <span className="text-slate-700 font-medium pl-2">
                                                            {p.title}
                                                        </span>
                                                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setProcessingTask(null)}
                            className="mt-4 w-full py-2 text-slate-400 text-sm hover:text-slate-600 shrink-0"
                        >
                            Volver
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ProcessModal;
