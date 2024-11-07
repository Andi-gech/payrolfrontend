/* eslint-disable react/prop-types */
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useNavigate } from "react-router-dom";

function TextField({ label, type = "text", value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  );
}

export default function LoginPage() {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const signIn = useSignIn();
  const navigate = useNavigate();

  // useMutation hook to handle login request
  const mutation = useMutation({
    mutationFn: async ({ username, password }) => {
      // Make a POST request to your login endpoint
      const data = new URLSearchParams();
      data.append("grant_type", "password");
      data.append("client_id", "MicroserviceAuth"); // Replace with your client ID in Keycloak
      data.append("username", username); // Replace with the user's username
      data.append("password", password); // Replace with the user's password
      data.append("client_secret", "TGBRNQ4JkeQy3aQXlpwEF4BDBq5CceYV"); // If client secret is required

      const response = await axios.post(
        "http://localhost:8080/realms/Hr-system/protocol/openid-connect/token",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return response.data;
    },

    onSuccess: (data) => {
      console.log("Login successful:", data);
      if (
        signIn({
          auth: {
            token: data.access_token,
            type: "Bearer",
          },

          userState: {
            name: "React User",
            uid: 123456,
          },
        })
      ) {
        navigate("/");
      } else {
        alert("Login failed. due to some internal error");
      }
    },
    onError: (error) => {
      // Handle login error
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({ username, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit}>
          <TextField
            label="username "
            type="username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
