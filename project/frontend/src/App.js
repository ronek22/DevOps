import React, { useState } from 'react';
import axios from "axios";
import { TextField, Container, Box, Typography, Button, FormGroup, Card } from "@material-ui/core";

function App() {

  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [pace, setPace] = useState('');
  const [error, setError] = useState('');


  const handleClick = async (event) => {
    event.preventDefault();
    axios.get(`/api/${distance}/${duration}/`).then(res => {
      if (res.data.error) {
        setPace('');
        setError(res.data.error);
      } else {
        setError('');
        setPace(res.data.result);
      }
    })
  };


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
              placeholder="HH:MM:SS"
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

      <Box m={2}>
        <Card elevation={2}>
          <Box p={2}>
            {error ?
              <Typography color='error' variant="h5" component="p" align="center" gutterBottom>
                {error}
      </Typography> :
              <Typography color='primary' variant="h5" component="p" align="center" gutterBottom>
                {pace ? `${pace} min/km` : 'Czekam na działanie..'}
              </Typography>
            }

          </Box>

        </Card>
      </Box>


    </Container>
  );
}

export default App;
