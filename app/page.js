'use client'
import Image from "next/image";

import { SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import Head from "next/head";
import { AppBar, Button, Container, Toolbar, Typography, Box, Grid} from "@mui/material";

import Link from 'next/link';
//import getStripe from "@/utils/get-stripe.js";

export default function Home() {
  //  const handleSubmit = async () => {
  //  // Send a POST request to create a checkout session
  //   const checkoutSession = await fetch('/api/generate/checkout_sessions', {
  //     method: 'POST',
  //     headers: {
  //       origin: 'http://localhost:3000',
  //     },
  //   });

  //   // Parse the response as JSON
  //   const session = await checkoutSession.json();

  //   // Check if there was an error creating the session
  //   if (session.statusCode === 500) {
  //     console.error(session.message);
  //     return;
  //   }

  //   // Load the Stripe library
  //   const stripe = await getStripe();

  //   // Redirect to the Stripe checkout page
  //   const {error} = await stripe.redirectToCheckout({ 
  //     sessionId: session.id 
  //   });

  //   // Handle any errors during redirection
  //   if (error) {
  //     console.warn(error.message);
  //     return;
  //   }
  // }
  return (
    <Container maxWidth="100vh">
      <Head>
        <title>Flashcards</title>
        <meta name="description" content="Flashcards" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>Flashcards</Typography>
          
          <SignedOut>
            <Button color="inherit" href="/sign-in"> Login</Button>
            <Button color="inherit" href="/sign-up"> Signed Up</Button>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        
        </Toolbar>
      </AppBar>


      <Box sx={{ textAlign: "center", my:4 }}>
        <Typography variant="h2" gutterBottom>Welcome to Flashcards Saas</Typography>
        <Typography variant="h5" gutterBottom>
          {' '}
          The easiest way to create flashcards from scratch
        </Typography>


          <Button variant="contained" color="primary" sx={{ mt: 3}} component="a">
            Get Started
          </Button>
   
          
      </Box>

      <Box sx={{my:6}}>
        <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
          Features:
        </Typography>
        <Grid container spacing={4}>
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
        
        <Box sx={{my:6}} textAlign="center">
          <Typography variant="h4" sx={{ mb: 4 }}>Pricing</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p:3,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: "4px",
                height: '100%'
              }}>
                <Typography variant="h5" gutterBottom >
                  Basic Plan
                </Typography> 
                <Typography variant="h6"> $5/month</Typography>
                <Typography>Access basic features and limited storage
                
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2}}>Choose Basic</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              
              
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
                <Button variant="contained" color="primary" sx={{ mt: 2}} >Choose Pro</Button>
              </Box>
            </Grid>
           
          </Grid>
        </Box>
      </Box>
  </Container>
  ); 
}