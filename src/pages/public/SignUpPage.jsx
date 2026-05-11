import { Link } from "react-router"; 
import { useState } from "react";

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        fullName: "", 
        email: "", 
        password: "", 
        confirmPassword: "",
    }); 

    const [errors, setErrors] = useState({}); 

    const handleChange = (e) => {
        setFormData({
            ...formData, 
            [e.target.name]: e.target.value
        }); 
    }; 
   

    const handleSubmit = (e) => {
        e.preventDefault()

        const newErrors = {}; 

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required"; 
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"; 
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required."; 
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters."; 
        }


        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = "Please confirm your password."; 
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match."; 
        }

        setErrors(newErrors); 

        if (Object.keys(newErrors).length === 0) {
            console.log("Sign up submitted");
        }
    };

    return (
        <div className="mx-auto max-w-md px-6 py-20">
            <div className="bg-white rounded-xl shadow p-8">
                <div className="text-center">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
                        Join Blogify
                    </p>
                    <h2 className="mt-3 text-3xl font-bold">Create Your Account</h2>
                    <p className="mt-3 text-slate-600">
                        Sign up to join the platform and interact with blog content.
                    </p>
                </div>

                <form action="" className="space-y-5 mt-8"
                onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Full Name
                        </label>

                        <input 
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2"
                        />

                        {errors.fullName && (
                            <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email Address
                        </label>

                        <input 
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {errors.email && (
                            <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>

                        <input 
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {errors.password && (
                            <p className="text-red-500 text-sm mt-2">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Confirm Password
                        </label>

                        <input 
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        onChange={handleChange}
                        className="w-full border border-slate-300 rounded-md px-4 py-2 outline-none focus:ring-blue-500"
                        />

                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>
                    
                    <button type="submit"
                    className="w-full bg-blue-500 text-white px-5 py-3 rounded-md font-medium hover:bg-blue-600 transition duration-300"
                    >
                        Create Account
                    </button>

                    <p className="mt-6 text-sm text-slate-600 text-center">
                        Already have an account? {" "}
                        <Link 
                        to="/login"
                        className="text-blue-500 font-medium hover:text-blue-600 transition duration-300"
                        >
                           Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}


export default SignUpPage;