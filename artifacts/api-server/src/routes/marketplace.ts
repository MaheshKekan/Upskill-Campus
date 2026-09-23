import { Router, type IRouter } from "express";
import { ReplitConnectors } from "@replit/connectors-sdk";
import {
  CreateCheckoutBody,
  CreateMerchantBody,
  CreateReviewBody,
  CreateServiceBody,
  CreateServiceParams,
  CreateReviewParams,
  GetMerchantParams,
  GetOrderParams,
  ListMerchantReviewsParams,
  ListMerchantsQueryParams,
  ListMerchantServicesParams,
  ListOrdersQueryParams,
  ListCategoriesResponse,
  ListMerchantReviewsResponse,
  ListMerchantServicesResponse,
  ListMerchantsResponse,
  ListOrdersResponse,
  CreateMerchantResponse,
  CreateServiceResponse,
  CreateReviewResponse,
  CreateCheckoutResponse,
  GetMerchantResponse,
  GetOrderResponse,
} from "@workspace/api-zod";

type MerchantRecord = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  rating: number;
  reviewCount: number;
  location: string;
  imageUrl: string;
  featured: boolean;
  startingPrice: number;
  description: string;
  availability: string;
  website: string | null;
};

type ServiceRecord = {
  id: string;
  merchantSlug: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  imageUrl: string;
  popular: boolean;
};

type OrderRecord = {
  id: string;
  merchantName: string;
  merchantSlug: string;
  serviceName: string;
  customerName: string;
  total: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  createdAt: string;
  scheduledAt: string;
  paymentMethod: string;
};

type ReviewRecord = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const image = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;

const categories = [
  { id: "cat-home", name: "Home", slug: "home", description: "Make your space work better.", merchantCount: 128 },
  { id: "cat-beauty", name: "Beauty", slug: "beauty", description: "Feel like your best self.", merchantCount: 94 },
  { id: "cat-pets", name: "Pets", slug: "pets", description: "Care for the ones you love.", merchantCount: 71 },
  { id: "cat-wellness", name: "Wellness", slug: "wellness", description: "Small rituals, better days.", merchantCount: 52 },
];

const merchants: MerchantRecord[] = [
  {
    id: "merchant-luma",
    slug: "luma-studio",
    name: "Luma Studio",
    category: "Beauty",
    tagline: "Skin care that fits real life.",
    rating: 4.9,
    reviewCount: 86,
    location: "Brooklyn, NY",
    imageUrl: image("photo-1556228578-8c89e6adf883"),
    featured: true,
    startingPrice: 65,
    description: "A neighborhood skin studio for thoughtful facials, barrier-first care, and a little time to reset.",
    availability: "Mon–Sat · 9:00 AM–6:00 PM",
    website: null,
  },
  {
    id: "merchant-northstar",
    slug: "northstar-home",
    name: "Northstar Home",
    category: "Home",
    tagline: "The good kind of home maintenance.",
    rating: 4.8,
    reviewCount: 54,
    location: "Queens, NY",
    imageUrl: image("photo-1581578731548-c64695cc6952"),
    featured: true,
    startingPrice: 95,
    description: "Reliable home care from a small local team that shows up, does the work, and leaves things better.",
    availability: "Mon–Fri · 8:00 AM–5:00 PM",
    website: null,
  },
  {
    id: "merchant-paws",
    slug: "paws-and-co",
    name: "Paws & Co.",
    category: "Pets",
    tagline: "Care your pet can feel.",
    rating: 4.9,
    reviewCount: 112,
    location: "Brooklyn, NY",
    imageUrl: image("photo-1548199973-03cce0bbc87b"),
    featured: false,
    startingPrice: 32,
    description: "Warm, attentive grooming and neighborhood walks for dogs who deserve the whole team.",
    availability: "Every day · 7:00 AM–7:00 PM",
    website: null,
  },
  {
    id: "merchant-marrow",
    slug: "marrow-wellness",
    name: "Marrow Wellness",
    category: "Wellness",
    tagline: "Make room for feeling good.",
    rating: 4.7,
    reviewCount: 38,
    location: "Manhattan, NY",
    imageUrl: image("photo-1544161515-4ab6ce6db874"),
    featured: false,
    startingPrice: 80,
    description: "Massage and bodywork in a quiet studio where your nervous system gets to set the pace.",
    availability: "Tue–Sun · 10:00 AM–8:00 PM",
    website: null,
  },
];

const services: ServiceRecord[] = [
  { id: "service-luma-facial", merchantSlug: "luma-studio", name: "Reset facial", description: "A restorative 60-minute facial tailored to what your skin needs today.", price: 95, duration: "60 min", imageUrl: image("photo-1570172619644-dfd03ed5d881"), popular: true },
  { id: "service-luma-glow", merchantSlug: "luma-studio", name: "Glow express", description: "A focused refresh for when you want to leave looking well-rested.", price: 65, duration: "30 min", imageUrl: image("photo-1515377905703-c4788e51af15"), popular: false },
  { id: "service-northstar-clean", merchantSlug: "northstar-home", name: "Home refresh", description: "A thorough two-hour clean for the spaces you use every day.", price: 140, duration: "2 hr", imageUrl: image("photo-1581578731548-c64695cc6952"), popular: true },
  { id: "service-northstar-fix", merchantSlug: "northstar-home", name: "Small fixes visit", description: "A flexible visit for the list of little things that never quite get done.", price: 95, duration: "90 min", imageUrl: image("photo-1503387762-592deb58ef4e"), popular: false },
  { id: "service-paws-groom", merchantSlug: "paws-and-co", name: "Full groom", description: "Bath, brush, nail trim, and a gentle finish for a very good dog.", price: 78, duration: "75 min", imageUrl: image("photo-1516734212186-a967f81ad0d7"), popular: true },
  { id: "service-marrow-massage", merchantSlug: "marrow-wellness", name: "Slow bodywork", description: "A calming 75-minute session designed around how you feel when you arrive.", price: 120, duration: "75 min", imageUrl: image("photo-1544161515-4ab6ce6db874"), popular: true },
];

let orders: OrderRecord[] = [
  { id: "ord-2401", merchantName: "Luma Studio", merchantSlug: "luma-studio", serviceName: "Reset facial", customerName: "Alex Morgan", total: 95, status: "confirmed", createdAt: "2026-09-18T14:20:00.000Z", scheduledAt: "2026-09-27T15:00:00.000Z", paymentMethod: "Visa ending 4242" },
  { id: "ord-2397", merchantName: "Paws & Co.", merchantSlug: "paws-and-co", serviceName: "Full groom", customerName: "Alex Morgan", total: 78, status: "completed", createdAt: "2026-09-05T09:15:00.000Z", scheduledAt: "2026-09-12T11:00:00.000Z", paymentMethod: "Visa ending 4242" },
];

const reviewsByMerchant: Record<string, ReviewRecord[]> = {
  "luma-studio": [
    { id: "review-1", customerName: "Maya R.", rating: 5, comment: "I left feeling like I had slept for ten hours. Thoughtful, calm, and no hard sell.", createdAt: "2026-09-14T12:00:00.000Z" },
    { id: "review-2", customerName: "Jordan K.", rating: 5, comment: "The best facial I have had in the city. Everything felt intentional.", createdAt: "2026-08-22T12:00:00.000Z" },
  ],
  "northstar-home": [{ id: "review-3", customerName: "Priya S.", rating: 5, comment: "On time, kind, and incredibly thorough.", createdAt: "2026-09-01T12:00:00.000Z" }],
  "paws-and-co": [{ id: "review-4", customerName: "Sam T.", rating: 5, comment: "My dog actually wanted to go back inside. That says everything.", createdAt: "2026-08-28T12:00:00.000Z" }],
  "marrow-wellness": [],
};

const router: IRouter = Router();

router.get("/categories", (_req, res): void => {
  res.json(ListCategoriesResponse.parse(categories));
});

router.get("/merchants", (req, res): void => {
  const parsed = ListMerchantsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { category, search, location, limit } = parsed.data;
  const normalizedSearch = search?.toLowerCase();
  const filtered = merchants
    .filter((merchant) => !category || merchant.category.toLowerCase() === category.toLowerCase())
    .filter((merchant) => !location || merchant.location.toLowerCase().includes(location.toLowerCase()))
    .filter((merchant) => !normalizedSearch || `${merchant.name} ${merchant.category} ${merchant.tagline}`.toLowerCase().includes(normalizedSearch))
    .slice(0, limit ?? 20);
  res.json(ListMerchantsResponse.parse(filtered));
});

router.post("/merchants", (req, res): void => {
  const parsed = CreateMerchantBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const slug = parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const merchant: MerchantRecord = {
    id: `merchant-${Date.now()}`,
    slug,
    name: parsed.data.name,
    category: parsed.data.category,
    tagline: parsed.data.tagline ?? "Local service, thoughtfully done.",
    rating: 0,
    reviewCount: 0,
    location: parsed.data.location,
    imageUrl: parsed.data.imageUrl,
    featured: false,
    startingPrice: 0,
    description: parsed.data.description,
    availability: parsed.data.availability ?? "Set your availability",
    website: null,
  };
  merchants.unshift(merchant);
  reviewsByMerchant[slug] = [];
  res.status(201).json(CreateMerchantResponse.parse({ ...merchant, services: [] }));
});

router.get("/merchants/:slug", (req, res): void => {
  const params = GetMerchantParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const merchant = merchants.find((item) => item.slug === params.data.slug);
  if (!merchant) {
    res.status(404).json({ error: "Merchant not found" });
    return;
  }
  res.json(GetMerchantResponse.parse({ ...merchant, services: services.filter((service) => service.merchantSlug === merchant.slug) }));
});

router.get("/merchants/:slug/services", (req, res): void => {
  const params = ListMerchantServicesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  res.json(ListMerchantServicesResponse.parse(services.filter((service) => service.merchantSlug === params.data.slug)));
});

router.post("/merchants/:slug/services", (req, res): void => {
  const params = CreateServiceParams.safeParse(req.params);
  const body = CreateServiceBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const merchant = merchants.find((item) => item.slug === params.data.slug);
  if (!merchant) {
    res.status(404).json({ error: "Merchant not found" });
    return;
  }
  const service: ServiceRecord = { id: `service-${Date.now()}`, merchantSlug: merchant.slug, ...body.data, popular: false };
  services.push(service);
  merchant.startingPrice = merchant.startingPrice ? Math.min(merchant.startingPrice, service.price) : service.price;
  res.status(201).json(CreateServiceResponse.parse(service));
});

router.get("/orders", (req, res): void => {
  const parsed = ListOrdersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const result = orders.filter((order) => !parsed.data.status || order.status === parsed.data.status);
  res.json(ListOrdersResponse.parse(result));
});

router.post("/orders/checkout", async (req, res): Promise<void> => {
  const parsed = CreateCheckoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const merchant = merchants.find((item) => item.slug === parsed.data.merchantSlug);
  const service = services.find((item) => item.id === parsed.data.serviceId && item.merchantSlug === parsed.data.merchantSlug);
  if (!merchant || !service) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  const orderId = `ord-${Date.now()}`;
  orders.unshift({
    id: orderId,
    merchantName: merchant.name,
    merchantSlug: merchant.slug,
    serviceName: service.name,
    customerName: parsed.data.customerName,
    total: service.price,
    status: "pending",
    createdAt: new Date().toISOString(),
    scheduledAt: parsed.data.scheduledAt,
    paymentMethod: "Stripe checkout",
  });

  const connectors = new ReplitConnectors();
  const body = new URLSearchParams({
    mode: "payment",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][product_data][name]": `${merchant.name} — ${service.name}`,
    "line_items[0][price_data][product_data][description]": service.description,
    "line_items[0][price_data][unit_amount]": String(Math.round(service.price * 100)),
    "line_items[0][quantity]": "1",
    "customer_email": parsed.data.customerEmail,
    "success_url": `${process.env.REPLIT_DOMAINS?.split(",")[0] ?? "http://localhost"}/orders?checkout=success&order=${orderId}`,
    "cancel_url": `${process.env.REPLIT_DOMAINS?.split(",")[0] ?? "http://localhost"}/checkout/${merchant.slug}/${service.id}?checkout=cancelled`,
    "metadata[order_id]": orderId,
    "metadata[merchant_slug]": merchant.slug,
  });

  try {
    const response = await connectors.proxy("stripe", "/v1/checkout/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    const result = (await response.json()) as { url?: string };
    if (!response.ok || !result.url) {
      req.log.error({ status: response.status, orderId }, "Stripe checkout session failed");
      res.status(502).json({ error: "Unable to start secure checkout" });
      return;
    }
    res.status(201).json(CreateCheckoutResponse.parse({ checkoutUrl: result.url, orderId }));
  } catch (error) {
    req.log.error({ err: error, orderId }, "Stripe checkout request failed");
    res.status(502).json({ error: "Unable to start secure checkout" });
  }
});

router.get("/orders/:id", (req, res): void => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const order = orders.find((item) => item.id === params.data.id);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(GetOrderResponse.parse(order));
});

router.get("/merchants/:slug/reviews", (req, res): void => {
  const params = ListMerchantReviewsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  res.json(ListMerchantReviewsResponse.parse(reviewsByMerchant[params.data.slug] ?? []));
});

router.post("/merchants/:slug/reviews", (req, res): void => {
  const params = CreateReviewParams.safeParse(req.params);
  const body = CreateReviewBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const review: ReviewRecord = { id: `review-${Date.now()}`, ...body.data, createdAt: new Date().toISOString() };
  reviewsByMerchant[params.data.slug] ??= [];
  reviewsByMerchant[params.data.slug].unshift(review);
  const merchant = merchants.find((item) => item.slug === params.data.slug);
  if (merchant) {
    const allReviews = reviewsByMerchant[merchant.slug];
    merchant.reviewCount = allReviews.length;
    merchant.rating = allReviews.length ? Number((allReviews.reduce((sum, item) => sum + item.rating, 0) / allReviews.length).toFixed(1)) : 0;
  }
  res.status(201).json(CreateReviewResponse.parse(review));
});

export default router;