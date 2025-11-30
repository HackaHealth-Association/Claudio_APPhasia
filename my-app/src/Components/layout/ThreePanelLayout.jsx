/**
 * ThreePanelLayout Component
 * 
 * PURPOSE: Ensure that the panel sizes are consistent across tabs
 *
 */

export default function ThreePanelLayout({ left, middle, right }) {
  return (
    <div
      className="grid gap-4 w-full h-full mon-h-0"
      style={{ gridTemplateColumns: "1fr 1.5fr 1fr" }}
    >
      <div className="h-full overflow-y-auto pr-1">{left}</div>
      <div className="h-full flex flex-col min-w-0 overflow-y-auto pr-1">{middle}</div>
      <div className="h-full overflow-y-auto pr-1">{right}</div>
    </div>
  );
}