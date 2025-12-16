import React from "react";

const ProgressBar = ({ current, total, className = "" }) => {
    if (total === 0) return null;
    const percent = Math.round((current / total) * 100);
    return (
        <div
            className={`h-1.5 w-full bg-slate-100 rounded-full overflow-hidden ${className}`}
        >
            <div
                className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                style={{ width: `${percent}%` }}
            />
        </div>
    );
};

export default ProgressBar;
