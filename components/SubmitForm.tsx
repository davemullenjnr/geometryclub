"use client";

import { FormEvent, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import styles from "./SubmitForm.module.css";

type FormState = {
  instagramUsername: string;
  name: string;
  email: string;
  location: string;
  notes: string;
  honey: string;
};

const INITIAL_FORM_STATE: FormState = {
  instagramUsername: "",
  name: "",
  email: "",
  location: "",
  notes: "",
  honey: "",
};

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_BYTES = 50 * 1024 * 1024;

type Status =
  | { type: "idle"; message: string }
  | { type: "submitting"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

type SubmitResponse = {
  ok: boolean;
  message?: string;
  detail?: string;
  hint?: string;
};

export function SubmitForm() {
  const [fields, setFields] = useState<FormState>(INITIAL_FORM_STATE);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) return null;
    return createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }, []);

  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;

  const updateField = (key: keyof FormState, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const validateBeforeUpload = () => {
    if (!supabase || !bucket) {
      return "Submit form is not configured yet. Please try again later.";
    }

    if (!fields.instagramUsername || !fields.name || !fields.email || !fields.location) {
      return "Please complete all required fields.";
    }

    if (!file) {
      return "Please attach your photo before submitting.";
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return "Please upload a JPG, PNG, or WEBP image.";
    }

    if (file.size > MAX_FILE_BYTES) {
      return "Please upload an image smaller than 50MB.";
    }

    return null;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    const validationError = validateBeforeUpload();
    if (validationError) {
      setStatus({ type: "error", message: validationError });
      return;
    }

    if (!supabase || !bucket || !file) {
      setStatus({ type: "error", message: "Submit form is not configured yet." });
      return;
    }

    setStatus({ type: "submitting", message: "Uploading image and submitting details..." });

    try {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const safeName = fields.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const filePath = `submissions/${Date.now()}-${safeName || "entry"}-${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
        upsert: false,
        contentType: file.type,
      });

      if (uploadError) {
        setStatus({ type: "error", message: "Image upload failed. Please try again." });
        return;
      }

      const payload = {
        instagramUsername: fields.instagramUsername.trim(),
        name: fields.name.trim(),
        email: fields.email.trim(),
        location: fields.location.trim(),
        notes: fields.notes.trim(),
        imagePath: filePath,
        imageOriginalName: file.name,
        imageMimeType: file.type,
        imageBytes: file.size,
        honey: fields.honey,
      };

      const response = await fetch("/.netlify/functions/submit-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as SubmitResponse;
      if (!response.ok || !result.ok) {
        const extra = [result.detail, result.hint].filter(Boolean).join(" ");
        setStatus({
          type: "error",
          message: [result.message ?? "Submission failed. Please try again.", extra]
            .filter(Boolean)
            .join(" — "),
        });
        return;
      }

      setFields(INITIAL_FORM_STATE);
      setFile(null);
      setStatus({
        type: "success",
        message: "Thanks for your submission! Please check your email for confirmation.",
      });
    } catch {
      setStatus({ type: "error", message: "Something went wrong. Please try again." });
    }
  };

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <label className={styles.field}>
        <span className={styles.label}>Instagram Username *</span>
        <input
          className={styles.input}
          type="text"
          name="instagramUsername"
          required
          value={fields.instagramUsername}
          onChange={(event) => updateField("instagramUsername", event.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Name *</span>
        <input
          className={styles.input}
          type="text"
          name="name"
          required
          value={fields.name}
          onChange={(event) => updateField("name", event.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Email *</span>
        <input
          className={styles.input}
          type="email"
          name="email"
          required
          value={fields.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Attach your photo *</span>
        <input
          className={styles.fileInput}
          type="file"
          name="photo"
          required
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
        <span className={styles.helpText}>JPG, PNG, WEBP. Max 50MB.</span>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Location [eg. Los Angeles, USA.] *</span>
        <input
          className={styles.input}
          type="text"
          name="location"
          required
          value={fields.location}
          onChange={(event) => updateField("location", event.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>
          Notes about the architecture / structure [eg. The Broad Museum]
        </span>
        <textarea
          className={styles.textarea}
          name="notes"
          rows={4}
          value={fields.notes}
          onChange={(event) => updateField("notes", event.target.value)}
        />
      </label>

      <label className={styles.honeypot} aria-hidden="true">
        Do Not Fill This Out
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={fields.honey}
          onChange={(event) => updateField("honey", event.target.value)}
        />
      </label>

      <button className={styles.submitButton} disabled={status.type === "submitting"} type="submit">
        {status.type === "submitting" ? "Submitting..." : "Submit"}
      </button>

      {status.message ? (
        <p
          className={status.type === "error" ? styles.statusError : styles.statusMessage}
          role={status.type === "error" ? "alert" : "status"}
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
