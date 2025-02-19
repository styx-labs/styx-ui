import { CreditCard, Loader2, Coins } from "lucide-react";
import { usePricing } from "@/hooks/usePricing";
import { useSearchCredits } from "@/hooks/useSearchCredits";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "lucide-react";

const pricingTiers = [
  {
    name: "Starter",
    price: 0,
    credits: 50,
    description: "Best for individuals",
    features: [
      "Unlimited Users",
      "Export",
      "AI search and outreach",
      "Chrome Extension",
      "Limited to 3 jobs",
    ],
  },
  {
    name: "Growth",
    price: 200,
    credits: 1000,
    popular: true,
    description: "Best for small teams and agencies",
    features: [
      "Everything from Starter",
      "Rollover credits",
      "Unlimited Jobs",
      "Dedicated Support",
    ],
  },
  {
    name: "Pro",
    price: 750,
    credits: 5000,
    description: "Best for large teams",
    features: [
      "Everything from Growth",
      "Dedicated Slack Channel",
      "ATS integrations",
    ],
  },
];

export default function PricingPage() {
  const { handleSelectPlan, isLoading } = usePricing();
  const { searchCredits, loading: creditsLoading } = useSearchCredits();

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Search Credits</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Power up your recruiting with AI-driven candidate evaluation and
          outreach. Choose the plan that best fits your needs.
        </p>
        {!creditsLoading && searchCredits !== null && (
          <Badge
            variant="secondary"
            className="mt-6 bg-purple-100 text-purple-700 hover:bg-purple-200"
          >
            <Coins className="w-4 h-4 mr-2" />
            <span>{searchCredits} search credits remaining</span>
          </Badge>
        )}
      </div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {pricingTiers.map((tier) => (
          <Card
            key={tier.name}
            className={`relative ${
              tier.popular
                ? "border-purple-500 shadow-lg shadow-purple-100"
                : ""
            } hover:border-purple-300 transition-colors`}
          >
            {tier.popular && (
              <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-purple-500 hover:bg-purple-600">
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-purple-600">
                    ${tier.price}
                  </span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                {/* <div className="text-sm text-muted-foreground mb-2">
                  Save 10% with annual billing
                </div> */}
              </>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <div className="text-lg font-semibold">
                  {tier.credits} credits
                </div>
              </div>
              <ul className="space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckIcon className="w-4 h-4 mr-2 text-purple-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {tier.price > 0 ? (
                <Button
                  className={`w-full ${
                    tier.popular
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "hover:border-purple-500 hover:text-purple-600"
                  }`}
                  variant={tier.popular ? "default" : "outline"}
                  onClick={() => handleSelectPlan(tier.name.toLowerCase())}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Get Started
                    </>
                  )}
                </Button>
              ) : (
                <Button className="w-full" variant="outline" disabled>
                  Free Tier
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Enterprise CTA */}
      <div className="text-center mt-8 mb-12">
        <h2 className="text-2xl font-bold mb-4">Looking for Enterprise?</h2>
        <p className="text-muted-foreground mb-4">
          Interested in enterprise features like dedicated support, higher
          limits, and unlimited company + people data?
        </p>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "mailto:support@styxlabs.co")}
        >
          Contact Us
        </Button>
      </div>

      {/* FAQ or Additional Info */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>About Search Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-6">
            Search credits power our AI-driven candidate evaluation system. Each
            credit unlocks:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Profile Analysis",
                description:
                  "Comprehensive LinkedIn profile evaluation using advanced AI",
              },
              {
                title: "Trait Scoring",
                description:
                  "AI-powered assessment of candidate traits against job requirements",
              },
              {
                title: "Email Discovery",
                description: "Automated email finding for candidate outreach",
              },
              {
                title: "Smart Messaging",
                description: "AI-generated personalized outreach messages",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
