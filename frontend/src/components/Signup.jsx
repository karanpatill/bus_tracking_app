import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminSignup } from "../api";
import axios from "../api";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [allowed, setAllowed] = useState(null); // null = loading

  useEffect(() => {
    const checkSignupAllowed = async () => {
      try {
        const res = await axios.get("/api/admin/me", { withCredentials: true });
        if (!res.data.allowSignup) navigate("/login");
        else setAllowed(true);
      } catch (err) {
        navigate("/login");
      }
    };
    checkSignupAllowed();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminSignup(form);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.error || "Signup failed. Try a different email.");
    }
  };

  if (allowed === null) return <p className="text-center mt-10">Checking permissions...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Admin Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
