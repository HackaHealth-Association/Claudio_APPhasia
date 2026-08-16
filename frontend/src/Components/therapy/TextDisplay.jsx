import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2, Volume2, X } from "lucide-react";

/**
 * The phrase bar: the words that were tapped, and the controls for them.
 *
 * Words are tokens now rather than bare strings, so each chip knows what kind
 * of word it is and can be removed by its own id.
 */
export default function TextDisplay({
  tokens,
  onRemoveToken,
  onBack,
  onClearAll,
  isSpeaking,
  isLoading,
  onSpeak,
  onStop,
}) {
  const hasWords = tokens.length > 0;

  return (
    <Card className="bg-white border-2 border-gray-300">
      <div className="p-4 flex items-center gap-4">
        <div className="flex gap-2">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-600
              ring-4 ring-emerald-300/60 hover:ring-emerald-400/70
              shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-200
              disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!hasWords}
            title="Letztes Wort entfernen"
            aria-label="Letztes Wort entfernen"
          >
            <ArrowLeft className="w-8 h-8 text-white" strokeWidth={2.75} />
          </Button>

          <Button
            onClick={onClearAll}
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700
              shadow-lg focus:outline-none focus:ring-4 focus:ring-red-200
              disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!hasWords}
            title="Alles löschen"
            aria-label="Alles löschen"
          >
            <X className="w-8 h-8 text-white" strokeWidth={2.75} />
          </Button>
        </div>

        <div className="flex-1 text-center min-h-[48px] flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          {hasWords ? (
            tokens.map((token) => (
              <button
                key={token.id}
                type="button"
                onClick={() => onRemoveToken(token.id)}
                className="text-2xl font-semibold text-gray-800 cursor-pointer
                  bg-yellow-100 hover:bg-yellow-200 px-2 py-0.5 rounded-md
                  transition-colors duration-150 active:scale-[0.98]"
                title={`"${token.label}" entfernen`}
              >
                {token.label}
              </button>
            ))
          ) : (
            <p className="text-2xl font-semibold text-gray-400">.........</p>
          )}
        </div>

        {isSpeaking ? (
          <Button
            onClick={onStop}
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 shadow-lg"
            title="Wiedergabe stoppen"
            aria-label="Wiedergabe stoppen"
          >
            <span className="block w-5 h-5 rounded-sm bg-white animate-pulse" />
          </Button>
        ) : (
          <Button
            onClick={onSpeak}
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700
              ring-4 ring-blue-300/60 hover:ring-blue-400/70
              shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200
              disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!hasWords || isLoading}
            title="Satz vorlesen"
            aria-label="Satz vorlesen"
          >
            {isLoading ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" strokeWidth={2.75} />
            ) : (
              <Volume2 className="w-8 h-8 text-white" strokeWidth={2.75} />
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}
