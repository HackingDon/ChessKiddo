import { Button, Snackbar, TextField, Alert } from "@mui/material";
import "./login.css";
import { useState } from "react";
import { supabaseClient } from "../../utils/superbase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const [error, setError] = useState({
    email: null,
    password: null,
    auth: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      setError({
        email: null,
        password: null,
        auth: null,
      });
      setIsLoading(true);
      const { data, error: loginError } =
        await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });
      if (loginError) {
        setIsLoading(false);
        setError((prev) => ({ ...prev, auth: loginError.message }));
        return;
      }
      const { data: userProfile, error: userError } = await supabaseClient
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();
      setIsLoading(false);
      if (userError) {
        setError((prev) => ({ ...prev, auth: userError.message }));
        return;
      }
      userProfile.role === "student"
        ? localStorage.setItem("userid", userProfile.userid)
        : localStorage.setItem("userid", userProfile.id);
      userProfile.role === "student"
        ? navigate("/home")
        : navigate("/admin");
    } else {
      if (email)
        setError((prev) => ({ ...prev, password: "Password is Required" }));
      else setError((prev) => ({ ...prev, email: "Email is Required" }));
    }
  };

  return (
    <div className="login-container container-fluid">
      {isLoading && (
        <div className="loader-wrap">
          <div className="loading"></div>
        </div>
      )}
      <form className="login-form" onSubmit={handleLogin}>
        <h3 className="text-center">Login</h3>
        <div className="login-input mt-5">
          <label> Email</label>
          <TextField
            placeholder="Enter Your Email"
            onChange={(e) => {
              setEmail(e.target.value);
              setError((prev) => ({ ...prev, email: null }));
            }}
            fullWidth
            size="small"
            error={!!error.email}
            helperText={error.email}
          />
        </div>
        <div className="login-input">
          <label> Password</label>
          <TextField
            placeholder="Enter Your Password"
            onChange={(e) => {
              setPassword(e.target.value);
              setError((prev) => ({ ...prev, password: null }));
            }}
            fullWidth
            type="password"
            size="small"
            error={!!error.password}
            helperText={error.password}
          />
        </div>
        <div className="submit mt-3">
          <Button size="small" type="submit" variant="contained">
            Login
          </Button>
        </div>
      </form>
      <Snackbar
        open={!!error.auth}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        autoHideDuration={3000}
        onClose={() => setError((prev) => ({ ...prev, auth: null }))}
      >
        <Alert severity="error">{error.auth}</Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
