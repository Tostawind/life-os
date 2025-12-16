import React from "react";
import { X, Target, Layers, CheckCircle2, PauseCircle, Gift, HelpCircle } from "lucide-react";
import Card from "../ui/Card";

const SystemExplanationModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const sections = [
        {
            title: "Metas",
            icon: <Target className="w-5 h-5 text-indigo-600" />,
            desc: "Son tus grandes objetivos. Representan el 'QUÉ' quieres lograr a largo plazo. Una meta agrupa varios proyectos.",
            color: "bg-indigo-50 border-indigo-100",
        },
        {
            title: "Proyectos",
            icon: <Layers className="w-5 h-5 text-blue-600" />,
            desc: "Son los pasos concretos para lograr una Meta. Un proyecto tiene un principio y un fin, y contiene múltiples tareas.",
            color: "bg-blue-50 border-blue-100",
        },
        {
            title: "Tareas Diarias",
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
            desc: "Son las acciones pequeñas y manejables que haces día a día. Pueden pertenecer a un proyecto o ser tareas sueltas.",
            color: "bg-emerald-50 border-emerald-100",
        },
        {
            title: "Incubadora",
            icon: <PauseCircle className="w-5 h-5 text-amber-600" />,
            desc: "El lugar para tus proyetos o metas que no puedes atender ahora pero no quieres olvidar. Están en pausa hasta que decidas activarlos.",
            color: "bg-amber-50 border-amber-100",
        },
        {
            title: "Deseos",
            icon: <Gift className="w-5 h-5 text-pink-600" />,
            desc: "Ideas, compras o sueños futuros que no requieren acción inmediata. Es tu lista de 'algún día'.",
            color: "bg-pink-50 border-pink-100",
        },
    ];

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col p-0 animate-in zoom-in duration-200 shadow-2xl">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <HelpCircle className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Filosofía LifeOS</h3>
                            <p className="text-sm text-slate-500">Cómo funciona el sistema</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-4 bg-slate-50 rounded-b-2xl">
                    <div className="prose prose-slate max-w-none mb-6">
                        <p className="text-slate-600">
                            Este sistema está diseñado para ayudarte a transformar grandes sueños en acciones diarias concretas, evitando que te sientas abrumado.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                        {sections.map((item) => (
                            <div key={item.title} className={`p-4 rounded-xl border ${item.color} flex gap-4 transition-hover hover:shadow-sm`}>
                                <div className="shrink-0 pt-1">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        {item.icon}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SystemExplanationModal;
