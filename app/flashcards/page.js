'use client'
// Import necessary dependencies
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  CardActionArea, Container, Grid, Card, CardContent, 
  Typography, Button, Box, AppBar, Toolbar, 
} from "@mui/material";
import { useUser } from "@clerk/nextjs";

export default function Flashcards() {
    // Get user authentication state
    const { isLoaded, isSignedIn, user } = useUser();
    // State to store flashcards
    const [flashcards, setFlashcards] = useState([]); // Fix: Initialize with an empty array
    const router = useRouter();
      

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return;
            // Create a reference to the user's document in Firestore
            const docRef = doc(collection(db, "users"), user.id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                // If the document exists, get the flashcards or an empty array
                const collections = docSnap.data().flashcards || [];
                setFlashcards(collections);
            } 
            else 
            {
                // If the document doesn't exist, create it with an empty flashcards array
                await setDoc(docRef, { flashcards: [] });
            }
        }
        getFlashcards();
    }, [user]) // Run effect when user changes

    // If not loaded or not signed in, return empty fragment
    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    // Handle click on a flashcard
    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`); // Navigate to flashcard details page
    }

    return (
        <>
            <AppBar position="static" color="primary" elevation={0}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        My Flashcards
                    </Typography>
                   
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" align="center" sx={{ mt: 4, mb: 10 }}>Flashcards</Typography>
                <Grid container spacing={3}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card 
                                onClick={() => handleCardClick(flashcard.name)}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: '0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: 3,
                                    },
                                }}
                            >
                                <CardActionArea sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center' }}>
                                    <CardContent>
                                        <Typography variant="h6" align="center">{flashcard.name}</Typography>
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            {flashcard.cards && flashcard.cards.length > 0 ? `${flashcard.cards.length} cards` : ''}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
}