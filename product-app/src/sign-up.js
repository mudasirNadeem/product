import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function Signup() {
  localStorage.clear();
var [validateMessage , setValidateMaessage] = useState(false);
  const navigate = useNavigate();
  const sinUpUser = async (e) => {
    e.preventDefault();
    const form = e.target.closest("form");
    const formData = new FormData(form);
    var passwordElement = document.getElementById('password')
    if(passwordElement.value.length >= 8){
    
    const response = await fetch("http://localhost:3000/api/signUp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    const data = await response.json();
    if (data.ok) {
      localStorage.setItem('userId', data.signUpUser.id);
      navigate("/product-list");
    } else {
      setValidateMaessage(true);
    }
    }
    else{
      alert('The passowrd should greate than 8 digit')
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Create an Account
        </h2>

        <form className="space-y-4"  onSubmit={(e) => sinUpUser(e)}>
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
              placeholder="name@company.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          
          {validateMessage ? <p className="text-[red] pt-0 mt-0">User is already have </p> : ''}
          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Sign Up
          </button>

          <p className="text-sm font-light text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/" className="font-medium text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
