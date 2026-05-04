import { createClient } from "@supabase/supabase-js";
import postmark, { TemplatedMessage } from "postmark";

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

const REQUIRED_ENV = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_BUCKET",
  "POSTMARK_SERVER_TOKEN",
  "POSTMARK_FROM_EMAIL",
  "OWNER_NOTIFICATION_EMAIL",
] as const;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_BYTES = 50 * 1024 * 1024;

const json = (statusCode: number, payload: Record<string, unknown>): NetlifyResponse => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const hasMissingEnv = () => REQUIRED_ENV.some((key) => !process.env[key]);

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

  if (hasMissingEnv()) {
    return json(500, { ok: false, message: "Server is missing required environment variables." });
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

  const supabaseUrl = process.env.SUPABASE_URL as string;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  const bucket = process.env.SUPABASE_BUCKET as string;

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
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
    return json(500, { ok: false, message: "Could not store submission." });
  }

  const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN as string);

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
  // Postmark template aliases (match Postmark UI): submission-notification, submission-confirmation
  const ownerAlias = process.env.POSTMARK_OWNER_TEMPLATE_ALIAS?.trim();
  const userAlias = process.env.POSTMARK_USER_TEMPLATE_ALIAS?.trim();

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
