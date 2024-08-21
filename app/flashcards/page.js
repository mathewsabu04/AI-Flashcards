'use client'
// Import necessary dependencies
import { useState, useEffect, use } from "react";
import { db } from "@/firebase";
import { CollectionReference, doc, setDoc, getDoc} from "firebase/firestore";
import { userRouter } from "next/navigation";
import { CardActionArea,Container,Grid,Card,CardContent,Typography } from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { collection } from "firebase/firestore";

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
        <Container maxWidth="100vw">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card onClick={() => handleCardClick(flashcard.name)}>
                            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                <CardContent>
                                    <Typography variant="h6">{flashcard.name}</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}