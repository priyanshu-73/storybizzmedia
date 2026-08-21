import WhatsAppIcon from "@/components/WhatsAppIcon";
import { waHref } from "@/lib/contact";

const WA_HREF = waHref("Hi StoryBizz, I'd like to get featured. Can you share how it works?");

export default function WhatsAppFloat() {
  return (
    <a
      id="wa-float"
      href={WA_HREF}
      target="_blank"
      rel="noopener"
      aria-label="Chat with StoryBizz on WhatsApp"
    >
      <span className="wa-ico">
        <WhatsAppIcon size={26} />
      </span>
      <span className="wa-label">Chat on WhatsApp</span>
    </a>
  );
}
