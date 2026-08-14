// Plans.js — Stripe-compatible plan configuration
// amount is in the smallest currency unit (cents for USD, paise for INR).
// priceId maps to the Stripe Product Price ID created in your Stripe Dashboard.

export const PLANS = {

    free: {
        id: "free",
        name: "Free",
        amount: 0,
        credits: 100,
        currency: "usd",
        validity: 30,
        priceId: null   // No Stripe price for free plan
    },

    starter: {
        id: "starter",
        name: "Starter",
        amount: 299,    // $2.99 in cents (USD) — adjust as needed
        credits: 500,
        currency: "usd",
        validity: 30,
        priceId: process.env.STRIPE_PRICE_STARTER  // Set in .env from Stripe Dashboard
    },

    pro: {
        id: "pro",
        name: "Pro",
        amount: 799,    // $7.99 in cents (USD) — adjust as needed
        credits: 1000,
        currency: "usd",
        validity: 30,
        priceId: process.env.STRIPE_PRICE_PRO      // Set in .env from Stripe Dashboard
    }

}