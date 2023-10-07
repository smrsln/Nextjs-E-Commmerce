"use client";
import { useState } from "react";
import { AuthService } from "@/services/AuthService";
import { Dialog, Transition } from "@headlessui/react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const authService = new AuthService();
    try {
      await authService.signIn({ email, password });
    } catch (error: any) {
      setErrorMessage(error.message);
      setIsOpen(true);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Sign In
        </button>
      </form>
      <Transition
        appear
        show={isOpen}
        as={Dialog}
        onClose={() => setIsOpen(false)}
      >
        <Dialog.Title>Error</Dialog.Title>
        <Dialog.Description>{errorMessage}</Dialog.Description>
        <button onClick={() => setIsOpen(false)}>Close</button>
      </Transition>
    </>
  );
}
