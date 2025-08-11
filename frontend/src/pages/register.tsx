import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import '../register.css'

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      navigate("/login"); // After successfull registration
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-register w-[100%] h-[100vh] flex items-center justify-center bg-cover bg-center relative p-[0px]"
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div className="relative z-10 w-full flex items-center justify-center inner-container-register p-[0px]">

        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-90 p-[12px] rounded-lg shadow-lg w-[90%] max-w-md mx-auto form"
        >
          <h2 className="text-[1.7rem] font-bold mb-4 text-center text-gray-800">
            Create your Account
          </h2>
          {error && (
            <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
          )}

          <input
            name="name"
            placeholder="Name (optional)"
            className="border border-gray-300 p-2 mb-[5px] w-[95%] h-[1.4rem] text-[14px] px-[6px] mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Your email address"
            className="border border-gray-300 mb-[5px] p-2 w-[95%] h-[1.4rem] text-[14px] px-[6px] mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border border-gray-300 mb-[10px] p-2 w-[95%] h-[1.4rem] text-[14px] px-[6px] mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-[90%] button-register ${
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