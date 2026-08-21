/* Shared contact validation. Both lead forms — the PR survey popup and The
   Draft's intake card — run these, so a number that passes in one place passes
   in the other and the sales desk gets dialable numbers. */

/** Digits only, for storage and length checks. */
export const phoneDigits = (value: string) => value.replace(/\D/g, "");

/**
 * Accepts international formats (E.164 allows up to 15 digits) while rejecting
 * the usual junk: repeated digits, all zeroes, and Indian 10-digit numbers that
 * don't start 6-9, since no real mobile does.
 */
export function isValidPhone(value: string): boolean {
  const raw = value.trim();
  if (!raw) return false;
  /* one optional leading +, then digits and the usual separators */
  if (!/^\+?[\d\s().-]+$/.test(raw)) return false;

  const digits = phoneDigits(raw);
  if (digits.length < 8 || digits.length > 15) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  /* strip an Indian country code or trunk prefix before the mobile-series check */
  const local =
    digits.length === 12 && digits.startsWith("91")
      ? digits.slice(2)
      : digits.length === 11 && digits.startsWith("0")
        ? digits.slice(1)
        : digits;
  if (local.length === 10 && !/^[6-9]/.test(local)) return false;

  return true;
}

/**
 * Deliberately stricter than the `\S+@\S+\.\S+` shorthand: that accepts
 * "a@b.c", double dots and trailing hyphens, all of which bounce.
 */
export function isValidEmail(value: string): boolean {
  const email = value.trim();
  if (!email || email.length > 254 || /\s/.test(email)) return false;

  const parts = email.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;

  if (!local || local.length > 64) return false;
  if (!/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+$/.test(local)) return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;

  if (!domain || domain.length > 253) return false;
  if (!/^[A-Za-z0-9.-]+$/.test(domain) || domain.includes("..")) return false;

  const labels = domain.split(".");
  if (labels.length < 2) return false;
  if (labels.some((l) => !l || l.length > 63 || l.startsWith("-") || l.endsWith("-"))) return false;
  /* a real TLD is alphabetic and at least two characters */
  return /^[A-Za-z]{2,}$/.test(labels[labels.length - 1]);
}

export const PHONE_ERROR = "Please add a valid mobile / WhatsApp number.";
export const EMAIL_ERROR = "That email doesn’t look right — please check it.";
