import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const ToastContext = createContext(null);
const DEFAULT_DURATION = 4500;
const MAX_TOASTS = 4;

const ICONS = {
  success: "bi-check-circle-fill",
  error: "bi-exclamation-circle-fill",
  warning: "bi-exclamation-triangle-fill",
  info: "bi-info-circle-fill",
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }
  return context;
}

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const push = useCallback((type, input, options = {}) => {
    const config = typeof input === "string" ? { message: input, ...options } : input || {};
    const message = String(config.message || "").trim();
    if (!message) return null;

    const id = ++nextId.current;
    const duration = Number.isFinite(config.duration)
      ? Math.max(0, config.duration)
      : type === "error" ? 6500 : DEFAULT_DURATION;

    setItems((current) => [
      ...current,
      {
        id,
        type,
        message,
        title: config.title || "",
        duration,
      },
    ].slice(-MAX_TOASTS));

    return id;
  }, []);

  const toast = useMemo(() => ({
    success: (message, options) => push("success", message, options),
    error: (message, options) => push("error", message, options),
    warning: (message, options) => push("warning", message, options),
    info: (message, options) => push("info", message, options),
    dismiss,
    clear: () => setItems([]),
  }), [dismiss, push]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="gom-toast-viewport"
        aria-label="Notifications"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {items.map((item) => (
          <ToastItem key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ item, onDismiss }) {
  React.useEffect(() => {
    if (!item.duration) return undefined;
    const timer = window.setTimeout(() => onDismiss(item.id), item.duration);
    return () => window.clearTimeout(timer);
  }, [item.duration, item.id, onDismiss]);

  return (
    <section
      className={`gom-toast gom-toast--${item.type}`}
      role={item.type === "error" ? "alert" : "status"}
    >
      <i className={`bi ${ICONS[item.type] || ICONS.info}`} aria-hidden="true" />
      <div className="gom-toast-content">
        {item.title && <strong className="gom-toast-title">{item.title}</strong>}
        <p className="gom-toast-message">{item.message}</p>
      </div>
      <button
        type="button"
        className="gom-toast-close"
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss notification"
      >
        <i className="bi bi-x-lg" aria-hidden="true" />
      </button>
    </section>
  );
}
