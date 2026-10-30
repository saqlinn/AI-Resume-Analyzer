import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ResultsErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Results view failed to render", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center glass-card p-8">
          <h1 className="text-2xl font-bold mb-3">Unable to display this analysis</h1>
          <p className="text-muted-foreground mb-6">
            The analysis response could not be rendered. You can retry the view or upload the resume again.
          </p>
          <div className="flex justify-center gap-3">
            <Button onClick={() => window.location.reload()}>Retry</Button>
            <Button variant="outline" onClick={() => { window.location.href = "/upload"; }}>
              Upload again
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
