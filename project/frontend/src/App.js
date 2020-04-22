import React, { useState } from 'react';
import axios from "axios";
import { TextField, Container, Box, Typography, Button, FormGroup } from "@material-ui/core";

function App() {

  const handleClick = async (event) => {
    event.preventDefault();
    axios.get(`/api/${distance}/${duration}/`).then(res => {
      alert(`Tempo biegu -> ${res.data.result}`)
    })
  };

  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');

  return (
    <Container maxWidth="sm">
      <Box m={2} pt={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Kalkulator tempa biegowego
        </Typography>
        <form onSubmit={handleClick}>
          <FormGroup>
            <TextField
              label="Czas trwania"
              placeholder="H:M:S"
              value={duration}
              onInput={e => setDuration(e.target.value)}
              variant="outlined"
              required
            />
          </FormGroup>

          <Box pt={2}>

            <FormGroup>
              <TextField
                label="Dystans"
                placeholder="10.22 km"
                value={distance}
                onInput={e => setDistance(e.target.value)}
                variant="outlined"
                required
              />

            </FormGroup>
          </Box>

          <Box mt={2}>

            <FormGroup>
              <Button variant="contained" type="submit" color="primary">Oblicz</Button>

            </FormGroup>
          </Box>

        </form>
      </Box>

      <Typography variant="h4" component="h1" gutterBottom>

      </Typography>


    </Container>
  );
}

export default App;
