"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { saveApplication } from "../lib/career-applications";

type Props = {
  jobId: string;
  jobTitle: string;
};

const MAX_FILE_SIZE = 1 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read the selected file."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Could not read the file."));
    };

    reader.readAsDataURL(file);
  });
}

export default function CareerApplicationForm({
  jobId,
  jobTitle,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
  function clearUnsavedForm() {
    setFile(null);
    setName("");
    setEmail("");
    setCoverLetter("");
    setMessage("");
    setSubmitted(false);

    const input = document.getElementById(
      "resume"
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }

  window.addEventListener("pagehide", clearUnsavedForm);

  return () => {
    window.removeEventListener("pagehide", clearUnsavedForm);
    clearUnsavedForm();
  };
  }, []);

  useEffect(() => {
    if (!file || file.type !== "application/pdf") {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const input = event.currentTarget;
    const selected = input.files?.[0];

    if (!selected) return;

    setSubmitted(false);
    setMessage("");

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setFile(null);
      setMessage("Please select a PDF, DOC, DOCX, or TXT file.");
      input.value = "";
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setFile(null);
      setMessage(
        "For browser storage, your resume must be 1 MB or smaller."
      );
      input.value = "";
      return;
    }

    setFile(selected);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");
    setSubmitted(false);

    if (!file) {
      setMessage("Please attach your resume before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const resumeDataUrl = await readFileAsDataUrl(file);

      saveApplication({
        id: crypto.randomUUID(),
        jobId,
        jobTitle,
          name: name.trim(),
        email: email.trim(),
        coverLetter: coverLetter.trim(),
        resumeName: file.name,
        resumeType: file.type,
        resumeDataUrl,
        submittedAt: new Date().toISOString(),
        status: "received",
      });

      setName("");
      setEmail("");
      setCoverLetter("");
      setFile(null);
      setMessage("");
      setSubmitted(true);

      const input = document.getElementById(
        "resume"
      ) as HTMLInputElement | null;

      if (input) input.value = "";
    } catch {
      setSubmitted(false);
      setMessage(
        "Could not save the application. Browser storage may be full or unavailable."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Full name
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={100}
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
                   className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-700"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-700"
        />
      </div>

      <div>
        <label
          htmlFor="coverLetter"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Cover letter
        </label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          rows={5}
          maxLength={5000}
          value={coverLetter}
          onChange={(event) => setCoverLetter(event.target.value)}
          placeholder="Tell us why you're interested in this role..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-emerald-700"
        />
      </div>

      <div>
        <label
          htmlFor="resume"
                  className="mb-2 block text-sm font-medium text-gray-700"
        >
          Resume (required)
        </label>
        <input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          required={!file}
          onChange={handleFileChange}
          className="block w-full rounded-lg border border-gray-300 p-3 text-sm"
        />
        <p className="mt-2 text-xs text-gray-500">
          PDF, DOC, DOCX, or TXT. Maximum size: 1 MB.
        </p>
      </div>

      {file && (
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="break-all text-sm font-medium text-gray-900">
                {file.name}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setFile(null);
                setMessage("");
                setSubmitted(false);

                const input = document.getElementById(
                  "resume"
                ) as HTMLInputElement | null;

                if (input) input.value = "";
              }}
              className="shrink-0 text-sm font-medium text-red-700 hover:text-red-900"
            >
              Remove file
            </button>
          </div>
        {previewUrl && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-gray-700">
                PDF preview
              </p>
              <iframe
                src={previewUrl}
                title="Resume PDF preview"
                className="h-96 w-full rounded-md border border-gray-200"
              />
            </div>
          )}
        </div>
      )}

      {message && (
        <p
          role="alert"
          className="text-sm text-red-700"
        >
          {message}
        </p>
      )}

      {submitted && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mt-0.5 size-5 shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5 12 4 4L19 6"
            />
          </svg>

          <div>
            <p className="font-semibold">
              Application saved successfully!
                        </p>
            <p className="mt-1 text-sm">
              Your application for {jobTitle} has been saved in this
              browser.
            </p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Save application"}
      </button>
    </form>
  );
}