import { useEffect, useState } from 'react';
import { loginWithEmailLink } from '@/services/firebase';
import { router } from '@inertiajs/react';
import { Page, Spinner, Banner } from '@shopify/polaris';

export default function EmailLinkHandler() {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleEmailLink = async () => {
            try {
                const email = window.localStorage.getItem('emailForSignIn');
                if (!email) {
                    setError('Email not found. Please try the magic link again.');
                    return;
                }

                const userCredential = await loginWithEmailLink(email, window.location.href);
                if (userCredential) {
                    const token = await userCredential.user.getIdToken();
                    // Send token to server to create session
                    await router.post('/auth/callback', { token });
                }
            } catch (error) {
                console.error('Email link sign in error:', error);
                setError('Failed to verify email link');
            }
        };

        handleEmailLink();
    }, []);

    if (error) {
        return (
            <Page>
                <Banner tone="critical">
                    {error}
                </Banner>
            </Page>
        );
    }

    return (
        <Page>
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="large" accessibilityLabel="Authenticating..." />
            </div>
        </Page>
    );
} 