import { useState } from "react";
import api from "./api";

function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (isRegister && !name.trim()) {
      setMessage("Please enter your name.");
      setMessageType("error");
      return;
    }

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      setMessageType("error");
      return;
    }

    if (isRegister && password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        await api.post("/students", {
          name: name.trim(),
          email: email.trim(),
          password: password,
        });

        setMessage("Registration successful! Please log in.");
        setMessageType("success");

        setIsRegister(false);
        setName("");
        setPassword("");
      } else {
        const response = await api.post("/students/login", {
          email: email.trim(),
          password: password,
        });

        const student = response.data;

        if (!student.token) {
          setMessage(student.message || "Login failed. Please try again.");
          setMessageType("error");
          return;
        }

        localStorage.setItem("token", student.token);
        localStorage.setItem("studentId", student.id);
        localStorage.setItem("studentName", student.name);
        localStorage.setItem("studentEmail", student.email);

        setMessage("Login successful!");
        setMessageType("success");

        if (onLogin) {
          onLogin(student);
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.response?.status === 409
          ? "This email is already registered."
          : "Something went wrong. Please check your details and try again.");

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setMessage("");
    setMessageType("");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-icon">S</div>

          <div>
            <h2>SkillTrack</h2>
            <p>Student Skill Gap Analyzer</p>
          </div>
        </div>

        <div className="auth-heading">
          <h1>{isRegister ? "Create Your Account" : "Welcome Back!"}</h1>

          <p>
            {isRegister
              ? "Create an account to start tracking your skills."
              : "Log in to continue your learning journey."}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="auth-field">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
            />
          </div>

          {message && (
            <div className={`auth-message ${messageType}`} role="alert">
              {message}
            </div>
          )}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create Account"
                : "Log In"}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}{" "}

          <button type="button" onClick={switchMode}>
            {isRegister ? "Log In" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;