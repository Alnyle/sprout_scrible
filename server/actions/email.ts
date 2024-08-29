'use server'

import getBaseURL from "@/lib/base-url"
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

export const sendVericationEmail = async (email: string, token: string) => {


    // attach token to url to know who click the token
    const confirmationLink = `${domain}/auth/new-vericiation-token?token=${token}`;

    
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Hello world',
        html: `<p>Click to <a href='${confirmationLink}'>confirm your email</a></p>`,
      });
    
      if (error) {
        console.log(error)
      }
      if (data) return data;
}

export const sendPasswordResetEmail = async (email: string, token: string) => {


    // attach token to url to know who click the token
    const confirmationLink = `${domain}/auth/new-password?token=${token}`;

    
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Hello world',
        html: `<p>Click here <a href='${confirmationLink}'> reset your password</a></p>`,
      });
    
      if (error) {
        console.log(error)
      }
      if (data) return data;
}


// RESEND_API_KEY