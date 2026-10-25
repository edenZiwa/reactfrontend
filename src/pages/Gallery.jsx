import React, { useEffect, useMemo, useRef, useState } from "react";
import "../css/gallary.css";
import { AppLink } from "../components/SiteChrome.jsx";

const GALLERY_IMAGES = [
  {
    id: 1,
    category: "children",
    label: "Children",
    title: "A Future Filled With Hope",
    date: "2026",
    location: "Uganda",
    src: "/images/gallery/children-01.png",
    alt: "Children supported by Garden of Mercy Foundation",
    layout: "gallery-large",
  },
  {
    id: 2,
    category: "community",
    label: "Community",
    title: "Building Hope Together",
    date: "2026",
    location: "Uganda",
    src: "/images/gallery/community-01.png",
    alt: "Community members participating in an outreach activity",
  },
  {
    id: 3,
    category: "outreach",
    label: "Outreach",
    title: "Mercy Reaching Communities",
    date: "2026",
    location: "Uganda",
    src: "/images/gallery/outreach-01.jpg",
    alt: "Garden of Mercy Foundation outreach",
  },
  {
    id: 4,
    category: "volunteers",
    label: "Volunteers",
    title: "Serving With Compassion",
    date: "2026",
    location: "Uganda",
    src: "/images/gallery/volunteers-01.jpg",
    alt: "Garden of Mercy Foundation volunteers serving",
    layout: "gallery-tall",
  },
  {
    id: 5,
    category: "events",
    label: "Events",
    title: "Together in Celebration",
    date: "2026",
    location: "Kampala, Uganda",
    src: "/images/gallery/event-01.jpg",
    alt: "Garden of Mercy Foundation event",
  },
  {
    id: 6,
    category: "children",
    label: "Children",
    title: "Growing With Dignity",
    date: "2026",
    location: "Uganda",
    src: "/images/gallery/children-02.png",
    alt: "Children participating in a foundation program",
    layout: "gallery-wide",
  },
  {
    id: 7,
    category: "outreach",
    label: "Outreach",
    title: "Small Acts, Great Impact",
    date: "2026",
    location: "Uganda",
    src: "/images/gallery/outreach-02.jpg",
    alt: "Community outreach activity",
  },
  {
    id: 8,
    category: "community",
    label: "Community",
    title: "Stronger Together",
    date: "2026",
    location: "Uganda",
    src: "/images/gallery/community-02.jpg",
    alt: "Community members coming together",
  },
  {
    id: 9,
    category: "volunteers",
    label: "Volunteers",
    title: "The Power of Volunteers",
    date: "2026",
    location: "Uganda",
    src: "/images/gallery/volunteers-02.png",
    alt: "Garden of Mercy Foundation volunteers",
  },
  {
    id: 10,
    category: "children",
    label: "Children",
    title: "Learning and Growing",
    date: "2026",
    location: "Uganda",
    src: "/images/gallery/children-03.png",
    alt: "Children learning and growing",
  },
  {
    id: 11,
    category: "community",
    label: "Community",
    title: "Community Voices",
    date: "2026",
    location: "Uganda",
    src: "/images/gallery/community-03.png",
    alt: "Community engagement",
  },
  {
    id: 12,
    category: "events",
    label: "Events",
    title: "Celebrating Together",
    date: "2026",
    location: "Uganda",
    src: "/images/gallery/event-02.png",
    alt: "Garden of Mercy Foundation event",
  },
];

const FILTERS = [
  { value: "all", label: "All Stories" },
  { value: "children", label: "Children" },
  { value: "community", label: "Community" },
  { value: "outreach", label: "Outreach" },
  { value: "events", label: "Events" },
  { value: "volunteers", label: "Volunteers" },
];

const VIDEOS = [
  {
    id: 1,
    category: "IMPACT STORY",
    title: "Sowing Seeds of Mercy",
    description:
      "Discover how compassion becomes practical action within the communities we serve.",
    image: "/images/gallery/featured.jpg",
    alt: "Garden of Mercy Foundation story",
    src: "/videos/story-01.mp4",
    featured: true,
  },
  {
    id: 2,
    category: "COMMUNITY",
    title: "Together We Can",
    description: "A glimpse into community partnership.",
    image: "/images/gallery/event-01.jpg",
    alt: "Community story",
    src: "/videos/story-02.mp4",
    featured: false,
  },
];

function Gallery({navigate}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videoRef = useRef(null);
  const searchRef = useRef(null);

  const filteredImages = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return GALLERY_IMAGES.filter((image) => {
      const matchesCategory =
        activeFilter === "all" || image.category === activeFilter;

      const searchableText = [
        image.title,
        image.label,
        image.category,
        image.date,
        image.location,
        image.alt,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && searchableText.includes(query);
    });
  }, [activeFilter, searchTerm]);

  const visibleImages = filteredImages.slice(0, visibleCount);
  const hasMore = visibleCount < filteredImages.length;

  function changeFilter(filter) {
    setActiveFilter(filter);
    setVisibleCount(8);
  }

  function changeSearch(value) {
    setSearchTerm(value);
    setVisibleCount(8);
  }

  function openImage(image) {
    setSelectedImage(image);
  }

  function closeImage() {
    setSelectedImage(null);
  }

  function navigateImage(direction) {
    if (!selectedImage) return;

    const currentIndex = filteredImages.findIndex(
      (image) => image.id === selectedImage.id
    );

    if (currentIndex === -1 || filteredImages.length === 0) return;

    const nextIndex =
      (currentIndex + direction + filteredImages.length) %
      filteredImages.length;

    setSelectedImage(filteredImages[nextIndex]);
  }

  function openVideo(video) {
    setSelectedVideo(video);
  }

  function closeVideo() {
    setSelectedVideo(null);
  }

  // Keep page scrolling locked only while a viewer is open, and always restore it.
  useEffect(() => {
    const viewerIsOpen = Boolean(selectedImage || selectedVideo);
    if (!viewerIsOpen) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSelectedImage(null);
        setSelectedVideo(null);
        return;
      }

      if (!selectedImage) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigateImage(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        navigateImage(1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [selectedImage, selectedVideo, filteredImages]);

  useEffect(() => {
    if (!selectedVideo || !videoRef.current) return;

    const videoElement = videoRef.current;
    const playPromise = videoElement.play();

    if (playPromise?.catch) {
      playPromise.catch(() => {
        // The user can start playback with the video controls.
      });
    }

    return () => {
      videoElement.pause();
      videoElement.removeAttribute("src");
      videoElement.load();
    };
  }, [selectedVideo]);

  return (
    <>
      {/* HERO */}
      <section className="gallery-hero">
        <div className="gallery-hero-background" />

        <div className="container position-relative">
          <div className="row align-items-center min-vh-60">
            <div className="col-lg-8">
              <span className="gallery-eyebrow">
                <i className="bi bi-camera-fill me-2" />
                Our Stories
              </span>

              <h1 className="display-2 fw-bold text-white mt-3">
                Moments of <span className="text-warning">Mercy</span>
              </h1>

              <p className="lead text-white col-lg-9 mt-3">
                Explore the people, communities and moments behind Garden of
                Mercy Foundation&apos;s mission to sow seeds of mercy and
                compassion.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <a
                  href="#gallery"
                  className="btn btn-light btn-lg rounded-pill px-4"
                >
                  <i className="bi bi-images me-2" />
                  Explore Stories
                </a>

                <AppLink
                  to="/donate"
                  navigate={navigate}
                  className="btn btn-warning btn-lg rounded-pill px-4"
                >
                  <i className="bi bi-heart-fill me-2" />
                  Make a Difference
                </AppLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <span className="section-eyebrow">SEE THE IMPACT</span>

              <h2 className="display-6 fw-bold mt-2">
                Every Image Has a Story
              </h2>

              <p className="lead text-body-secondary">
                Our gallery gives a glimpse into the people, programs and
                partnerships that turn compassion into meaningful action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED STORY */}
      <section className="pb-5">
        <div className="container">
          <div className="featured-story rounded-5 overflow-hidden">
            <div className="row g-0 align-items-stretch">
              <div className="col-lg-7">
                <div className="featured-image-wrapper">
                  <img
                    src="/images/gallery/featured.jpg"
                    alt="Garden of Mercy Foundation community outreach"
                    className="featured-image"
                    loading="lazy"
                  />

                  <div className="featured-badge">
                    <i className="bi bi-star-fill me-1" />
                    Featured Story
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="featured-content h-100 p-4 p-lg-5">
                  <span className="text-success fw-semibold small">
                    COMMUNITY OUTREACH
                  </span>

                  <h2 className="fw-bold display-6 mt-2">
                    Compassion in Action
                  </h2>

                  <p className="text-body-secondary">
                    Behind every program are people who choose to care.
                    Through practical acts of compassion, Garden of Mercy
                    Foundation works alongside communities to bring hope and
                    dignity.
                  </p>

                  <div className="story-meta mb-4">
                    <div>
                      <i className="bi bi-calendar3 me-2" />
                      2026
                    </div>

                    <div>
                      <i className="bi bi-geo-alt me-2" />
                      Uganda
                    </div>
                  </div>

                  <a
                    href="#gallery"
                    className="btn btn-success rounded-pill px-4"
                  >
                    View Gallery
                    <i className="bi bi-arrow-right ms-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERABLE GALLERY */}
      <section
        id="gallery"
        className="gallery-section py-5"
      >
        <div className="container">
          <div className="row align-items-end g-4 mb-4">
            <div className="col-lg-7">
              <span className="section-eyebrow">OUR GALLERY</span>

              <h2 className="display-6 fw-bold mt-2">
                Stories Worth Remembering
              </h2>

              <p className="text-body-secondary mb-0">
                Explore moments of kindness, service and transformation in
                the communities we serve.
              </p>
            </div>

            <div className="col-lg-5">
              <label className="visually-hidden" htmlFor="gallerySearch">
                Search gallery stories
              </label>

              <div className="input-group input-group-lg gallery-search">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search" />
                </span>

                <input
                  ref={searchRef}
                  id="gallerySearch"
                  type="search"
                  className="form-control"
                  placeholder="Search stories..."
                  value={searchTerm}
                  onChange={(event) => changeSearch(event.target.value)}
                />

                {searchTerm && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    aria-label="Clear search"
                    onClick={() => {
                      changeSearch("");
                      searchRef.current?.focus();
                    }}
                  >
                    <i className="bi bi-x-lg" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CATEGORY FILTERS */}
          <div
            className="gallery-filters d-flex flex-wrap gap-2 mb-5"
            aria-label="Filter gallery by category"
          >
            {FILTERS.map((filter) => (
              <button
                type="button"
                key={filter.value}
                className={`btn rounded-pill px-4 ${
                  activeFilter === filter.value
                    ? "btn-success"
                    : "btn-outline-success"
                }`}
                aria-pressed={activeFilter === filter.value}
                onClick={() => changeFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* GALLERY GRID */}
          {visibleImages.length > 0 ? (
            <div className="editorial-grid" id="galleryGrid">
              {visibleImages.map((image) => (
                <article
                  key={image.id}
                  className={`gallery-entry ${image.layout || ""}`}
                  data-category={image.category}
                >
                  <button
                    type="button"
                    className="gallery-open"
                    onClick={() => openImage(image)}
                    aria-label={`View ${image.title}`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                    />

                    <span className="gallery-overlay">
                      <span className="gallery-expand">
                        <i className="bi bi-arrows-fullscreen" />
                      </span>
                    </span>
                  </button>

                  <div className="gallery-caption">
                    <span className="gallery-category">
                      {image.label}
                    </span>

                    <h3>{image.title}</h3>

                    <div className="gallery-entry-meta">
                      <span>
                        <i className="bi bi-calendar3 me-1" />
                        {image.date}
                      </span>

                      <span>
                        <i className="bi bi-geo-alt me-1" />
                        {image.location}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-5" id="galleryEmpty">
              <i className="bi bi-images display-3 text-success" />

              <h3 className="fw-bold mt-3">No stories found</h3>

              <p className="text-body-secondary">
                Try another category or search term.
              </p>

              <button
                type="button"
                className="btn btn-outline-success rounded-pill px-4"
                onClick={() => {
                  setActiveFilter("all");
                  setSearchTerm("");
                  setVisibleCount(8);
                }}
              >
                Clear filters
              </button>
            </div>
          )}

          {/* LOAD MORE */}
          {hasMore && (
            <div className="text-center mt-5">
              <button
                type="button"
                id="loadMore"
                className="btn btn-outline-success btn-lg rounded-pill px-5"
                onClick={() => setVisibleCount((count) => count + 4)}
              >
                Load More
                <i className="bi bi-plus-lg ms-2" />
              </button>
            </div>
          )}

          {filteredImages.length > 0 && (
            <p className="text-center text-body-secondary small mt-3">
              Showing {visibleImages.length} of {filteredImages.length} stories
            </p>
          )}
        </div>
      </section>

      {/* VIDEO STORIES */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-end mb-5">
            <div className="col-lg-8">
              <span className="section-eyebrow">VIDEO STORIES</span>

              <h2 className="display-6 fw-bold mt-2">
                Hear the Stories Behind the Images
              </h2>

              <p className="text-body-secondary">
                Photos capture a moment. Stories help us understand the
                people and purpose behind that moment.
              </p>
            </div>
          </div>

          <div className="row g-4">
            {VIDEOS.map((video) => (
              <div
                className={video.featured ? "col-lg-8" : "col-lg-4"}
                key={video.id}
              >
                <article
                  className={`video-card rounded-4 overflow-hidden ${
                    video.featured ? "video-feature" : "h-100"
                  }`}
                >
                  <div
                    className={`video-placeholder ${
                      video.featured ? "" : "video-small"
                    }`}
                  >
                    <img
                      src={video.image}
                      alt={video.alt}
                      loading="lazy"
                    />

                    <button
                      type="button"
                      className="video-play"
                      onClick={() => openVideo(video)}
                      aria-label={`Play ${video.title}`}
                    >
                      <i className="bi bi-play-fill" />
                    </button>
                  </div>

                  <div className="p-4">
                    <span className="text-success fw-semibold small">
                      {video.category}
                    </span>

                    <h3 className="fw-bold mt-2">{video.title}</h3>

                    <p className="text-body-secondary mb-0">
                      {video.description}
                    </p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCRIPTURE */}
      <section className="py-5 gallery-scripture">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <i className="bi bi-quote scripture-icon" />

              <blockquote className="display-6 fw-semibold">
                “For I was hungry and you gave me something to eat, I was
                thirsty and you gave me something to drink...”
              </blockquote>

              <p className="text-success fw-bold mt-3 mb-0">
                Matthew 25:35–45
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DONATION CTA */}
      <section className="py-5">
        <div className="container">
          <div className="gallery-cta rounded-5 p-4 p-lg-5">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <span className="text-warning fw-semibold">
                  JOIN THE MISSION
                </span>

                <h2 className="display-6 fw-bold text-white mt-2">
                  Help create the next story of hope.
                </h2>

                <p className="text-white-50 mb-0">
                  Your generosity can help turn compassion into food,
                  opportunity, dignity and hope.
                </p>
              </div>

              <div className="col-lg-4 text-lg-end">
                <AppLink
                  to="/donate"
                  navigate={navigate}
                  className="btn btn-warning btn-lg rounded-pill px-4"
                >
                  <i className="bi bi-heart-fill me-2" />
                  Give Today
                </AppLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMAGE LIGHTBOX */}
      {selectedImage && (
        <div
          className="lightbox"
          id="galleryLightbox"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            background: "rgba(8, 12, 10, 0.94)",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
          aria-hidden="false"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeImage();
          }}
        >
          <button
            type="button"
            className="lightbox-close"
            style={{ position: "absolute", top: 18, right: 22, zIndex: 2, cursor: "pointer" }}
            onClick={closeImage}
            aria-label="Close gallery"
          >
            <i className="bi bi-x-lg" />
          </button>

          <button
            type="button"
            className="lightbox-control lightbox-prev"
            style={{ position: "absolute", left: 12, top: "50%", zIndex: 2, cursor: "pointer" }}
            onClick={() => navigateImage(-1)}
            aria-label="Previous image"
          >
            <i className="bi bi-chevron-left" />
          </button>

          <div
            className="lightbox-content"
            style={{
              width: "min(100%, 1100px)",
              maxHeight: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              minWidth: 0,
            }}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              onClick={(event) => event.stopPropagation()}
              style={{
                display: "block",
                maxWidth: "100%",
                maxHeight: "min(72vh, 780px)",
                width: "auto",
                height: "auto",
                objectFit: "contain",
              }}
              onError={(event) => {
                event.currentTarget.style.visibility = "hidden";
              }}
            />

            <div className="lightbox-info">
              <div>
                <span id="lightboxCategory">{selectedImage.label}</span>
                <h2 id="lightboxTitle">{selectedImage.title}</h2>
              </div>

              <div className="lightbox-meta">
                <span id="lightboxDate">{selectedImage.date}</span>
                <span id="lightboxLocation">
                  {selectedImage.location}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="lightbox-control lightbox-next"
            style={{ position: "absolute", right: 12, top: "50%", zIndex: 2, cursor: "pointer" }}
            onClick={() => navigateImage(1)}
            aria-label="Next image"
          >
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      )}

      {/* VIDEO MODAL */}
      {selectedVideo && (
        <div
          className="modal fade show d-block"
          id="videoModal"
          role="dialog"
          aria-modal="true"
          aria-label={selectedVideo.title}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeVideo();
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content bg-black border-0">
              <div className="modal-header border-0">
                <button
                  type="button"
                  className="btn-close btn-close-white ms-auto"
                  onClick={closeVideo}
                  aria-label="Close video"
                />
              </div>

              <div className="modal-body p-0">
                <video
                  ref={videoRef}
                  className="w-100"
                  src={selectedVideo.src}
                  controls
                  playsInline
                  preload="metadata"
                >
                  Your browser does not support HTML video.
                </video>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedVideo && <div className="modal-backdrop fade show" />}
    </>
  );
}

export default Gallery;
