import React, { useState, useEffect, useRef } from "react";

// --- Helper para UX Móvil (Global) ---
const handleInputFocus = (e) => {
    setTimeout(() => {
        e.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
};

const AutoSaveInput = ({ value, onSave, className = "", placeholder = "" }) => {
    const [text, setText] = useState(value);
    const textareaRef = useRef(null);

    useEffect(() => {
        setText(value);
    }, [value]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [text]);

    const handleBlur = () => {
        if (text !== value) {
            onSave(text);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { // Allow Shift+Enter for new lines, Enter to save
            e.preventDefault();
            e.target.blur();
        }
    };

    return (
        <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onClick={(e) => e.stopPropagation()}
            className={`bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-100 rounded px-1 transition-all resize-none overflow-hidden block ${className}`}
            placeholder={placeholder}
        />
    );
};

export default AutoSaveInput;
