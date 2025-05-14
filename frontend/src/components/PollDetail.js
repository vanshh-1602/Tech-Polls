import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api, { endpoints } from '../utils/api';
import {
  Container,
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  TextField,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Paper,
  IconButton,
  Alert,
  Chip,
  Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HowToVoteIcon from '@mui/icons-material/HowToVote';


function PollDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        console.log('Fetching poll with ID:', id);
        const response = await api.get(endpoints.poll(id));
        console.log('Poll response:', response.data);
        if (response.data) {
          setPoll(response.data);
          setError(null);
          

          if (isAuthenticated) {
            checkUserVoteStatus();
          } else {
            setHasVoted(localStorage.getItem(`voted_${id}`) === 'true');
          }
        }
      } catch (error) {
        console.error('Error fetching poll:', error.response || error);
        setError('Failed to fetch poll. The poll may not exist or there was a server error.');
        setPoll(null);
      } finally {
        setLoading(false);
      }
    };
    
    // Check if user has voted on this poll
    const checkUserVoteStatus = async () => {
      if (!id || !isAuthenticated) return;
      
      try {
        const response = await api.get(endpoints.vote(id));
        if (response.data.hasVoted) {
          setHasVoted(true);
          setSelectedOption(response.data.option.toString());
        }
      } catch (error) {
        console.error('Error checking vote status:', error);
      }
    };

    const fetchComments = async () => {
      if (!id) return;
      
      try {
        const response = await api.get(endpoints.pollComments(id));
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error.response || error);

      }
    };

    fetchPoll();
    fetchComments();
  }, [id]);


  const handleVote = async (e) => {
    if (!selectedOption) return;
    
    if (!isAuthenticated) {

      if (window.confirm('You need to be logged in to vote. Do you want to log in now?')) {
        navigate('/login');
      }
      return;
    }
    
    try {
      setVoteLoading(true);
      
      const response = await api.post(
        endpoints.vote(id), 
        { option: parseInt(selectedOption) }
      );
      
      setPoll(response.data);
      setHasVoted(true);
    } catch (error) {
      console.error('Error submitting vote:', error);
      if (error.response?.status === 400 && error.response?.data?.message === 'You have already voted on this poll') {
        alert('You have already voted on this poll');
        setHasVoted(true);
      } else {
        alert('Failed to submit your vote. Please try again.');
      }
    } finally {
      setVoteLoading(false);
    }
  };


  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    if (!isAuthenticated) {

      if (window.confirm('You need to be logged in to comment. Do you want to log in now?')) {
        navigate('/login');
      }
      return;
    }

    try {
      setCommentLoading(true);
      
      const response = await api.post(
        endpoints.comments, 
        {
          pollId: id,
          content: comment,
          username: user.username // Include username with comment
        }
      );
      
      setComments([response.data, ...comments]);
      setComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post your comment. Please try again.');
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4, mt: 3, maxWidth: "100%" }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%', mb: 3 }}>
          <Button 
            variant="text" 
            color="primary" 
            size="medium" 
            sx={{ 
              py: 0.5, 
              px: 1, 
              borderRadius: 1,
              backgroundColor: 'rgba(25, 118, 210, 0.08)', 
              '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.15)' },
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.9rem'
            }} 
            component={Link} 
            to="/polls" 
            startIcon={<ArrowBackIcon />}
          >
            Back to Polls
          </Button>
        </Box>
        <Typography variant="h4" component="h1" sx={{ ml: 0, fontWeight: 600 }}>
          Poll Details
        </Typography>
      </Box>
      <Divider sx={{ mb: 4 }} />
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error" gutterBottom>{error}</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="medium" 
            sx={{ py: 1, mt: 2 }}
            onClick={() => navigate('/polls')}
          >
            BACK TO POLLS
          </Button>
        </Paper>
      ) : !poll ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Poll not found</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="medium" 
            sx={{ py: 1, mt: 2 }}
            onClick={() => navigate('/polls')}
          >
            BACK TO POLLS
          </Button>
        </Paper>
      ) : (

        <>

          {poll && (
            <>

              {(() => {
                const totalVotes = poll.votes1 + poll.votes2;
                const option1Percentage = totalVotes ? Math.round((poll.votes1 / totalVotes) * 100) : 0;
                const option2Percentage = totalVotes ? Math.round((poll.votes2 / totalVotes) * 100) : 0;
                return (
      <Card sx={{ mb: 3 }} elevation={3} component={Paper}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {poll.question}
          </Typography>
          {!hasVoted ? (
            <Box sx={{ mt: 3 }}>
              <RadioGroup value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                <FormControlLabel value="1" control={<Radio />} label={poll.option1} />
                <FormControlLabel value="2" control={<Radio />} label={poll.option2} />
              </RadioGroup>
              <Button 
                variant="contained" 
                color="primary" 
                size="medium" 
                sx={{ py: 1, mt: 2 }}
                onClick={handleVote} 
                disabled={!selectedOption || voteLoading}
              >
                {voteLoading ? 'SUBMITTING...' : 'SUBMIT VOTE'}
              </Button>
            </Box>
          ) : (
            <Box sx={{ mt: 3 }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Thanks for voting! Here are the current results.
                {selectedOption && (
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 'medium' }}>
                    You voted for: <strong>{selectedOption === '1' ? poll.option1 : poll.option2}</strong>
                  </Typography>
                )}
              </Alert>
              <Typography variant="h6" gutterBottom>
                Results:
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box display="flex" alignItems="center">
                    <span>{poll.option1}</span>
                    {selectedOption === '1' && (
                      <Tooltip title="You voted for this option" arrow>
                        <Chip 
                          icon={<HowToVoteIcon />}
                          label="Your vote" 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ ml: 1.5, height: '24px' }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                  <span>{poll.votes1} votes ({option1Percentage}%)</span>
                </Typography>
                <Box
                  sx={{
                    height: 12,
                    backgroundColor: '#e0e0e0',
                    borderRadius: 6,
                    mt: 1,
                    mb: 2,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      borderRadius: 6,
                      width: `${option1Percentage || 1}%`,
                      backgroundColor: 'primary.main',
                      transition: 'width 1s ease-in-out'
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box display="flex" alignItems="center">
                    <span>{poll.option2}</span>
                    {selectedOption === '2' && (
                      <Tooltip title="You voted for this option" arrow>
                        <Chip 
                          icon={<HowToVoteIcon />}
                          label="Your vote" 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ ml: 1.5, height: '24px' }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                  <span>{poll.votes2} votes ({option2Percentage}%)</span>
                </Typography>
                <Box
                  sx={{
                    height: 12,
                    backgroundColor: '#e0e0e0',
                    borderRadius: 6,
                    mt: 1,
                    mb: 2,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      borderRadius: 6,
                      width: `${option2Percentage || 1}%`,
                      backgroundColor: 'secondary.main',
                      transition: 'width 1s ease-in-out'
                    }}
                  />
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Total votes: {totalVotes}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
                );
              })()}
            </>
          )}


          <Card elevation={3} component={Paper}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Comments
              </Typography>
              <form onSubmit={(e) => e.preventDefault()}>
                <TextField
                  fullWidth
                  label="Add your comment"
                  multiline
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ mb: 2 }}
                  variant="outlined"
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="medium" 
                  sx={{ py: 1 }}
                  onClick={handleComment} 
                  disabled={!comment.trim() || commentLoading}
                >
                  {commentLoading ? 'POSTING...' : 'POST COMMENT'}
                </Button>
              </form>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                {comments.length > 0 ? `All Comments (${comments.length})` : 'Comments'}
              </Typography>
              <Box sx={{ mt: 2 }}>
                {comments.length === 0 ? (
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Typography variant="body2" color="text.secondary">
                      No comments yet. Be the first to comment!
                    </Typography>
                  </Paper>
                ) : (
                  <List>
                    {comments.map((commentItem) => (
                      <ListItem 
                        key={commentItem._id} 
                        divider 
                        sx={{ 
                          borderRadius: 1,
                          '&:hover': { bgcolor: 'background.default' },
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <ListItemText
                          primary={commentItem.content}
                          secondary={`Posted on ${new Date(commentItem.createdAt).toLocaleDateString()}`}
                          primaryTypographyProps={{ fontWeight: 500 }}
                          secondaryTypographyProps={{ fontSize: '0.8rem' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
}

export default PollDetail;
