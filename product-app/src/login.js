import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
function Login() {
  localStorage.clear();
  const navigate = useNavigate();
  var [validateMessage , setValidateMaessage] = useState(false)
  const sinInUser = async (e) => {
    e.preventDefault();
    const form = e.target.closest("form");
    const formData = new FormData(form);
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    const data = await response.json();
    if (data.ok) {
          localStorage.setItem('userId', data.user.id);
      navigate("/product-list");
    } else {
   setValidateMaessage(true)
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow dark:bg-gray-800 p-6">
        <form onSubmit={(e) => sinInUser(e)}>
          <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white text-center">
            Sign in to your account
          </h2>

          <div className="mt-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="mt-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>
          {validateMessage ? <p className="text-[red] mt-0 pt-0">username and password is not correct</p> : ''}
          <div className="flex justify-between text-sm mt-3 text-gray-500 dark:text-gray-300">
            <a href="#" className="hover:underline">
              Forgot password?
            </a>
            <Link to="/signup" className="hover:underline">
              Sign up
            </Link>
          </div>

          <button
            type="submit"
            className="w-full text-white mt-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
