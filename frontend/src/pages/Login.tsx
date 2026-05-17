import { useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert("Login Failed");

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w- [400px]">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>
        <div className="bg-gray-100 p-3 rounded-lg mb-4 text-sm">

          <p>
            Demo Credentials
          </p>

          <p>Email: diksha@gmail.com</p>

          <p>Password: 123456</p>

        </div>
        <form
          className="space-y-4"
          onSubmit={handleLogin}
        >

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg"

            value={email}

            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg"

            value={password}

            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            className="w-full bg-black text-white p-3 rounded-lg"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;