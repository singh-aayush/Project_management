import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  dueDate: Date | null; // Updated to handle Date or null
}

export default function ProjectDetails() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To-do");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("To-do");

  const formatDateForDisplay = (date: Date | null | undefined): string => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return ""; // Handle invalid dates
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/tasks`);
      if (Array.isArray(res.data.tasks)) {
        setTasks(res.data.tasks);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    }
  };

  const addTask = async () => {
    try {
      await api.post(`/projects/${projectId}/tasks`, {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : null, // Convert input date to Date object
      });
      setTitle("");
      setDescription("");
      setStatus("To-do");
      setDueDate("");
      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await api.put(`/tasks/${taskId}`, updates);
      fetchTasks();
      setEditTaskId(null); // Exit edit mode after saving
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (window.confirm("Delete this task?")) {
      try {
        await api.delete(`/tasks/${taskId}`);
        fetchTasks();
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter((t) => t.status.toLowerCase() === filter.toLowerCase());

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-start py-10">
      <div className="w-3/5 bg-white rounded-xl p-6 space-y-6">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          ← Back to Dashboard
        </button>

        {/* Add Task Form */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold my-[10px]">Add Task</h2>
          <div className="flex flex-row gap-[5px]">
          <input
            placeholder="Task Name"
            className="border p-2 mb-2 w-full h-[1.5rem] text-[1rem] rounded-[2px]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Task Description"
            className="border p-2 mb-2 w-full h-[3rem] text-[.9rem] rounded-[2px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          </div>
          <div className="flex flex-row gap-[5px] my-[7px]">
          <select
            className="border p-2 mb-2 w-full h-[1.5rem] text-[1rem] rounded-[2px]"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="To-do">To-do</option>
            <option value="In-Progress">In-progress</option>
            <option value="Done">Done</option>
          </select>
          <input
            type="date"
            className="border p-2 mb-2 w-full h-[1.5rem] text-[1rem] rounded-[2px]"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          </div>
          <button
            onClick={addTask}
            className="bg-green-500 text-white px-4 py-[10px] my-[10px] rounded w-full"
          >
            Add Task
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-[5px]">
          {["All", "To-do", "In-Progress", "Done"].map((f) => (
            <button
              key={f}
              className={`px-3 py-1 rounded ${
                filter === f ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setFilter(f.toLowerCase())}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="w-full bg-gray-50 rounded-lg border-0 divide-y divide-gray-200 my-[1rem]">
  {filteredTasks.length > 0 ? (
    filteredTasks.map((t) => {
      const isEditing = editTaskId === t._id;
      const statusColor = t.status === "To-do" ? "text-red-500" : t.status === "In-progress" ? "text-yellow-500" : "text-green-500";
      const dueDateOnly = formatDateForDisplay(t.dueDate); // Use the new formatting function
      const dueColor = "text-blue-500";
      // Find the original index in the unfiltered tasks array to maintain S/No.
      const originalIndex = tasks.findIndex((task) => task._id === t._id);
      const serialNumber = originalIndex + 1; // S/No. starts from 1

      return (
        <div
          key={t._id}
          className="w-full flex flex-row justify-between items-center p-4 gap-4"
        >
          {/* Left: Task Info or Edit Form */}
          <div className="flex flex-row gap-[10px] my-[10px] items-center w-[70%]">
            <p className="text-xs text-gray-500 mr-[5px]">{serialNumber}.</p>
            {isEditing ? (
              <div className="flex flex-col w-full mr-[10px]">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border p-2 mb-2 w-full h-[1.5rem] text-[1rem] rounded-[2px]"
                  placeholder="Task Name"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="border p-2 mb-2 w-full h-[3rem] text-[.9rem] rounded-[2px]"
                  placeholder="Task Description"
                />
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="border p-2 mb-2 w-full h-[1.5rem] text-[1rem] rounded-[2px]"
                >
                  <option value="To-do">To-do</option>
                  <option value="In-progress">In-progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            ) : (
              <div className="flex flex-col w-full mr-[10px]">
                <h3 className="text-lg font-semibold m-[0px]">{t.title}</h3>
                <p className="text-sm text-gray-600 my-[5px]">{t.description}</p>
                <p className="text-xs m-[0px]">
                  <span className={statusColor}>Status: {t.status}</span> | <span className={dueColor}>Due: {dueDateOnly}</span>
                </p>
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex gap-[5px]">
            {isEditing ? (
              <button
                onClick={() => updateTask(t._id, { title: editTitle, description: editDescription, status: editStatus })}
                className="bg-green-500 text-white px-[14px] py-1 rounded-lg text-[14px] hover:bg-green-600 transition"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditTaskId(t._id);
                  setEditTitle(t.title);
                  setEditDescription(t.description);
                  setEditStatus(t.status);
                }}
                className="bg-blue-100 text-blue-700 px-[14px] py-1 rounded-lg text-[14px] hover:bg-blue-200 transition"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => deleteTask(t._id)}
              className="bg-red-100 text-red-700 px-[14px] py-1 rounded-lg text-[14px] hover:bg-red-200 transition"
            >
              Delete
            </button>
          </div>
        </div>
      );
    })
  ) : (
    <p className="p-4 text-gray-500 text-center">No tasks found.</p>
  )}
</div>
      </div>
    </div>
  );
}