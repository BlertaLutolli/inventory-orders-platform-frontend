import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export defaut function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("")
    const navigate = useNavigate();


    const handleSubmi =async (e : React.FormEvent )
=> 
    {
    e.preventDefault();
    try{
        const res =await api.post("/auth/login" , { username ,password });
        localStorage.setItem("token",res.data.token);
        navigate("/dashboard");
    }
    catch{
        alert("Invalid credentials");

    }
    };


    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 shadow-md rounded w-96 space-y-4"
          >
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Login
            </button>
          </form>
        </div>
      );
    }