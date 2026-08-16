import AddWordForm from "./AddWordForm";

/** The "Zusätzliche Wörter" tab. */
export default function CustomWordsPanel({ words, onAdd, onRemove, onExport, onImport, onSelect }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 border rounded-lg">
        <AddWordForm onSubmit={onAdd} />

        <div className="flex gap-2">
          <button
            onClick={onExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Wörter exportieren
          </button>
          <label className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer">
            Wörter importieren
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(event) => {
                onImport(event.target.files[0]);
                event.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      <div className="border-t my-4" />

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}
      >
        {words.length === 0 && (
          <p className="text-muted-foreground">Noch keine Wörter hinzugefügt.</p>
        )}

        {words.map((item) => (
          <div key={item.word} className="relative group">
            <button
              onClick={() => onSelect({ type: "custom", value: item.word })}
              className="w-full p-2 bg-white rounded-lg shadow border hover:shadow-md transition-all flex flex-col items-center gap-2"
            >
              {item.image ? (
                <img src={item.image} alt="" aria-hidden="true" className="w-28 h-28 object-contain" />
              ) : (
                <div className="w-28 h-28 flex items-center justify-center bg-gray-100 rounded-md">
                  <span className="text-gray-400 text-sm">(Kein Bild)</span>
                </div>
              )}
              <span className="font-medium text-center">{item.word}</span>
            </button>

            <button
              onClick={() => onRemove(item.word)}
              title={`"${item.word}" löschen`}
              aria-label={`"${item.word}" löschen`}
              className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center
                opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
