import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

export type V4SubscriptionRecord = {
  clerkUserId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  priceId?: string;
  plan?: "pro" | "pro_plus" | "unknown";
  status?: string;
  currentPeriodEnd?: number | null;
  updatedAt: string;
};

const SUBSCRIPTION_FILE = path.join(process.cwd(), "data", "subscriptions_v4.json");

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function toSupabaseRow(record: V4SubscriptionRecord) {
  return {
    clerk_user_id: record.clerkUserId,
    stripe_customer_id: record.stripeCustomerId || null,
    stripe_subscription_id: record.stripeSubscriptionId || null,
    price_id: record.priceId || null,
    plan: record.plan || "unknown",
    status: record.status || null,
    current_period_end: record.currentPeriodEnd ?? null,
    updated_at: record.updatedAt || new Date().toISOString(),
  };
}

function fromSupabaseRow(row: any): V4SubscriptionRecord {
  return {
    clerkUserId: row.clerk_user_id,
    stripeCustomerId: row.stripe_customer_id || undefined,
    stripeSubscriptionId: row.stripe_subscription_id || undefined,
    priceId: row.price_id || undefined,
    plan: row.plan || "unknown",
    status: row.status || undefined,
    currentPeriodEnd: row.current_period_end ?? null,
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

function ensureFile() {
  if (!fs.existsSync(path.dirname(SUBSCRIPTION_FILE))) {
    fs.mkdirSync(path.dirname(SUBSCRIPTION_FILE), { recursive: true });
  }

  if (!fs.existsSync(SUBSCRIPTION_FILE)) {
    fs.writeFileSync(SUBSCRIPTION_FILE, JSON.stringify({}, null, 2));
  }
}

export function readSubscriptions(): Record<string, V4SubscriptionRecord> {
  ensureFile();

  try {
    const raw = fs.readFileSync(SUBSCRIPTION_FILE, "utf8");
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}

function writeSubscriptionLocal(record: V4SubscriptionRecord) {
  const all = readSubscriptions();

  all[record.clerkUserId] = {
    ...all[record.clerkUserId],
    ...record,
    updatedAt: record.updatedAt || new Date().toISOString(),
  };

  fs.writeFileSync(SUBSCRIPTION_FILE, JSON.stringify(all, null, 2));
}

export async function writeSubscription(record: V4SubscriptionRecord) {
  const cleanRecord: V4SubscriptionRecord = {
    ...record,
    updatedAt: record.updatedAt || new Date().toISOString(),
  };

  writeSubscriptionLocal(cleanRecord);

  const supabase = getSupabaseClient();

  if (!supabase) {
    console.warn("Supabase env missing. Saved subscription locally only.");
    return;
  }

  const { error } = await supabase
    .from("subscriptions_v4")
    .upsert(toSupabaseRow(cleanRecord), {
      onConflict: "clerk_user_id",
    });

  if (error) {
    console.error("Supabase subscription save failed:", error.message);
    return;
  }

  console.log("Saved subscription to Supabase for:", cleanRecord.clerkUserId);
}

export async function getSubscriptionByClerkUserId(clerkUserId: string) {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("subscriptions_v4")
      .select("*")
      .eq("clerk_user_id", clerkUserId)
      .maybeSingle();

    if (error) {
      console.error("Supabase subscription read failed:", error.message);
    }

    if (data) {
      return fromSupabaseRow(data);
    }
  }

  const all = readSubscriptions();
  return all[clerkUserId] || null;
}

export async function getStripeCustomerIdByClerkUserId(clerkUserId: string) {
  const subscription = await getSubscriptionByClerkUserId(clerkUserId);
  return subscription?.stripeCustomerId || null;
}

export function isPaidSubscription(status?: string | null) {
  return status === "active" || status === "trialing";
}

export function getPlanFromPriceId(priceId?: string | null): "pro" | "pro_plus" | "unknown" {
  if (!priceId) return "unknown";

  if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
    return "pro";
  }

  if (priceId === process.env.STRIPE_PRO_PLUS_PRICE_ID) {
    return "pro_plus";
  }

  return "unknown";
}
