import React, { useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  userLoginRequest,
  userLoginSuccess,
  userLoginFailure,
} from "../redux/userSlice";
import { loginUser } from "../redux/apiCalls";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const initialValues = {
  email: "",
  password: "",
};

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email!").required("Required"),
  password: yup.string().required("Required"),
});

const Login = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFormSubmit = async (values) => {
    try {
      dispatch(userLoginRequest());
      const userData = await loginUser(values.email, values.password);

      if (!userData.isAdmin) {
        // Display error toast for unauthorized access
        toast.error("You do not have admin access.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return; // Exit the function to prevent further execution
      }

      dispatch(userLoginSuccess(userData));
      // Save the user information in localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      // Display success toast
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      navigate("/");
    } catch (error) {
      dispatch(userLoginFailure(error));
      // Display error toast
      toast.error("Login failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    // Check if the user information exists in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      dispatch(userLoginSuccess(userData));
    }
  }, [dispatch]);

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" m="30%">
      <Header title="LOGIN" subtitle="Login to Your Account" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={loginSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(2, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 2" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 12" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 12" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
