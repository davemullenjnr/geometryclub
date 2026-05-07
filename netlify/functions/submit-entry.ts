import { createClient } from "@supabase/supabase-js";
import { ServerClient, TemplatedMessage } from "postmark";

type NetlifyEvent = {
  httpMethod: string;
  body: string | null;
};

type NetlifyResponse = {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
};

type SubmissionPayload = {
  instagramUsername: string;
  name: string;
  email: string;
  location: string;
  notes: string;
  imagePath: string;
  imageOriginalName: string;
  imageMimeType: string;
  imageBytes: number;
  honey?: string;
};

/**
 * Netlify Functions sometimes do not receive NEXT_PUBLIC_* vars (build-only / wrong scope).
 * Use the same values as SUPABASE_URL and SUPABASE_BUCKET for the function only.
 */
const supabaseProjectUrl = () =>
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || process.env.SUPABASE_URL?.trim() || "";

const supabaseStorageBucket = () =>
  process.env.NEXT_PUBLIC_SUPABASE_BUCKET?.trim() || process.env.SUPABASE_BUCKET?.trim() || "";

/** Supabase server key: modern `sb_secret_...` or legacy `service_role` JWT — not the publishable/anon key */
const serverSupabaseKey = () =>
  process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_BYTES = 50 * 1024 * 1024;

const json = (statusCode: number, payload: Record<string, unknown>): NetlifyResponse => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const missingEnvReport = (): string[] => {
  const missing: string[] = [];
  if (!supabaseProjectUrl()) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL");
  }
  if (!supabaseStorageBucket()) {
    missing.push("NEXT_PUBLIC_SUPABASE_BUCKET or SUPABASE_BUCKET");
  }
  if (!serverSupabaseKey()) {
    missing.push("SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY");
  }
  if (!process.env.POSTMARK_SERVER_TOKEN?.trim()) missing.push("POSTMARK_SERVER_TOKEN");
  if (!process.env.POSTMARK_FROM_EMAIL?.trim()) missing.push("POSTMARK_FROM_EMAIL");
  if (!process.env.OWNER_NOTIFICATION_EMAIL?.trim()) missing.push("OWNER_NOTIFICATION_EMAIL");
  return missing;
};

const sanitize = (value: string) => value.replace(/[<>&"]/g, "");

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validatePayload = (payload: SubmissionPayload): string | null => {
  if (
    !payload.instagramUsername ||
    !payload.name ||
    !payload.email ||
    !payload.location ||
    !payload.imagePath
  ) {
    return "Missing required fields.";
  }

  if (!isEmail(payload.email)) return "Invalid email address.";

  if (!ALLOWED_IMAGE_TYPES.has(payload.imageMimeType)) {
    return "Invalid image type. Allowed: JPG, PNG, WEBP.";
  }

  if (!Number.isFinite(payload.imageBytes) || payload.imageBytes <= 0) {
    return "Invalid image size.";
  }

  if (payload.imageBytes > MAX_FILE_BYTES) {
    return "Image exceeds max allowed size.";
  }

  if (payload.honey && payload.honey.trim().length > 0) {
    return "Rejected.";
  }

  return null;
};

const bytesToMb = (bytes: number) => (bytes / 1024 / 1024).toFixed(2);

export const handler = async (event: NetlifyEvent): Promise<NetlifyResponse> => {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, message: "Method not allowed." });
  }

  const missing = missingEnvReport();
  if (missing.length > 0) {
    console.error("[submit-entry] missing env:", missing.join(", "));
    return json(500, {
      ok: false,
      message: "Server is missing required environment variables.",
      detail: missing.join(", "),
    });
  }

  let payload: SubmissionPayload;
  try {
    payload = JSON.parse(event.body ?? "") as SubmissionPayload;
  } catch {
    return json(400, { ok: false, message: "Invalid JSON payload." });
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    const statusCode = validationError === "Rejected." ? 200 : 400;
    return json(statusCode, { ok: validationError === "Rejected.", message: validationError });
  }

  const supabaseUrl = supabaseProjectUrl();
  const secretKey = serverSupabaseKey();
  const bucket = supabaseStorageBucket();

  const supabase = createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: signedData, error: signedError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(payload.imagePath, 7 * 24 * 60 * 60);

  if (signedError || !signedData?.signedUrl) {
    return json(500, { ok: false, message: "Could not generate image URL." });
  }

  const imageUrl = signedData.signedUrl;

  const { data: insertData, error: insertError } = await supabase
    .from("submissions")
    .insert({
      instagram_username: payload.instagramUsername,
      name: payload.name,
      email: payload.email,
      location: payload.location,
      notes: payload.notes,
      image_path: payload.imagePath,
      image_public_url: imageUrl,
      image_original_name: payload.imageOriginalName,
      image_mime_type: payload.imageMimeType,
      image_bytes: payload.imageBytes,
      status: "pending_review",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[submit-entry] submissions insert failed", insertError);
    return json(500, {
      ok: false,
      message: "Could not store submission.",
      detail: insertError.message,
      hint:
        insertError.message?.toLowerCase().includes("permission denied") ||
        insertError.message?.toLowerCase().includes("row-level security")
          ? "Use SUPABASE_SECRET_KEY (sb_secret_…) or legacy SUPABASE_SERVICE_ROLE_KEY (service_role JWT)—never NEXT_PUBLIC_SUPABASE_ANON_KEY / publishable."
          : insertError.message?.includes("relation") && insertError.message?.includes("does not exist")
            ? "Run supabase/submissions.sql in the Supabase SQL editor (submissions table missing)."
            : undefined,
    });
  }

  const client = new ServerClient(process.env.POSTMARK_SERVER_TOKEN as string);

  const clean = {
    instagramUsername: sanitize(payload.instagramUsername),
    name: sanitize(payload.name),
    email: sanitize(payload.email),
    location: sanitize(payload.location),
    notes: sanitize(payload.notes ?? ""),
  };

  const submittedAt = new Date().toISOString();
  const templateModel = {
    submission_id: insertData.id,
    name: clean.name,
    email: clean.email,
    instagram_username: clean.instagramUsername,
    location: clean.location,
    notes: clean.notes,
    image_filename: sanitize(payload.imageOriginalName),
    image_size_mb: bytesToMb(payload.imageBytes),
    image_url: imageUrl,
    submitted_at: submittedAt,
  };

  const ownerHtml = `
    <h2>New Geometry Club submission</h2>
    <p><strong>Submission ID:</strong> ${insertData.id}</p>
    <p><strong>Instagram Username:</strong> ${clean.instagramUsername}</p>
    <p><strong>Name:</strong> ${clean.name}</p>
    <p><strong>Email:</strong> ${clean.email}</p>
    <p><strong>Location:</strong> ${clean.location}</p>
    <p><strong>Notes:</strong> ${clean.notes || "(none provided)"}</p>
    <p><strong>Image file:</strong> ${sanitize(payload.imageOriginalName)} (${bytesToMb(payload.imageBytes)} MB)</p>
    <p><a href="${imageUrl}">Open submitted image</a></p>
  `;

  const userHtml = `
    <h2>Thanks for submitting to Geometry Club</h2>
    <p>Hi ${clean.name},</p>
    <p>We received your submission and will review it shortly.</p>
    <p><strong>Instagram Username:</strong> ${clean.instagramUsername}</p>
    <p><strong>Location:</strong> ${clean.location}</p>
    <p><strong>Image:</strong> ${sanitize(payload.imageOriginalName)}</p>
    <p>You can preview the uploaded image here: <a href="${imageUrl}">View image</a></p>
    <p>Thanks again for sharing your work.</p>
  `;

  const from = process.env.POSTMARK_FROM_EMAIL as string;
  // Template aliases are fixed, non-secret identifiers in Postmark.
  const ownerAlias = "submission-notification";
  const userAlias = "submission-confirmation";

  try {
    await Promise.all([
      ownerAlias
        ? client.sendEmailWithTemplate(
            new TemplatedMessage(
              from,
              ownerAlias,
              templateModel,
              process.env.OWNER_NOTIFICATION_EMAIL as string,
            ),
          )
        : client.sendEmail({
            From: from,
            To: process.env.OWNER_NOTIFICATION_EMAIL as string,
            Subject: `New Geometry Club submission from ${clean.name}`,
            HtmlBody: ownerHtml,
          }),
      userAlias
        ? client.sendEmailWithTemplate(
            new TemplatedMessage(from, userAlias, templateModel, payload.email),
          )
        : client.sendEmail({
            From: from,
            To: payload.email,
            Subject: "Geometry Club submission received",
            HtmlBody: userHtml,
          }),
    ]);
  } catch {
    return json(502, {
      ok: false,
      message: "Submission saved, but email delivery failed. Please retry notifications.",
    });
  }

  return json(200, { ok: true, message: "Submission received." });
};
