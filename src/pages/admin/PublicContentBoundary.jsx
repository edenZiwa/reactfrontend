import React from "react";
import PublicContent from "./PublicContent.jsx";

export default class PublicContentBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Photos & Stories module failed to render:", error, info);
  }

  render() {
    if (!this.state.error) return <PublicContent />;
    return (
      <section className="gom-panel" role="alert">
        <div className="alert alert-danger">
          <h2 className="h5">Photos &amp; Stories could not load</h2>
          <p className="mb-2">This module encountered a rendering error. Other admin sections remain available.</p>
          <details>
            <summary>Technical error details</summary>
            <pre className="small text-break text-wrap mt-2 mb-0">{String(this.state.error?.message || this.state.error)}</pre>
          </details>
        </div>
        <button type="button" className="btn btn-outline-success" onClick={() => this.setState({ error: null })}>Try loading the module again</button>
      </section>
    );
  }
}
