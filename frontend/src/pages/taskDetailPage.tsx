import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import '../taskDetails.css';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  dueDate: Date | null;
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

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const formatDateForDisplay = (date: Date | null | undefined): string => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchTasks = async () => {
    try {
      const params: any = { page };
      if (filter !== "all") {
        const mapStatus: Record<string, string> = {
          "to-do": "To-do",
          "in-progress": "In-Progress",
          "done": "Done",
        };
        params.status = mapStatus[filter] || filter;
      }

      const res = await api.get(`/projects/${projectId}/tasks`, { params });

      if (Array.isArray(res.data.tasks)) {
        setTasks(res.data.tasks);
      } else {
        setTasks([]);
      }

      if (res.data.pagination) {
        setTotalPages(res.data.pagination.pages || 1);
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
      setTotalPages(1);
    }
  };

  const addTask = async () => {
    try {
      const due = dueDate ? new Date(dueDate) : new Date();

      await api.post(`/projects/${projectId}/tasks`, {
        title,
        description,
        status,
        dueDate: due,
      });

      setTitle("");
      setDescription("");
      setStatus("To-do");
      setDueDate("");
      setPage(1);
      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await api.put(`/tasks/${taskId}`, updates);
      fetchTasks();
      setEditTaskId(null);
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

  useEffect(() => {
    fetchTasks();
  }, [projectId, filter, page]);

  return (
    <div className="container flex justify-center items-start w-full">
      <div className="inner-container w-[90%] rounded-xl min-h-screen p-[10px]">
        {/* Heading and Back Button */}
        <div className="flex justify-between items-center mb-4 heading">
          <h1 className="header-title font-bold text-white text-2xl m-0">Add Tasks</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="back-button bg-gray-500 hover:bg-gray-600 text-white text-sm px-[7px] py-[5px] rounded-md cursor-pointer transition-colors duration-300"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Add Task Form */}
        <div className="add-task-form flex flex-col gap-[5px] mb-6 pt-[1rem] rounded-md shadow-sm">
          <div className="add-task-input-row flex flex-col gap-[5px] md:flex-row md:gap-2">
            <input
              placeholder="Task Name"
              className="add-task-input border border-gray-300 rounded-sm outline-none text-[14px] h-[1.2rem] px-[5px]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Task Description"
              className="add-task-textarea border border-gray-300 rounded-sm outline-none text-[14px] h-[1.2rem] px-[5px] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="add-task-input-row flex flex-col gap-[5px] md:flex-row md:gap-2">
            <select
              className="add-task-select border border-gray-300 rounded-sm text-[14px] h-[1.2rem] px-[5px] outline-none text-base"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="To-do">To-do</option>
              <option value="In-Progress">In-progress</option>
              <option value="Done">Done</option>
            </select>
            <input
              type="date"
              className="add-task-input border border-gray-300 rounded-sm outline-none text-base text-[14px] h-[1.2rem] px-[5px]"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <button
            onClick={addTask}
            className="add-task-button bg-black hover:bg-black text-white rounded-md cursor-pointer transition-colors duration-300 w-full md:w-auto px-4 py-2 my-[10px] text-sm"
          >
            Add Task
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons flex gap-[5px] flex-wrap mb-4 md:flex-nowrap">
          {["All", "To-do", "In-Progress", "Done"].map((f) => (
            <button
              key={f}
              className={`filter-button px-3 py-2 rounded-md text-sm cursor-pointer transition-colors duration-300
                ${
                  filter === f.toLowerCase()
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              onClick={() => {
                setFilter(f.toLowerCase());
                setPage(1);
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="task-list bg-gray-50 rounded-md border-0 divide-y divide-gray-200">
          {tasks.length > 0 ? (
            tasks.map((t, idx) => {
              const isEditing = editTaskId === t._id;
              const dueDateOnly = formatDateForDisplay(t.dueDate);
              const serialNumber = (page - 1) * 7 + idx + 1;

              return (
                <div
                  key={t._id}
                  className="task-item flex flex-col md:flex-row justify-between gap-[5px] md:gap-4 items-start md:items-center"
                >
                  {/* Left: Task Info or Edit Form */}
                  <div className="task-info flex flex-row items-center gap-[5px] mt-[14px] w-full md:w-auto">
                    <p className="task-serial text-gray-500 mr-[5px] text-xs">{serialNumber}.</p>
                    {isEditing ? (
                      <div className="task-edit-form flex flex-col gap-[5px] w-full md:w-auto">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="task-edit-input border border-gray-300 rounded-sm outline-none text-base px-[5px] h-[1rem] text-[12px]"
                          placeholder="Task Name"
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="task-edit-textarea border border-gray-300 rounded-sm outline-none text-sm px-[5px] h-[1.6rem] text-[14px] resize-none"
                          placeholder="Task Description"
                        />
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="task-edit-select border border-gray-300 rounded-sm outline-none text-base"
                        >
                          <option value="To-do">To-do</option>
                          <option value="In-Progress">In-progress</option>
                          <option value="Done">Done</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <h3 className="task-title text-lg font-semibold text-gray-900">{t.title}</h3>
                        <p className="task-description text-sm text-gray-700 my-1">{t.description}</p>
                        <p className="task-status text-xs">
                          <span
                            className={`task-status ${t.status
                              .toLowerCase()
                              .replace(" ", "-")} ${
                              t.status.toLowerCase() === "to-do"
                                ? "text-red-500"
                                : t.status.toLowerCase() === "in-progress"
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}
                          >
                            Status: {t.status}
                          </span>{" "}
                          |{" "}
                          <span className="task-due text-blue-500">
                            Due: {dueDateOnly}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="task-buttons flex flex-row w-full justify-evenly mb-[10px] mt-[5px] gap-2 md:gap-4">
                    {isEditing ? (
                      <button
                        onClick={() =>
                          updateTask(t._id, {
                            title: editTitle,
                            description: editDescription,
                            status: editStatus,
                          })
                        }
                        className="task-save-button bg-green-500 hover:bg-green-600 text-white rounded-md px-3 py-1 text-sm cursor-pointer transition-colors duration-300"
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
                        className="task-edit-button bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md px-3 py-1 text-sm cursor-pointer transition-colors duration-300"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(t._id)}
                      className="task-delete-button bg-red-100 hover:bg-red-200 text-red-700 rounded-md px-3 py-1 text-sm cursor-pointer transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="task-empty text-gray-600 text-center">No tasks found.</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="pagination flex justify-center items-center gap-4 mt-4 mb-2 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`pagination-btn border border-gray-300 px-4 py-2 rounded-md text-xs cursor-pointer transition-colors duration-300 ${
              page === 1 ? "bg-gray-300 opacity-50 cursor-not-allowed" : "bg-blue-500 text-white"
            }`}
          >
            Prev
          </button>
          <span className="pagination-text text-sm text-gray-800">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`pagination-btn border border-gray-300 px-4 py-2 rounded-md text-xs cursor-pointer transition-colors duration-300 ${
              page === totalPages ? "bg-gray-300 opacity-50 cursor-not-allowed" : "bg-blue-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
