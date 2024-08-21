// Indicates that this is a client-side component
'use client'

// Importing necessary hooks and functions
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { collection, doc, getDoc, writeBatch,setDoc } from "firebase/firestore";
import { db } from '@/firebase';
import { Box ,Container, Paper, Typography, TextField,Button, CardActionArea, Grid, DialogTitle, DialogContent,Dialog, DialogContentText,DialogActions, Card} from '@mui/material';

// Defining the main Generate component
export default function Generate() {
    // Using Clerk's useUser hook to get user information
    const { isLoaded, isSignedIn, user } = useUser();
    // State for storing generated flashcards
    const [flashcards, setFlashcards] = useState([]);
    // State for tracking which cards are flipped
    const [flipped, setFlipped] = useState({});
    // State for storing input text
    const [text, setText] = useState("");
    // State for storing flashcard set name
    const [name, setName] = useState("");
    // State for controlling modal open/close
    const [open, setOpen] = useState(false);
    // Using Next.js router
    const router = useRouter();
    
    // Function to handle form submission
    const handleSubmit = async () => {
        // Check if the text is empty before sending the request
        if (!text) {
          alert("Please enter some text");
          return;
        }
      
        // Sending a POST request to the generate API
        fetch("/api/generate", {
          method: "POST",
          body: JSON.stringify(text), // Convert text to JSON before sending
        })
        .then((res) => res.json())
        .then((data) => setFlashcards(data));
      };

    // Function to handle card flipping
    const handleCardClick = (index) => {
        setFlipped(prev => ({
            ...prev,
            [index]: !prev[index],
        }));
    }

    // Function to open the modal
    const handleOpen = () => {
        setOpen(true);
    }

    // Function to close the modal
    const handleClose = () => {
        setOpen(false);
    }

    // Function to save flashcards to Firestore
    const saveFlashcards = async () => {
        // Check if user is signed in
        if (!isSignedIn || !user) {
            alert("Please sign in to save flashcards");
            return;
        }

        // Check if a name has been provided
        if (!name) {
            alert("Please enter a name");
            return;
        }

        // Initialize a write batch
        const batch = writeBatch(db);
        // Reference to the user's document
        const userDocRef = doc(collection(db, "users"), user.id);
        // Get the user's document
        const docSnap = await getDoc(userDocRef);

        // If the user document exists
        if (docSnap.exists()) {
            // Get existing flashcard collections or initialize an empty array
            const collections = docSnap.data().flashcards || [];
            // Check if a collection with the same name already exists
            if (collections.find((flashcard) => flashcard.name === name)) {
                alert("You already have a flashcard with this name");
                return;
            } 
            else {
                // Add the new collection to the array
                collections.push({ name });
                // Update the user document with the new collections array
                batch.set(userDocRef, { flashcards: collections }, { merge: true });
            }
        } 
        else {
            // If the user document doesn't exist, create it with the new collection
            batch.set(userDocRef, { flashcards: [{ name }] });
        }

        // Reference to the new flashcard collection
        const colRef = collection(userDocRef, name);
        // Add each flashcard to the collection
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, flashcard);
        });

        // Commit the batch write
        await batch.commit();
        // Close the modal
        handleClose();
        // Navigate to the flashcards page
        router.push("/flashcards");
    }

    return(
        <Container maxWidth="md">
            <Box sx={{
                mt: 4,
                mb: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Generate Flashcards
                </Typography>
                <Paper sx={{ p: 4,width: "100%" }}>
                    <TextField
                        label="Input Text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        fullWidth
                 
                        rows={4}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ mb: 2 }}
                    fullWidth
                    >
                        {' '}
                        Submit
                    </Button>
                </Paper>
            </Box>
            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5">Flashcards Preview</Typography>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
                                        <Box sx={{
                                            perspective: '1000px',
                                            height: '200px',
                                        }}>
                                            <Box sx={{
                                                transition: 'transform 0.6s',
                                                transformStyle: 'preserve-3d',
                                                position: 'relative',
                                                width: '100%',
                                                height: '100%',
                                                transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                            }}>
                                                <Box sx={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '16px',
                                                    boxSizing: 'border-box',
                                                }}>
                                                    <Typography variant="h6">{flashcard.front}</Typography>
                                                </Box>
                                                <Box sx={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '16px',
                                                    boxSizing: 'border-box',
                                                    transform: 'rotateY(180deg)',
                                                }}>
                                                    <Typography variant="h6">{flashcard.back}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 4 }} display='flex' justifyContent='center'>
                        <Button variant="contained" color="secondary" onClick={handleOpen}>
                            Save Flashcards
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcard set
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        autoFocus
                        label="Name"
                        type="text"
                      
                        
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 2 }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}