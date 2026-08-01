import { Component, type ErrorInfo, type ReactNode } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Without this, any render-time throw unmounts the entire tree and the user
 * gets a blank white page with no way back. Class component because React
 * still has no hook equivalent for error boundaries.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // TODO: forward to Sentry (or whatever we pick) once error tracking lands.
    console.error("Unhandled render error:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <span className="bg-maroon-50 grid h-20 w-20 place-items-center rounded-full">
          <TriangleAlert
            className="text-maroon-700 h-8 w-8"
            strokeWidth={1.5}
          />
        </span>
        <h1 className="mt-6 font-serif text-2xl text-stone-900">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">
          This page hit an unexpected error. Reloading usually clears it.
        </p>

        {import.meta.env.DEV && (
          <pre className="mt-5 max-w-full overflow-x-auto rounded-xl bg-stone-100 p-3 text-left text-[11px] text-red-700">
            {this.state.error.message}
          </pre>
        )}

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="bg-maroon-800 hover:bg-maroon-900 mt-7 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03]"
        >
          <RotateCcw className="h-4 w-4" />
          Reload page
        </button>
      </div>
    );
  }
}
