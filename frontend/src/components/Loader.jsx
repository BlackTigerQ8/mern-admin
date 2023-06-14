import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { tokens } from "../theme";
import { useTheme } from "@emotion/react";

const Loader = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress color="secondary" />
    </Box>
  );
};

export default Loader;
