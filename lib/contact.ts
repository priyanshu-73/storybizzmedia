/* Single source of truth for the WhatsApp desk used by the nav, the survey
   popup, The Draft and the floating widget. */
export const WA_NUMBER = "919933041222";

export const waHref = (message: string) =>
  `https://api.whatsapp.com/send/?phone=${WA_NUMBER}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
