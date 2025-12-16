import React from "react";
import { Inbox } from "lucide-react";

const InboxBanner = ({ data, view, onProcess }) => {
    if (view !== "today") return null;
    const inboxCount = data.tasks.filter((t) => t.status === "inbox").length;
    if (inboxCount === 0) return null;
    return (
        <div className="bg-indigo-50 border border-indigo-100 text-indigo-900 px-4 py-3 rounded-xl mb-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Inbox className="w-5 h-5 text-indigo-600" />
                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
                        {inboxCount}
                    </span>
                </div>
                <p className="font-bold text-sm">Baúl ({inboxCount})</p>
            </div>
            <button
                onClick={onProcess}
                className="bg-white text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors"
            >
                Procesar
            </button>
        </div>
    );
};

export default InboxBanner;
