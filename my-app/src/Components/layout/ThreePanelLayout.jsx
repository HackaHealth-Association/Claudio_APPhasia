/**
 * ThreePanelLayout Component
 * 
 * PURPOSE: Ensure that the panel sizes are consistent across tabs
 *
 */

export default function ThreePanelLayout({ left, middle, right }) {
  return (
    <div className="grid grid-cols-3 gap-4 w-full h-full">
      <div className="h-full">{left}</div>
      <div className="h-full">{middle}</div>
      <div className="h-full">{right}</div>
    </div>
  );
}