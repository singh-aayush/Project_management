import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import '../Dashboard.css'

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt?: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Search state
  const [searchInput, setSearchInput] = useState(""); // user typing
  const [search, setSearch] = useState(""); // actual applied search

  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("Active");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 7;

  const fetchProjects = useCallback(
    async (p = page, s = search) => {
      try {
        const res = await api.get("/projects", {
          params: { page: p, search: s },
        });

        const data = res.data;
        setProjects(Array.isArray(data.projects) ? data.projects : []);
        setTotal(data.pagination?.total ?? 0);
        setTotalPages(data.pagination?.pages ?? 1);
        setPage(data.pagination?.page ?? p);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
        setTotal(0);
        setTotalPages(1);
      }
    },
    [page, search]
  );

  useEffect(() => {
    fetchProjects(page, search);
  }, [page, search, fetchProjects]);

  const addProject = async () => {
    if (!title.trim()) return;
    try {
      const res = await api.post("/projects", { title, description });
      const pagination = res.data.pagination;
      const newTotal = pagination?.total ?? total + 1;
      const newPages = pagination?.pages ?? Math.ceil(newTotal / limit);

      setTitle("");
      setDescription("");

      setTotal(newTotal);
      setTotalPages(newPages);
      setPage(newPages);
      fetchProjects(newPages, search);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      await api.put(`/projects/${id}`, updates);
      fetchProjects(page, search);
      setEditProjectId(null);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const res = await api.delete(`/projects/${id}`);
      const pagination = res.data.pagination;
      const newTotal = pagination?.total ?? Math.max(0, total - 1);
      const newPages =
        pagination?.pages ?? Math.max(1, Math.ceil(newTotal / limit));

      if (page > newPages) {
        setPage(newPages);
      } else {
        fetchProjects(page, search);
      }

      setTotal(newTotal);
      setTotalPages(newPages);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Logout handler
  const handleLogout = () => {
    // Clear any auth tokens or data here, adjust as needed
    localStorage.clear();
    window.location.href = "/login"; // Redirect to login page or home
  };

  return (
  <div className="min-h-screen  flex justify-center items-start py-10 container-project">
    <div className="min-h-screen rounded-xl p-[10px] inner-container-project">
      {/* Header */}
      <div className="flex justify-between items-center mb-[1.5rem] heading-project">
        <h1 className=" font-bold text-white header-title">Project Management</h1>
        <button
          onClick={handleLogout}
          className="text-white px-[14px] py-[5px] rounded transition"
        >
          Logout
        </button>
      </div>

      {/* Search */}
      <div className="flex w-full justify-center mb-[1rem] items-center gap-[0px] search-wrapper">
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border border-gray-300 h-[1.5rem] px-[7px] rounded-[2px] text-[14px] outline-none search-input"
          />
        </div>
        <button
          onClick={() => {
            setSearch(searchInput);
            setPage(1);
          }}
          className="relative right-[-16px] h-[2rem] flex justify-center items-center ml-[5px] bg-black-600 text-white px-4 py-2 rounded-[2px] transition search-button"
        >
          Search
        </button>
      </div>

      {/* Add Project */}
      <div className="flex flex-col gap-[10px] mb-[.5rem] add-project-form">
        <div className="flex gap-[5px] add-project-input-row">
          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 h-[1.2rem] border border-gray-300 p-[7px] rounded-[2px] mb-[5px] text-[14px] outline-none add-project-input"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 border border-gray-300 p-[7px] rounded-[2px] h-[1.2rem] mb-[5px] text-[14px] outline-none add-project-input"
          />
        </div>
        <button
          onClick={addProject}
          className="bg-blue-600 mt-[5px] text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition w-full add-project-button"
        >
          Create Project
        </button>
      </div>

      {/* Project List */}
      <div className="bg-gray-50 rounded-lg border-0 divide-y divide-gray-200 project-list">
        {projects.length > 0 ? (
          projects.map((p) => {
            const isEditing = editProjectId === p._id;
            return (
              <div
                key={p._id}
                className="flex justify-between items-center p-[0px] gap-4 project-item"
              >
                <div className="flex flex-row gap-[10px] my-[5px] items-center w-full project-info">
                  {/* ...keep your existing JSX here */}
                  {/* Make sure you add these classes inside edit inputs: */}
                  {isEditing ? (
                    <div className="flex flex-col w-full mr-[10px]">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="border mb-[5px] p-[5px] mb-2 w-[95%] h-[1.5rem] text-[1rem] rounded-[2px] project-edit-input"
                        placeholder="Project Title"
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="border p-[5px] mb-[5px] w-[95%] h-[3rem] text-[.9rem] rounded-[2px] project-edit-textarea"
                        placeholder="Description"
                      />
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="border p-[5px] mb-[5px] w-[95%] h-[2rem] text-[1rem] rounded-[2px] bg-white text-black project-edit-select"
                      >
                        <option className="bg-white text-black" value="Active">Active</option>
                        <option className="bg-white text-black" value="Completed">Completed</option>
                      </select>
                    </div>
                  ) : (
                    // Keep as is for display mode
                    <div className="flex flex-col w-full mr-[0px]">
                      <h3 className="text-lg font-semibold m-[0px]">{p.title}</h3>
                      <p className="text-sm text-gray-600 my-[5px]">{p.description}</p>
                      <div className="flex items-center gap-[5px]">
                        <span>Status: </span>
                        <select
                          value={p.status}
                          onChange={(e) => updateProject(p._id, { status: e.target.value })}
                          className="border p-1 text-[1rem] rounded-[2px] bg-white text-black"
                        >
                          <option className="bg-black text-white" value="Active">Active</option>
                          <option className="bg-black text-white" value="Completed">Completed</option>
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

                <div className="flex gap-[10px] project-buttons">
                  {isEditing ? (
                    <button
                      onClick={() =>
                        updateProject(p._id, {
                          title: editTitle,
                          description: editDescription,
                          status: editStatus,
                        })
                      }
                      className=" text-white px-3 py-1 rounded-lg text-xs my-[10px] transition"
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
                      className=" text-white my-[0px] mb-[10px] px-3 py-1 rounded-lg text-xs  transition"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteProject(p._id)}
                    className="my-[0px] px-3 py-1 mb-[10px] rounded-lg text-xs transition"
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

      {/* Pagination Controls */}
      <div className="flex justify-center gap-[5px] items-center mt-[10px] mb-[.5rem] pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-[7px] py-[5px] border mr-[5px] text-[12px] rounded disabled:opacity-50 pagination-btn"
        >
          Prev
        </button>
        <span className="text-[14px]">
          Page {page} of {totalPages} — {total} Project
          {total !== 1 ? "s" : ""}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-[7px] py-[5px] ml-[5px] border text-[12px] rounded disabled:opacity-50 pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  </div>
);

}
