export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  stock: number;
  description: string;
}

import { stripe } from "@/config/stripe";
import { NextRequest, NextResponse } from "next/server";

async function getActiveProducts() {
  const stripeProducts = await stripe.products.list();
  const activeProducts = stripeProducts.data.filter(
    (item: any) => item.active === true
  );
  return activeProducts;
}
export async function POST(request: NextRequest) {
  const userId = "cm7a5184n0000vp3wsc164zu1";
  try {
    const { products } = await request.json();
    const checkoutProducts: CartItem[] = products;
    // Creating Stripe Non existing Stripe Products
    let activeProducts = await getActiveProducts();
    try {
      for (const product of checkoutProducts) {
        const stripeProduct = activeProducts?.find(
          (stripeProduct: any) =>
            stripeProduct?.name?.toLowerCase() === product?.name?.toLowerCase()
        );

        if (stripeProduct === undefined) {
          const unitAmount = Math.round(product.price * 100);

          const prod = await stripe.products.create({
            name: product.name,
            default_price_data: {
              unit_amount: unitAmount,
              currency: "usd",
            },
            images: [product.image],
          });
          console.log(`Product created: ${prod.name}`);
        } else {
          console.log("Product already exists");
        }
      }
    } catch (error) {
      console.error("Error creating products:", error);
    }

    //Creating Checkout Stripe Items
    activeProducts = await getActiveProducts();
    let checkoutStripeProducts: any = [];
    for (const product of checkoutProducts) {
      const stripeProduct = activeProducts?.find(
        (stripeProduct: any) =>
          stripeProduct?.name?.toLowerCase() === product?.name?.toLowerCase()
      );

      if (stripeProduct) {
        checkoutStripeProducts.push({
          price: stripeProduct?.default_price,
          quantity: product.qty,
        });
      }
    }

    //Creating Checkout Session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    console.log(checkoutStripeProducts);
    const session = await stripe.checkout.sessions.create({
      line_items: checkoutStripeProducts,
      ui_mode: "embedded",
      payment_method_types: ["card"],
      mode: "payment",
      return_url: `${request.headers.get(
        "origin"
      )}/payment-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    });
    console.log(session?.url);
    return NextResponse.json({
      id: session.id,
      client_secret: session.client_secret,
      url: session?.url,
    });
  } catch (error) {
    console.log(error);
  }
}
