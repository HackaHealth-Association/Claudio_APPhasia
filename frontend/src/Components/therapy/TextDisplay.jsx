import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2, RefreshCw, Volume2, X } from "lucide-react";

/**
 * The phrase bar: the words that were tapped, and — the important part — the
 * sentence that will actually be spoken, shown before anyone hears it.
 *
 * The old version only revealed the sentence in a toast that disappeared, so
 * the therapist discovered a wrong sentence by having the room hear it.
 */
export default function TextDisplay({
  tokens,
  onRemoveToken,
  onBack,
  onClearAll,
  sentence,
  sentenceStatus,
  sentenceError,
  hasAlternatives,
  onUseAlternative,
  speechStatus,
  onSpeak,
  onStop,
}) {
  const hasWords = tokens.length > 0;
  const isBusy = speechStatus === "loading";
  const isPlaying = speechStatus === "playing";

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

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 min-h-[40px]">
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

          <SentencePreview
            hasWords={hasWords}
            sentence={sentence}
            status={sentenceStatus}
            error={sentenceError}
            hasAlternatives={hasAlternatives}
            onUseAlternative={onUseAlternative}
          />
        </div>

        {isPlaying ? (
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
            disabled={!hasWords || isBusy}
            title="Satz vorlesen"
            aria-label="Satz vorlesen"
          >
            {isBusy ? (
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

function SentencePreview({ hasWords, sentence, status, error, hasAlternatives, onUseAlternative }) {
  if (!hasWords) return null;

  if (status === "error") {
    return (
      <p className="mt-1 text-center text-sm text-red-600">
        {error} — es wird die Stimme des Browsers verwendet.
      </p>
    );
  }

  if (status === "loading" && !sentence) {
    return (
      <p className="mt-1 text-center text-sm text-gray-400 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        Satz wird vorbereitet …
      </p>
    );
  }

  if (!sentence) return null;

  return (
    <div className="mt-1 flex items-center justify-center gap-2">
      <p className="text-center text-lg text-gray-600 italic">„{sentence}"</p>
      {hasAlternatives && (
        <button
          type="button"
          onClick={onUseAlternative}
          className="text-gray-400 hover:text-gray-700 shrink-0"
          title="Andere Formulierung vorschlagen"
          aria-label="Andere Formulierung vorschlagen"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
