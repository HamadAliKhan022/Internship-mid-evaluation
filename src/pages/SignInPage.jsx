import { Alert, Box, Button, Link, Typography } from "@mui/material";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import {
  Link as RouterLink,
  useLocation,
  useNavigate
} from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import FormTextField from "../components/forms/FormTextField";
import { auth, db } from "../firebase/firebase";

function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    control,
    handleSubmit,
    trigger,
    setError,
    formState: { isSubmitting, errors }
  } = useForm({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const successMessage = location.state?.message;

  const handleSignIn = async (formData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );

      const userDocument = await getDoc(
        doc(db, "users", userCredential.user.uid)
      );

      if (!userDocument.exists()) {
        await signOut(auth);
        setError("root", {
          message: "Your user profile could not be found. Please sign up again."
        });
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      let message = "Unable to sign in. Please check your details.";

      if (error.code === "auth/invalid-credential") {
        message = "Incorrect email or password.";
      }

      if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      }

      setError("root", { message });
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to view and manage your projects."
    >
      <Box component="form" onSubmit={handleSubmit(handleSignIn)} noValidate>
        <Box sx={{ display: "grid", gap: 2 }}>
          {successMessage && <Alert severity="success">{successMessage}</Alert>}

          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

          <FormTextField
            name="email"
            control={control}
            trigger={trigger}
            label="Email"
            type="email"
            autoComplete="email"
            rules={{
              required: "Email is required.",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email address."
              }
            }}
          />

          <FormTextField
            name="password"
            control={control}
            trigger={trigger}
            label="Password"
            type="password"
            autoComplete="current-password"
            rules={{
              required: "Password is required."
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>

          <Typography variant="body2" color="text.secondary" align="center">
            Do not have an account?{" "}
            <Link component={RouterLink} to="/signup" color="primary.main">
              Create one
            </Link>
          </Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
}

export default SignInPage;
