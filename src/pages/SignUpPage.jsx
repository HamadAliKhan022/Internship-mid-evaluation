import { Alert, Box, Button, Link, Typography } from "@mui/material";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import FormSelectField from "../components/FormSelectField";
import FormTextField from "../components/FormTextField";
import { auth, db } from "../firebase/firebase";

function SignUpPage() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    },
  });

  const password = watch("password");

  const handleSignUp = async (formData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password,
      );

      const firebaseUser = userCredential.user;

      await setDoc(doc(db, "users", firebaseUser.uid), {
        uid: firebaseUser.uid,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        createdAt: serverTimestamp(),
      });

      await signOut(auth);

      navigate("/signin", {
        replace: true,
        state: {
          message: "Account created successfully. Please sign in.",
        },
      });
    } catch (error) {
      let message = "Unable to create your account. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        message = "An account with this email already exists.";
      }

      if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      }

      setError("root", { message });
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Create an account to submit and manage your projects."
    >
      <Box component="form" onSubmit={handleSubmit(handleSignUp)} noValidate>
        <Box sx={{ display: "grid", gap: 2 }}>
          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

          <FormTextField
            name="name"
            control={control}
            label="Name"
            autoComplete="name"
            rules={{
              required: "Name is required.",
              validate: (value) =>
                value.trim().length >= 2 || "Enter at least 2 characters.",
            }}
          />

          <FormTextField
            name="email"
            control={control}
            label="Email"
            type="email"
            autoComplete="email"
            rules={{
              required: "Email is required.",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email address.",
              },
            }}
          />

          <FormTextField
            name="password"
            control={control}
            label="Password"
            type="password"
            autoComplete="new-password"
            rules={{
              required: "Password is required.",
              minLength: {
                value: 6,
                message: "Password must contain at least 6 characters.",
              },
            }}
          />

          <FormTextField
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            rules={{
              required: "Please confirm your password.",
              validate: (value) =>
                value === password || "Passwords do not match.",
            }}
          />

          <FormSelectField
            name="role"
            control={control}
            label="Role"
            rules={{
              required: "Please select a role.",
            }}
            options={[
              { label: "User", value: "user" },
              { label: "Admin", value: "admin" },
            ]}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>

          <Typography variant="body2" color="text.secondary" align="center">
            Already have an account?{" "}
            <Link component={RouterLink} to="/signin" color="primary.main">
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
}

export default SignUpPage;
