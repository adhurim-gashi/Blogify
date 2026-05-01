import { Link } from "react-router"; 
import { useState } from "react";

const LoginPage = () => {
const [email, setEmail] = useState(""); 
const [password, setPassword] = useState(""); 
const [errors, setErrors] = useState({});

const handleSubmit = (e) => {
    e.preventDefault(); 

    const newErrors = {};

    if (!email.trim()) {
        newErrors.email = "Email is required.";
    }

    if (!password.trim()) {
        newErrors.password = "Password is required"; 
    } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors); 

    if(Object.keys(newErrors).length === 0) {
        console.log("Login Submitted");
    }
}
return (
    <div className="mx-auto max-w-md px-6 py-20">
        <div className="bg-white rounded-xl shadow p-8">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
                    Welcome Back
                </p>
                <h2 className="mt-3 text-3xl font-bold">Login to Blogify</h2>
                <p>
                Sign in to access your account and manage your content.
                </p>
            </div>


            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="" className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                    </label>


                <input 
                type="email"
                placeholder="Enter your email"
                className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Password
                    </label>

                <input 
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-2">{errors.password}</p>
                )}
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white px-5 py-3 rounded-md font-medium hover:bg-blue-600 transition duration-300">
                    Login
                </button>
            </form>


            <div className="mt-6 text-center">
                <Link to="/home" className="text-blue-500 font-medium hover:text-blue-600 transition duration-300">Back to Home</Link>
            </div>
        </div>
    </div>
)
}


export default LoginPage;