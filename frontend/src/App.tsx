import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import ProjectDetails from "./pages/projectDetails";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}
