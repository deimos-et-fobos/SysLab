import React from "react";
import Box from '@mui/material/Box';
import { teal } from '@mui/material/colors';

import HomePage from "./HomePage";

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <Box sx={{ bgcolor: teal['50'] }}>
        <HomePage />
      </Box>
    )
  }
}
