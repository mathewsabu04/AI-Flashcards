'use client'
import Image from "next/image";
import { useState } from 'react';
import { SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import Head from "next/head";
import { AppBar, Button, Container, Toolbar, Typography, Box, Grid, Snackbar } from "@mui/material";

import Link from 'next/link';
import getStripe from '@/utils/get-stripe.js';

export default function Home() {
   const handleSubmit = async (plan) => {
    try {
      const checkoutSession = await fetch('/api/generate/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      if (!checkoutSession.ok) {
        const errorData = await checkoutSession.json();
        throw new Error(errorData.message || 'Failed to create checkout session');
      }

      const session = await checkoutSession.json();
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({ sessionId: session.id });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setShowError(true);
    }
  }

  const [showError, setShowError] = useState(false);

  const handleGetStarted = () => {
    // Replace this condition with your actual check for user payment status
    const userHasPaid = false;

    if (!userHasPaid) {
      setShowError(true);
    } else {
      // Redirect to the sign-up page or wherever you want paid users to go
      window.location.href = '/sign-up';
    }
  };

  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcards</title>
        <meta name="description" content="Flashcards" />
      </Head>

      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>Flashcards</Typography>
          
          <SignedOut>
            <Button color="primary" variant="outlined" href="/sign-in" sx={{ mr: 2 }}> Login</Button>
            <Button color="primary" variant="contained" href="/sign-up"> Sign Up</Button>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        
        </Toolbar>
      </AppBar>


      <Box sx={{ textAlign: "center", my: 8 }}>
        <Typography variant="h2" gutterBottom fontWeight="bold">Welcome to Flashcards SaaS</Typography>
        <Typography variant="h5" gutterBottom color="text.secondary">
          The easiest way to create flashcards from scratch
        </Typography>


          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            sx={{ mt: 4 }}
            href="/generate"
          >
            Get Started
          </Button>

          <Snackbar
            open={showError}
            autoHideDuration={6000}
            onClose={() => setShowError(false)}
            message="Please subscribe to a plan before getting started."
          />
   
          
      </Box>

      <Box sx={{my: 8}}>
        <Typography variant="h3" component="h2" sx={{ mb: 6, textAlign: 'center' }}>
          Features
        </Typography>
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5">
              Accessible Anytime, Anywhere
            </Typography>
            <Typography>Access your flashcards from any device, at any time. Study on the go with ease</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h5">
              Easy Text Input
            </Typography>
            <Typography>Just paste your text and we will create flashcards for you. Creating flashcards has never been easier.</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h5">
             Smart Flashcards
            </Typography>
            <Typography>Our AI intelligently creates flashcards for you. No more manual work.</Typography>
          </Grid>
        </Grid>
        
        <Box sx={{my: 8}} textAlign="center">
          <Typography variant="h3" sx={{ mb: 6 }}>Pricing</Typography>
         
              
              
              <Box sx={{ 
                p:3,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: "4px",
                height: '100%'
                
              }}>
                <Typography variant="h5" gutterBottom>
                  Pro Plan
                </Typography>
                <Typography variant="h6"> $10/month</Typography>
                <Typography>Unlimited flashcards and access to advanced features</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}  onClick={() => handleSubmit('pro')}>Choose Pro</Button>
              </Box>
            
        </Box>
      </Box>
  </Container>
  ); 
}