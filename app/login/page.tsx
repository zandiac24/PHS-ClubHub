import {Suspense} from 'react'
import LoginPage from '@/app/ui/login-page'
import BackButton from '@/app/ui/dashboard/back-button'

export default function Login() {
    return(
        <Suspense fallback={<div>Loading...</div>}>
            <BackButton />
            <LoginPage />
        </Suspense>
    )
}