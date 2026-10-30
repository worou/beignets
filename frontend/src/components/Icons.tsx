import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = ({ size = 20, ...rest }: P) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, ...rest,
});

export const WhatsAppIcon = ({ size = 20, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...rest}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91A9.85 9.85 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
  </svg>
);
export const CartIcon = (p: P) => (
  <svg {...base(p)}><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2.5 3h2.6l2.3 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2L21 7H6" /></svg>
);
export const ArrowRight = (p: P) => (<svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const ArrowLeft = (p: P) => (<svg {...base(p)}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>);
export const LeafIcon = (p: P) => (
  <svg {...base(p)}><path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15Z" /><path d="M5 19 14 10" /></svg>
);
export const HeartIcon = ({ size = 20, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...rest}>
    <path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2.1 0 3.9 1.3 5.4 3.2 1.5-1.9 3.3-3.2 5.4-3.2 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21Z" />
  </svg>
);
export const HeartOutline = (p: P) => (
  <svg {...base(p)}><path d="M12 20s-7-4.3-9-8.7C1.6 8 3.6 4.6 6.9 4.6c2 0 3.6 1.2 5.1 3 1.5-1.8 3.1-3 5.1-3 3.3 0 5.3 3.4 3.9 6.7-2 4.4-9 8.7-9 8.7Z" /></svg>
);
export const AfricaIcon = ({ size = 20, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...rest}>
    <path d="M9.2 2.6c1.3-.3 2.6.2 3.8.1 1.1-.1 1.8.6 2.4 1.4.5.8 1.4 1.2 1.6 2.1.2.8.9 1.4 1.8 1.5.7.1 1.4.3 1.9.8-.4 1.1-1.2 2-1.9 2.9-.8 1-1 2.3-1.3 3.5-.3 1.4-1.2 2.5-1.9 3.7-.6 1-1 2.2-2 2.8-.9.5-1.9.3-2.4-.6-.5-.9-.4-2-.9-2.9-.5-.9-.4-1.9-.8-2.8-.4-.8-1.3-1.2-1.6-2.1-.3-.8-1.1-1.1-1.9-1-1 .1-2-.3-2.6-1.1-.6-.8-1.2-1.7-1-2.7.1-1 .9-1.8 1.4-2.6.6-.9 1.2-1.9 2.2-2.4.9-.4 1.9-.3 2.8-.5.2 0 .3-.1.4-.2Z" />
  </svg>
);
export const TruckIcon = (p: P) => (
  <svg {...base(p)}><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>
);
export const PhoneIcon = (p: P) => (
  <svg {...base(p)}><path d="M5 3h3.5l1.7 4.4-2.2 1.4a11 11 0 0 0 5.2 5.2l1.4-2.2L19 13.5V17a2 2 0 0 1-2.2 2A16 16 0 0 1 3 5.2 2 2 0 0 1 5 3Z" /></svg>
);
export const MailIcon = (p: P) => (<svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6.5 8.5-6.5" /></svg>);
export const PinIcon = (p: P) => (<svg {...base(p)}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>);
export const ClockIcon = (p: P) => (<svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
export const MenuIcon = (p: P) => (<svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>);
export const CloseIcon = (p: P) => (<svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const PlusIcon = (p: P) => (<svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>);
export const MinusIcon = (p: P) => (<svg {...base(p)}><path d="M5 12h14" /></svg>);
export const TrashIcon = (p: P) => (<svg {...base(p)}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>);
export const CheckIcon = (p: P) => (<svg {...base(p)}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>);
export const StoreIcon = (p: P) => (<svg {...base(p)}><path d="M4 9h16l-1.5-5h-13zM5 9v11h14V9M10 20v-6h4v6" /></svg>);
export const FamilyIcon = (p: P) => (<svg {...base(p)}><circle cx="8" cy="7" r="2.5" /><circle cx="16" cy="7" r="2.5" /><path d="M3.5 20v-3.5A4.5 4.5 0 0 1 8 12a4.5 4.5 0 0 1 4 2.4A4.5 4.5 0 0 1 16 12a4.5 4.5 0 0 1 4.5 4.5V20" /></svg>);
export const SproutIcon = (p: P) => (<svg {...base(p)}><path d="M12 21v-9M12 12C12 7 8 5 4 5c0 4 3 7 8 7ZM12 14c0-4 3-6 7-6 0 3.5-2.5 6-7 6Z" /></svg>);
export const BowlIcon = (p: P) => (<svg {...base(p)}><path d="M3 11h18a9 9 0 0 1-18 0ZM8 8c0-1.5 1-2 1-3.5M12 8c0-1.5 1-2 1-3.5M16 8c0-1.5 1-2 1-3.5" /></svg>);
export const FacebookIcon = ({ size = 18, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...rest}><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1Z" /></svg>
);
export const InstagramIcon = (p: P) => (<svg {...base(p)}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r=".6" fill="currentColor" /></svg>);
export const TikTokIcon = ({ size = 18, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...rest}><path d="M16.6 3c.4 2.2 1.7 3.6 3.9 3.8v3.1a7 7 0 0 1-3.8-1.2v6.1c0 3.5-2.5 6.2-6 6.2a5.9 5.9 0 0 1-6-6c0-3.5 2.9-6.2 6.6-5.9v3.2c-1.8-.3-3.4.9-3.4 2.7 0 1.6 1.2 2.8 2.8 2.8 1.7 0 2.9-1.2 2.9-3.2V3h3Z" /></svg>
);
