import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { Modal } from "./Modal";
import { Logo } from "@/components/bits/Logo";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  closeLogin,
  selectLoginIntent,
  selectLoginOpen,
  setCredentials,
} from "@/features/auth/authSlice";
import {
  MOCK_OTP,
  OTP_LENGTH,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_SECONDS,
} from "@/utils/constants";

type Step = "phone" | "otp";

const INTENT_COPY: Record<string, string> = {
  checkout: "Sign in to place your order",
  wishlist: "Sign in to save your favourites",
  account: "Sign in to view your account",
};

export function LoginDialog() {
  const dispatch = useAppDispatch();
  const open = useAppSelector(selectLoginOpen);
  const intent = useAppSelector(selectLoginIntent);

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(OTP_MAX_ATTEMPTS);
  const [cooldown, setCooldown] = useState(0);

  // Reset whenever the dialog is dismissed so it never reopens mid-flow.
  useEffect(() => {
    if (open) return;
    setStep("phone");
    setPhone("");
    setOtp("");
    setError(null);
    setBusy(false);
    setAttemptsLeft(OTP_MAX_ATTEMPTS);
    setCooldown(0);
  }, [open]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const phoneValid = /^[6-9]\d{9}$/.test(phone);

  const sendOtp = async () => {
    if (!phoneValid) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setBusy(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 700)); // TODO: POST /auth/send-otp
    setBusy(false);
    setStep("otp");
    setCooldown(OTP_RESEND_SECONDS);
  };

  const verifyOtp = async (code: string) => {
    setBusy(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 700)); // TODO: POST /auth/verify-otp
    setBusy(false);

    if (code === MOCK_OTP) {
      dispatch(
        setCredentials({ access_token: "mock-token", phone_number: phone }),
      );
      return;
    }

    const left = attemptsLeft - 1;
    setAttemptsLeft(left);
    setOtp("");
    setError(
      left > 0
        ? `Incorrect code. ${left} attempt${left === 1 ? "" : "s"} left.`
        : "Too many incorrect attempts. Request a new code.",
    );
  };

  const locked = attemptsLeft <= 0;

  return (
    <Modal
      open={open}
      onClose={() => dispatch(closeLogin())}
      title="Sign in to ClothifyHer"
    >
      <div className="text-center">
        <Logo variant="monogram" className="mx-auto h-14" />
        <h2 className="mt-4 font-serif text-2xl text-stone-900">
          {step === "phone"
            ? "Sign in or create account"
            : "Verify your number"}
        </h2>
        <p className="mt-1.5 text-sm text-stone-500">
          {step === "phone"
            ? (intent && INTENT_COPY[intent]) ||
              "We'll text you a one-time code — no password needed."
            : `Enter the ${OTP_LENGTH}-digit code sent to +91 ${phone}`}
        </p>
      </div>

      {step === "phone" ? (
        <form
          className="mt-7"
          onSubmit={(e) => {
            e.preventDefault();
            sendOtp();
          }}
        >
          <label htmlFor="login-phone" className="sr-only">
            Mobile number
          </label>
          <div
            className={cn(
              "focus-within:border-maroon-600 focus-within:ring-maroon-600/20 flex h-13 items-center overflow-hidden rounded-full border bg-white transition-colors focus-within:ring-4",
              error ? "border-red-400" : "border-stone-300",
            )}
          >
            <span className="border-r border-stone-200 px-4 text-sm font-medium text-stone-500">
              +91
            </span>
            <input
              id="login-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                setError(null);
              }}
              placeholder="98765 43210"
              aria-invalid={!!error}
              aria-describedby="login-error"
              className="h-full flex-1 bg-transparent px-4 text-[15px] tracking-wide outline-none"
            />
          </div>

          <Feedback id="login-error" error={error} />

          <button
            type="submit"
            disabled={busy || !phoneValid}
            className="bg-maroon-800 hover:bg-maroon-900 mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Send OTP
          </button>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-stone-400">
            By continuing you agree to our Terms &amp; Privacy Policy.
          </p>
        </form>
      ) : (
        <div className="mt-7">
          <OtpInput
            value={otp}
            onChange={(v) => {
              setOtp(v);
              setError(null);
            }}
            onComplete={verifyOtp}
            disabled={busy || locked}
            invalid={!!error}
          />

          <Feedback id="login-error" error={error} />

          <button
            type="button"
            onClick={() => verifyOtp(otp)}
            disabled={busy || locked || otp.length < OTP_LENGTH}
            className="bg-maroon-800 hover:bg-maroon-900 mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Verify &amp; Continue
          </button>

          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError(null);
                setAttemptsLeft(OTP_MAX_ATTEMPTS);
              }}
              className="hover:text-maroon-800 inline-flex items-center gap-1 text-stone-500"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Change number
            </button>

            <button
              type="button"
              disabled={cooldown > 0}
              onClick={() => {
                setCooldown(OTP_RESEND_SECONDS);
                setAttemptsLeft(OTP_MAX_ATTEMPTS);
                setError(null);
                setOtp("");
              }}
              className="text-maroon-700 font-medium disabled:text-stone-400"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
            </button>
          </div>

          <p className="bg-maroon-50 mt-5 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[11px] text-stone-500">
            <ShieldCheck className="text-maroon-700 h-3.5 w-3.5" />
            Demo build — use code{" "}
            <strong className="font-semibold">{MOCK_OTP}</strong>
          </p>
        </div>
      )}
    </Modal>
  );
}

function Feedback({ id, error }: { id: string; error: string | null }) {
  return (
    <p
      id={id}
      aria-live="polite"
      className="mt-2 min-h-5 px-1 text-center text-sm text-red-600"
    >
      {error}
    </p>
  );
}

function OtpInput({
  value,
  onChange,
  onComplete,
  disabled,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  onComplete: (v: string) => void;
  disabled: boolean;
  invalid: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (index: number, digit: string) => {
    const next = value.padEnd(OTP_LENGTH, " ").split("");
    next[index] = digit || " ";
    const joined = next.join("").trimEnd();
    onChange(joined);

    if (digit && index < OTP_LENGTH - 1) refs.current[index + 1]?.focus();
    if (joined.replace(/\s/g, "").length === OTP_LENGTH) onComplete(joined);
  };

  return (
    <div
      className="flex justify-center gap-2"
      role="group"
      aria-label="One-time code"
    >
      {Array.from({ length: OTP_LENGTH }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          value={value[i]?.trim() ?? ""}
          onChange={(e) => setDigit(i, e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i]?.trim() && i > 0) {
              refs.current[i - 1]?.focus();
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData
              .getData("text")
              .replace(/\D/g, "")
              .slice(0, OTP_LENGTH);
            if (!pasted) return;
            onChange(pasted);
            if (pasted.length === OTP_LENGTH) onComplete(pasted);
            else refs.current[pasted.length]?.focus();
          }}
          className={cn(
            "focus:border-maroon-600 focus:ring-maroon-600/20 h-13 w-11 rounded-xl border bg-white text-center text-lg font-semibold transition-colors outline-none focus:ring-4 disabled:opacity-50",
            invalid ? "border-red-400" : "border-stone-300",
          )}
        />
      ))}
    </div>
  );
}
