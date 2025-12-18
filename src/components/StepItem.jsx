import React, { useState, useRef, useEffect } from "react";
import { CheckCircle2, Trash2, MoreHorizontal, GripVertical } from "lucide-react";
import AutoSaveInput from "./ui/AutoSaveInput";

const StepItem = ({
    step,
    onUpdate,
    onDelete,
    onDragStart,
    onDragOver,
    onDrop,
    isDragging,
    index,
}) => {
    const [showMenu, setShowMenu] = useState(false);
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

    return (
        <div
            className={`flex items-start gap-3 py-2 group ${isDragging ? "opacity-50 bg-slate-50" : ""
                }`}
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <button
                onClick={() => onUpdate({ completed: !step.completed })}
                className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 transition-colors ${step.completed
                    ? "bg-indigo-500 border-indigo-500 text-white"
                    : "border-slate-300 hover:border-indigo-400 text-slate-400 font-bold text-xs"
                    }`}
            >
                {step.completed ? <CheckCircle2 className="w-4 h-4" /> : index}
            </button>

            <div className="flex-1 min-w-0">
                <AutoSaveInput
                    value={step.title}
                    onSave={(val) => onUpdate({ title: val })}
                    className={`w-full text-sm break-words ${step.completed ? "text-slate-400 line-through" : "text-slate-700"
                        }`}
                />
            </div>

            <div className="relative shrink-0" ref={menuRef}>
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 text-slate-300 hover:text-slate-600 rounded-md hover:bg-slate-100"
                >
                    <MoreHorizontal className="w-4 h-4" />
                </button>
                {showMenu && (
                    <div className="absolute right-0 top-6 bg-white border border-slate-200 rounded-lg shadow-xl z-20 overflow-hidden min-w-[120px] animate-in fade-in zoom-in duration-100">
                        <button
                            onClick={() => {
                                onDelete();
                                setShowMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                            <Trash2 className="w-3 h-3" /> Eliminar
                        </button>
                    </div>
                )}
            </div>

            {/* Drag Handle on the Right */}
            <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 shrink-0">
                <GripVertical className="w-4 h-4" />
            </div>
        </div>
    );
};

export default StepItem;
