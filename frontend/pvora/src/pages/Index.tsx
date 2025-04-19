import { useState, useEffect, useRef } from "react";
import {
  Mail,
  ArrowRight,
  Bot,
  Shield,
  Sparkles,
  BarChart,
  Clock,
  User,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

// HowItWorks component definition
const HowItWorks = () => {
  const sectionRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Email Reception",
      description:
        "New emails arrive in your inbox and are intercepted by our system.",
    },
    {
      title: "Classification & Analysis",
      description:
        "AI analyzes content, context, and metadata to determine importance and category.",
    },
    {
      title: "Action Extraction",
      description:
        "AI identifies required actions, deadlines, and responsibilities from the email.",
    },
    {
      title: "Smart Interface Presentation",
      description:
        "System presents analyzed emails with summaries, actions, and response suggestions.",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const stepElements = section.querySelectorAll(".timeline-step");
      stepElements.forEach((step, index) => {
        const rect = step.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2) {
          setActiveStep(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="how-it-works" className="py-16 bg-gray-50" ref={sectionRef}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our collaborative AI agents work together to transform your inbox
            into an organized, actionable system.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-100">
            {/* Animated progress */}
            <div
              className="bg-blue-500 w-1 transition-all duration-500 ease-in-out"
              style={{ height: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {steps.map((step, index) => (
            <div key={index} className="relative mb-12 timeline-step">
              <div className="flex items-center mb-2">
                {/* Left column (text or empty depending on even/odd) */}
                {index % 2 === 0 ? (
                  <>
                    <div className="w-1/2 pr-8 text-right">
                      <h3 className="text-xl font-bold text-primary">
                        {step.title}
                      </h3>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center z-10 shadow-md">
                      {index + 1}
                    </div>
                    <div className="w-1/2 pl-8">
                      <p
                        className={`text-gray-600 transition-opacity duration-500 ${
                          activeStep >= index ? "opacity-100" : "opacity-30"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-1/2 pr-8 text-right">
                      <p
                        className={`text-gray-600 transition-opacity duration-500 ${
                          activeStep >= index ? "opacity-100" : "opacity-30"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center z-10 shadow-md">
                      {index + 1}
                    </div>
                    <div className="w-1/2 pl-8">
                      <h3 className="text-xl font-bold text-primary">
                        {step.title}
                      </h3>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main Index component
const Index = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
  useEffect(() => {
    fetch("http://localhost:5000/api/emails", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          navigate("/dashboard");
        }
      })
      .catch(() => {
        // Not logged in or error, do nothing
      });
  }, []);

  const plans = [
    {
      name: "Free",
      description: "Basic email management for personal use",
      price: {
        monthly: 0,
        annual: 0,
      },
      features: [
        "Connect 1 email account",
        "Basic email categorization",
        "100 AI-processed emails per month",
        "Email summaries",
        "Basic spam protection",
      ],
    },
    {
      name: "Pro",
      description: "Advanced features for professionals",
      price: {
        monthly: 9.99,
        annual: 7.99,
      },
      popular: true,
      features: [
        "Connect 3 email accounts",
        "Advanced email categorization",
        "Unlimited AI-processed emails",
        "Priority inbox",
        "Advanced spam protection",
        "Email analytics",
        "Quick actions & templates",
      ],
    },
    {
      name: "Business",
      description: "Complete solution for teams and businesses",
      price: {
        monthly: 19.99,
        annual: 16.99,
      },
      features: [
        "Connect unlimited email accounts",
        "Team collaboration features",
        "Admin dashboard",
        "Custom integrations",
        "Advanced analytics",
        "Priority support",
        "Custom AI training",
        "99.9% uptime SLA",
      ],
    },
  ];

  const handleSignIn = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate loading and redirect
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate loading and redirect
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const handleDemoAccess = () => {
    setLoading(true);

    // Simulate loading and redirect
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 bg-white border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-primary" />
            <h1 className="ml-2 text-xl font-bold">AInbox</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Pricing
            </a>
          </nav>
          <div>
            <Button
              variant="outline"
              onClick={() =>
                (window.location.href = "http://localhost:5000/auth/login")
              }
              className="w-full flex justify-center items-center gap-2 mt-1"
            >
              <Mail className="w-4 h-4" />
              Sign in with Gmail
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Smart Email Triage with Agentic AI Assistants
            </h1>
            <p className="text-lg text-gray-600 mb-6 md:mb-8">
              Our AI agents collaborate to classify, extract action items, and
              generate responses from your emails, saving you hours each day.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={() =>
                  document
                    .querySelector("#auth-card")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Start For Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
              <div className="bg-primary p-4 text-white flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <h3 className="font-medium">Inbox</h3>
              </div>
              <div className="p-4 space-y-2">
                <div className="border-l-4 border-amber-500 pl-3 py-2 bg-amber-50 rounded-r-md">
                  <p className="text-sm font-medium">Project Proposal Review</p>
                  <p className="text-xs text-gray-500">
                    Urgent: Action required by EOD
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-3 py-2 bg-green-50 rounded-r-md">
                  <p className="text-sm font-medium">Team Meeting Schedule</p>
                  <p className="text-xs text-gray-500">
                    Choose your preferred time slot
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-3 py-2 bg-purple-50 rounded-r-md">
                  <p className="text-sm font-medium">Monthly Report Summary</p>
                  <p className="text-xs text-gray-500">
                    AI-generated key insights
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 p-3 border-t border-gray-200">
                <div className="flex items-center text-xs text-blue-700">
                  <Bot className="h-4 w-4 mr-1" />
                  <span>AI Assistant: 3 actions identified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Intelligent Email Management
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform transforms how you handle emails with
              smart automation and collaborative AI agents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-blue-500">
              <CardHeader>
                <Sparkles className="h-10 w-10 text-blue-500 mb-2" />
                <CardTitle>Smart Classification</CardTitle>
                <CardDescription>
                  AI agents automatically sort and prioritize incoming emails
                  based on content and urgency.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    Urgent vs. non-urgent categorization
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    Topic-based labeling
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    Sender reputation analysis
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-amber-500">
              <CardHeader>
                <Clock className="h-10 w-10 text-amber-500 mb-2" />
                <CardTitle>Action Extraction</CardTitle>
                <CardDescription>
                  Extract and prioritize action items from emails to ensure
                  nothing falls through the cracks.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    Automated task extraction
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    Deadline identification
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    Priority-based sorting
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-purple-500">
              <CardHeader>
                <Bot className="h-10 w-10 text-purple-500 mb-2" />
                <CardTitle>AI Response Generation</CardTitle>
                <CardDescription>
                  Create appropriate response drafts based on email content and
                  your communication style.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    Smart reply suggestions
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    Tone and style matching
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    One-click responses
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/*Pricing*/}
      <section id="pricing" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="flex justify-center items-center mb-10">
            <span
              className={`mr-3 ${
                !isAnnual ? "font-medium text-primary" : "text-gray-500"
              }`}
            >
              Monthly
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAnnual}
                onChange={() => setIsAnnual(!isAnnual)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
            <span
              className={`ml-3 ${
                isAnnual ? "font-medium text-primary" : "text-gray-500"
              }`}
            >
              Annual{" "}
              <span className="text-xs ml-1 bg-amber-100 text-amber-800 py-0.5 px-1.5 rounded-full">
                Save 20%
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`border rounded-lg overflow-hidden ${
                  plan.popular
                    ? "border-primary shadow-lg relative"
                    : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-xs py-1 px-3 rounded-bl">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-gray-500">/month</span>
                    )}
                    {isAnnual && plan.price.monthly > 0 && (
                      <p className="text-sm text-gray-500">Billed annually</p>
                    )}
                  </div>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? ""
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check
                          size={16}
                          className="text-green-500 mt-1 mr-2 flex-shrink-0"
                        />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section id="auth-card" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <Card className="border-none shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  Get Started with AInbox
                </CardTitle>
                <CardDescription>
                  Sign in to your account or create a new one
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? "Signing In..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Input
                          type="text"
                          placeholder="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleDemoAccess}
                      disabled={loading}
                    >
                      <Bot className="mr-2 h-4 w-4" />
                      Try Demo Access
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-center text-sm text-gray-500">
                By signing up, you agree to our Terms of Service and Privacy
                Policy
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 mr-2" />
                <h3 className="text-lg font-bold">AInbox</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Smart email triage and action automation with AI assistants.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Case Studies
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Reviews
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; 2025 AInbox. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
