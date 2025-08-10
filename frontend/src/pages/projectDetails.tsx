import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
}

export default function ProjectDetails() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const fetchTasks = async () => {
    const res = await api.get(`/projects/${id}/tasks`);
    setTasks(res.data);
  };

  const addTask = async () => {
    await api.post(`/projects/${id}/tasks`, { title, description, dueDate });
    setTitle("");
    setDescription("");
    setDueDate("");
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Project Tasks</h1>

      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl mb-2">Add Task</h2>
        <input
          placeholder="Title"
          className="border p-2 mr-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Description"
          className="border p-2 mr-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 mr-2"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <div>
        {tasks.map((t) => (
          <div key={t._id} className="bg-white p-4 rounded shadow mb-3">
            <h3 className="text-lg font-semibold">{t.title}</h3>
            <p>{t.description}</p>
            <p className="text-sm text-gray-500">
              Status: {t.status} | Due: {new Date(t.dueDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
