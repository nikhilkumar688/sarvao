import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield, Eye } from "lucide-react";
import { Link } from "wouter";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}?payment=success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your donation!",
      });
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full btn-primary"
      >
        {isProcessing ? "Processing..." : "Complete Donation"}
      </Button>
    </form>
  );
};

export default function Donate() {
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);

  const createPaymentIntent = async () => {
    if (!amount || !donorName || !donorEmail) {
      return;
    }

    setIsCreatingPayment(true);
    try {
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount: parseFloat(amount),
        donorName,
        donorEmail,
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error creating payment intent:", error);
    } finally {
      setIsCreatingPayment(false);
    }
  };

  if (clientSecret) {
    return (
      <div className="min-h-screen bg-muted/50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Complete Your Donation</CardTitle>
              <div className="text-center text-muted-foreground">
                Donating ${amount} to Sarvao.org
              </div>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Secure Stripe Processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>100% Transparent Tracking</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Support Sarvao.org</CardTitle>
            <div className="text-center text-muted-foreground">
              Your donation helps us build transparent, open-source solutions for communities worldwide.
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="donorName">Full Name</Label>
                <Input
                  id="donorName"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donorEmail">Email Address</Label>
                <Input
                  id="donorEmail"
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Donation Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="25.00"
                required
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[25, 50, 100, 250].map((presetAmount) => (
                <Button
                  key={presetAmount}
                  variant="outline"
                  onClick={() => setAmount(presetAmount.toString())}
                  className="w-full"
                >
                  ${presetAmount}
                </Button>
              ))}
            </div>

            <Button
              onClick={createPaymentIntent}
              disabled={!amount || !donorName || !donorEmail || isCreatingPayment}
              className="w-full btn-primary"
            >
              {isCreatingPayment ? "Creating..." : "Continue to Payment"}
            </Button>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure Processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Full Transparency</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
