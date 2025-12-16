import React from "react";
import { X, Settings } from "lucide-react";
import Card from "../ui/Card";

// UX Helper for Focus
const handleInputFocus = (e) => {
    setTimeout(() => {
        e.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
};

const AddGoalModal = ({
    isOpen,
    onClose,
    data,
    addGoal,
    onOpenCategoryManager,
}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-6 animate-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Nueva Meta</h3>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const { title, desc, cat } = e.target.elements;
                        if (title.value.trim()) {
                            addGoal(title.value.trim(), desc.value.trim(), cat.value.trim());
                            onClose();
                        }
                    }}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                Título
                            </label>
                            <input
                                onFocus={handleInputFocus}
                                name="title"
                                autoFocus
                                placeholder="Ej: Correr Maratón"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                Descripción
                            </label>
                            <input
                                onFocus={handleInputFocus}
                                name="desc"
                                placeholder="El por qué..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                Categoría
                            </label>
                            <div className="flex gap-2">
                                <div className="relative w-full">
                                    <select
                                        name="cat"
                                        defaultValue="Sin Categoría"
                                        className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-600 font-medium"
                                    >
                                        {data.categories.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                        <option value="Sin Categoría">Sin Categoría</option>
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={onOpenCategoryManager}
                                    className="px-3 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 text-slate-500"
                                >
                                    <Settings className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        Crear Meta
                    </button>
                </form>
            </Card>
        </div>
    );
};

export default AddGoalModal;
