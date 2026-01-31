import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Get Started</h1>
                    <p className="text-gray-400">Create your Logic2Agent account</p>
                </div>

                {/* Clerk Sign Up Component */}
                <div className="flex justify-center">
                    <SignUp
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
                        path="/sign-up"
                    />
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-8">
                    Already have an account?{' '}
                    <a href="/sign-in" className="text-green-600 hover:text-green-500 font-medium">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    )
}
