import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        email: form.email,
        password: form.password,
        name: form.name || undefined,
      });

      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('./assets/register_background.jpg')`,
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div className="relative z-10">
        <div className="flex justify-end p-4 w-full">
          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded ${
              isDarkMode
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-800"
            } hover:opacity-90 transition`}
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto"
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Create your Account
          </h2>
          {error && (
            <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
          )}

          <input
            name="name"
            placeholder="Name (optional)"
            className="border border-gray-300 p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Your email address"
            className="border border-gray-300 p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border border-gray-300 p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            } text-white px-4 py-2 w-full rounded transition mt-4`}
          >
            {loading ? "Registering..." : "Continue"}
          </button>

          <p className="mt-3 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}