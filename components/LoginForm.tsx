"use client";
import { useState } from "react";
import { AuthService } from "@/services/AuthService";
import { Dialog, Transition } from "@headlessui/react";

declare global {
  interface Window {
    gapi: any;
  }
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleGoogleSignIn() {
    const auth2 = window.gapi.auth2.getAuthInstance();
    try {
      const googleUser = await auth2.signIn();
      const idToken = googleUser.getAuthResponse().id_token;
      const authService = new AuthService("YOUR_CLIENT_ID");
      await authService.signInWithGoogle(idToken);
    } catch (error: any) {
      setErrorMessage(error.message);
      setIsOpen(true);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const authService = new AuthService("YOUR_CLIENT_ID");
    try {
      await authService.signIn({ email, password });
    } catch (error: any) {
      setErrorMessage(error.message);
      setIsOpen(true);
    }
  }

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function handleDialogClose() {
    setIsOpen(false);
  }

  function handleGoogleSignInInit() {
    window.gapi.load("auth2", () => {
      window.gapi.auth2.init({
        client_id: "YOUR_CLIENT_ID",
      });
    });
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
            className="border rounded-lg py-2 px-3 w-full"
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
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
            className="border rounded-lg py-2 px-3 w-full"
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          type="submit"
        >
          Sign In
        </button>
      </form>
      <div className="mt-4">
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-lg mr-2"
          onClick={handleGoogleSignInInit}
        >
          Sign In with Google
        </button>
      </div>
      <Transition
        appear
        show={isOpen}
        as={Dialog}
        onClose={() => setIsOpen(false)}
      >
        <Dialog.Title>Error</Dialog.Title>
        <Dialog.Description>{errorMessage}</Dialog.Description>
        <button onClick={handleDialogClose}>Close</button>
      </Transition>
    </>
  );
}
