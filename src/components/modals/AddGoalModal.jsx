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
                                <select
                                    name="cat"
                                    defaultValue="Sin Categoría"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                >
                                    {data.categories.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                    <option value="Sin Categoría">Sin Categoría</option>
                                </select>
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
