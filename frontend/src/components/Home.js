import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, Button, Box, Card, CardContent, Paper, Stack } from '@mui/material';
import PollIcon from '@mui/icons-material/Poll';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleCardClick = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate('/login', { state: { from: path } });
    }
  };
  
  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 8, mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Tech Polls
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Create polls, vote, and share your opinions on any topic
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="center" sx={{ mt: 4 }}>
        {/* Browse Polls Card */}
        <Card 
          component={Paper} 
          elevation={3}
          sx={{ 
            flex: 1,
            display: 'flex', 
            flexDirection: 'column',
            transition: 'transform 0.3s, box-shadow 0.3s',
            height: '400px',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: 8
            }
          }}
        >
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
            <PollIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
            <Typography variant="h5" component="h2" gutterBottom>
              View & Vote on Polls
            </Typography>
            <Typography variant="body1" paragraph textAlign="center">
              Explore polls and share your opinion by voting.
            </Typography>
            <Box mt="auto" width="100%">
              <Button 
                onClick={() => handleCardClick('/polls')} 
                variant="contained" 
                color="primary" 
                endIcon={<ArrowForwardIcon />}
                size="medium"
                sx={{ py: 1 }}
                fullWidth
              >
                BROWSE POLLS
              </Button>
            </Box>
          </CardContent>
        </Card>
        
        {/* Create Poll Card */}
        <Card 
          component={Paper} 
          elevation={3}
          sx={{ 
            flex: 1,
            display: 'flex', 
            flexDirection: 'column',
            transition: 'transform 0.3s, box-shadow 0.3s',
            height: '400px',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: 8
            }
          }}
        >
          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
            <AddCircleOutlineIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
            <Typography variant="h5" component="h2" gutterBottom>
              Create New Poll
            </Typography>
            <Typography variant="body1" paragraph textAlign="center">
              Have a question? Create a new poll and gather opinions.
            </Typography>
            <Box mt="auto" width="100%">
              <Button 
                onClick={() => handleCardClick('/create')} 
                variant="contained" 
                color="primary" 
                endIcon={<ArrowForwardIcon />}
                size="medium"
                sx={{ py: 1 }}
                fullWidth
              >
                CREATE A POLL
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}

export default Home;
