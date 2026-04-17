import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowLeft, MessageSquare, Reply, Clock3 } from "lucide-react";

const GOOGLE_CALLBACK_URL = "https://insta-crm.vercel.app/auth/google/callback";

export function GoogleLandingPage({ onBackToInstagramLanding }) {
  const handleGoogleLogin = () => {
    // Will connect to actual Google OAuth later.
    alert(`Google login redirects to: ${GOOGLE_CALLBACK_URL}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-blue-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-300" />
            <div>
              <p className="text-lg font-semibold leading-none">Automation</p>
              <p className="text-xs text-gray-300">Instagram CRM Tool</p>
            </div>
          </div>
          <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800" onClick={onBackToInstagramLanding}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Insta Login Page
          </Button>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 pb-16 pt-20 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-4 text-5xl font-bold leading-tight md:text-6xl">Automate your Instagram customer responses</h1>
            <p className="mb-3 text-xl text-gray-200">Save 5+ hours per week by automating replies</p>
            <p className="mb-10 text-gray-300">Use Google sign-in first, then connect your Instagram account in the next step.</p>
            <Button size="lg" className="px-10 py-6 text-lg font-semibold bg-white text-gray-900 hover:bg-gray-200" onClick={handleGoogleLogin}>
              Continue with Google
            </Button>
            <p className="mt-4 text-sm text-gray-300">Redirect URL: {GOOGLE_CALLBACK_URL}</p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <h2 className="mb-8 text-center text-3xl font-semibold">Core Features</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-gray-700 bg-gray-900/60 text-white">
              <CardHeader>
                <CardTitle>Read Comments</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">Pull comments from Instagram posts and identify intent quickly.</CardContent>
            </Card>
            <Card className="border-gray-700 bg-gray-900/60 text-white">
              <CardHeader>
                <CardTitle>Automated Replies</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">Trigger response templates for frequent queries and sales prompts.</CardContent>
            </Card>
            <Card className="border-gray-700 bg-gray-900/60 text-white">
              <CardHeader>
                <CardTitle>Save Time</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">Reduce manual handling and focus on high-intent leads first.</CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-14">
          <h2 className="mb-8 text-center text-3xl font-semibold">How It Works</h2>
          <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-4">
            <StepCard icon={<MessageSquare className="h-5 w-5" />} title="Sign in with Google" />
            <StepCard icon={<Reply className="h-5 w-5" />} title="Connect Instagram account" />
            <StepCard icon={<Clock3 className="h-5 w-5" />} title="Set up automation rules" />
            <StepCard icon={<Clock3 className="h-5 w-5" />} title="Let it run automatically" />
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-6 px-4 text-sm text-gray-300">
          <a href="/privacy" className="hover:text-white">Privacy</a>
          <a href="/terms" className="hover:text-white">Terms</a>
          <a href="mailto:hello@insta-crm.app" className="hover:text-white">Contact</a>
        </div>
      </footer>
    </div>
  );
}

function StepCard({ icon, title }) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-5 text-left">
      <div className="mb-3 inline-flex rounded-lg bg-blue-500/20 p-2 text-blue-200">{icon}</div>
      <p className="text-sm font-medium text-gray-100">{title}</p>
    </div>
  );
}
