import React from "react";
import { AlertTriangle, Upload } from "lucide-react";
import Card from "../ui/Card";

export const DeleteProjectConfirmationModal = ({ onDelete, onCancel }) => (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-6 animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 text-rose-600">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                    ¿Eliminar Proyecto?
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                    Se borrarán todas sus tareas.
                </p>
                <div className="flex gap-3 w-full">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 shadow-lg shadow-rose-200"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </Card>
    </div>
);

export const DeleteCategoryConfirmationModal = ({ onDelete, onCancel }) => (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-6 animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 text-rose-600">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                    ¿Eliminar Categoría?
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                    Las metas asociadas pasarán a "Sin Categoría".
                </p>
                <div className="flex gap-3 w-full">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 shadow-lg shadow-rose-200"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </Card>
    </div>
);

export const DeleteConfirmationModal = ({ onDelete, onCancel }) => (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-6 animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 text-rose-600">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                    ¿Eliminar Tarea?
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                    Esta acción no se puede deshacer.
                </p>
                <div className="flex gap-3 w-full">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 shadow-lg shadow-rose-200"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </Card>
    </div>
);

export const ResetConfirmModal = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-6 animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 text-rose-600">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Hard Reset</h3>
                <p className="text-slate-500 text-sm mb-6">
                    Se borrarán TODOS los datos. ¿Seguro?
                </p>
                <div className="flex gap-3 w-full">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 shadow-lg shadow-rose-200"
                    >
                        Borrar Todo
                    </button>
                </div>
            </div>
        </Card>
    </div>
);

export const ImportConfirmModal = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-6 animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                    <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                    Confirmar Importación
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                    Esto sobrescribirá tus datos actuales. ¿Continuar?
                </p>
                <div className="flex gap-3 w-full">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                    >
                        Importar
                    </button>
                </div>
            </div>
        </Card>
    </div>
);
