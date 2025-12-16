import React, { useState, useEffect } from "react";

// --- Helper para UX Móvil (Global) ---
const handleInputFocus = (e) => {
    setTimeout(() => {
        e.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
};

const AutoSaveInput = ({ value, onSave, className = "", placeholder = "" }) => {
    const [text, setText] = useState(value);

    useEffect(() => {
        setText(value);
    }, [value]);

    const handleBlur = () => {
        if (text !== value) {
            onSave(text);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.target.blur(); // Trigger blur to save
        }
    };

    return (
        <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onClick={(e) => e.stopPropagation()}
            className={`bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-100 rounded px-1 transition-all ${className}`}
            placeholder={placeholder}
        />
    );
};

export default AutoSaveInput;
