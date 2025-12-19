
import React from 'react';
import { LogIn } from 'lucide-react';

export default function LoginPage({ onLogin }) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-sm w-full rounded-2xl shadow-xl overflow-hidden animate-in zoom-in duration-300">
                <div className="bg-indigo-600 p-8 text-center">
                    <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
                        <img src="/logo.png" alt="LifeOS" className="w-14 h-14 object-contain opacity-90" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">LifeOS</h1>
                    <p className="text-indigo-200 text-sm">Organiza tu vida, alcanza tus metas.</p>
                </div>

                <div className="p-8">
                    <button
                        onClick={onLogin}
                        className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-slate-200"
                    >
                        <LogIn className="w-5 h-5" />
                        Iniciar con Google
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-6">
                        Tus datos se sincronizarán en todos tus dispositivos.
                    </p>
                </div>
            </div>
        </div>
    );
}
