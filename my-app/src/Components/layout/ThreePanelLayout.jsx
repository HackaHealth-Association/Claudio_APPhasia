/**
 * ThreePanelLayout Component
 * 
 * PURPOSE: Ensure that the panel sizes are consistent across tabs
 *
 */

export default function ThreePanelLayout({ left, middle, right }) {
  return (
    <div
      className="grid gap-4 w-full h-full"
      style={{ gridTemplateColumns: "1fr 1.5fr 1fr" }}
    >
      <div className="h-full">{left}</div>
      <div className="h-full flex flex-col min-w-0">{middle}</div>
      <div className="h-full">{right}</div>
    </div>
  );
}