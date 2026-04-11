import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { X, Instagram } from "lucide-react";

export function AuthModal({ onClose }) {
  const instagramLoginUrl = "https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=3306198099545111&redirect_uri=https%3A%2F%2Fcosmic-travesseiro-8a059c.netlify.app%2Fauth%2Fcallback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md relative bg-white border border-gray-200 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2563eb] to-[#f97316] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">IL</div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-500 mt-2">
            Log in to access your Instagram CRM dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-8 px-6">
          <a
            href={instagramLoginUrl}
            className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-3 transition-transform active:scale-[0.98] shadow-sm hover:shadow-md"
            style={{ backgroundColor: '#0095f6', color: '#ffffff' }}
          >
            <Instagram className="w-6 h-6" />
            <span className="text-[17px]">Login with Instagram</span>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
