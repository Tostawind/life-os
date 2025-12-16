import { useState, useEffect } from "react";

const INITIAL_DATA = {
    categories: ["Profesional", "Salud", "Desarrollo Personal", "Otros"],
    goals: [],
    projects: [],
    tasks: [],
};

export function useLifeOS() {
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem("lifeos_v9_6_data");
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
    const [isSystemExplanationOpen, setIsSystemExplanationOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("lifeos_v9_6_data", JSON.stringify(data));
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
            active: false,
            status: "incubator",
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

    const getFilteredTasks = () => {
        let tasks = data.tasks.filter((t) => t.status === "active");
        if (todayFilter === "favorites") tasks = tasks.filter((t) => t.isFavorite);
        if (todayFilter === "project") tasks = tasks.filter((t) => t.projectId);
        if (todayFilter === "normal") tasks = tasks.filter((t) => !t.projectId);
        return tasks;
    };

    return {
        data,
        setData, // Exposed for direct manipulation if needed, but try to use actions
        view,
        setView,
        todayFilter,
        setTodayFilter,
        isProcessModalOpen,
        setIsProcessModalOpen,
        processingTask,
        setProcessingTask,
        goalModal,
        setGoalModal,
        selectedTask,
        setSelectedTask,
        isAddGoalModalOpen,
        setIsAddGoalModalOpen,
        taskToDelete,
        setTaskToDelete,
        projectToDelete,
        setProjectToDelete,
        showResetConfirm,
        setShowResetConfirm,
        pendingImportData,
        setPendingImportData,
        isCategoryManagerOpen,
        setIsCategoryManagerOpen,
        categoryToDelete,
        setCategoryToDelete,
        isSystemExplanationOpen,
        setIsSystemExplanationOpen,
        actions: {
            addTask,
            updateTask,
            toggleTask,
            toggleFavorite,
            requestDeleteTask,
            confirmDeleteTask,
            addStep,
            updateStep,
            deleteStep,
            reorderSteps,
            reorderProjectTasks,
            addGoal,
            updateGoal,
            addProject,
            updateProject,
            requestDeleteProject,
            confirmDeleteProject,
            addCategory,
            updateCategory,
            requestDeleteCategory,
            confirmDeleteCategory,
            processTaskAction,
            getGoalProgress,
            handleExport,
            confirmImport,
            requestHardReset,
            confirmHardReset,
            getFilteredTasks,
        },
    };
}
