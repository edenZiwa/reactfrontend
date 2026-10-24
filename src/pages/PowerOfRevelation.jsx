import React, { useState } from "react";
import "../css/power-of-revelation.css";

const MINISTRY = {
  name: "Power of Revelation Ministries",
  shortName: "Power of Revelation",
  church: "Revelation Church Kampala",
  location: "Najjanankumbi, Kampala, Uganda",
  address:
    "Najjanankumbi, off Entebbe Road, along Busaabala Road, Kampala, Uganda",

  leader: "Apostle Derrick Musinguzi",
  founder: "Bishop Merita Nabaasa",

  description:
    "Power of Revelation Ministries is a Christian ministry committed to reconciling people with God, revealing Christ through unconditional love, and spreading the Gospel of grace and love.",

  vision:
    "To reconcile people with God so that they may experience the power of His resurrection and divine love.",

  visionScripture: "2 Corinthians 5:18–21",

  mission:
    "To reveal Christ through the demonstration of His unconditional love and with the gifts and resources God has entrusted to us.",

  identity:
    "We are an apostolic, Word-centred church focused on spreading the Gospel of grace and love.",

  network:
    "A church ministry serving communities through its reported network of 13 churches across Uganda.",

  podcast:
    "https://podcasts.apple.com/us/podcast/revelation-church-kampala/id1551432049",

  facebook:
    "https://www.facebook.com/powerofrevelation/",

  churchFacebook:
    "https://www.facebook.com/revelationchurchkampala/",

  // Confirmed livestream supplied for the featured sermon.
  youtubeSermon: "https://www.youtube.com/live/vjG_LPPfunE?si=fhcdH94u435HOanB",
  youtubeVideoId: "vjG_LPPfunE",

  leadershipPhotos: {
    founder: "/images/founder/bishop_merita_nabaasa.jpg",
    leader: "/images/founder/derrick-musinguzi.png",
  },

  maps:
    "https://www.google.com/maps/search/?api=1&query=Power+of+Revelation+Ministries+Najjanankumbi+Kampala+Uganda",

  scriptures: {
    reconciliation: "2 Corinthians 5:18–21",
    greatCommission: "Matthew 28:19–20",
    love: "John 13:34–35",
    service: "Mark 10:43–45",
    integrity: "Proverbs 11:3",
    generosity: "2 Corinthians 9:7–8",
    humility: "Philippians 2:3–5",
  },
};

const sermons = [
  {
    id: "sowing-seeds-of-mercy",
    category: "LOVE & COMPASSION",
    title: "Sowing Seeds of Mercy",
    speaker: "Apostle Derrick Musinguzi",
    description:
      "Discover how demonstrating the love of Christ, serving others, and extending mercy can sow seeds of hope that make a lasting difference in people's lives. A message centred on compassion, generosity, and living out the Gospel.",
    type: "video",
    link: MINISTRY.youtubeSermon,
    icon: "bi-play-circle-fill",
    featured: true,
    keywords: [
      "Sowing Seeds of Mercy",
      "Apostle Derrick Musinguzi",
      "Power of Revelation Ministries",
      "Christian compassion",
      "Gospel of grace and love",
    ],
  },
  {
    id: "divine-favour-grace",
    category: "FAITH & GRACE",
    title: "The Divine Favour (Grace)",
    speaker: "Apostle Derrick Musinguzi",
    description:
      "A recorded teaching exploring divine favour and the grace of God in the life of a believer.",
    type: "audio",
    link:
      "https://www.facebook.com/revelationchurchkampala/videos/977851343539147/",
    icon: "bi-headphones",
    featured: false,
  },
  {
    id: "finding-fulfilling-purpose",
    category: "PURPOSE & DESTINY",
    title: "Finding and Fulfilling Your Purpose",
    speaker: "Apostle Derrick Musinguzi",
    description:
      "Explore the importance of discovering your purpose, growing in spiritual understanding, and pursuing God's calling with faith and commitment.",
    type: "podcast",
    link: MINISTRY.podcast,
    icon: "bi-broadcast",
    featured: false,
  },
  {
    id: "happiness-and-joy",
    category: "CHRISTIAN LIVING",
    title: "The Difference Between Happiness and Joy",
    speaker: "Apostle Derrick Musinguzi",
    description:
      "A teaching on the difference between circumstances that bring temporary happiness and the deeper joy believers find in their relationship with God.",
    type: "podcast",
    link: MINISTRY.podcast,
    icon: "bi-soundwave",
    featured: false,
  },
  {
    id: "not-every-purpose-revealed",
    category: "SPIRITUAL GROWTH",
    title: "Not Every Purpose Is Revealed",
    speaker: "Apostle Derrick Musinguzi",
    description:
      "An encouragement to trust God, seek wisdom, and remain faithful as His purpose unfolds throughout life's journey.",
    type: "podcast",
    link: MINISTRY.podcast,
    icon: "bi-journal-richtext",
    featured: false,
  },
  {
    id: "god-loves-us",
    category: "FOUNDATION OF FAITH",
    title: "God Loves Us",
    speaker: "Revelation Church Kampala",
    description:
      "A foundational message about the love of God and the gift of salvation through Jesus Christ, drawing on John 3:16.",
    type: "podcast",
    link: MINISTRY.podcast,
    icon: "bi-heart-fill",
    featured: false,
  },
];

const values = [
  {
    id: "word-centred",
    abbreviation: "W",
    title: "Word-Centred",
    description:
      "We uphold the Word of God as the foundation for our faith, teaching, decisions, and daily Christian living. Scripture guides our beliefs and directs how we share the Gospel of grace and love.",
    scripture: "2 Timothy 3:16–17",
    icon: "bi-book-half",
  },
  {
    id: "integrity",
    abbreviation: "I",
    title: "Integrity",
    description:
      "We pursue honesty, faithfulness, accountability, and consistency in our words and actions. We seek to honour God by living according to His truth in our relationships, leadership, and service.",
    scripture: "Proverbs 11:3",
    icon: "bi-shield-check",
  },
  {
    id: "generosity",
    abbreviation: "G",
    title: "Generosity",
    description:
      "We give willingly of our time, talents, gifts, and resources to demonstrate the unconditional love of Christ and serve people and communities with compassion.",
    scripture: "2 Corinthians 9:7–8",
    icon: "bi-gift",
  },
  {
    id: "service",
    abbreviation: "S",
    title: "Service",
    description:
      "We follow the example of Jesus by serving others with love and humility. We see ministry as an opportunity to meet needs, strengthen communities, and demonstrate Christ's love through practical action.",
    scripture: "Mark 10:43–45",
    icon: "bi-hands",
  },
  {
    id: "commitment",
    abbreviation: "C",
    title: "Commitment",
    description:
      "We remain devoted to God, His Word, the mission of the Church, and the responsibilities entrusted to us. We serve faithfully and persevere in spreading the Gospel of grace and love.",
    scripture: "Colossians 3:23–24",
    icon: "bi-check2-circle",
  },
  {
    id: "humility",
    abbreviation: "H",
    title: "Humility",
    description:
      "We choose humility over pride and value others with genuine love and respect. Following Christ's example, we seek to serve rather than seek recognition, honouring God in all we do.",
    scripture: "Philippians 2:3–5",
    icon: "bi-heart",
  },
];

const ministryPillars = [
  {
    id: "reconciliation",
    title: "Reconciliation with God",
    description:
      "Sharing the message of reconciliation through Jesus Christ so that people can know God and experience His transforming love.",
    scripture: "2 Corinthians 5:18–21",
    icon: "bi-cross",
  },
  {
    id: "gospel-of-grace",
    title: "The Gospel of Grace",
    description:
      "Proclaiming the good news of Jesus Christ and encouraging people to grow in faith, grace, and the knowledge of God's Word.",
    scripture: "Ephesians 2:8–10",
    icon: "bi-book",
  },
  {
    id: "demonstrated-love",
    title: "Demonstrating God's Love",
    description:
      "Putting faith into action through generosity, compassion, practical service, and the responsible use of the gifts God has entrusted to us.",
    scripture: "1 John 3:18",
    icon: "bi-heart-fill",
  },
  {
    id: "discipleship",
    title: "Discipleship and Growth",
    description:
      "Encouraging believers to mature spiritually, develop Christlike character, and become faithful witnesses of the Gospel.",
    scripture: "Matthew 28:19–20",
    icon: "bi-people-fill",
  },
];

const ministryLinks = [
  {
    title: "Listen to Our Podcast",
    description:
      "Explore teachings and recorded messages from Revelation Church Kampala.",
    link: MINISTRY.podcast,
    icon: "bi-mic-fill",
  },
  {
    title: "Follow Power of Revelation Ministries",
    description:
      "Connect with the ministry through its Facebook page.",
    link: MINISTRY.facebook,
    icon: "bi-facebook",
  },
  {
    title: "Visit Revelation Church Kampala",
    description:
      "Find directions to the church in Najjanankumbi, Kampala.",
    link: MINISTRY.maps,
    icon: "bi-geo-alt-fill",
  },
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

function ScriptureQuote() {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`pr-scripture ${expanded ? "is-expanded" : ""}`}>
            <i
                className="bi bi-quote pr-scripture-icon"
                aria-hidden="true"
            />

            <div className="pr-scripture-content">
                <p className="pr-scripture-text mb-2">
                    “Therefore if any man be in Christ, he is a new creature:
                    old things are passed away; behold, all things are become
                    new.

                    {" "}And all things are of God, Who has reconciled us to
                    Himself by Jesus Christ, and has given to us the Ministry
                    of Reconciliation;

                    {" "}To wit, that God was in Christ, reconciling the world
                    unto Himself, not imputing their trespasses unto them;
                    and has committed unto us the Word of Reconciliation.

                    {" "}Now then we are Ambassadors for Christ, as though
                    God beseech you by us: we pray you in Christ's stead,
                    be reconciled to God.

                    {" "}For He has made Him to be sin for us, Who knew no sin
                    that we might be made the Righteousness of God in Him.”
                </p>

                <span className="pr-scripture-reference">
                    2 Corinthians 5:17–21 · KJV
                </span>

                <button
                    type="button"
                    className="pr-scripture-toggle"
                    onClick={() => setExpanded((previous) => !previous)}
                    aria-expanded={expanded}
                >
                    {expanded ? (
                        <>
                            Show less
                            <i className="bi bi-chevron-up ms-2" aria-hidden="true" />
                        </>
                    ) : (
                        <>
                            Read full scripture
                            <i className="bi bi-chevron-down ms-2" aria-hidden="true" />
                        </>
                    )}
                </button>
            </div>
        </div>
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
              <span className="pr-kicker"><i className="bi bi-book-half me-2" aria-hidden="true" />THE GROUND OF GOD'S GRACE</span>
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
<ScriptureQuote />
</div>
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
            <p className="mt-4">Power of Revelation Ministries is a Christian ministry in Uganda, the home of Revelation Church Kampala. Its ministry statement emphasizes reconciliation with God, intimacy with His presence, and sharing the Good News through the demonstration of God's love.</p>
            <p>The ministry's history is traced to the late 1990s, when, according to the ministry background provided for this page, Bishop Merita Nabaasa founded the ministry. Over time, the ministry has developed a church presence of 13 congregations across Uganda.</p>
            <p>Through preaching, worship, prayer, discipleship, fellowship, and digital teaching, the ministry seeks to help people grow in their understanding of Scripture and their relationship with God.</p>
            <div className="pr-inline-scripture mt-4"><i className="bi bi-bookmark-heart" aria-hidden="true" /><div><strong>Our guiding promise</strong><p className="mb-0">Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new. — 2 Corinthians 5:17.</p></div></div>
          </div>
        </div></div>
      </section>

      <section className="pr-vision-section py-5 py-lg-6" id="pr-vision">
        <div className="container py-lg-4">
          <SectionHeading eyebrow="OUR SPIRITUAL DIRECTION" title="Our vision and mission" description="A clear spiritual direction for our churches, leaders, members, and communities." centered />
          <div className="row g-4 mt-4">
            <div className="col-lg-6"><article className="pr-purpose-card pr-purpose-vision h-100"><span className="pr-purpose-icon"><i className="bi bi-eye" aria-hidden="true" /></span><span className="pr-purpose-label">OUR VISION</span><h3 className="display-6 fw-bold mt-3">Reconciling people to God</h3><p className="mt-3">To reconcile people with God so that they may experience the power of His resurrection and divine love.</p><div className="pr-purpose-footer"><i className="bi bi-bookmark" aria-hidden="true" /><span>2 Corinthians 5:18–21</span></div></article></div>
            <div className="col-lg-6"><article className="pr-purpose-card pr-purpose-mission h-100"><span className="pr-purpose-icon"><i className="bi bi-send" aria-hidden="true" /></span><span className="pr-purpose-label">OUR MISSION</span><h3 className="display-6 fw-bold mt-3">Sharing the Good News through love</h3><p className="mt-3">To reveal Christ through the demonstration of His unconditional love and with the gifts and resources God has entrusted to us.</p><div className="pr-purpose-footer"><i className="bi bi-heart" aria-hidden="true" /><span>Unconditional love · Gifts · Resources</span></div></article></div>
          </div>
          <div className="pr-purpose-statement text-center mt-5"><i className="bi bi-stars me-2" aria-hidden="true" />Our calling is not only to proclaim the Gospel, but also to encourage people to live it.</div>
        </div>
      </section>

      <section className="py-5 py-lg-6" id="pr-history">
        <div className="container py-lg-4">
          <SectionHeading eyebrow="OUR HERITAGE" title="A story of faith and ministry" description="Honouring the founding vision while continuing to share the Gospel with new generations." />
          <div className="pr-timeline mt-5">
            <article className="pr-timeline-item"><span className="pr-timeline-marker"><i className="bi bi-bookmark-heart" aria-hidden="true" /></span><div className="pr-timeline-content"><span className="pr-timeline-date">Late 1990s</span><h3 className="h4 fw-bold mt-2">The founding vision</h3><p className="mb-0">Bishop Merita Nabaasa founded Power of Revelation Ministries in the late 1990s, establishing the foundation for its continuing Christian ministry.</p></div></article>
            <article className="pr-timeline-item"><span className="pr-timeline-marker"><i className="bi bi-building" aria-hidden="true" /></span><div className="pr-timeline-content"><span className="pr-timeline-date">Church community</span><h3 className="h4 fw-bold mt-2">A growing presence across Uganda</h3><p className="mb-0">The ministry has 13 churches across Uganda, with local congregations providing places for worship, teaching, fellowship, and spiritual growth.</p></div></article>
            <article className="pr-timeline-item"><span className="pr-timeline-marker"><i className="bi bi-mic" aria-hidden="true" /></span><div className="pr-timeline-content"><span className="pr-timeline-date">Digital outreach</span><h3 className="h4 fw-bold mt-2">Sharing the message beyond the church</h3><p className="mb-0">Sermons, recorded teachings, and podcast episodes from Revelation Church Kampala extend access to ministry messages beyond in-person gatherings.</p></div></article>
          </div>
          <div className="pr-founder-panel mt-5">
            <div className="row g-4">
              <div className="col-md-6">
                <article className="pr-leader-card h-100 border rounded-4 overflow-hidden shadow-sm bg-white">
                  <img src={MINISTRY.leadershipPhotos.founder} alt="Bishop Merita Nabaasa, founder of Power of Revelation Ministries" className="pr-leader-photo img-fluid w-100 object-fit-cover" loading="lazy" />
                  <div className="p-4">
                    <span className="ministry-eyebrow">FOUNDING LEADERSHIP</span>
                    <h3 className="h3 fw-bold mt-3">Bishop Merita Nabaasa</h3>
                    <p className="text-secondary">Founder of Power of Revelation Ministries, whose ministry story dates to the late 1990s.</p>
                    <a href="https://www.youtube.com/results?search_query=Bishop+Merita+Nabaasa+Power+of+Revelation+Ministries" target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark mt-2"><i className="bi bi-youtube me-2" aria-hidden="true" />Find teachings</a>
                  </div>
                </article>
              </div>
              <div className="col-md-6">
                <article className="pr-leader-card h-100 border rounded-4 overflow-hidden shadow-sm bg-white">
                  <img src={MINISTRY.leadershipPhotos.leader} alt="Apostle Derrick Musinguzi, ministry leader and teacher at Revelation Church Kampala" className="pr-leader-photo img-fluid w-100 object-fit-cover" loading="lazy" />
                  <div className="p-4">
                    <span className="ministry-eyebrow">MINISTRY LEADERSHIP</span>
                    <h3 className="h3 fw-bold mt-3">Apostle Derrick Musinguzi</h3>
                    <p className="text-secondary">Preaching and teaching through Revelation Church Kampala, sharing messages on the Gospel of grace, purpose, and the love of God.</p>
                    <a href={MINISTRY.youtubeSermon} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark mt-2"><i className="bi bi-play-circle me-2" aria-hidden="true" />Watch featured sermon</a>
                  </div>
                </article>
              </div>
            </div>
          </div>
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
            <p className="mt-4">Power of Revelation Ministries has a reported network of 13 churches across Uganda. This church network creates opportunities for people in different communities to gather in worship, learn Scripture, build relationships, and participate in Christian ministry.</p>
            <p>Each congregation contributes to the wider ministry by serving its local community while sharing the central vision of reconciliation with God and the mission of demonstrating His love.</p>
           
          </div>
          <div className="col-lg-6"><div className="pr-network-visual"><div className="pr-network-center"><i className="bi bi-crosshair" aria-hidden="true" /><strong>Power of Revelation</strong><span>Ministries · International</span></div><div className="pr-network-orbit pr-network-orbit-one" /><div className="pr-network-orbit pr-network-orbit-two" />{Array.from({ length: 13 }, (_, index) => { const angle = (index * 360) / 13 - 90; const radians = (angle * Math.PI) / 180; const x = 50 + 42 * Math.cos(radians); const y = 50 + 42 * Math.sin(radians); return <span key={index} className="pr-network-node" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true" title={`Church ${index + 1}` }><i className="bi bi-building" aria-hidden="true" /></span>; })}</div><p className="text-secondary small text-center mt-3 mb-0">Illustrative network graphic; branch positions are not geographic locations.</p></div>
        </div></div>
      </section>

      <section className="pr-events-section py-5 py-lg-6" id="pr-events">
        <div className="container py-lg-4">
          <SectionHeading
            eyebrow="GATHER · GROW · SERVE"
            title="Recent and upcoming events"
            description="Keep connected with ministry messages, church activities, and announcements from Revelation Church Kampala."
            centered
          />
          <div className="row g-4 mt-4">
            <div className="col-lg-6">
              <div className="pr-events-column h-100 border rounded-4 p-4 p-lg-5 bg-white shadow-sm">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="pr-event-heading-icon"><i className="bi bi-calendar2-check" aria-hidden="true" /></span>
                  <div><span className="ministry-eyebrow">MINISTRY HIGHLIGHT</span><h3 className="h3 fw-bold mt-1 mb-0">Recent events & messages</h3></div>
                </div>
                <article className="pr-event-card d-flex align-items-start gap-3 border-bottom pb-4">
                  <div className="pr-event-date-icon"><i className="bi bi-play-circle-fill" aria-hidden="true" /></div>
                  <div className="flex-grow-1">
                    <span className="pr-sermon-category">FEATURED LIVESTREAM</span>
                    <h4 className="h5 fw-bold mt-2">Sowing Seeds of Mercy</h4>
                    <p className="text-secondary mb-3">A message by Apostle Derrick Musinguzi on mercy, compassion, and demonstrating the love of Christ. The publication date is not listed here.</p>
                    <a href={MINISTRY.youtubeSermon} target="_blank" rel="noopener noreferrer" className="pr-sermon-link">Watch the livestream<i className="bi bi-arrow-up-right ms-2" aria-hidden="true" /></a>
                  </div>
                </article>
                <article className="pr-event-card d-flex align-items-start gap-3 mt-4">
                  <div className="pr-event-date-icon"><i className="bi bi-mic-fill" aria-hidden="true" /></div>
                  <div className="flex-grow-1">
                    <span className="pr-sermon-category">RECORDED TEACHINGS</span>
                    <h4 className="h5 fw-bold mt-2">Revelation Church Kampala Podcast</h4>
                    <p className="text-secondary mb-3">Explore recorded teachings, including messages on divine favour, purpose, Christian living, and the love of God.</p>
                    <a href={MINISTRY.podcast} target="_blank" rel="noopener noreferrer" className="pr-sermon-link">Browse podcast episodes<i className="bi bi-arrow-up-right ms-2" aria-hidden="true" /></a>
                  </div>
                </article>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="pr-events-column pr-upcoming-events h-100 border rounded-4 p-4 p-lg-5 bg-white shadow-sm">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="pr-event-heading-icon"><i className="bi bi-calendar2-plus" aria-hidden="true" /></span>
                  <div><span className="ministry-eyebrow">PLAN YOUR VISIT</span><h3 className="h3 fw-bold mt-1 mb-0">Upcoming events</h3></div>
                </div>
                <div className="pr-upcoming-empty rounded-4 p-4 bg-light">
                  <span className="pr-upcoming-empty-icon"><i className="bi bi-calendar-week" aria-hidden="true" /></span>
                  <h4 className="h5 fw-bold mt-3">Stay tuned for announcements</h4>
                  <p className="text-secondary">I could not verify a current upcoming-event schedule from the public sources checked. We have therefore not added unconfirmed dates or service times.</p>
                  <p className="text-secondary">Follow the official ministry pages or contact the church to confirm upcoming services, conferences, prayer meetings, and special gatherings.</p>
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <a href={MINISTRY.churchFacebook} target="_blank" rel="noopener noreferrer" className="btn btn-dark"><i className="bi bi-facebook me-2" aria-hidden="true" />Church updates</a>
                    <a href={MINISTRY.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark">Ministry updates<i className="bi bi-arrow-up-right ms-2" aria-hidden="true" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pr-sermons-section py-5 py-lg-6" id="pr-sermons">
        <div className="container py-lg-4"><div className="row align-items-end g-3"><div className="col-lg-8"><SectionHeading eyebrow="WORD · WORSHIP · SPIRITUAL GROWTH" title="Sermons and teachings" description="Explore Revelation Church Kampala teachings." /></div><div className="col-lg-4 text-lg-end"><a href={MINISTRY.podcast} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark"><i className="bi bi-headphones me-2" aria-hidden="true" />Browse the podcast</a></div></div>
          <div className="row g-4 mt-3">{sermons.map((sermon) => <div className="col-md-6 col-xl-4" key={sermon.id}><article className="pr-sermon-card h-100"><div className="pr-sermon-art"><span className="pr-sermon-art-icon"><i className={`bi ${sermon.icon}`} aria-hidden="true" /></span><span className="pr-sermon-type">{sermon.type}</span><span className="pr-sermon-art-title">Revelation Church Kampala</span></div><div className="p-4"><span className="pr-sermon-category">{sermon.category}</span><h3 className="h5 fw-bold mt-3">{sermon.title}</h3><p className="small text-secondary mb-3">{sermon.speaker}</p><p className="text-secondary">{sermon.description}</p><a href={sermon.link} target="_blank" rel="noopener noreferrer" className="pr-sermon-link">{sermon.type === "video" ? "Watch sermon" : sermon.type === "audio" ? "Listen to recording" : "Explore podcast"}<i className="bi bi-arrow-up-right ms-2" aria-hidden="true" /></a></div></article></div>)}</div>
          <div className="pr-featured-video mt-5"><div className="row align-items-center g-0"><div className="col-lg-7"><div className="ratio ratio-16x9 pr-video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${MINISTRY.youtubeVideoId}`} title="Sowing Seeds of Mercy — Apostle Derrick Musinguzi" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div></div><div className="col-lg-5"><div className="pr-featured-video-content"><span className="ministry-eyebrow">FEATURED SERMON</span><h3 className="h2 fw-bold mt-3">Sowing Seeds of Mercy</h3><p className="text-secondary mt-3">Join Apostle Derrick Musinguzi for a message about demonstrating Christ’s love, sowing seeds of hope, and serving others with mercy and compassion.</p><a href={MINISTRY.youtubeSermon} target="_blank" rel="noopener noreferrer" className="btn btn-dark mt-2">Watch on YouTube<i className="bi bi-youtube ms-2" aria-hidden="true" /></a></div></div></div></div>
        </div>
      </section>

      <section className="py-5 py-lg-6" id="pr-media">
        <div className="container py-lg-4"><SectionHeading eyebrow="STAY CONNECTED" title="Follow the ministry" description="Find available recordings, church updates, and teachings through the ministry's public media channels." centered />
          <div className="row g-4 mt-4"><div className="col-lg-6">
            <MediaLink href={MINISTRY.churchFacebook} icon="bi-facebook" title="Revelation Church Kampala" description="Church updates, videos, and ministry content on Facebook." label="Open Facebook" />
            <MediaLink href={MINISTRY.facebook} icon="bi-globe" title="Power of Revelation Ministries" description="Visit the ministry's Facebook page for updates and recordings." label="Open ministry Facebook" />
            <MediaLink href="https://www.youtube.com/results?search_query=Revelation+Church+Kampala+official+channel" icon="bi-youtube" title="Revelation Church Kampala on YouTube" description="Explore sermons and video teachings. If the channel address changes, use the search link below." label="Open YouTube" />
            <MediaLink href="https://www.youtube.com/results?search_query=Revelation+Church+Kampala+Apostle+Derrick+Musinguzi" icon="bi-play-btn" title="Find more video sermons" description="Search YouTube for sermons by Apostle Derrick Musinguzi." label="Search sermons" />
          </div><div className="col-lg-6"><div className="pr-podcast-panel h-100"><span className="pr-podcast-icon"><i className="bi bi-headphones" aria-hidden="true" /></span><span className="ministry-eyebrow mt-4">AUDIO MINISTRY</span><h3 className="h2 fw-bold mt-3">Revelation Church Kampala Podcast</h3><p className="text-secondary mt-3">Listen to recorded messages of Apostle Derrick Musinguzi, including teachings on divine favour, purpose, Christian living, and the love of God.</p><a href={MINISTRY.podcast} target="_blank" rel="noopener noreferrer" className="btn btn-dark mt-2"><i className="bi bi-apple me-2" aria-hidden="true" />Listen on Apple Podcasts</a><a href="https://www.listennotes.com/podcasts/revelation-church-kampala-apostle-derrick-tXMzfW6hRFV/" target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark mt-2 ms-sm-2">Other podcast details<i className="bi bi-arrow-up-right ms-2" aria-hidden="true" /></a><p className="small text-secondary mt-4 mb-0">The publicly indexed podcast catalogue includes older recordings. Check the official church channels for the latest services and new messages.</p></div></div></div>
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
