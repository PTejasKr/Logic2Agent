import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to continue to Logic2Agent</p>
                </div>

                {/* Clerk Sign In Component */}
                <div className="flex justify-center">
                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "bg-gray-900 border border-gray-800 shadow-2xl",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                socialButtonsBlockButton: "bg-gray-800 border-gray-700 hover:bg-gray-700 text-white",
                                formButtonPrimary: "bg-green-600 hover:bg-green-700 text-white",
                                footerActionLink: "text-green-600 hover:text-green-500",
                                formFieldInput: "bg-gray-800 border-gray-700 text-white",
                                formFieldLabel: "text-gray-300",
                                identityPreviewText: "text-white",
                                identityPreviewEditButton: "text-green-600",
                            }
                        }}
                        routing="path"
                        path="/sign-in"
                    />
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-8">
                    Don't have an account?{' '}
                    <a href="/sign-up" className="text-green-600 hover:text-green-500 font-medium">
                        Sign up for free
                    </a>
                </p>
            </div>
        </div>
    )
}
