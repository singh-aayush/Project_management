import { useEffect, useState } from "react";
import api from "../services/api";
import { Search } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("active");

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(Array.isArray(res.data.projects) ? res.data.projects : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    }
  };

  const addProject = async () => {
    if (!title.trim()) return;
    try {
      await api.post("/projects", { title, description });
      setTitle("");
      setDescription("");
      fetchProjects();
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      await api.put(`/projects/${id}`, updates);
      fetchProjects();
      setEditProjectId(null); // Exit edit mode after saving
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "active"
        ? p.status === "active"
        : p.status === "completed";
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-start py-10">
      <div className="min-h-screen w-3/5 bg-white rounded-xl p-[10px]">
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Project Management
        </h1>

        {/* Search bar */}
        <div className="flex justify-center mb-[1rem]">
          <div className="relative w-3/5 md:w-1/3">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-[2px] px-3 py-2 text-[1rem] outline-none"
            />
            <Search className="absolute right-0 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* Add Project */}
        <div className="flex flex-col gap-4 mb-[1.5rem]">
          <div className="flex flex-row md:flex-row gap-[12px]">
            <input
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 h-[1.5rem] border border-gray-300 p-2 rounded-[2px] text-[1rem] outline-none"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 border border-gray-300 p-2 rounded-[2px] text-[1rem] outline-none"
            />
          </div>
          <button
            onClick={addProject}
            className="bg-blue-600 mt-[10px] text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition w-full"
          >
            Create Project
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-[10px] mb-[1rem]">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
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

        {/* Project List */}
        <div className="bg-gray-50 rounded-lg border-0 divide-y divide-gray-200">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((p, index) => {
              const isEditing = editProjectId === p._id;

              return (
                <div
                  key={p._id}
                  className="flex flex-row md:flex-row justify-between items-center p-4 gap-4"
                >
                  {/* Left: Project Info or Edit Form */}
                  <div className="flex flex-row gap-[10px] my-[10px] items-center w-full">
                    <p className="text-xs text-gray-500 mr-[5px]">{index + 1}.</p>
                    {isEditing ? (
                      <div className="flex flex-col w-full mr-[10px]">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="border p-2 mb-2 w-full h-[1.5rem] text-[1rem] rounded-[2px]"
                          placeholder="Project Title"
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="border p-2 mb-2 w-full h-[3rem] text-[.9rem] rounded-[2px]"
                          placeholder="Description"
                        />
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="border p-2 mb-2 w-full h-[1.5rem] text-[1rem] rounded-[2px]"
                        >
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex flex-col w-full mr-[10px]">
                        <h3 className="text-lg font-semibold m-[0px]">{p.title}</h3>
                        <p className="text-sm text-gray-600 my-[5px]">{p.description}</p>
                        <div className="flex items-center gap-[10px]">
                          <span>Status: </span>
                          <select
                            value={p.status}
                            onChange={(e) => updateProject(p._id, { status: e.target.value })}
                            className="border p-1 text-[1rem] rounded-[2px] bg-transparent"
                          >
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                          </select>
                          <span>|</span>
                          <Link
                            to={`/project/${p._id}`}
                            className="inline-block underline bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs hover:bg-blue-200 transition w-fit"
                          >
                            View Tasks
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex gap-[10px]">
                    {isEditing ? (
                      <button
                        onClick={() => updateProject(p._id, { title: editTitle, description: editDescription, status: editStatus })}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600 transition"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditProjectId(p._id);
                          setEditTitle(p.title);
                          setEditDescription(p.description);
                          setEditStatus(p.status);
                        }}
                        className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs hover:bg-yellow-200 transition"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => deleteProject(p._id)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="p-4 text-gray-500 text-center">No projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
}