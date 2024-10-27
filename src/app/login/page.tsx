"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Starter innlogging...");
      console.log("Sender brukernavn og passord:", { username, password });

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Responsstatus:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Innloggingsdata:", data); // Dette viser hele responsen fra backend

        // Sjekk om `data.user` finnes og har nødvendig informasjon
        if (data.user && data.user._id && data.user.role) {
          localStorage.setItem("userId", data.user._id);
          localStorage.setItem("userType", data.user.role);
          console.log("Bruker er logget inn med rolle:", data.user.role);

          // Omdiriger til hjemmesiden
          router.push("/");
        } else {
          console.error("Manglende brukerdata i responsen");
          alert("Innlogging mislyktes: Manglende brukerdata");
        }
      } else {
        console.error("Innlogging mislyktes: Feil brukernavn eller passord");
        alert("Feil brukernavn eller passord");
      }
    } catch (error) {
      console.error("Feil ved innlogging:", error);
      alert("Det oppstod en feil under innloggingen. Prøv igjen senere.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Logg inn</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Brukernavn
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Passord
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Logg inn
        </button>
      </form>
    </div>
  );
}
