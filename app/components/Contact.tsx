"use client";

import emailjs from "@emailjs/browser";
import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { audio } from "../lib/audio";

export default function Contact() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setStatus("sending");
    setError(null);

    const form = event.currentTarget;

    const serviceId =
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;

    const templateId =
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;

    const publicKey =
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus("error");
      setError("EmailJS variables missing.");
      return;
    }

    try {
      await emailjs.sendForm(
        serviceId,
        templateId,
        form,
        publicKey
      );

      form.reset();

      setStatus("sent");
      audio?.play("contactSuccess");

      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    } catch (err) {
      console.error("EMAIL ERROR:", err);

      setStatus("error");
      audio?.play("contactError");

      setError(
        err instanceof Error
          ? err.message
          : "Message could not be sent."
      );
    }
  }

  return (
    <section
      id="contact"
      className="section-shell"
    >
      <div className="section-inner">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-label">
            Contact
          </p>

          <h2 className="section-title">
            Start a Conversation
          </h2>

          <p className="fine-text mt-5">
            Send a direct message through
            the portfolio contact system.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <form
            onSubmit={handleSubmit}
            className="panel panel-red exhibit-card relative p-7 md:p-9"
          >
            <div className="absolute left-[-1px] top-[-1px] h-4 w-4 border-l-2 border-t-2 border-exhibit-blue" />

            <div className="absolute bottom-[-1px] right-[-1px] h-4 w-4 border-b-2 border-r-2 border-exhibit-blue" />

            <h3 className="font-display text-xl font-bold uppercase tracking-[0.12em] text-exhibit-chrome">
              Message
            </h3>

            <div className="mt-6 grid gap-5">

              <label className="grid gap-2">
                <span className="font-display text-[0.68rem] uppercase tracking-[0.24em] text-exhibit-muted">
                  Name
                </span>

                <input
                  name="from_name"
                  type="text"
                  required
                  className="border border-exhibit-blue/25 bg-white/[0.03] px-4 py-3 text-sm text-exhibit-chrome outline-none transition focus:border-exhibit-red"
                />
              </label>

              <label className="grid gap-2">
                <span className="font-display text-[0.68rem] uppercase tracking-[0.24em] text-exhibit-muted">
                  Email
                </span>

                <input
                  name="reply_to"
                  type="email"
                  required
                  className="border border-exhibit-blue/25 bg-white/[0.03] px-4 py-3 text-sm text-exhibit-chrome outline-none transition focus:border-exhibit-red"
                />
              </label>

              <label className="grid gap-2">
                <span className="font-display text-[0.68rem] uppercase tracking-[0.24em] text-exhibit-muted">
                  Message
                </span>

                <textarea
                  name="message"
                  required
                  className="min-h-36 resize-y border border-exhibit-blue/25 bg-white/[0.03] px-4 py-3 text-sm text-exhibit-chrome outline-none transition focus:border-exhibit-red"
                />
              </label>

              <button
                type="submit"
                disabled={status === "sending"}
                className="clip-corners inline-flex items-center justify-center gap-2 bg-exhibit-red px-5 py-3 font-display text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-exhibit-redDark disabled:opacity-60"
                onClick={() => audio?.play("uiClick")}
                onMouseEnter={() => audio?.play("uiHover")}
              >
                <Send size={15} />

                {status === "sending"
                  ? "Sending..."
                  : "Send Message"}
              </button>

              {status === "sent" && (
                <p className="border border-green-500/30 bg-green-500/10 p-3 text-center text-sm text-green-300">
                  Transmission successful.
                  I will respond shortly.
                </p>
              )}

              {status === "error" && (
                <p className="border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-300">
                  {error}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}