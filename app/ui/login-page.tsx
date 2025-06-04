//admin login page
'use client'
import { useState, useEffect} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const [token, setToken] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams();
  const [loginType, setLoginType] = useState<'admin' | 'sponsor'>('admin')
  
  const urlToken = searchParams.get('token');
  const typeParam = searchParams.get('type')

  useEffect(() => {
    if (urlToken || typeParam === 'sponsor') {
      setLoginType('sponsor')
      if (urlToken) {
        setToken(urlToken)
      }
    }
  }, [urlToken, typeParam])
  

  //upon submission, attempt to authorize login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const tokenToUse = token || urlToken;
      const reqBody = loginType==='admin'?{username, password}:{token: tokenToUse}
        
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
      })
      
      //if credentials are good, access admin panel
      if (response.ok) {
        const ret = await response.json();
        if(ret.type === 'admin'){
            router.push('/dashboard/approval')
            router.refresh()
        }
        else{
            router.push('/dashboard/update')
            router.refresh()
        }
      } else {
        const data = await response.json()
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="text-black min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full sm:w-[80vw] space-y-8">
        <div>
        {loginType === 'admin'? (
        <>
          <h2 className="mt-6 text-center justify-center text-3xl font-bold">
            Teacher Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to access the administrator dashboard.
          </p>
          </>
        ) : (
           <>
          <h2 className="mt-6 text-center justify-center text-3xl font-bold">
            Sponsor Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your sponsor token from the email link to access the club information update page.
          </p>
          </> 
        )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            {loginType === 'admin'? (
            <>
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 border-[3px] placeholder-gray-500 appearance-none order-[3px] border-yellow-200 rounded-xl text-gray-700 mb-3 leading-tight focus:border-yellow-400 focus:outline-none"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 border-[3px] placeholder-gray-500 appearance-none order-[3px] border-yellow-200 rounded-xl text-gray-700 mb-3 leading-tight focus:border-yellow-400 focus:outline-none"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </> 
            ) : (
                <div>
                <label htmlFor="token" className="sr-only">
                  Access Token
                </label>
                <input
                  id="token"
                  name="token"
                  type="text"
                  required
                  className="w-full px-4 py-3 border-[3px] placeholder-gray-500 appearance-none border-yellow-200 rounded-xl text-gray-700 mb-3 leading-tight focus:border-yellow-400 focus:outline-none"
                  placeholder="Enter your access token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
                {urlToken && (
                  <p className="text-sm text-green-600 text-center">
                    Token loaded from URL
                  </p>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md bg-yellow-100 text-sm font-medium hover:bg-yellow-200"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
