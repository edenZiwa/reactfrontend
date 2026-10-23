import React from "react";
import "../css/power-of-revelation.css";

const MINISTRY = {
  name: "Power of Revelation Ministries",
  church: "Revelation Church Kampala",
  location: "Najjanankumbi, Kampala, Uganda",
  address: "Najjanankumbi, off Entebbe Road, along Busaabala Road",
  podcast: "https://podcasts.apple.com/us/podcast/revelation-church-kampala/id1551432049",
  facebook: "https://www.facebook.com/powerofrevelation/",
  churchFacebook: "https://www.facebook.com/revelationchurchkampala/",
  youtubeSermon: "https://www.youtube.com/watch?v=oSwl5aEd_k4",
  maps: "https://www.google.com/maps/search/?api=1&query=Power+of+Revelation+Ministries+Najjanankumbi+Kampala+Uganda",
};

const sermons = [
  {
    category: "BIBLE TEACHING",
    title: "God's Kingdom: Purpose for Humanity",
    speaker: "Apostle Derrick Musinguzi",
    description: "Explore God's purpose for humanity, our identity in Christ, and how believers can live intentionally according to His Word.",
    type: "video",
    link: MINISTRY.youtubeSermon,
    icon: "bi-play-circle",
  },
  {
    category: "FAITH & GRACE",
    title: "The Divine Favour (Grace)",
    speaker: "Apostle Derrick Musinguzi",
    description: "A recorded teaching on divine favour and grace, published through the Revelation Church Kampala media ministry.",
    type: "audio",
    link: "https://www.facebook.com/revelationchurchkampala/videos/977851343539147/",
    icon: "bi-headphones",
  },
  {
    category: "PURPOSE & DESTINY",
    title: "Finding and Fulfilling Your Purpose",
    speaker: "Apostle Derrick Musinguzi",
    description: "A practical teaching encouraging believers to discover their purpose and pursue it with faith and understanding.",
    type: "podcast",
    link: MINISTRY.podcast,
    icon: "bi-broadcast",
  },
  {
    category: "CHRISTIAN LIVING",
    title: "The Difference Between Happiness and Joy",
    speaker: "Apostle Derrick Musinguzi",
    description: "A message exploring the difference between temporary happiness and the deeper joy found in the Christian life.",
    type: "podcast",
    link: MINISTRY.podcast,
    icon: "bi-soundwave",
  },
  {
    category: "SPIRITUAL GROWTH",
    title: "Not Every Purpose Is Revealed",
    speaker: "Apostle Derrick Musinguzi",
    description: "An encouragement to seek God, grow in understanding, and discover the purpose He has for your life.",
    type: "podcast",
    link: MINISTRY.podcast,
    icon: "bi-journal-richtext",
  },
  {
    category: "FOUNDATION OF FAITH",
    title: "God Loves Us",
    speaker: "Revelation Church Kampala",
    description: "A foundational message about God's love and the promise of salvation through Jesus Christ, drawing on John 3:16.",
    type: "podcast",
    link: MINISTRY.podcast,
    icon: "bi-heart",
  },
];

const values = [
  { icon: "bi-book", title: "Biblical truth", description: "Teaching the Word of God and encouraging believers to build their lives on Scripture." },
  { icon: "bi-heart", title: "Demonstrated love", description: "Expressing the love of Christ through compassion, service, fellowship, and care for others." },
  { icon: "bi-people", title: "Discipleship", description: "Equipping believers to grow in faith, character, spiritual maturity, and Christian responsibility." },
  { icon: "bi-globe-africa", title: "Evangelism", description: "Sharing the Good News and extending the message of Christ to individuals and communities." },
  { icon: "bi-building", title: "Church community", description: "Building local congregations where people can worship, learn, serve, and grow together." },
  { icon: "bi-stars", title: "Purposeful living", description: "Encouraging people to discover their God-given purpose and live a life of faith and integrity." },
];

function SectionHeading({ eyebrow, title, description, centered = false }) {
  return (
    <div className={`ministry-heading ${centered ? "text-center mx-auto" : ""}`}>
      <span className="ministry-eyebrow"><span className="ministry-eyebrow-dot" />{eyebrow}</span>
      <h2 className="display-6 fw-bold mt-3">{title}</h2>
      {description && <p className="text-secondary mt-3 mb-0">{description}</p>}
    </div>
  );
}

function MediaLink({ href, icon, title, description, label }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="ministry-media-link">
      <span className="ministry-media-icon"><i className={`bi ${icon}`} aria-hidden="true" /></span>
      <span className="flex-grow-1">
        <strong className="d-block">{title}</strong>
        <span className="small text-secondary d-block mt-1">{description}</span>
      </span>
      <span className="ministry-media-arrow" aria-label={label || "Open link"}><i className="bi bi-arrow-up-right" aria-hidden="true" /></span>
    </a>
  );
}

export default function PowerOfRevelation() {
  return (
    <main className="power-revelation-page" id="main-content">
      <section className="pr-hero" aria-labelledby="pr-title">
        <div className="pr-hero-overlay" />
        <div className="container position-relative py-5">
          <div className="row align-items-center g-5 py-lg-5">
            <div className="col-lg-8 col-xl-7">
              <span className="pr-kicker"><i className="bi bi-book-half me-2" aria-hidden="true" />A MINISTRY OF FAITH, REVELATION &amp; PURPOSE</span>
              <h1 id="pr-title" className="display-3 fw-bold mt-4">Power of<br />Revelation <span>Ministries</span></h1>
              <p className="pr-hero-subtitle mt-4">Reconciling people with God. Proclaiming the Good News. Demonstrating the love of Christ.</p>
              <p className="pr-hero-description mt-3">Discover the story, spiritual vision, leadership, church community, and biblical teachings of Power of Revelation Ministries, with its headquarters at Revelation Church Kampala, Uganda.</p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <a href="#pr-vision" className="btn pr-btn-light btn-lg">Discover Our Vision<i className="bi bi-arrow-down-right ms-2" aria-hidden="true" /></a>
                <a href="#pr-sermons" className="btn pr-btn-outline btn-lg"><i className="bi bi-play-circle me-2" aria-hidden="true" />Explore Teachings</a>
              </div>
              <div className="pr-hero-location mt-4"><i className="bi bi-geo-alt-fill me-2" aria-hidden="true" />Najjanankumbi, off Entebbe Road, Busaabala Road, Kampala</div>
            </div>
            <div className="col-lg-4 col-xl-5">
              <div className="pr-hero-feature">
                <div className="pr-feature-symbol"><i className="bi bi-sunrise" aria-hidden="true" /></div>
                <span className="text-uppercase small fw-semibold">Our spiritual foundation</span>
                <h2 className="h3 fw-bold mt-3">A glorious life in Christ</h2>
                <p className="mb-4">We believe the Gospel calls people into a relationship with God, a deeper understanding of His Word, and a life that reflects His love.</p>
                <div className="pr-scripture"><i className="bi bi-quote" aria-hidden="true" /><p className="mb-2">“I am come that they might have life, and that they might have it more abundantly.”</p><span>John 10:10 · KJV</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pr-stats-section" aria-label="Ministry overview">
        <div className="container"><div className="row g-0">
          {[
            ["bi-calendar2-heart", "Late 1990s", "Ministry beginnings"],
            ["bi-diagram-3", "13 Churches", "Across Uganda"],
            ["bi-geo-alt", "Kampala", "Headquarters"],
            ["bi-broadcast", "Digital Ministry", "Sermons & podcasts"],
          ].map(([icon, title, subtitle]) => <div className="col-6 col-lg-3" key={title}><div className="pr-stat"><span className="pr-stat-icon"><i className={`bi ${icon}`} aria-hidden="true" /></span><strong>{title}</strong><span>{subtitle}</span></div></div>)}
        </div></div>
      </section>

      <section className="py-5 py-lg-6" id="pr-about">
        <div className="container py-lg-4"><div className="row align-items-center g-5">
          <div className="col-lg-6"><div className="pr-about-visual"><div className="pr-about-main"><i className="bi bi-book-half" aria-hidden="true" /><span>Faith · Fellowship · Revelation</span></div><div className="pr-about-note"><i className="bi bi-quote" aria-hidden="true" /><p className="mb-2">A people reconciled to God and equipped to demonstrate His love.</p><span>Our ministry emphasis</span></div></div></div>
          <div className="col-lg-6">
            <SectionHeading eyebrow="WHO WE ARE" title="A ministry founded on the Gospel of Jesus Christ" />
            <p className="mt-4">Power of Revelation Ministries is a Christian ministry in Uganda, associated with Revelation Church Kampala. Its published ministry statement emphasizes reconciliation with God, intimacy with His presence, and sharing the Good News through the demonstration of God's love.</p>
            <p>The ministry's history is traced to the late 1990s, when, according to the ministry background provided for this page, Bishop Merita Nabaasa founded the ministry. Over time, the ministry has developed a church presence that you identify as comprising 13 congregations across Uganda.</p>
            <p>Through preaching, worship, prayer, discipleship, fellowship, and digital teaching, the ministry seeks to help people grow in their understanding of Scripture and their relationship with God.</p>
            <div className="pr-inline-scripture mt-4"><i className="bi bi-bookmark-heart" aria-hidden="true" /><div><strong>Our guiding promise</strong><p className="mb-0">An abundant life grounded in Christ — John 10:10.</p></div></div>
          </div>
        </div></div>
      </section>

      <section className="pr-vision-section py-5 py-lg-6" id="pr-vision">
        <div className="container py-lg-4">
          <SectionHeading eyebrow="OUR SPIRITUAL DIRECTION" title="Our vision and mission" description="A clear spiritual direction for our churches, leaders, members, and communities." centered />
          <div className="row g-4 mt-4">
            <div className="col-lg-6"><article className="pr-purpose-card pr-purpose-vision h-100"><span className="pr-purpose-icon"><i className="bi bi-eye" aria-hidden="true" /></span><span className="pr-purpose-label">OUR VISION</span><h3 className="display-6 fw-bold mt-3">Reconciling people to God</h3><p className="mt-3">To reconcile all people with God so that they may experience His divine presence, grow in intimacy with Him, and live the abundant life made available through Jesus Christ.</p><div className="pr-purpose-footer"><i className="bi bi-arrow-up-right-circle" aria-hidden="true" /><span>Relationship with God · Spiritual growth · Abundant life</span></div></article></div>
            <div className="col-lg-6"><article className="pr-purpose-card pr-purpose-mission h-100"><span className="pr-purpose-icon"><i className="bi bi-send" aria-hidden="true" /></span><span className="pr-purpose-label">OUR MISSION</span><h3 className="display-6 fw-bold mt-3">Sharing the Good News through love</h3><p className="mt-3">To spread the Good News of Jesus Christ to all people through biblical teaching, evangelism, discipleship, prayer, Christian fellowship, and the practical demonstration of God's love.</p><div className="pr-purpose-footer"><i className="bi bi-arrow-up-right-circle" aria-hidden="true" /><span>Proclamation · Discipleship · Demonstrated love</span></div></article></div>
          </div>
          <div className="pr-purpose-statement text-center mt-5"><i className="bi bi-stars me-2" aria-hidden="true" />Our calling is not only to proclaim the Gospel, but also to encourage people to live it.</div>
        </div>
      </section>

      <section className="py-5 py-lg-6" id="pr-history">
        <div className="container py-lg-4">
          <SectionHeading eyebrow="OUR HERITAGE" title="A story of faith and ministry" description="Honouring the founding vision while continuing to share the Gospel with new generations." />
          <div className="pr-timeline mt-5">
            <article className="pr-timeline-item"><span className="pr-timeline-marker"><i className="bi bi-bookmark-heart" aria-hidden="true" /></span><div className="pr-timeline-content"><span className="pr-timeline-date">Late 1990s</span><h3 className="h4 fw-bold mt-2">The founding vision</h3><p className="mb-0">According to the ministry history supplied for this profile, Bishop Merita Nabaasa founded Power of Revelation Ministries in the late 1990s, establishing the foundation for its continuing Christian ministry.</p></div></article>
            <article className="pr-timeline-item"><span className="pr-timeline-marker"><i className="bi bi-building" aria-hidden="true" /></span><div className="pr-timeline-content"><span className="pr-timeline-date">Church community</span><h3 className="h4 fw-bold mt-2">A growing presence across Uganda</h3><p className="mb-0">The ministry is described as having 13 churches across Uganda, with local congregations providing places for worship, teaching, fellowship, and spiritual growth.</p></div></article>
            <article className="pr-timeline-item"><span className="pr-timeline-marker"><i className="bi bi-mic" aria-hidden="true" /></span><div className="pr-timeline-content"><span className="pr-timeline-date">Digital outreach</span><h3 className="h4 fw-bold mt-2">Sharing the message beyond the church</h3><p className="mb-0">Sermons, recorded teachings, and podcast episodes associated with Revelation Church Kampala extend access to ministry messages beyond in-person gatherings.</p></div></article>
          </div>
          <div className="pr-founder-panel mt-5"><div className="row align-items-center g-4"><div className="col-md-3"><div className="pr-founder-symbol"><i className="bi bi-person-heart" aria-hidden="true" /></div></div><div className="col-md-9"><span className="ministry-eyebrow">FOUNDING LEADERSHIP</span><h3 className="h2 fw-bold mt-3">Bishop Merita Nabaasa</h3><p>Bishop Merita Nabaasa is identified in the ministry history provided for this page as the founder of Power of Revelation Ministries in the late 1990s. Her place in the ministry's story represents its founding heritage and early vision.</p><p className="text-secondary small mb-0">To complete this profile, add an approved biography, historical photographs, ministry milestones, and links to verified sermons or interviews featuring Bishop Merita Nabaasa.</p><a href="https://www.youtube.com/results?search_query=Bishop+Merita+Nabaasa+Power+of+Revelation+Ministries" target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark mt-3"><i className="bi bi-youtube me-2" aria-hidden="true" />Find teachings by Bishop Merita</a></div></div></div>
        </div>
      </section>

      <section className="pr-values-section py-5 py-lg-6" id="pr-values">
        <div className="container py-lg-4"><SectionHeading eyebrow="WHAT GUIDES US" title="Our ministry values" description="Principles that express the ministry's stated vision and mission in everyday Christian life." centered />
          <div className="row g-4 mt-4">{values.map((value) => <div className="col-sm-6 col-lg-4" key={value.title}><article className="pr-value-card h-100"><span className="pr-value-icon"><i className={`bi ${value.icon}`} aria-hidden="true" /></span><h3 className="h5 fw-bold mt-4">{value.title}</h3><p className="text-secondary mb-0">{value.description}</p></article></div>)}</div>
        </div>
      </section>

      <section className="py-5 py-lg-6" id="pr-network">
        <div className="container py-lg-4"><div className="row align-items-center g-5">
          <div className="col-lg-6"><SectionHeading eyebrow="ONE MINISTRY · MANY COMMUNITIES" title="13 churches across Uganda" />
            <p className="mt-4">Power of Revelation Ministries is described as having a network of 13 churches across Uganda. This church network creates opportunities for people in different communities to gather in worship, learn Scripture, build relationships, and participate in Christian ministry.</p>
            <p>Each congregation contributes to the wider ministry by serving its local community while sharing the central vision of reconciliation with God and the mission of demonstrating His love.</p>
            <div className="pr-network-callout mt-4"><i className="bi bi-info-circle me-2" aria-hidden="true" /><span>The full branch directory can be added when the official church names, locations, local leaders, and service schedules have been confirmed.</span></div>
            <a href={MINISTRY.churchFacebook} target="_blank" rel="noopener noreferrer" className="btn btn-dark mt-4">Contact the church network<i className="bi bi-arrow-up-right ms-2" aria-hidden="true" /></a>
          </div>
          <div className="col-lg-6"><div className="pr-network-visual"><div className="pr-network-center"><i className="bi bi-crosshair" aria-hidden="true" /><strong>Power of Revelation</strong><span>Ministries · Uganda</span></div><div className="pr-network-orbit pr-network-orbit-one" /><div className="pr-network-orbit pr-network-orbit-two" />{Array.from({ length: 13 }, (_, index) => { const angle = (index * 360) / 13 - 90; const radians = (angle * Math.PI) / 180; const x = 50 + 42 * Math.cos(radians); const y = 50 + 42 * Math.sin(radians); return <span key={index} className="pr-network-node" style={{ left: `${x}%`, top: `${y}%` }} aria-label={`Church ${index + 1} of 13`} title={`Church ${index + 1}`}><i className="bi bi-building" aria-hidden="true" /></span>; })}</div><p className="text-secondary small text-center mt-3 mb-0">Illustrative network graphic; branch positions are not geographic locations.</p></div>
        </div></div>
      </section>

      <section className="pr-sermons-section py-5 py-lg-6" id="pr-sermons">
        <div className="container py-lg-4"><div className="row align-items-end g-3"><div className="col-lg-8"><SectionHeading eyebrow="WORD · WORSHIP · SPIRITUAL GROWTH" title="Sermons and teachings" description="Explore selected teachings associated with Revelation Church Kampala and Apostle Derrick Musinguzi." /></div><div className="col-lg-4 text-lg-end"><a href={MINISTRY.podcast} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark"><i className="bi bi-headphones me-2" aria-hidden="true" />Browse the podcast</a></div></div>
          <div className="row g-4 mt-3">{sermons.map((sermon) => <div className="col-md-6 col-xl-4" key={sermon.title}><article className="pr-sermon-card h-100"><div className="pr-sermon-art"><span className="pr-sermon-art-icon"><i className={`bi ${sermon.icon}`} aria-hidden="true" /></span><span className="pr-sermon-type">{sermon.type}</span><span className="pr-sermon-art-title">Revelation Church Kampala</span></div><div className="p-4"><span className="pr-sermon-category">{sermon.category}</span><h3 className="h5 fw-bold mt-3">{sermon.title}</h3><p className="small text-secondary mb-3">{sermon.speaker}</p><p className="text-secondary">{sermon.description}</p><a href={sermon.link} target="_blank" rel="noopener noreferrer" className="pr-sermon-link">{sermon.type === "video" ? "Watch sermon" : sermon.type === "audio" ? "Listen to recording" : "Explore podcast"}<i className="bi bi-arrow-up-right ms-2" aria-hidden="true" /></a></div></article></div>)}</div>
          <div className="pr-featured-video mt-5"><div className="row align-items-center g-0"><div className="col-lg-7"><div className="ratio ratio-16x9 pr-video-frame"><iframe src="https://www.youtube-nocookie.com/embed/oSwl5aEd_k4" title="God's Kingdom: Purpose for Humanity — Apostle Derrick Musinguzi" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div></div><div className="col-lg-5"><div className="pr-featured-video-content"><span className="ministry-eyebrow">FEATURED TEACHING</span><h3 className="h2 fw-bold mt-3">God's Kingdom: Purpose for Humanity</h3><p className="text-secondary mt-3">Join Apostle Derrick Musinguzi in a teaching on God's purpose for humanity, identity in Christ, and living according to God's will.</p><a href={MINISTRY.youtubeSermon} target="_blank" rel="noopener noreferrer" className="btn btn-dark mt-2">Watch on YouTube<i className="bi bi-youtube ms-2" aria-hidden="true" /></a></div></div></div></div>
        </div>
      </section>

      <section className="py-5 py-lg-6" id="pr-media">
        <div className="container py-lg-4"><SectionHeading eyebrow="STAY CONNECTED" title="Follow the ministry" description="Find available recordings, church updates, and teachings through the ministry's public media channels." centered />
          <div className="row g-4 mt-4"><div className="col-lg-6">
            <MediaLink href={MINISTRY.churchFacebook} icon="bi-facebook" title="Revelation Church Kampala" description="Church updates, videos, and ministry content on Facebook." label="Open Facebook" />
            <MediaLink href={MINISTRY.facebook} icon="bi-globe" title="Power of Revelation Ministries" description="Visit the ministry's Facebook page for updates and recordings." label="Open ministry Facebook" />
            <MediaLink href="https://www.youtube.com/@RevelationChurchKampala" icon="bi-youtube" title="Revelation Church Kampala on YouTube" description="Explore sermons and video teachings. If the channel address changes, use the search link below." label="Open YouTube" />
            <MediaLink href="https://www.youtube.com/results?search_query=Revelation+Church+Kampala+Apostle+Derrick+Musinguzi" icon="bi-play-btn" title="Find more video sermons" description="Search YouTube for sermons by Apostle Derrick Musinguzi." label="Search sermons" />
          </div><div className="col-lg-6"><div className="pr-podcast-panel h-100"><span className="pr-podcast-icon"><i className="bi bi-headphones" aria-hidden="true" /></span><span className="ministry-eyebrow mt-4">AUDIO MINISTRY</span><h3 className="h2 fw-bold mt-3">Revelation Church Kampala Podcast</h3><p className="text-secondary mt-3">Listen to recorded messages credited to Apostle Derrick Musinguzi, including teachings on divine favour, purpose, Christian living, and the love of God.</p><a href={MINISTRY.podcast} target="_blank" rel="noopener noreferrer" className="btn btn-dark mt-2"><i className="bi bi-apple me-2" aria-hidden="true" />Listen on Apple Podcasts</a><a href="https://www.listennotes.com/podcasts/revelation-church-kampala-apostle-derrick-tXMzfW6hRFV/" target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark mt-2 ms-sm-2">Other podcast details<i className="bi bi-arrow-up-right ms-2" aria-hidden="true" /></a><p className="small text-secondary mt-4 mb-0">The publicly indexed podcast catalogue includes older recordings. Check the official church channels for the latest services and new messages.</p></div></div></div>
        </div>
      </section>

      <section className="pr-location-section py-5 py-lg-6" id="pr-location">
        <div className="container py-lg-4"><div className="row align-items-center g-5"><div className="col-lg-6"><SectionHeading eyebrow="VISIT OUR HEADQUARTERS" title="Revelation Church Kampala" description="A place to gather for worship, hear the Word, and grow in Christian fellowship." />
          <div className="pr-address-card mt-4"><span className="pr-address-icon"><i className="bi bi-geo-alt-fill" aria-hidden="true" /></span><div><strong>Power of Revelation Ministries</strong><p className="text-secondary mt-2 mb-0">Revelation Church Kampala<br />Najjanankumbi, off Entebbe Road<br />Busaabala Road, Kampala, Uganda</p></div></div>
          <p className="text-secondary small mt-3">Please contact the ministry to confirm service times, directions, and arrangements before visiting.</p>
          <a href={MINISTRY.maps} target="_blank" rel="noopener noreferrer" className="btn btn-dark mt-2"><i className="bi bi-map me-2" aria-hidden="true" />Get directions</a>
          <a href={MINISTRY.churchFacebook} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark mt-2 ms-sm-2">Contact through Facebook<i className="bi bi-arrow-up-right ms-2" aria-hidden="true" /></a>
        </div><div className="col-lg-6"><a href={MINISTRY.maps} target="_blank" rel="noopener noreferrer" className="pr-map-card" aria-label="Open directions to Revelation Church Kampala on Google Maps"><div className="pr-map-decoration"><span className="pr-map-road pr-map-road-one" /><span className="pr-map-road pr-map-road-two" /><span className="pr-map-road pr-map-road-three" /><span className="pr-map-pin"><i className="bi bi-geo-alt-fill" aria-hidden="true" /></span><div className="pr-map-label"><i className="bi bi-building me-2" aria-hidden="true" />Revelation Church Kampala<span>Najjanankumbi · Kampala</span></div></div><div className="pr-map-footer"><span><strong>Headquarters</strong><span className="d-block text-secondary small">Busaabala Road, Uganda</span></span><i className="bi bi-arrow-up-right-circle fs-3" aria-hidden="true" /></div></a></div></div></div>
      </section>

      <section className="pr-cta-section py-5 py-lg-6"><div className="container py-lg-4 text-center"><span className="pr-cta-icon"><i className="bi bi-heart-fill" aria-hidden="true" /></span><span className="pr-kicker mt-4 d-inline-flex">GROW IN FAITH · WALK IN PURPOSE</span><h2 className="display-5 fw-bold mt-3">Discover the life God has called you to live.</h2><p className="mx-auto mt-3">Explore the Word, connect with the church community, and discover more of the ministry's teachings as you grow in faith and fellowship.</p><div className="d-flex justify-content-center flex-wrap gap-3 mt-4"><a href={MINISTRY.churchFacebook} target="_blank" rel="noopener noreferrer" className="btn pr-btn-light btn-lg">Connect with the ministry<i className="bi bi-arrow-up-right ms-2" aria-hidden="true" /></a><a href={MINISTRY.podcast} target="_blank" rel="noopener noreferrer" className="btn pr-btn-outline btn-lg">Listen to teachings<i className="bi bi-headphones ms-2" aria-hidden="true" /></a></div></div></section>
    </main>
  );
}
