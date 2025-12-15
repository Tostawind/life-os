import React, { useState, useEffect, useRef } from "react";
import {
  Target,
  Layers,
  Zap,
  Gift,
  HelpCircle,
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  ArrowRight,
  Inbox,
  Layout,
  Star,
  CornerDownRight,
  Tag,
  Pencil,
  Save,
  X,
  Trash2,
  MoreHorizontal,
  Sun,
  AlertTriangle,
  Settings,
  Calendar,
  PlayCircle,
  PauseCircle,
  Archive,
  GripVertical,
  Filter,
  Download,
  Upload,
  RotateCcw,
  ChevronRight,
} from "lucide-react";

// --- Helper para UX Móvil (Global) ---
const handleInputFocus = (e) => {
  setTimeout(() => {
    e.target.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 300);
};

// --- Componentes UI Genéricos ---
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}
  >
    {children}
  </div>
);

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

// Input que guarda al perder el foco (onBlur)
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

// --- Subcomponentes ---

const ProjectCard = ({
  project,
  tasks,
  goal,
  onUpdateProject,
  onDeleteProject,
  onToggleStatus,
  onAddTask,
  onTaskToggle,
  onTaskClick,
  onTaskFavorite,
  onReorderTasks,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [draggingTaskIndex, setDraggingTaskIndex] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const progress = {
    current: tasks.filter((t) => t.completed).length,
    total: tasks.length,
  };

  const isActive = project.status === "active";
  const nextStep = tasks.find((t) => !t.completed);

  const handleDragStart = (e, index) => {
    setDraggingTaskIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggingTaskIndex === null) return;
    onReorderTasks(draggingTaskIndex, index);
    setDraggingTaskIndex(null);
  };

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm mb-6 last:mb-0 transition-colors ${
        isActive ? "border-slate-200" : "border-slate-100 bg-slate-50/50"
      }`}
    >
      {/* Header Clickable */}
      <div
        className={`p-4 bg-slate-50 border-slate-200 flex justify-between items-start cursor-pointer hover:bg-slate-100/50 transition-colors ${
          isExpanded ? "border-b rounded-t-xl" : "rounded-xl"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 mr-4 min-w-0">
          {/* Project Title Row */}
          <div className="flex items-center gap-2 mb-1">
            {isActive ? (
              <PlayCircle
                className="w-4 h-4 text-emerald-500 shrink-0"
                title="Proyecto Activo"
              />
            ) : (
              <PauseCircle
                className="w-4 h-4 text-slate-400 shrink-0"
                title="Proyecto en Incubadora"
              />
            )}

            <AutoSaveInput
              value={project.title}
              onSave={(val) => onUpdateProject({ title: val })}
              className={`font-bold w-full text-base bg-transparent p-0 border-none truncate ${
                isActive ? "text-slate-700" : "text-slate-500"
              }`}
              placeholder="Nombre del proyecto..."
            />
          </div>

          {/* Goal Chip (Debajo del título) */}
          {goal && (
            <div className="mb-2">
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                <Target className="w-3 h-3 shrink-0" /> {goal.title}
              </span>
            </div>
          )}

          {/* Siguiente Paso (Solo visible si está colapsado) */}
          {!isExpanded && nextStep && isActive && (
            <div className="flex items-center gap-1.5 mb-3 mt-1 text-sm text-indigo-600 pl-6">
              <CornerDownRight className="w-3.5 h-3.5 shrink-0" />
              <span className="font-medium truncate">{nextStep.title}</span>
            </div>
          )}

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full mt-1">
            <ProgressBar
              current={progress.current}
              total={progress.total}
              className="flex-1"
            />
            <span className="text-[10px] text-slate-400 font-mono shrink-0">
              {progress.current}/{progress.total}
            </span>
          </div>
        </div>

        {/* Menu */}
        <div
          className="relative shrink-0"
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-xl z-20 overflow-hidden min-w-[170px] animate-in fade-in zoom-in duration-100">
              <button
                onClick={() => {
                  onToggleStatus();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-50 whitespace-nowrap"
              >
                {isActive ? (
                  <>
                    {" "}
                    <Archive className="w-3.5 h-3.5" /> Mover a Incubadora{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <PlayCircle className="w-3.5 h-3.5" /> Activar Proyecto{" "}
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  onDeleteProject();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" /> Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task List & Form (Collapsible) */}
      {isExpanded && (
        <div
          className={`divide-y divide-slate-100 animate-in slide-in-from-top-2 duration-200 ${
            !isActive ? "opacity-60" : ""
          }`}
        >
          {tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              projects={[]}
              goals={[]}
              onToggle={onTaskToggle}
              onClick={onTaskClick}
              onToggleFavorite={onTaskFavorite}
              showContextTags={false}
              showTodayStatus={true}
              // Drag Props
              isDraggable={true}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              isDragging={draggingTaskIndex === index}
            />
          ))}

          {/* Formulario */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const val = e.target.elements.taskTitle.value.trim();
              if (val) {
                onAddTask(val);
                e.target.reset();
              }
            }}
            className="flex items-center gap-3 p-4 opacity-60 focus-within:opacity-100 transition-opacity hover:bg-slate-50 rounded-b-xl"
          >
            <Plus className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              name="taskTitle"
              placeholder="Añadir tarea al proyecto..."
              className="bg-transparent text-sm focus:outline-none w-full placeholder-slate-400 truncate"
              autoComplete="off"
              onFocus={handleInputFocus}
            />
          </form>
        </div>
      )}
    </div>
  );
};

const StepItem = ({
  step,
  onUpdate,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`flex items-center gap-3 py-2 group ${
        isDragging ? "opacity-50 bg-slate-50" : ""
      }`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <button
        onClick={() => onUpdate({ completed: !step.completed })}
        className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
          step.completed
            ? "bg-indigo-500 border-indigo-500 text-white"
            : "border-slate-300 hover:border-indigo-400"
        }`}
      >
        {step.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
      </button>

      <div className="flex-1 min-w-0">
        <AutoSaveInput
          value={step.title}
          onSave={(val) => onUpdate({ title: val })}
          className={`w-full text-sm truncate ${
            step.completed ? "text-slate-400 line-through" : "text-slate-700"
          }`}
        />
      </div>

      <div className="relative shrink-0" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 text-slate-300 hover:text-slate-600 rounded-md hover:bg-slate-100"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {showMenu && (
          <div className="absolute right-0 top-6 bg-white border border-slate-200 rounded-lg shadow-xl z-20 overflow-hidden min-w-[120px] animate-in fade-in zoom-in duration-100">
            <button
              onClick={() => {
                onDelete();
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
            >
              <Trash2 className="w-3 h-3" /> Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Drag Handle on the Right */}
      <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 shrink-0">
        <GripVertical className="w-4 h-4" />
      </div>
    </div>
  );
};

const TaskItem = ({
  task,
  projects,
  goals,
  onToggle,
  onClick,
  onToggleFavorite,
  showContextTags = true,
  showTodayStatus = false,
  isDraggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
}) => {
  const progress =
    !task.steps || task.steps.length === 0
      ? null
      : {
          current: task.steps.filter((s) => s.completed).length,
          total: task.steps.length,
        };

  const nextStep = task.steps?.find((s) => !s.completed);
  const project = task.projectId
    ? projects.find((p) => p.id === task.projectId)
    : null;
  const goal = project ? goals.find((g) => g.id === project.goalId) : null;

  return (
    <div
      className={`border-b border-slate-100 last:border-0 p-4 transition-colors ${
        task.completed ? "opacity-50 bg-slate-50/50" : "hover:bg-slate-50"
      } ${isDragging ? "opacity-50 bg-slate-100" : ""}`}
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex flex-col gap-2">
        {/* Row 1: Checkbox + Title + Star + Drag */}
        <div className="flex items-start gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(task.id);
            }}
            className={`shrink-0 transition-colors ${
              task.completed
                ? "text-indigo-500"
                : "text-slate-300 hover:text-indigo-500"
            }`}
          >
            {task.completed ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>

          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => onClick(task)}
          >
            <span
              className={`font-medium text-base truncate block ${
                task.completed
                  ? "line-through text-slate-400"
                  : "text-slate-800"
              }`}
            >
              {task.title}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(task.id);
            }}
            className="focus:outline-none transition-transform active:scale-90 p-1 rounded-full hover:bg-slate-100 shrink-0"
          >
            <Star
              className={`w-5 h-5 ${
                task.isFavorite
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300"
              }`}
            />
          </button>

          {isDraggable && (
            <div className="mt-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 shrink-0">
              <GripVertical className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Row 2: Chips (Aligned fully Left) */}
        <div
          className="flex flex-wrap gap-2 items-center cursor-pointer"
          onClick={() => onClick(task)}
        >
          {/* "Hoy" Chip (Hidden in today view by prop control, shown in others) */}
          {showTodayStatus && task.status === "active" && !task.completed && (
            <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded border border-orange-100 font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
              <Sun className="w-3 h-3" /> Hoy
            </span>
          )}

          {/* Context Chips */}
          {showContextTags && project && (
            <>
              {goal && (
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-bold uppercase tracking-wider flex items-center gap-1 max-w-full truncate">
                  <Target className="w-3 h-3 shrink-0" /> {goal.title}
                </span>
              )}
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 font-bold uppercase tracking-wider flex items-center gap-1 max-w-full truncate">
                <Layers className="w-3 h-3 shrink-0" /> {project.title}
              </span>
            </>
          )}
        </div>

        {/* Row 3: Next Step & Progress (Indentados o alineados segun preferencia, aqui los dejo bajo el contenido para no romper el flow) */}
        <div className="pl-9 cursor-pointer" onClick={() => onClick(task)}>
          {" "}
          {/* Indentado para alinear con titulo */}
          {!task.completed && nextStep && (
            <div className="flex items-center gap-1.5 mb-1.5 text-sm text-indigo-600">
              <CornerDownRight className="w-3.5 h-3.5 shrink-0" />
              <span className="font-medium truncate">{nextStep.title}</span>
            </div>
          )}
          {progress && (
            <div className="flex items-center gap-2 w-full">
              <ProgressBar
                current={progress.current}
                total={progress.total}
                className="flex-1"
              />
              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                {progress.current}/{progress.total}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const INITIAL_DATA = {
  categories: ["Profesional", "Salud", "Desarrollo Personal", "Otros"],
  goals: [],
  projects: [],
  tasks: [],
};

export default function LifeOS() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("lifeos_v9_5_data"); // Updated key
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [view, setView] = useState("today");
  const [todayFilter, setTodayFilter] = useState("all");

  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [processingTask, setProcessingTask] = useState(null);

  const [goalModal, setGoalModal] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [pendingImportData, setPendingImportData] = useState(null);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem("lifeos_v9_5_data", JSON.stringify(data));
  }, [data]);

  // --- ACTIONS ---
  const addTask = (title) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      type: "normal",
      status: "inbox",
      steps: [],
      isFavorite: false,
      completed: false,
    };
    setData((prev) => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };
  const updateTask = (id, updates) =>
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  const toggleTask = (id) =>
    updateTask(id, {
      completed: !data.tasks.find((t) => t.id === id).completed,
    });
  const toggleFavorite = (id) => {
    const task = data.tasks.find((t) => t.id === id);
    updateTask(id, { isFavorite: !task.isFavorite });
  };

  const requestDeleteTask = (id) => setTaskToDelete(id);
  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setData((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== taskToDelete),
      }));
      setTaskToDelete(null);
      setSelectedTask(null);
    }
  };

  const addStep = (taskId, title) => {
    const newStep = { id: Date.now().toString(), title, completed: false };
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, steps: [...(t.steps || []), newStep] } : t
      ),
    }));
  };
  const updateStep = (taskId, stepId, updates) =>
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id !== taskId
          ? t
          : {
              ...t,
              steps: t.steps.map((s) =>
                s.id === stepId ? { ...s, ...updates } : s
              ),
            }
      ),
    }));
  const deleteStep = (taskId, stepId) =>
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id !== taskId
          ? t
          : { ...t, steps: t.steps.filter((s) => s.id !== stepId) }
      ),
    }));

  const reorderSteps = (taskId, draggedIndex, targetIndex) => {
    setData((prev) => {
      const task = prev.tasks.find((t) => t.id === taskId);
      if (!task || !task.steps) return prev;
      const newSteps = [...task.steps];
      const [removed] = newSteps.splice(draggedIndex, 1);
      newSteps.splice(targetIndex, 0, removed);
      return {
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === taskId ? { ...t, steps: newSteps } : t
        ),
      };
    });
  };

  const reorderProjectTasks = (projectId, fromIndex, toIndex) => {
    setData((prev) => {
      const allTasks = [...prev.tasks];
      const projectTaskIndices = allTasks
        .map((t, i) =>
          t.projectId === projectId && t.status !== "deleted" ? i : -1
        )
        .filter((i) => i !== -1);

      const projectTasks = projectTaskIndices.map((i) => allTasks[i]);
      const [moved] = projectTasks.splice(fromIndex, 1);
      projectTasks.splice(toIndex, 0, moved);

      projectTaskIndices.forEach((originalIndex, i) => {
        allTasks[originalIndex] = projectTasks[i];
      });

      return { ...prev, tasks: allTasks };
    });
  };

  const addGoal = (title, description, category) => {
    const newGoal = { id: Date.now().toString(), title, description, category };
    setData((prev) => ({ ...prev, goals: [...prev.goals, newGoal] }));
  };
  const updateGoal = (id, updates) =>
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  const addProject = (title, goalId) => {
    const newProject = {
      id: Date.now().toString(),
      title,
      goalId,
      active: true,
      status: "active",
    };
    setData((prev) => ({ ...prev, projects: [...prev.projects, newProject] }));
  };
  const updateProject = (id, updates) =>
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));

  const requestDeleteProject = (id) => setProjectToDelete(id);
  const confirmDeleteProject = () => {
    if (projectToDelete) {
      setData((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== projectToDelete),
        tasks: prev.tasks.filter((t) => t.projectId !== projectToDelete),
      }));
      setProjectToDelete(null);
    }
  };

  const addCategory = (name) => {
    if (name && !data.categories.includes(name))
      setData((prev) => ({ ...prev, categories: [...prev.categories, name] }));
  };
  const updateCategory = (oldName, newName) => {
    if (newName && !data.categories.includes(newName))
      setData((prev) => ({
        ...prev,
        categories: prev.categories.map((c) => (c === oldName ? newName : c)),
        goals: prev.goals.map((g) =>
          g.category === oldName ? { ...g, category: newName } : g
        ),
      }));
  };

  const requestDeleteCategory = (name) => setCategoryToDelete(name);
  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      setData((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c !== categoryToDelete),
        goals: prev.goals.map((g) =>
          g.category === categoryToDelete
            ? { ...g, category: "Sin Categoría" }
            : g
        ),
      }));
      setCategoryToDelete(null);
    }
  };

  const processTaskAction = (taskId, action, payload = {}) => {
    setData((prev) => {
      const updatedTasks = prev.tasks.map((t) => {
        if (t.id !== taskId) return t;
        if (action === "immediate")
          return { ...t, status: "active", type: "normal" };
        if (action === "wish") return { ...t, status: "wish", type: "normal" };
        if (action === "project")
          return {
            ...t,
            status: "pending",
            type: "project",
            projectId: payload.projectId,
          };
        return t;
      });
      return { ...prev, tasks: updatedTasks };
    });
    setProcessingTask(null);
  };

  const getGoalProgress = (goalId) => {
    const goalProjectIds = data.projects
      .filter((p) => p.goalId === goalId)
      .map((p) => p.id);
    const goalTasks = data.tasks.filter(
      (t) =>
        t.projectId &&
        goalProjectIds.includes(t.projectId) &&
        t.status !== "deleted"
    );
    if (goalTasks.length === 0) return { current: 0, total: 0 };
    return {
      current: goalTasks.filter((t) => t.completed).length,
      total: goalTasks.length,
    };
  };

  // --- DATA MANAGEMENT ---
  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lifeos_backup_${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportRequest = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        setPendingImportData(importedData);
      } catch (error) {
        alert("Error al leer archivo.");
      }
    };
    reader.readAsText(file);
  };

  const confirmImport = () => {
    if (pendingImportData) {
      setData(pendingImportData);
      setPendingImportData(null);
      setIsCategoryManagerOpen(false);
    }
  };

  const requestHardReset = () => setShowResetConfirm(true);
  const confirmHardReset = () => {
    setData(INITIAL_DATA);
    setShowResetConfirm(false);
    setIsCategoryManagerOpen(false);
  };

  // --- FILTER HELPER ---
  const getFilteredTasks = () => {
    let tasks = data.tasks.filter((t) => t.status === "active");
    if (todayFilter === "favorites") tasks = tasks.filter((t) => t.isFavorite);
    if (todayFilter === "project") tasks = tasks.filter((t) => t.projectId);
    if (todayFilter === "normal") tasks = tasks.filter((t) => !t.projectId);
    return tasks;
  };

  // --- MODALS DE TAREA ---

  const TaskDetailsModal = () => {
    if (!selectedTask) return null;
    const task = data.tasks.find((t) => t.id === selectedTask.id);
    if (!task) return null;
    const [draggingStepIndex, setDraggingStepIndex] = useState(null);

    const progress =
      !task.steps || task.steps.length === 0
        ? null
        : {
            current: task.steps.filter((s) => s.completed).length,
            total: task.steps.length,
          };

    // UX Helper for Focus inside Modal
    const handleInputFocus = (e) => {
      setTimeout(() => {
        e.target.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    };

    const handleDragStart = (e, index) => {
      setDraggingStepIndex(index);
      e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, index) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, index) => {
      e.preventDefault();
      if (draggingStepIndex === null) return;
      reorderSteps(task.id, draggingStepIndex, index);
      setDraggingStepIndex(null);
    };

    const renderActionButton = () => {
      if (task.projectId) {
        return (
          <button
            onClick={() =>
              updateTask(task.id, {
                status: task.status === "active" ? "pending" : "active",
              })
            }
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
              task.status === "active"
                ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {task.status === "active" ? (
              <>
                {" "}
                <Sun className="w-5 h-5 fill-indigo-600" /> Quitar de "Mi Día"{" "}
              </>
            ) : (
              <>
                {" "}
                <Sun className="w-5 h-5" /> Añadir a "Mi Día"{" "}
              </>
            )}
          </button>
        );
      }
      if (task.status === "wish") {
        return (
          <button
            onClick={() => updateTask(task.id, { status: "active" })}
            className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Sun className="w-5 h-5" /> Activar Tarea
          </button>
        );
      }
      return (
        <button
          onClick={() =>
            updateTask(task.id, {
              status: task.status === "active" ? "inbox" : "active",
            })
          }
          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
            task.status === "active"
              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {task.status === "active" ? (
            <>
              {" "}
              <Inbox className="w-5 h-5" /> Mover al Baúl{" "}
            </>
          ) : (
            <>
              {" "}
              <Sun className="w-5 h-5" /> Activar Tarea{" "}
            </>
          )}
        </button>
      );
    };

    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90dvh] animate-in zoom-in duration-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
            <div className="flex-1 mr-4 flex items-center gap-3 min-w-0">
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  task.completed
                    ? "bg-indigo-500 border-indigo-500 text-white"
                    : "border-slate-300 hover:border-indigo-400"
                }`}
              >
                {task.completed && <CheckCircle2 className="w-4 h-4" />}
              </button>
              <AutoSaveInput
                value={task.title}
                onSave={(val) => updateTask(task.id, { title: val })}
                className={`text-xl font-bold w-full bg-transparent p-0 border-none focus:ring-0 placeholder-slate-400 truncate ${
                  task.completed
                    ? "text-slate-400 line-through"
                    : "text-slate-800"
                }`}
                placeholder="Título de la tarea..."
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleFavorite(task.id)}
                className="focus:outline-none transition-transform active:scale-90"
              >
                <Star
                  className={`w-6 h-6 ${
                    task.isFavorite
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              </button>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="p-6 overflow-y-auto pb-40">
            {progress && (
              <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                  <span>Progreso</span>
                  <span>
                    {progress.current}/{progress.total}
                  </span>
                </div>
                <ProgressBar
                  current={progress.current}
                  total={progress.total}
                />
              </div>
            )}
            <div className="space-y-1 mb-6">
              {task.steps &&
                task.steps.map((step, index) => (
                  <StepItem
                    key={step.id}
                    step={step}
                    onUpdate={(updates) =>
                      updateStep(task.id, step.id, updates)
                    }
                    onDelete={() => deleteStep(task.id, step.id)}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    isDragging={draggingStepIndex === index}
                  />
                ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const val = e.target.elements.stepTitle.value.trim();
                  if (val) {
                    addStep(task.id, val);
                    e.target.reset();
                  }
                }}
                className="flex items-center gap-3 py-2 mt-2 opacity-60 focus-within:opacity-100 transition-opacity"
              >
                <Plus className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  onFocus={handleInputFocus}
                  name="stepTitle"
                  placeholder="Añadir paso siguiente..."
                  className="bg-transparent text-sm focus:outline-none w-full placeholder-slate-400 border-b border-transparent focus:border-indigo-200 pb-1"
                />
              </form>
            </div>
            <div className="space-y-3 pt-4 border-t border-slate-100">
              {renderActionButton()}
              <button
                onClick={() => requestDeleteTask(task.id)}
                className="w-full py-3 rounded-xl font-bold text-rose-600 hover:bg-rose-50 flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-5 h-5" /> Eliminar Tarea
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const InboxBanner = () => {
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
          onClick={() => {
            setProcessingTask(null);
            setIsProcessModalOpen(true);
          }}
          className="bg-white text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors"
        >
          Procesar
        </button>
      </div>
    );
  };

  const DeleteProjectConfirmationModal = () => {
    if (!projectToDelete) return null;
    return (
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
                onClick={() => setProjectToDelete(null)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteProject}
                className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 shadow-lg shadow-rose-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // --- Delete Category Modal ---
  const DeleteCategoryConfirmationModal = () => {
    if (!categoryToDelete) return null;
    return (
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
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteCategory}
                className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 shadow-lg shadow-rose-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const DeleteConfirmationModal = () => {
    if (!taskToDelete) return null;
    return (
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
                onClick={() => setTaskToDelete(null)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteTask}
                className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 shadow-lg shadow-rose-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const ResetConfirmModal = () => {
    if (!showResetConfirm) return null;
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-6 animate-in zoom-in duration-200">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Hard Reset
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Se borrarán TODOS los datos. ¿Seguro?
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmHardReset}
                className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 shadow-lg shadow-rose-200"
              >
                Borrar Todo
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const ImportConfirmModal = () => {
    if (!pendingImportData) return null;
    return (
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
                onClick={() => setPendingImportData(null)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmImport}
                className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200"
              >
                Importar
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const ProcessModal = () => {
    if (!isProcessModalOpen) return null;
    const projectsByGoal = data.goals
      .map((g) => ({
        goal: g,
        projects: data.projects.filter((p) => p.goalId === g.id),
      }))
      .filter((group) => group.projects.length > 0);
    const inboxTasks = data.tasks.filter((t) => t.status === "inbox");
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-6 animate-in zoom-in duration-200 flex flex-col max-h-[85vh]">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Inbox className="w-5 h-5 text-indigo-600" />
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
                  {inboxTasks.length}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Baúl</h3>
            </div>
            <button
              onClick={() => {
                setIsProcessModalOpen(false);
                setProcessingTask(null);
              }}
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          {!processingTask ? (
            <>
              {inboxTasks.length === 0 ? (
                <div className="py-10 text-center text-slate-400">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>Baúl vacío.</p>
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto pr-1 pb-20">
                  {inboxTasks.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setProcessingTask(t)}
                      className="w-full text-left p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-100 rounded-lg group transition-colors flex justify-between items-center"
                    >
                      <span className="font-medium text-slate-700">
                        {t.title}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="mb-6 bg-slate-50 p-5 rounded-xl border border-slate-200 text-center shrink-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Procesando
                </p>
                <p className="text-slate-800 text-lg font-medium leading-tight">
                  "{processingTask.title}"
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-1">
                <button
                  onClick={() =>
                    processTaskAction(processingTask.id, "immediate")
                  }
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group text-left shrink-0"
                >
                  <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-700">
                      Tarea Inmediata
                    </span>
                    <span className="text-xs text-slate-500">Hoy.</span>
                  </div>
                </button>
                <button
                  onClick={() => processTaskAction(processingTask.id, "wish")}
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition-all group text-left shrink-0"
                >
                  <div className="bg-amber-100 text-amber-600 p-2 rounded-lg">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-700">
                      Deseo
                    </span>
                    <span className="text-xs text-slate-500">Algún día.</span>
                  </div>
                </button>
                <div className="space-y-2 mt-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 sticky top-0 bg-white z-10 py-1">
                    Mover a Proyecto
                  </p>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    {projectsByGoal.map((group) => (
                      <div key={group.goal.id}>
                        <div className="bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                          {group.goal.title}
                        </div>
                        <div className="divide-y divide-slate-100 border-b border-slate-200 last:border-0">
                          {group.projects.map((p) => (
                            <button
                              key={p.id}
                              onClick={() =>
                                processTaskAction(
                                  processingTask.id,
                                  "project",
                                  { projectId: p.id }
                                )
                              }
                              className="w-full text-left p-3 hover:bg-slate-50 text-sm flex items-center justify-between group bg-white"
                            >
                              <span className="text-slate-700 font-medium pl-2">
                                {p.title}
                              </span>
                              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setProcessingTask(null)}
                className="mt-4 w-full py-2 text-slate-400 text-sm hover:text-slate-600 shrink-0"
              >
                Volver
              </button>
            </div>
          )}
        </Card>
      </div>
    );
  };

  const CategoryManagerModal = () => {
    if (!isCategoryManagerOpen) return null;
    const [newCat, setNewCat] = useState("");
    const [editingCat, setEditingCat] = useState(null);
    const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

    // UX Helper for Focus inside Modal
    const handleInputFocus = (e) => {
      setTimeout(() => {
        e.target.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    };

    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-6 animate-in zoom-in duration-200 max-h-[90dvh] flex flex-col">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h3 className="text-lg font-bold text-slate-800">Configuración</h3>
            <button onClick={() => setIsCategoryManagerOpen(false)}>
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
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                Datos y Seguridad
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  onClick={handleExport}
                  className="flex flex-col items-center justify-center gap-1 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
                >
                  <Download className="w-5 h-5 mb-1" />
                  <span className="text-xs font-bold">Exportar Copia</span>
                </button>
                <label className="flex flex-col items-center justify-center gap-1 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-xs font-bold">Restaurar Copia</span>
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
                <AlertTriangle className="w-4 h-4" /> Hard Reset (Borrar Todo)
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const AddGoalModal = () => {
    if (!isAddGoalModalOpen) return null;
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 animate-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Nueva Meta</h3>
            <button onClick={() => setIsAddGoalModalOpen(false)}>
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const { title, desc, cat } = e.target.elements;
              if (title.value.trim()) {
                addGoal(
                  title.value.trim(),
                  desc.value.trim(),
                  cat.value.trim()
                );
                setIsAddGoalModalOpen(false);
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
                    onClick={() => setIsCategoryManagerOpen(true)}
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-32 md:pb-12">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-3 shadow-sm">
        <div className="max-w-xl mx-auto flex gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const val = e.target.elements.title.value.trim();
              if (val) {
                addTask(val);
                e.target.reset();
              }
            }}
            className="flex-1 relative"
          >
            <input
              onFocus={handleInputFocus}
              name="title"
              type="text"
              placeholder="¿Qué tienes en mente?"
              className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400 focus:outline-none"
              autoComplete="off"
            />
            <Inbox className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
          </form>
          <button
            onClick={() => setIsCategoryManagerOpen(true)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      <main className="max-w-xl mx-auto px-4 py-6">
        <InboxBanner />

        {view === "today" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col gap-2 mb-2">
              {" "}
              {/* Minimal gap */}
              <header className="flex items-baseline justify-between gap-2">
                <h2 className="text-2xl font-bold text-slate-900">Hoy</h2>
                <span className="text-slate-400 text-sm">
                  {
                    data.tasks.filter(
                      (t) => t.status === "active" && !t.completed
                    ).length
                  }{" "}
                  activas
                </span>
              </header>
              {/* Filtros - Aligned Right */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full justify-end">
                {[
                  { id: "all", label: "Todo" },
                  {
                    id: "favorites",
                    label: "Favoritas",
                    icon: <Star className="w-3 h-3" />,
                  },
                  {
                    id: "project",
                    label: "Proyectos",
                    icon: <Layers className="w-3 h-3" />,
                  },
                  {
                    id: "normal",
                    label: "Simples",
                    icon: <CheckCircle2 className="w-3 h-3" />,
                  },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setTodayFilter(f.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                      todayFilter === f.id
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {f.icon} {f.label}
                  </button>
                ))}
              </div>
            </div>

            <Card className="overflow-hidden divide-y divide-slate-100">
              {getFilteredTasks()
                .sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite))
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    projects={data.projects}
                    goals={data.goals}
                    onToggle={toggleTask}
                    onClick={(t) => setSelectedTask(t)}
                    onToggleFavorite={toggleFavorite}
                    showTodayStatus={false}
                  />
                ))}
              {getFilteredTasks().length === 0 && (
                <div className="p-8 text-center text-slate-400">
                  <Filter className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p>No hay tareas con este filtro.</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {view === "projects" && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Proyectos Activos
            </h2>
            {/* Filter projects */}
            {data.projects
              .filter((p) => p.status === "active")
              .map((p) => {
                const pGoal = data.goals.find((g) => g.id === p.goalId);
                const projectTasks = data.tasks.filter(
                  (t) => t.projectId === p.id && t.status !== "deleted"
                );
                const sortedTasks = [
                  ...projectTasks.filter((t) => !t.completed),
                  ...projectTasks.filter((t) => t.completed),
                ];

                return (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    goal={pGoal}
                    tasks={sortedTasks}
                    onUpdateProject={(updates) => updateProject(p.id, updates)}
                    onDeleteProject={() => requestDeleteProject(p.id)} // Fixed: Using requestDeleteProject
                    onToggleStatus={() =>
                      updateProject(p.id, {
                        status: p.status === "active" ? "incubator" : "active",
                      })
                    }
                    onAddTask={(title) => {
                      const newTask = {
                        id: Date.now().toString(),
                        title,
                        type: "project",
                        projectId: p.id,
                        status: "pending",
                        completed: false,
                        steps: [],
                        isFavorite: false,
                      };
                      setData((prev) => ({
                        ...prev,
                        tasks: [...prev.tasks, newTask],
                      }));
                    }}
                    onTaskToggle={toggleTask}
                    onTaskClick={(t) => setSelectedTask(t)}
                    onTaskFavorite={toggleFavorite}
                    onReorderTasks={(from, to) =>
                      reorderProjectTasks(p.id, from, to)
                    }
                  />
                );
              })}

            {data.projects.filter((p) => p.status === "active").length ===
              0 && (
              <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                <p>No hay proyectos activos.</p>
                <p className="text-xs mt-1">
                  Activa proyectos desde tus Metas.
                </p>
              </div>
            )}
          </div>
        )}

        {view === "goals" && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Metas</h2>
            {data.goals.map((g) => {
              const progress = getGoalProgress(g.id);
              return (
                <Card
                  key={g.id}
                  className="p-6 cursor-pointer hover:border-indigo-300 relative"
                >
                  <div onClick={() => setGoalModal(g.id)}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-800 pr-4">
                        {g.title}
                      </h3>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {g.category && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded-full border border-slate-200">
                            {g.category}
                          </span>
                        )}
                        {g.status === "incubator" && (
                          <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-1 rounded-full font-bold uppercase tracking-wide flex items-center gap-1">
                            <PauseCircle className="w-3 h-3" /> Incubadora
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                      {g.description}
                    </p>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-400 ml-auto">
                        {progress.current}/{progress.total} tareas
                      </span>
                    </div>
                    <ProgressBar
                      current={progress.current}
                      total={progress.total}
                    />
                  </div>
                </Card>
              );
            })}
            <button
              onClick={() => setIsAddGoalModalOpen(true)}
              className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-bold hover:border-indigo-400 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100"
            >
              <Plus className="w-5 h-5" /> Nueva Meta
            </button>
          </div>
        )}

        {view === "wishes" && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Deseos</h2>
            <Card className="divide-y divide-slate-100">
              {data.tasks
                .filter((t) => t.status === "wish")
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    projects={data.projects}
                    goals={data.goals}
                    onToggle={toggleTask}
                    onClick={(t) => setSelectedTask(t)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              {data.tasks.filter((t) => t.status === "wish").length === 0 && (
                <div className="p-8 text-center text-slate-400">
                  <p>Sin deseos.</p>
                </div>
              )}
            </Card>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 z-40">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <button
            onClick={() => setView("today")}
            className={`flex flex-col items-center gap-1 ${
              view === "today" ? "text-indigo-600" : "text-slate-400"
            }`}
          >
            <Layout className="w-6 h-6" />
            <span className="text-[10px] font-bold">Hoy</span>
          </button>
          <button
            onClick={() => setView("projects")}
            className={`flex flex-col items-center gap-1 ${
              view === "projects" ? "text-indigo-600" : "text-slate-400"
            }`}
          >
            <Layers className="w-6 h-6" />
            <span className="text-[10px] font-bold">Proyectos</span>
          </button>
          <div
            className="-mt-8 bg-indigo-600 rounded-full p-4 shadow-lg shadow-indigo-300 border-4 border-slate-50 cursor-pointer"
            onClick={() =>
              document.querySelector('input[name="title"]').focus()
            }
          >
            <Plus className="w-6 h-6 text-white" />
          </div>
          <button
            onClick={() => setView("goals")}
            className={`flex flex-col items-center gap-1 ${
              view === "goals" ? "text-indigo-600" : "text-slate-400"
            }`}
          >
            <Target className="w-6 h-6" />
            <span className="text-[10px] font-bold">Metas</span>
          </button>
          <button
            onClick={() => setView("wishes")}
            className={`flex flex-col items-center gap-1 ${
              view === "wishes" ? "text-indigo-600" : "text-slate-400"
            }`}
          >
            <Gift className="w-6 h-6" />
            <span className="text-[10px] font-bold">Deseos</span>
          </button>
        </div>
      </nav>

      {isProcessModalOpen && <ProcessModal />}
      {selectedTask && <TaskDetailsModal />}
      {goalModal && <GoalDetailsModal />}
      {isAddGoalModalOpen && <AddGoalModal />}
      {taskToDelete && <DeleteConfirmationModal />}
      {projectToDelete && <DeleteProjectConfirmationModal />}
      {isCategoryManagerOpen && <CategoryManagerModal />}
      {showResetConfirm && <ResetConfirmModal />}
      {pendingImportData && <ImportConfirmModal />}
      {categoryToDelete && <DeleteCategoryConfirmationModal />}
    </div>
  );
}
