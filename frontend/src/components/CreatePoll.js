import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Divider, 
  Paper,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api, { endpoints } from '../utils/api';

function CreatePoll() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    question: '',
    option1: '',
    option2: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.question.trim()) {
      setError("Question is required");
      return false;
    }
    if (!formData.option1.trim()) {
      setError("Option 1 is required");
      return false;
    }
    if (!formData.option2.trim()) {
      setError("Option 2 is required");
      return false;
    }
    if (formData.option1.trim() === formData.option2.trim()) {
      setError("Options must be different");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await api.post(endpoints.polls, formData);
      console.log('Poll created:', response.data);
      setSuccess(true);

      setFormData({
        question: '',
        option1: '',
        option2: '',
      });

      setTimeout(() => {
        navigate('/polls');
      }, 1500);
    } catch (error) {
      console.error('Error creating poll:', error);
      setError('Failed to create poll. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4, mt: 3, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => navigate('/')} color="primary" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Create New Poll
        </Typography>
      </Box>
      <Divider sx={{ mb: 4 }} />

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Poll Information
          </Typography>

          <TextField
            fullWidth
            label="Question"
            name="question"
            value={formData.question}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            placeholder="e.g., Which technology do you prefer?"
            helperText="Enter a clear technology-related question"
            required
            disabled={loading}
          />

          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              Poll Options
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter two distinct options for people to vote on
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Option 1"
            name="option1"
            value={formData.option1}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            placeholder="e.g., React"
            required
            disabled={loading}
          />
          
          <TextField
            fullWidth
            label="Option 2"
            name="option2"
            value={formData.option2}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            placeholder="e.g., Vue"
            required
            disabled={loading}
          />

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/polls')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !formData.question || !formData.option1 || !formData.option2}
            >
              {loading ? 'Creating...' : 'Create Poll'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar 
        open={success} 
        autoHideDuration={3000} 
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Poll created successfully! Redirecting...
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default CreatePoll;
