import React from "react";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Keep diagnostics in the browser console without exposing internals to visitors.
    console.error("Garden of Mercy application rendering failed:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="container py-5" role="alert" aria-live="assertive">
        <div className="mx-auto text-center" style={{ maxWidth: 560 }}>
          <p className="text-success fw-semibold text-uppercase small">Garden of Mercy Foundation</p>
          <h1 className="h3 fw-bold">We could not display this page</h1>
          <p className="text-secondary">
            Something unexpected interrupted this page. Your information has not been submitted by this error screen.
            Please reload the website or return to the homepage.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <button className="btn btn-success" type="button" onClick={() => window.location.reload()}>
              Reload page
            </button>
            <a className="btn btn-outline-secondary" href="/">
              Return home
            </a>
          </div>
        </div>
      </main>
    );
  }
}
