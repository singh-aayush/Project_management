import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchProjects = async () => {
    const res = await api.get("/projects");
    setProjects(res.data);
  };

  const addProject = async () => {
    await api.post("/projects", { title, description });
    setTitle("");
    setDescription("");
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Projects</h1>

      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl mb-2">Add Project</h2>
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
        <button
          onClick={addProject}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{p.title}</h3>
            <p>{p.description}</p>
            <span className="text-sm text-gray-500">{p.status}</span>
            <Link
              to={`/project/${p._id}`}
              className="text-blue-500 block mt-2"
            >
              View Tasks →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
