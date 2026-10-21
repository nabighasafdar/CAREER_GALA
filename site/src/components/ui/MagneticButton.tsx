import { useRef, type ReactNode } from "react";
import { useDesktopHover } from "../../lib/animations";

export function MagneticButton({ children, className = "", onClick, href }: { children: ReactNode; className?: string; onClick?: () => void; href?: string }) {
  const ref = useRef<HTMLElement>(null);
  const desktop = useDesktopHover();
  const move = (e: React.MouseEvent) => {
    if (!desktop || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) > Math.max(r.width, r.height) / 2 + 60) return;
    const k = 8 / Math.max(r.width / 2, 1);
    ref.current.style.translate = `${Math.max(-8, Math.min(8, dx * k))}px ${Math.max(-8, Math.min(8, dy * k))}px`;
  };
  const leave = () => {
    if (!ref.current) return;
    ref.current.style.transition = "translate .35s cubic-bezier(.22,1,.36,1)";
    ref.current.style.translate = "0 0";
  };
  const common = { className: `btn ${className}`, onMouseMove: move, onMouseLeave: leave, onClick };
  return href
    ? <a ref={ref as any} href={href} {...common}>{children}</a>
    : <button ref={ref as any} {...common}>{children}</button>;
}
