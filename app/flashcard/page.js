'use client'

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { collection, doc, setDoc, getDoc ,getDocs} from "firebase/firestore";
import { db } from "@/firebase";
import { useSearchParams } from "next/navigation";
import { Grid, Container, Card, CardActionArea, Box, Typography } from "@mui/material";



export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcard, setFlashcard] = useState([]);
    const [flipped, setFlipped] = useState([]);

     const searchParams = useSearchParams();
     const search = searchParams.get("id");


     useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return;
            // Create a reference to the user's document in Firestore
            const colRef = collection(doc(collection(db, "users"), user.id),search);
            const docs= await getDocs(colRef);
            const flashcard = []
            docs.forEach((doc) => {
                flashcard.push({id: doc.id, ...doc.data()})
            })
            setFlashcard(flashcard);
          
        }
        getFlashcard();
    }, [user,search]) // Run effect when user changes

    const handleCardClick = (index) => {
        setFlipped(prev => ({
            ...prev,
            [index]: !prev[index],
        }));
    }

    if (!isLoaded || !isSignedIn) {
        return <></>
    }
    return(
        <Container maxWidth="100vw">
            
            
            <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcard.map((card, index) => (
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
                                        <Typography variant="h6">{card.front}</Typography>
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
                                        <Typography variant="h6">{card.back}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
            </Grid>
        </Container>
    )
}