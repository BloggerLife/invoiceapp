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
export interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
async function getActiveProducts() {
  const stripeProducts = await stripe.products.list();
  const activeProducts = stripeProducts.data.filter(
    (item: any) => item.active === true
  );
  return activeProducts;
}
export async function POST(request: NextRequest) {
  try {
    const { products } = await request.json();

    const checkoutProducts: Item[] = products;
    const amount = checkoutProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
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
          quantity: product.quantity,
        });
      }
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        items: JSON.stringify(checkoutProducts),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error);
  }
}
