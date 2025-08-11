import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import '../login.css'; 

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      // Save token in AuthContext & localStorage
      localStorage.setItem("token", res.data.token);
      login(res.data.token, res.data.user || null);

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container w-[100%] h-[100vh] flex items-center justify-center bg-cover bg-center relative p-[0px]"
      // optional: add background image if you want like register
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div className="relative z-10 w-full flex items-center justify-center inner-container p-[0px]">
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-90 p-[12px] rounded-lg shadow-lg w-[90%] max-w-md mx-auto form"
        >
          <h2 className="text-[1.7rem] font-bold mb-4 text-center text-gray-800">
            Login
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-2 mb-[5px] w-[95%] h-[1.4rem] text-[14px] px-[6px] mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-2 mb-[5px] w-[95%] h-[1.4rem] text-[14px] px-[6px] mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-[90%] mt-[10px] button ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white px-4 py-2 w-full rounded transition mt-4`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-3 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-500 underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
