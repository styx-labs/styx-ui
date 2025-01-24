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

const pricingTiers = [
  {
    name: "Basic",
    price: 9.99,
    credits: 100,
    costPerSearch: "$0.10",
    description:
      "Perfect for small teams or individual recruiters getting started with AI-powered recruiting.",
  },
  {
    name: "Growth",
    price: 44.99,
    credits: 500,
    costPerSearch: "$0.09",
    popular: true,
    description:
      "Ideal for growing teams who need advanced features and higher volume candidate processing.",
  },
  {
    name: "Enterprise",
    isEnterprise: true,
    description:
      "Custom solutions for large organizations with high-volume recruiting needs.",
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
              {!tier.isEnterprise ? (
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-purple-600">
                    ${tier.price}
                  </span>
                  <span className="text-muted-foreground ml-2">/package</span>
                </div>
              ) : (
                <div className="text-2xl font-bold mb-4 text-purple-600">
                  Custom Pricing
                </div>
              )}
              <div className="bg-muted p-4 rounded-lg mb-4">
                {!tier.isEnterprise ? (
                  <>
                    <div className="text-lg font-semibold">
                      {tier.credits} credits
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tier.costPerSearch} per search
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-lg font-semibold">
                      500-50,000 credits
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Volume-based pricing
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${
                  tier.popular
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "hover:border-purple-500 hover:text-purple-600"
                }`}
                variant={tier.popular ? "default" : "outline"}
                onClick={() =>
                  tier.isEnterprise
                    ? (window.location.href = "mailto:support@styxlabs.co")
                    : handleSelectPlan(tier.name.toLowerCase())
                }
                disabled={!tier.isEnterprise && isLoading}
              >
                {!tier.isEnterprise ? (
                  isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Get Started
                    </>
                  )
                ) : (
                  "Contact Sales"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
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
          <p className="text-sm text-muted-foreground mt-6">
            Credits never expire and can be used across any job posting in your
            account. Higher tier plans include additional features and premium
            support options.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
