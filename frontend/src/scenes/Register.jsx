import React from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../components/Header";
import {
  userRegisterFailure,
  userRegisterRequest,
  userRegisterSuccess,
} from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/apiCalls";
import { toast } from "react-toastify";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  password: "",
  confirmPassword: "",
  accessLevel: "",
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const registerSchema = yup.object().shape({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  email: yup.string().email("Invalid email!").required("Required"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid!")
    .required("required"),
  address: yup.string().required("Required"),
  city: yup.string().required("Required"),
  postalCode: yup.string().required("Required"),
  password: yup.string().required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
  accessLevel: yup.string().required("Required"),
});

const Register = () => {
  const accessLevelOptions = [
    { label: "Admin", value: 10 },
    { label: "Manager", value: 20 },
    { label: "User", value: 30 },
  ];
  const dispatch = useDispatch();

  const handleFormSubmit = async (values) => {
    try {
      dispatch(userRegisterRequest());
      // Map accessLevel option to numerical value
      values.accessLevel = accessLevelOptions.find(
        (option) => option.label === values.accessLevel
      ).value;
      await dispatch(registerUser(values));
      dispatch(userRegisterSuccess(values)); // Dispatch userRegisterSuccess action with the form values
      // Handle successful registration
    } catch (error) {
      dispatch(userRegisterFailure(error.message));

      try {
        if (
          error.response &&
          error.response.status === 409 &&
          error.response.data.error === "User already exists"
        ) {
          toast.error("User already exists"); // Show toast notification for user already exists error
          return; // Exit the function to prevent showing "Registration failed" toast
        }
      } catch (toastError) {
        console.error(toastError);
      }
      toast.error("Registration failed"); // Show toast notification for general registration failure
      console.error(error);
    }
  };

  return (
    <Box m="20px">
      <Header title="REGISTER" subtitle="Create a New Account" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={registerSchema}
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
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
              />
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Phone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                name="phone"
                error={!!touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="City"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.city}
                name="city"
                error={!!touched.city && !!errors.city}
                helperText={touched.city && errors.city}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Postal Code"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.postalCode}
                name="postalCode"
                error={!!touched.postalCode && !!errors.postalCode}
                helperText={touched.postalCode && errors.postalCode}
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
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Confirm Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmPassword}
                name="confirmPassword"
                error={!!touched.confirmPassword && !!errors.confirmPassword}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
              <TextField
                fullWidth
                variant="filled"
                select
                label="Access Level"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.accessLevel}
                name="accessLevel"
                error={!!touched.accessLevel && !!errors.accessLevel}
                helperText={touched.accessLevel && errors.accessLevel}
              >
                {accessLevelOptions.map((option) => (
                  <MenuItem key={option.label} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Register;
