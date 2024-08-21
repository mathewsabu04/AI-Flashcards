'use client'

import {useEffect,useState} from 'react'
import { useRouter } from 'next/navigation';
import getStripe from '@/utils/get-stripe';
import { useSearchParams } from 'next/navigation';
import { Box, Typography } from '@mui/material';


const ResultPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [loading,setLoading] = useState(true);
    const [session,setSession] = useState(null);
    const [error,setError] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            if(!sessionId) return;
            try{
                const res = await fetch(`/api/generate/checkout_sessions/${sessionId}`);
                const data = await res.json();
                if(res.ok)
                {
                    setSession(data);
                }
                else
                {
                    setError(data.message);
                }
            }
            catch(error){
                setError(error.message);
            }
            finally{
                setLoading(false);
            }
        }
        fetchSession();
    }, [sessionId]);

    if(loading) 
        return (
    <Container maxWidth="100vw" sx={{
        textAlign: 'center',
        mt:4

    }}>

        <CircularProgress>
            <Typography variant="h6" gutterBottom>
                Loading...
            </Typography>
        </CircularProgress>
    </Container>
    )
    if(error)
        return (
            <Container maxWidth="100vw" sx={{
                textAlign: 'center',
                mt:4
            }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography> 
            </Container>
        );

    return (
        <Container maxWidth="100vw" sx={{
            textAlign: 'center',
            mt:4
        }}>
            {
                session.payment_status === 'paid' ? (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Payment successful
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant='h6'>Session ID: {session.id}</Typography>
                            <Typography variant='h6'>We have received your payment</Typography>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Payment unsuccessful
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant='h6'>Session ID: {session.id}</Typography>
                            <Typography variant='h6'>There was an issue with your payment</Typography>
                        </Box>
                    </>
                )
            }
        </Container>
    )
}

export default ResultPage;