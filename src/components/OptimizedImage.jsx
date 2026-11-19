import React from "react";

/**
 * Shared image loader for public gallery surfaces.
 * Uses browser-native lazy loading and asynchronous decode by default.
 * Callers may opt into eager loading/fetch priority for above-the-fold imagery.
 */
export default function OptimizedImage({
  src,
  alt = "",
  className = "",
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  width,
  height,
  sizes,
  srcSet,
  style,
  onError,
  ...rest
}) {
  if (!src) return null;

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      width={width}
      height={height}
      style={style}
      onError={onError}
      {...rest}
    />
  );
}
