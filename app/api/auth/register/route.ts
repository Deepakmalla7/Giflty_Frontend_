import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firstName, lastName, username, email, password, confirmPassword } = body;

        console.log('Register API: Calling backend at', `${BACKEND_URL}/api/auth/register`);

        // Call backend register API
        const backendResponse = await axios.post(`${BACKEND_URL}/api/auth/register`, {
            firstName,
            lastName,
            username,
            email,
            password,
            confirmPassword
        });

        console.log('Backend response:', backendResponse.data);
        const { success, token, newUser, message } = backendResponse.data;

        if (!success) {
            console.error('Registration failed:', message);
            return NextResponse.json(
                { success: false, message: message || 'Registration failed' },
                { status: 400 }
            );
        }

        // Don't set cookies on registration — user should log in manually
        return NextResponse.json({ 
            success: true, 
            message: message || 'Registration successful'
        });
    } catch (error: any) {
        console.error('Register API error:', error);
        
        // Extract error message from axios error
        const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
        
        return NextResponse.json(
            { 
                success: false, 
                message: errorMessage
            },
            { status: error.response?.status || 500 }
        );
    }
}
