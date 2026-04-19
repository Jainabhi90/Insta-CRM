import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Check, MessageSquare, TrendingUp, Zap, BarChart3, Target, Sun, Star } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  hover: {
    y: -8,
    transition: { duration: 0.3, ease: "easeInOut" },
    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
  }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export function LandingPage({
  onGetStarted,
  onLogin,
  onCreateAccount,
  onGoToPricing,
  onToggleTheme,
  isGoogleAuthenticated,
  onGoToGoogleLanding,
  onLogout
}) {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-theme-primary to-theme-accent rounded-lg" />
            <span className="text-xl font-black">InstaLead</span>
          </div>
          <nav className="flex items-center gap-6">
            <button
              onClick={onGoToPricing}
              className="text-gray-600 hover:text-theme-primary transition-colors font-medium"
            >
              Pricing
            </button>
            {!isGoogleAuthenticated && (
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-gray-600 hover:text-theme-primary transition-colors font-medium"
                >
                  Features
                </button>
                <button
                  onClick={onToggleTheme}
                  className="p-2 text-gray-600 hover:text-theme-primary transition-colors"
                >
                  <Sun className="w-5 h-5" />
                </button>
                <Button variant="outline" onClick={onLogin}>
                  Login
                </Button>
                <Button
                  variant="outline"
                  className="border-theme-primary text-theme-primary hover:bg-blue-50"
                  onClick={onGoToGoogleLanding}
                >
                  Google Onboarding
                </Button>
              </>
            )}
            {isGoogleAuthenticated && (
              <Button variant="outline" onClick={onLogout}>
                Logout
              </Button>
            )}
            <Button className="bg-theme-primary hover:bg-theme-primary-hover" onClick={onCreateAccount || onGetStarted}>
              Connect Instagram
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 text-center">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.h1 
            className="text-5xl md:text-6xl mb-6 font-bold leading-[1.1]"
            variants={fadeInUp}
          >
            Stop Losing Sales in Your{" "}
            <span className="bg-gradient-to-r from-theme-primary to-theme-accent bg-clip-text text-transparent">
              Instagram DMs
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 mb-4"
            variants={fadeInUp}
          >
            The first "India-First" Instagram CRM that turns comments into customers.
          </motion.p>
          <motion.p 
            className="text-lg text-gray-500 mb-8"
            variants={fadeInUp}
          >
            Automate your replies, score your leads, and grow your revenue for the price of a pizza.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
          >
            <Button 
              size="lg" 
              className="bg-theme-primary hover:bg-theme-primary-hover text-white px-8 py-6 text-lg group relative overflow-hidden transition-all duration-300 transform active:scale-95"
              onClick={onCreateAccount || onGetStarted}
            >
              <span className="relative z-10">Connect Instagram</span>
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-6 text-lg border-theme-primary text-theme-primary hover:bg-blue-50 transition-all duration-300 active:scale-95"
              onClick={onLogin}
            >
              Login
            </Button>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-center gap-4 mt-12 pt-8 border-t border-gray-100"
            variants={fadeInUp}
          >
            <div className="flex -space-x-4">
              {[
                "https://randomuser.me/api/portraits/men/32.jpg",
                "https://randomuser.me/api/portraits/women/44.jpg",
                "https://randomuser.me/api/portraits/men/68.jpg",
                "https://randomuser.me/api/portraits/women/65.jpg",
                "https://randomuser.me/api/portraits/men/22.jpg",
              ].map((src, i) => (
                <motion.img
                  key={i}
                  src={src}
                  alt={`Creator ${i + 1}`}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
                  whileHover={{ y: -5, scale: 1.1, zIndex: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              ))}
            </div>
            <div className="text-left">
              <div className="flex gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600 block">
                Trusted by 500+ Indian creators
              </span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Pain Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-3xl text-center mb-12 font-semibold"
            variants={fadeInUp}
          >
            Sound Familiar?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <MessageSquare className="w-6 h-6 text-red-600" />,
                text: <>"Is your DM folder a <strong>graveyard</strong> of 'Price?' and 'Interested' messages?"</>
              },
              {
                icon: <Zap className="w-6 h-6 text-red-600" />,
                text: <>"Spending <strong>4 hours a day</strong> manually replying 'Check DM'?"</>
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-red-600" />,
                text: <>"Global tools like ManyChat charging you <strong>₹1,500/month?</strong> Switch to the local expert."</>
              }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} whileHover="hover">
                <Card className="border-2 border-red-100 bg-red-50/30 h-full transition-shadow hover:shadow-lg">
                  <CardContent className="pt-6">
                    <motion.div 
                      className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      {item.icon}
                    </motion.div>
                    <p className="text-gray-700">{item.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white" id="features">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-3xl text-center mb-4 font-semibold"
            variants={fadeInUp}
          >
            The 3 Pillars of Automated Growth
          </motion.h2>
          <motion.p 
            className="text-center text-gray-600 mb-12"
            variants={fadeInUp}
          >
            Everything you need to turn Instagram into your 24/7 sales employee
          </motion.p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Auto-Responder */}
            <motion.div variants={fadeInUp} whileHover="hover">
              <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all h-full bg-white hover:shadow-xl">
                <CardContent className="pt-6">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-theme-primary to-theme-primary-light rounded-xl flex items-center justify-center mb-4 text-white"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Zap className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-xl mb-3 font-semibold">Auto-Responder</h3>
                  <p className="text-gray-600 mb-4">
                    Set custom triggers for Reels and Posts. Never miss a "Price?" question again.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Instant replies to common questions",
                      "Custom triggers per post",
                      "Works 24/7, even while you sleep"
                    ].map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Lead Score Dashboard */}
            <motion.div variants={fadeInUp} whileHover="hover">
              <Card className="border-2 border-orange-100 hover:border-orange-300 transition-all h-full bg-white hover:shadow-xl">
                <CardContent className="pt-6">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-theme-accent to-theme-accent-light rounded-xl flex items-center justify-center mb-4 text-white"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Target className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-xl mb-3 font-semibold">Lead Score Dashboard</h3>
                  <p className="text-gray-600 mb-4">
                    See who is a "Hot Lead" vs. a "Window Shopper" at a glance.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "1-100 scoring system",
                      "Track engagement patterns",
                      "Focus on ready-to-buy customers"
                    ].map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Post Analytics */}
            <motion.div variants={fadeInUp} whileHover="hover">
              <Card className="border-2 border-green-100 hover:border-green-300 transition-all h-full bg-white hover:shadow-xl">
                <CardContent className="pt-6">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-theme-success to-theme-success-light rounded-xl flex items-center justify-center mb-4 text-white"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <BarChart3 className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-xl mb-3 font-semibold">Post Analytics</h3>
                  <p className="text-gray-600 mb-4">
                    See exactly which posts drive the most engagement.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Post-level performance tracking",
                      "Lead generation metrics",
                      "Engagement insights"
                    ].map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20 bg-blue-50/50">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-3xl text-center mb-12 font-semibold"
            variants={fadeInUp}
          >
            Don't just take our word for it
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                text: "Before InstaLead, I was spending minimum 3 hours a day just DMing links to my courses. Now the bot does it instantly. My sales increased by 40% in two weeks because nobody has to wait.",
                author: "Priya S.",
                role: "Fitness Coach, 120k followers",
                img: "https://randomuser.me/api/portraits/women/32.jpg"
              },
              {
                text: "I tried ManyChat but it was simply too complex and incredibly expensive for what I needed. InstaLead took 5 minutes to set up and the lead scoring completely changed how I prioritize agency calls.",
                author: "Rahul M.",
                role: "Marketing Agency Founder",
                img: "https://randomuser.me/api/portraits/men/46.jpg"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Card className="border border-blue-100 shadow-md hover:shadow-xl transition-all bg-white overflow-hidden h-full">
                  <CardContent className="pt-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-lg text-gray-700 mb-6 italic leading-relaxed">
                      "{item.text}"
                    </p>
                    <div className="flex items-center gap-4">
                      <motion.img 
                        src={item.img} 
                        alt={item.author} 
                        className="w-14 h-14 rounded-full border-2 border-blue-100" 
                        whileHover={{ scale: 1.1 }}
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{item.author}</p>
                        <p className="text-sm text-theme-primary font-medium">{item.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-theme-primary to-theme-accent rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl mb-4 text-white font-bold">
            Ready to Stop Losing Money?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join 500+ Indian creators who've automated their Instagram sales
          </p>
          <Button 
            size="lg" 
            className="bg-white text-theme-primary hover:bg-gray-100 px-8 py-6 text-lg"
            onClick={onCreateAccount || onGetStarted}
          >
            Connect Instagram
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2026 InstaLead. Made in India 🇮🇳</p>
        </div>
      </footer>
    </div>
  );
}
