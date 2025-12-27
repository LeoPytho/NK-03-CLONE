import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import "../styles/carousel.css";
import "../styles/liveShow.css";

function Home() {
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Banner images array
  const bannerImages = [
    "https://res.cloudinary.com/haymzm4wp/image/upload/v1760105848/bi5ej2hgh0cc2uowu5xr.jpg",
    "https://res.cloudinary.com/haymzm4wp/image/upload/v1709811057/hjsfgaw0kf3fhxg677fs.jpg",
    "https://res.cloudinary.com/haymzm4wp/image/upload/v1709811568/hm6aztwojrngb6ryrdn9.png",
    "https://res.cloudinary.com/haymzm4wp/image/upload/v1746940686/gnzangtum7a8ygmk8hvj.jpg",
    "https://res.cloudinary.com/haymzm4wp/image/upload/v1746940449/zjdka1gtuuoc5gx9kkco.jpg",
  ];

  // Static products data - Show Mingguan (using banner images)
  const weeklyProducts = [
    {
      id: 1,
      name: "Show Mingguan Premium",
      price: 75000,
      image_url: [
        "https://res.cloudinary.com/haymzm4wp/image/upload/v1760105848/bi5ej2hgh0cc2uowu5xr.jpg",
      ],
      custom_url: "show-mingguan-premium",
      category: "weekly",
    },
    {
      id: 2,
      name: "Show Mingguan Exclusive",
      price: 100000,
      image_url: [
        "https://res.cloudinary.com/haymzm4wp/image/upload/v1709811057/hjsfgaw0kf3fhxg677fs.jpg",
      ],
      custom_url: "show-mingguan-exclusive",
      category: "weekly",
    },
  ];

  // Static products data - Membership/Bulanan (using banner images)
  const membershipProducts = [
    {
      id: 3,
      name: "Membership Silver - Bulanan",
      price: 250000,
      image_url: [
        "https://res.cloudinary.com/haymzm4wp/image/upload/v1709811568/hm6aztwojrngb6ryrdn9.png",
      ],
      custom_url: "membership-silver-bulanan",
      category: "monthly",
    },
    {
      id: 4,
      name: "Membership Gold - Bulanan",
      price: 400000,
      image_url: [
        "https://res.cloudinary.com/haymzm4wp/image/upload/v1746940686/gnzangtum7a8ygmk8hvj.jpg",
      ],
      custom_url: "membership-gold-bulanan",
      category: "monthly",
    },
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-slide banner every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // Navigate to specific banner
  const goToBanner = (index) => {
    setCurrentBanner(index);
  };

  // Navigate to previous banner
  const prevBanner = () => {
    setCurrentBanner((prev) =>
      prev === 0 ? bannerImages.length - 1 : prev - 1
    );
  };

  // Navigate to next banner
  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
  };

  return (
    <div className="container">
      {/* Banner Carousel */}
      <div className="banner-carousel">
        <div className="carousel-container">
          {bannerImages.map((img, index) => (
            <div
              key={index}
              className={`carousel-slide ${
                index === currentBanner ? "active" : ""
              }`}
            >
              <img src={img} alt={`Banner ${index + 1}`} />
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={prevBanner}
            aria-label="Previous banner"
          >
            ‹
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={nextBanner}
            aria-label="Next banner"
          >
            ›
          </button>

          {/* Dots Indicator */}
          <div className="carousel-dots">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${
                  index === currentBanner ? "active" : ""
                }`}
                onClick={() => goToBanner(index)}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Show Mingguan Section */}
      <div className="section-title-img">
        <h2 className="section-title-text">Show Mingguan</h2>
      </div>

      <div className="product-grid">
        {loading
          ? Array.from({ length: 2 }, (_, i) => <ProductSkeleton key={i} />)
          : weeklyProducts.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      {/* Membership/Bulanan Section */}
      <div className="section-title-img">
        <h2 className="section-title-text">Membership / Bulanan</h2>
      </div>

      <div className="product-grid">
        {loading
          ? Array.from({ length: 2 }, (_, i) => (
              <ProductSkeleton key={`membership-${i}`} />
            ))
          : membershipProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
      </div>

      {/* Live Show Section */}
      <LiveShowSection loading={loading} />
    </div>
  );
}

// Live Show Component
function LiveShowSection({ loading }) {
  const [liveShows, setLiveShows] = useState([]);
  const [checkingLive, setCheckingLive] = useState(true);

  // Fetch live shows from Mux API
  const fetchLiveShows = async () => {
    try {
      // Call your backend endpoint that proxies to Mux API
      // Don't expose credentials in frontend!
      const response = await fetch(
        "https://backend-seven-nu-19.vercel.app/api/mux/live-streams"
      );
      const result = await response.json();

      // Check if request was successful
      if (!result.success) {
        console.error("Failed to fetch live streams:", result.message);
        setLiveShows([]);
        setCheckingLive(false);
        return;
      }

      // Process Mux data
      const activeLiveShows = result.data.data
        .filter(
          (stream) => stream.status === "active" && stream.connected === true
        )
        .map((stream) => {
          // Generate show name based on current date
          const today = new Date();
          const day = String(today.getDate()).padStart(2, "0");
          const month = String(today.getMonth() + 1).padStart(2, "0");
          const year = String(today.getFullYear()).slice(-2);
          const showName = `Show ${day}-${month}-${year}`;

          // Get playback ID for Mux player
          const playbackId = stream.playback_ids?.[0]?.id || "";

          return {
            id: stream.id,
            title: showName,
            host: "GiStream Team",
            thumbnail: playbackId
              ? `https://image.mux.com/${playbackId}/thumbnail.jpg?time=0`
              : "https://res.cloudinary.com/haymzm4wp/image/upload/v1760105848/bi5ej2hgh0cc2uowu5xr.jpg",
            isLive: true,
            viewers: Math.floor(Math.random() * 1000) + 100, // Replace with actual viewer count if available
            muxPlaybackId: playbackId,
            streamUrl: `/live/${stream.id}`,
            streamKey: stream.stream_key,
            createdAt: stream.created_at,
          };
        });

      setLiveShows(activeLiveShows);
    } catch (error) {
      console.error("Error fetching live shows:", error);
      setLiveShows([]);
    } finally {
      setCheckingLive(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLiveShows();
  }, []);

  // Poll for live status updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLiveShows();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const liveCount = liveShows.length;

  // Show loading state while checking
  if (loading || checkingLive) {
    return (
      <div className="live-show-section">
        <div className="section-title-img">
          <h2 className="section-title-text">Live Shows</h2>
        </div>
        <div className="checking-live-status">
          <div className="spinner"></div>
          <p>Checking for live shows...</p>
        </div>
      </div>
    );
  }

  // Show "No Live Shows" message if no shows are live
  if (liveCount === 0) {
    return (
      <div className="live-show-section">
        <div className="section-title-img">
          <h2 className="section-title-text">Live Shows</h2>
        </div>
        <div className="no-live-shows">
          <div className="no-live-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" stroke="#e0e0e0" strokeWidth="4" />
              <path
                d="M40 20C28.954 20 20 28.954 20 40s8.954 20 20 20 20-8.954 20-20S51.046 20 40 20zm0 36c-8.837 0-16-7.163-16-16s7.163-16 16-16 16 7.163 16 16-7.163 16-16 16z"
                fill="#ccc"
              />
              <circle cx="40" cy="40" r="8" fill="#ccc" />
            </svg>
          </div>
          <h3>No Live Shows Right Now</h3>
          <p>Check back soon! We'll be live with exciting content.</p>
          <button
            className="notify-btn"
            onClick={() => alert("Notification feature coming soon!")}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2c-.69 0-1.25.56-1.25 1.25v.5C5.34 4.24 4.5 5.7 4.5 7.5v3l-1.5 1.5v.5h10v-.5L11.5 10.5v-3c0-1.8-.84-3.26-2.25-3.75v-.5C9.25 2.56 8.69 2 8 2zm0 12c-.55 0-1-.45-1-1h2c0 .55-.45 1-1 1z" />
            </svg>
            Notify Me
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="live-show-section">
      <div className="section-title-img">
        <h2 className="section-title-text">
          Live Shows
          {liveCount > 0 && (
            <span className="live-count-badge">{liveCount} LIVE</span>
          )}
        </h2>
      </div>

      <div className="live-show-grid">
        {liveShows.map((show) => (
          <LiveShowCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
}

// Live Show Card Component
function LiveShowCard({ show }) {
  const handleWatchLive = () => {
    window.location.href = show.streamUrl;
  };

  return (
    <div className="live-show-card">
      <div className="live-show-thumbnail" onClick={handleWatchLive}>
        <img src={show.thumbnail} alt={show.title} />

        {/* Live Badge */}
        {show.isLive && (
          <div className="live-badge">
            <span className="live-dot"></span>
            LIVE
          </div>
        )}

        {/* Viewer Count */}
        {show.isLive && (
          <div className="viewer-count">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M8 3C4.5 3 1.7 5.6 1 8c.7 2.4 3.5 5 7 5s6.3-2.6 7-5c-.7-2.4-3.5-5-7-5zm0 8c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
              <circle cx="8" cy="8" r="2" />
            </svg>
            {show.viewers.toLocaleString()}
          </div>
        )}

        {/* Play Overlay */}
        <div className="play-overlay">
          <div className="play-button">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
              <circle cx="20" cy="20" r="20" fill="rgba(0,0,0,0.7)" />
              <path d="M15 12l12 8-12 8V12z" fill="white" />
            </svg>
          </div>
        </div>
      </div>

      <div className="live-show-info">
        <h3 className="live-show-title">{show.title}</h3>
        <p className="live-show-host">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <circle cx="7" cy="4" r="3" />
            <path d="M7 8c-3.3 0-6 1.8-6 4v1h12v-1c0-2.2-2.7-4-6-4z" />
          </svg>
          {show.host}
        </p>

        <button
          className={`watch-live-btn ${show.isLive ? "live" : "offline"}`}
          onClick={handleWatchLive}
        >
          {show.isLive ? "Watch Live" : "View Details"}
        </button>
      </div>
    </div>
  );
}

export default Home;
