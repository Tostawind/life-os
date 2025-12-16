import React, { useState } from "react";
import {
    X,
    ChevronDown,
    ChevronRight,
    CheckCircle2,
    Pencil,
    Trash2,
    Plus,
    Download,
    Upload,
    AlertTriangle,
    HelpCircle,
} from "lucide-react";
import Card from "../ui/Card";

// UX Helper for Focus
const handleInputFocus = (e) => {
    setTimeout(() => {
        e.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
};

const CategoryManagerModal = ({
    isOpen,
    onClose,
    data,
    addCategory,
    updateCategory,
    requestDeleteCategory,
    handleExport,
    handleImportRequest, // Expects onChange event
    requestHardReset,
    onOpenSystemExplanation,
}) => {
    if (!isOpen) return null;
    const [newCat, setNewCat] = useState("");
    const [editingCat, setEditingCat] = useState(null);
    const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <Card className="w-full max-w-sm p-6 animate-in zoom-in duration-200 max-h-[90dvh] flex flex-col">
                <div className="flex justify-between items-center mb-4 shrink-0">
                    <h3 className="text-lg font-bold text-slate-800">Configuración</h3>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 pr-1">
                    <div className="mb-6">
                        <button
                            onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                            className="flex items-center justify-between w-full text-xs font-bold text-slate-400 uppercase mb-2 hover:text-slate-600 transition-colors"
                        >
                            <span>Categorías</span>
                            {isCategoriesExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                            ) : (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </button>

                        {isCategoriesExpanded && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="space-y-2 mb-2">
                                    {data.categories.map((cat) => (
                                        <div
                                            key={cat}
                                            className="flex items-center justify-between p-2 bg-slate-50 rounded-lg group"
                                        >
                                            {editingCat && editingCat.original === cat ? (
                                                <div className="flex gap-2 flex-1">
                                                    <input
                                                        autoFocus
                                                        value={editingCat.current}
                                                        onFocus={handleInputFocus}
                                                        onChange={(e) =>
                                                            setEditingCat({
                                                                ...editingCat,
                                                                current: e.target.value,
                                                            })
                                                        }
                                                        className="flex-1 bg-white border rounded px-2 text-sm"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            updateCategory(
                                                                editingCat.original,
                                                                editingCat.current
                                                            );
                                                            setEditingCat(null);
                                                        }}
                                                        className="text-emerald-600"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingCat(null)}
                                                        className="text-slate-400"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-sm font-medium text-slate-700">
                                                        {cat}
                                                    </span>
                                                    <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() =>
                                                                setEditingCat({ original: cat, current: cat })
                                                            }
                                                            className="text-slate-400 hover:text-indigo-600"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => requestDeleteCategory(cat)}
                                                            className="text-slate-400 hover:text-rose-600"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        addCategory(newCat);
                                        setNewCat("");
                                    }}
                                    className="flex gap-2 mb-6"
                                >
                                    <input
                                        value={newCat}
                                        onFocus={handleInputFocus}
                                        onChange={(e) => setNewCat(e.target.value)}
                                        placeholder="Nueva categoría..."
                                        className="flex-1 bg-slate-100 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">
                            Recursos
                        </h4>
                        <button
                            onClick={onOpenSystemExplanation}
                            className="w-full flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 font-bold hover:bg-indigo-100 transition-colors mb-2"
                        >
                            <span className="flex items-center gap-2"><HelpCircle className="w-4 h-4" /> Cómo funciona el sistema</span>
                            <ChevronRight className="w-4 h-4 opacity-50" />
                        </button>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">
                            Datos y Seguridad
                        </h4>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <button
                                onClick={handleExport}
                                className="flex flex-col items-center justify-center gap-1 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
                            >
                                <Download className="w-5 h-5 mb-1" />
                                <span className="text-xs font-bold">Descargar Datos</span>
                            </button>
                            <label className="flex flex-col items-center justify-center gap-1 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors cursor-pointer">
                                <Upload className="w-5 h-5 mb-1" />
                                <span className="text-xs font-bold">Cargar Datos</span>
                                <input
                                    type="file"
                                    onChange={handleImportRequest}
                                    className="hidden"
                                    accept=".json"
                                />
                            </label>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-rose-400 uppercase mb-2">
                            Zona de Peligro
                        </h4>
                        <button
                            onClick={requestHardReset}
                            className="w-full flex items-center justify-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 font-bold hover:bg-rose-100 transition-colors"
                        >
                            <AlertTriangle className="w-4 h-4" /> Hard Reset
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CategoryManagerModal;
