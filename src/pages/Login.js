import React, { useState } from "react";
import "./Login.css";

// File: src/pages/Login.js

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!email.trim()) e.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Invalid email";
        if (!password) e.password = "Password is required";
        return e;
    };

    const onSubmit = (ev) => {
        ev.preventDefault();
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length === 0) {
            // Replace with real auth logic
            console.log("Logging in", { email, password, remember });
            alert("Login submitted (check console)");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-visual" aria-hidden="true">
                    <div className="visual-inner">
                        <h2>Welcome Back</h2>
                        <p>Sign in to continue to BackgroundRemoverAI</p>
                    </div>
                </div>

                <div className="login-form-wrap">
                    <form className="login-form" onSubmit={onSubmit} noValidate>
                        <h1 className="brand">BackgroundRemoverAI</h1>

                        <label className="field">
                            <span className="label-text">Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                aria-invalid={!!errors.email}
                                aria-describedby="email-error"
                            />
                            {errors.email && (
                                <div className="error" id="email-error">
                                    {errors.email}
                                </div>
                            )}
                        </label>

                        <label className="field">
                            <span className="label-text">Password</span>
                            <div className="password-row">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    aria-invalid={!!errors.password}
                                    aria-describedby="password-error"
                                />
                                <button
                                    type="button"
                                    className="toggle-pw"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {errors.password && (
                                <div className="error" id="password-error">
                                    {errors.password}
                                </div>
                            )}
                        </label>

                        <div className="options-row">
                            <label className="remember">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                />
                                Remember me
                            </label>
                            <a className="link" href="#forgot">
                                Forgot?
                            </a>
                        </div>

                        <button className="btn primary" type="submit">
                            Sign in
                        </button>

                        <div className="divider">or continue with</div>

                        <div className="socials">
                            <button type="button" className="btn social">
                                {/* simple icons via text to avoid external deps */}
                                <span className="icon">G</span> Google
                            </button>
                            <button type="button" className="btn social">
                                <span className="icon">f</span> Facebook
                            </button>
                        </div>

                        <p className="signup">
                            New here? <a href="#signup">Create an account</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}