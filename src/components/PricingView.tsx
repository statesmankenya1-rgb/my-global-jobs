import { useState } from "react";
import { UserProfile, PlanType } from "../types";
import { Check, ArrowRight, ShieldCheck, CreditCard, Sparkles, Loader2 } from "lucide-react";

interface PricingViewProps {
  currentUser: UserProfile | null;
  onUpgradePlan: (plan: PlanType) => void;
  onOpenModal: (name: "login" | "signup") => void;
}

export default function PricingView({
  currentUser,
  onUpgradePlan,
  onOpenModal
}: PricingViewProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card" | "flutterwave">("mpesa");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Constants mapping pricing details
  const pricingTiers = [
    {
      plan: PlanType.FREE,
      name: "Free",
      price: "$0",
      period: "Forever free",
      desc: "For candidates beginning their global exploration cycle.",
      features: [
        "5 job applications/month",
        "1 ATS CV Builder Template",
        "Basic AI suggestions dashboard",
        "Standard global alerts (Daily)",
        "WhatsApp alerts integration"
      ],
      cta: "Get Started Free"
    },
    {
      plan: PlanType.PRO,
      name: "Pro Coach",
      price: "$12",
      period: "Billed monthly (~KES 1,560 / monthly)",
      desc: "Our most popular tier. Maximize international sponsor matching.",
      features: [
        "Unlimited applications",
        "50+ Premium CV builder exports",
        "Full AI career coach & chat access",
        "Auto cover letter proxy generator",
        "Priority job alerts (Real-time)",
        "Interview prep simulation panel",
        "Application status dashboard",
        "WhatsApp auto-apply capabilities"
      ],
      cta: "Upgrade to Pro Care",
      featured: true
    },
    {
      plan: PlanType.ELITE,
      name: "Elite Visa",
      price: "$29",
      period: "Billed monthly (~KES 3,770 / monthly)",
      desc: "A comprehensive VIP career relocation concierge program.",
      features: [
        "Everything in Pro Coach tier",
        "1-on-1 AI voice mock interviews",
        "Custom salary negotiation coach",
        "LinkedIn profile full auto-write",
        "Visa & relocation legal guides",
        "Dedicated corporate advisor",
        "Priority support SLA (1 hour)",
        "Instant employer sponsor matches"
      ],
      cta: "Get Elite Concierge"
    }
  ];

  const handleInitiatePayment = (plan: PlanType) => {
    if (!currentUser) {
      onOpenModal("signup");
      return;
    }
    setSelectedPlan(plan);
    setSuccess(false);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    // Simulate payment transaction delays
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      if (selectedPlan) {
        onUpgradePlan(selectedPlan);
      }
      setTimeout(() => {
        setSelectedPlan(null);
        setSuccess(false);
      }, 3000);
    }, 2500);
  };

  return (
    <div className="bg-neutral-950 min-h-screen px-4 py-8 md:px-8 max-w-5xl mx-auto w-full relative">
      <div className="text-center mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">Subscription Plans</span>
        <h1 className="font-serif font-black text-3xl md:text-5xl text-white mt-1">Invest in Your Future</h1>
        <p className="text-zinc-500 text-xs md:text-sm mt-1 max-w-xl mx-auto">
          Start for free, unlock premium features when you are ready to apply. Cancel at any time. Secure transactions configured globally.
        </p>
      </div>

      {/* Grid displays */}
      {!selectedPlan ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-zinc-900 rounded-2xl p-6 md:p-8 flex flex-col justify-between relative shadow-xl transition-all ${
                tier.featured
                  ? "border-2 border-amber-500 ring-4 ring-amber-500/5 bg-[radial-gradient(ellipse_at_top,rgba(197,160,76,0.04)_0%,transparent_70%)]"
                  : "border border-zinc-805 border-zinc-800/80"
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest font-mono">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <span className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                  {tier.name}
                </span>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-serif font-black text-white">{tier.price}</span>
                  <span className="text-zinc-500 text-sm">{tier.period !== "Forever free" ? "/mo" : ""}</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal font-mono">{tier.period}</p>
                <p className="text-zinc-400 text-xs leading-relaxed">{tier.desc}</p>

                <ul className="space-y-2 border-t border-zinc-800/60 pt-4 text-zinc-300">
                  {tier.features.map((feat) => (
                    <li key={feat} className="text-xs flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-zinc-800/40 mt-6">
                <button
                  onClick={() => handleInitiatePayment(tier.plan)}
                  className={`w-full py-3 text-xs md:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                    tier.featured
                      ? "bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/10"
                      : "bg-transparent text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  {currentUser?.subscriptionPlan === tier.plan ? "Your Active Plan" : tier.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Easy Checkout Panel interface */
        <div className="bg-zinc-900 border border-zinc-800/85 max-w-md mx-auto rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 animate-fade-in relative overflow-hidden">
          
          {/* Subtle safety header */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full filter blur-xl" />

          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h3 className="text-md font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Secure Checkout
            </h3>
            <button
              onClick={() => setSelectedPlan(null)}
              className="text-xs text-zinc-500 hover:text-zinc-300 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {success ? (
            <div className="text-center py-8 space-y-4 animate-scale-up">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-full flex items-center justify-center text-3xl mx-auto">
                🎉
              </div>
              <h4 className="text-lg font-bold text-white uppercase tracking-wide">Plan Upgraded!</h4>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-xs mx-auto">
                Payment successful. We upgraded <strong>{currentUser?.firstName}</strong>'s account plan to <strong>{selectedPlan.toUpperCase()}</strong> membership tier real-time. Redirecting...
              </p>
              <div className="h-1 bg-zinc-950 rounded overflow-hidden">
                <div className="h-full bg-emerald-500 rounded animate-slide-right w-full" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-mono">Plan selection:</span>
                  <strong className="text-md text-amber-500 uppercase tracking-wide">{selectedPlan.toUpperCase()} TIER</strong>
                </div>
                <div className="text-right">
                  <span className="block text-lg font-black text-white font-serif">
                    {selectedPlan === PlanType.PRO ? "$12" : "$29"}
                  </span>
                  <span className="text-[10px] text-zinc-500 lowercase leading-none">monthly bill</span>
                </div>
              </div>

              {/* Method choice pills */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-zinc-500">Choose preferred channel:</label>
                <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-xl">
                  <button
                    onClick={() => setPaymentMethod("mpesa")}
                    className={`py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      paymentMethod === "mpesa"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    🟢 M-Pesa
                  </button>
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      paymentMethod === "card"
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        : "bg-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    💳 Card Pay
                  </button>
                  <button
                    onClick={() => setPaymentMethod("flutterwave")}
                    className={`py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      paymentMethod === "flutterwave"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    🌍 Flutterwave
                  </button>
                </div>
              </div>

              {/* Fields relative to methods */}
              {paymentMethod === "mpesa" && (
                <div className="space-y-3 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500">M-Pesa Registered Mobile Phone</label>
                    <input
                      type="tel"
                      placeholder="e.g. +254 712 345 678"
                      className="w-full bg-zinc-950 border border-zinc-850 border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none placeholder:text-zinc-700 font-mono"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-normal">
                    We will send an STK Push prompt directly to this phone asking for your M-Pesa PIN.
                  </p>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="space-y-3 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500">Credit Card Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 4111 2222 3333 4444"
                      maxLength={19}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none placeholder:text-zinc-700 font-mono"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="e.g. 12/28"
                        maxLength={5}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none placeholder:text-zinc-700 font-mono"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Secure CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={3}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none placeholder:text-zinc-700 font-mono"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "flutterwave" && (
                <div className="space-y-3 animate-fade-in text-center py-2 bg-zinc-950/40 border border-zinc-800/80 rounded-2xl">
                  <p className="text-zinc-400 text-xs">
                    This triggers safety integrations for West African networks (Nigeria/Ghana support). Payment is securely routed via your card or mobile money.
                  </p>
                </div>
              )}

              <button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    Processing Encrypted payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-black" />
                    Complete Simulated Payment Securely
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="inline-flex items-center gap-1 text-[9px] text-zinc-500 font-mono justify-center">
                  🔐 SSL 256-bit Encrypted Transaction Gateway
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accepted badges */}
      <p className="text-center text-[10px] text-zinc-650 text-zinc-500 mt-10 font-mono">
        All plans are backed by a 30-day risk-free cash-refund guarantee. We accept Visa, Mastercard, AMEX, Airtel, and Safaricom M-Pesa.
      </p>
    </div>
  );
}
