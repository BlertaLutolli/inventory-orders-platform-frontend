import { Navigate } from "react-router-dom";

export default function Dashboard() {
    const token = localStorage.getItem("token");

    if (!token)
    {
        return <Navigate to="/" />;
    }

    return (
        <div className ="p-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-700">Welcome to your dashboard 🚀</p>
    </div>
  );
}