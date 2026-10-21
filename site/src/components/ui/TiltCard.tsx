import { useRef, type ReactNode, type CSSProperties } from "react";
import { useDesktopHover } from "../../lib/animations";

export function TiltCard({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useDesktopHover();
  const move = (e: React.MouseEvent) => {
    const el = ref.current; if (!el || !desktop) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--x", `${px * r.width}px`); el.style.setProperty("--y", `${py * r.height}px`);
    el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 8}deg)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} className={`card ${className}`} style={{ ...style, transition: "transform .25s cubic-bezier(.22,1,.36,1), border-color .2s" }} onMouseMove={move} onMouseLeave={leave}>
      {children}
    </div>
  );
}
