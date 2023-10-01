import { useState } from "react";
import { AuthService } from "../services/AuthService";
import { Dialog, Transition } from "@headlessui/react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const authService = new AuthService();
    try {
      await authService.signIn({ email, password });
    } catch (error: any) {
      setError(error.message);
      setIsOpen(true);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && (
          <p className="text-red-500 mb-4">
            <span className="font-bold">Error:</span> {error}
          </p>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="border rounded py-2 px-3 text-gray-700"
            type="email"
            id="email"
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
            className="border rounded py-2 px-3 text-gray-700"
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Login
        </button>
      </form>
      <Transition
        appear
        show={isOpen}
        as={Dialog}
        onClose={() => setIsOpen(false)}
      >
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 opacity-75" />
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <Transition.Child
            appear
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog
              as="div"
              className="bg-white rounded-lg w-1/2 px-4 py-6 text-center"
              onClose={() => setIsOpen(false)}
            >
              <Dialog.Title as="h3" className="text-lg font-bold mb-2">
                Error
              </Dialog.Title>
              <Dialog.Description className="text-red-500 mb-2">
                {error}
              </Dialog.Description>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </Dialog>
          </Transition.Child>
        </div>
      </Transition>
    </>
  );
}
