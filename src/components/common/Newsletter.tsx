import { useState, type FormEvent } from "react";
import { Check, Loader2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error" | "duplicate";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGES: Record<Exclude<Status, "idle" | "submitting">, string> = {
  success: "You're on the list — watch your inbox for WELCOME10.",
  duplicate: "You're already subscribed with this email.",
  error: "Enter a valid email address.",
};

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    // TODO: swap for the real subscribe endpoint once the backend exists.
    await new Promise((r) => setTimeout(r, 700));
    setStatus(
      email.trim().toLowerCase() === "test@clothifyher.com"
        ? "duplicate"
        : "success",
    );
  };

  const done = status === "success" || status === "duplicate";

  return (
    <section className="border-maroon-100 bg-cream-100/70 border-y">
      <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6 sm:py-16">
        <span className="bg-maroon-800 mx-auto grid h-12 w-12 place-items-center rounded-full">
          <Mail className="text-cream-100 h-5 w-5" strokeWidth={1.75} />
        </span>

        <h2 className="mt-5 font-serif text-2xl text-stone-900 sm:text-3xl">
          Get 10% off your first order
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">
          New arrivals, styling notes and early access to sales. No spam — we
          send about twice a month.
        </p>

        <form
          onSubmit={submit}
          noValidate
          className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== "idle") setStatus("idle");
            }}
            disabled={done}
            placeholder="you@example.com"
            aria-invalid={status === "error"}
            aria-describedby="newsletter-status"
            className={cn(
              "focus:border-maroon-600 focus:ring-maroon-600/20 h-12 flex-1 rounded-full border bg-white px-5 text-sm transition-colors outline-none focus:ring-4 disabled:opacity-60",
              status === "error" ? "border-red-400" : "border-stone-300",
            )}
          />
          <button
            type="submit"
            disabled={status === "submitting" || done}
            className="bg-maroon-800 hover:bg-maroon-900 inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          >
            {status === "submitting" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {done && <Check className="h-4 w-4" />}
            {done ? "Subscribed" : "Subscribe"}
          </button>
        </form>

        <p
          id="newsletter-status"
          aria-live="polite"
          className={cn(
            "mt-3 min-h-5 text-sm",
            status === "error" ? "text-red-600" : "text-maroon-700",
          )}
        >
          {status !== "idle" && status !== "submitting" && MESSAGES[status]}
        </p>
      </div>
    </section>
  );
}
