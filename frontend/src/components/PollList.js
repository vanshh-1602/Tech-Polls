import { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Box, Divider, Paper, CircularProgress, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import api, { endpoints } from '../utils/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function PollList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        const response = await api.get(endpoints.polls);
        setPolls(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching polls:', error);
        setError('Failed to fetch polls. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, mt: 3, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => navigate('/')} color="primary" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Available Polls
        </Typography>
      </Box>
      <Divider sx={{ mb: 4 }} />

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      ) : polls.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No polls found
          </Typography>
          <Button 
            component={Link} 
            to="/create" 
            variant="contained" 
            color="primary"
            sx={{ mt: 2 }}
          >
            Create the first poll
          </Button>
        </Paper>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-12px' }}>
          {polls.map((poll) => (
            <div key={poll._id} style={{ width: '33.33%', padding: '12px', boxSizing: 'border-box' }}>
              <Card 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  height: 220,
                  backgroundColor: 'background.paper',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, pt: 3, px: 3, pb: 1 }}>
                  <Box sx={{ height: '100px' }}>
                    <Typography variant="h6" sx={{ 
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.4
                    }}>
                      {poll.question}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {poll.votes1 + poll.votes2} votes
                    </Typography>
                  </Box>
                </CardContent>
                
                <Box sx={{ p: 3, pt: 1 }}>
                  <Button
                    component={Link}
                    to={`/poll/${poll._id}`}
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="medium"
                  >
                    VIEW & VOTE
                  </Button>
                </Box>
              </Card>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

export default PollList;
