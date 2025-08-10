import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
}

export default function TaskManager() {
  const { id: projectId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To-do");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");

  const formatDateForBackend = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/tasks`);
      if (Array.isArray(res.data)) {
        setTasks(res.data);
      } else if (Array.isArray(res.data.tasks)) {
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
    if (!title.trim()) return;
    try {
      await api.post(`/projects/${projectId}/tasks`, {
        title,
        description,
        status,
        dueDate: formatDateForBackend(dueDate),
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
      <div className="w-3/5 max-w-5xl bg-black rounded-xl p-[10px]">
        {/* Heading + Back Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Back to Projects
          </Link>
        </div>

        {/* Add Task Form */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-bold mb-3">Add Task</h2>
          <input
            placeholder="Title"
            className="border border-gray-300 p-2 mb-2 w-full rounded-[2px] outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="border border-gray-300 p-2 mb-2 w-full rounded-[2px] outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            className="border border-gray-300 p-2 mb-2 w-full rounded-[2px] outline-none"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="To-do">To-do</option>
            <option value="In-progress">In-progress</option>
            <option value="Done">Done</option>
          </select>
          <input
            type="date"
            className="border border-gray-300 p-2 mb-2 w-full rounded-[2px] outline-none"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition w-full"
          >
            Add Task
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-[10px] mb-[1rem]">
          {["All", "To-do", "In-progress", "Done"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg border text-sm capitalize ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="bg-gray-50 rounded-lg border-0 divide-y divide-gray-200">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((t) => (
              <div
                key={t._id}
                className="flex flex-row justify-between items-center p-4 gap-4"
              >
                {/* Task Info */}
                <div className="flex flex-col w-full mr-[10px]">
                  <h3 className="text-lg font-semibold">{t.title}</h3>
                  <p className="text-sm text-gray-600">{t.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Status: {t.status} | Due: {t.dueDate}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-[10px]">
                  <button
                    onClick={() => updateTask(t._id, { status: "Done" })}
                    className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs hover:bg-yellow-200 transition"
                  >
                    Mark Done
                  </button>
                  <button
                    onClick={() => deleteTask(t._id)}
                    className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-gray-500 text-center">No tasks found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
