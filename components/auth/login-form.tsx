'use client';

import React from 'react'
import AuthCard from '@/components/auth/auth-card';

const LoginForm = () => {
  return (
    <AuthCard 
      cardTitle='Welcome back!' 
      backButtonHref='/auth/register' 
      backButtonLabel='Create a new account'
      showSocial
      >

        <div>
            <h1>Happy form</h1>
        </div>

    </AuthCard> 
  )
}

export default LoginForm;