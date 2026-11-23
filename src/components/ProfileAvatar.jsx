import React, { useState } from "react";

function safeImageUrl(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

export default function ProfileAvatar({ user, size = "md", className = "", alt }) {
  const pictureUrl = safeImageUrl(user?.pictureUrl || user?.picture_url || user?.photoURL || user?.photoUrl);
  const [failedUrl, setFailedUrl] = useState("");
  const initials = [user?.firstName || user?.first_name, user?.lastName || user?.last_name]
    .filter(Boolean).map(value => String(value).trim().charAt(0)).join("").toUpperCase()
    || String(user?.email || "U").trim().charAt(0).toUpperCase() || "U";
  const showImage = pictureUrl && failedUrl !== pictureUrl;

  return (
    <span className={`gom-profile-avatar gom-profile-avatar-${size} ${className}`.trim()}
      role="img" aria-label={alt || (user?.firstName || user?.first_name ? `${user.firstName || user.first_name}'s profile photo` : "Account profile")}>
      {showImage
        ? <img src={pictureUrl} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setFailedUrl(pictureUrl)} />
        : <span aria-hidden="true">{initials}</span>}
    </span>
  );
}
