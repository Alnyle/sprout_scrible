'use client'

import { useEffect } from "react";

const Error = ({ 
  error, reset } : 
  { error: Error & { digest?: string }
  reset: () => void
}) => {

  useEffect(() => {
    console.log(error)
  }, [error])

  return (
    <div className="w-full min-h-56 text-lg flex items-center justify-center flex-col">
      <h1>{error.message}</h1>
      <button onClick={() => reset}>Try again</button>
    </div>
  )
}

export default Error;