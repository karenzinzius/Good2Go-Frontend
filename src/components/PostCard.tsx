import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart, FaRegHeart, FaMapMarkerAlt,
  FaChevronLeft, FaChevronRight, FaCalendarCheck, FaInfoCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import type { Post } from "../types/post";

const API_URL = import.meta.env.VITE_API_URL;


interface PostCardProps {
  item: Post;
  onReserve?: (item: Post) => void;
}

const PostCard = ({ item, onReserve }: PostCardProps) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [isLiked, setIsLiked] = useState(item.userHasLiked || false);
  const [fav, setFav] = useState(item.favorites || 0);
  const [currentImage, setCurrentImage] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const [modalImage, setModalImage] = useState(0);

  const images =
    item.images && item.images.length > 0
      ? item.images
      : ["https://placehold.co/400x500?text=No+Image"];

  // ── Card image scroll ──
  const scrollTo = (dir: "left" | "right") => {
    const next =
      dir === "right"
        ? Math.min(currentImage + 1, images.length - 1)
        : Math.max(currentImage - 1, 0);
    setCurrentImage(next);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: scrollRef.current.offsetWidth * next, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    setCurrentImage(Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth));
  };

  // ── Modal image scroll (desktop arrows) ──
  const scrollModalTo = (dir: "left" | "right") => {
    const next =
      dir === "right"
        ? Math.min(modalImage + 1, images.length - 1)
        : Math.max(modalImage - 1, 0);
    setModalImage(next);
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTo({ left: modalScrollRef.current.offsetWidth * next, behavior: "smooth" });
    }
  };

  const handleModalScroll = () => {
    if (!modalScrollRef.current) return;
    setModalImage(Math.round(modalScrollRef.current.scrollLeft / modalScrollRef.current.offsetWidth));
  };

  // ── Favourite (toggle, checks existing like via userHasLiked) ──
  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      Swal.fire({
        title: "Want to save this?",
        text: "Please log in to add items to your favourites.",
        icon: "info",
        confirmButtonText: "Log in",
        confirmButtonColor: "#570df8",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
      return;
    }
    try {
      await axios.post(
        `${API_URL}/api/users/favourite`,
        { postId: item._id },
        { withCredentials: true }
      );
      if (isLiked) {
        setFav((prev) => Math.max(prev - 1, 0));
        setIsLiked(false);
      } else {
        setFav((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch {
      console.error("Fav error");
    }
  };

  // ── Reserve ──
  const handleReserve = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      Swal.fire({
        title: "Login required",
        text: "Please log in to reserve items.",
        icon: "info",
        confirmButtonText: "Log in",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
      return;
    }
    onReserve?.(item);
  };

  return (
    <>
      {/* ── COMPACT CARD ── */}
      <div
        onClick={() => setIsDetailsOpen(true)}
        className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden bg-base-100 border border-base-300 shadow-sm hover:shadow-lg transition-shadow"
      >
        {/* Image */}
        <div className="relative h-52">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex h-full overflow-x-auto snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {images.map((src, i) => (
              <img key={i} src={src} alt={item.title}
                className="w-full h-full object-cover flex-shrink-0 snap-center"
                draggable={false}
              />
            ))}
          </div>

          {/* Desktop arrows */}
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); scrollTo("left"); }}
                className={`hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 btn btn-circle btn-xs bg-black/40 text-white border-none backdrop-blur-sm transition-opacity ${currentImage === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                <FaChevronLeft size={10} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); scrollTo("right"); }}
                className={`hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 btn btn-circle btn-xs bg-black/40 text-white border-none backdrop-blur-sm transition-opacity ${currentImage === images.length - 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                <FaChevronRight size={10} />
              </button>
            </>
          )}

          {/* Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-2 w-full flex justify-center gap-1 pointer-events-none">
              {images.map((_, i) => (
                <div key={i} className={`rounded-full transition-all ${i === currentImage ? "w-3 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`} />
              ))}
            </div>
          )}

          {/* Heart */}
          <button onClick={handleFavorite}
            className={`absolute top-2 right-2 btn btn-circle btn-xs border-none backdrop-blur-sm transition-colors ${isLiked ? "bg-red-500 text-white" : "bg-black/30 text-white hover:bg-red-500"}`}>
            {isLiked ? <FaHeart size={11} /> : <FaRegHeart size={11} />}
          </button>
        </div>

        {/* Text */}
        <div className="p-3 flex flex-col gap-1">
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-bold text-sm leading-tight truncate group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            {fav > 0 && (
              <span className="text-[10px] text-red-400 font-bold shrink-0 flex items-center gap-0.5">
                <FaHeart size={8} /> {fav}
              </span>
            )}
          </div>
          {item.location && (
            <div className="flex items-center gap-1 text-[11px] opacity-50">
              <FaMapMarkerAlt size={9} /> {item.location}
            </div>
          )}
          <button onClick={handleReserve} className="btn btn-primary btn-sm mt-2 w-full">
            Reserve
          </button>
        </div>
      </div>

      {/* ── DETAILS MODAL ── */}
      {isDetailsOpen && (
        <div className="modal modal-open items-end md:items-center">
          {/* 
            Mobile: sheet sliding up from bottom, scrollable
            Desktop: side-by-side 2-column layout
          */}
          <div className="modal-box p-0 w-full max-w-4xl
            rounded-t-[2rem] md:rounded-[2rem]
            overflow-hidden border-none
            max-h-[92dvh] md:max-h-[85vh]
            flex flex-col md:flex-row"
          >
            {/* Close */}
            <button onClick={() => setIsDetailsOpen(false)}
              className="btn btn-circle btn-sm absolute right-5 top-5 z-50 bg-black/30 text-white border-none backdrop-blur-md">
              ✕
            </button>

            {/* ── LEFT: images ── */}
            <div className="relative w-full md:w-1/2 h-64 md:h-auto flex-shrink-0 bg-base-300">
              <div
                ref={modalScrollRef}
                onScroll={handleModalScroll}
                className="flex h-full overflow-x-auto snap-x snap-mandatory"
                style={{ scrollbarWidth: "none" }}
              >
                {images.map((src, i) => (
                  <img key={i} src={src} alt={item.title}
                    className="w-full h-full object-cover flex-shrink-0 snap-center" />
                ))}
              </div>

              {/* Desktop arrows on modal image */}
              {images.length > 1 && (
                <>
                  <button onClick={() => scrollModalTo("left")}
                    className={`hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-black/40 text-white border-none backdrop-blur-sm transition-opacity ${modalImage === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                    <FaChevronLeft />
                  </button>
                  <button onClick={() => scrollModalTo("right")}
                    className={`hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-black/40 text-white border-none backdrop-blur-sm transition-opacity ${modalImage === images.length - 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                    <FaChevronRight />
                  </button>
                </>
              )}

              {/* Dots */}
              {images.length > 1 && (
                <div className="absolute bottom-3 w-full flex justify-center gap-1 pointer-events-none">
                  {images.map((_, i) => (
                    <div key={i} className={`rounded-full transition-all ${i === modalImage ? "w-3 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`} />
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: details (scrollable on mobile) ── */}
            <div className="w-full md:w-1/2 flex flex-col overflow-y-auto p-7 gap-4">

              <div className="flex gap-2 flex-wrap">
                {item.category && <span className="badge badge-primary font-bold">{item.category}</span>}
                {item.availability && <span className="badge badge-success badge-outline font-bold">{item.availability}</span>}
              </div>

              <h2 className="text-3xl font-black leading-tight">{item.title}</h2>

              <div className="space-y-2">
                {item.location && (
                  <div className="flex items-center gap-3 opacity-60">
                    <FaMapMarkerAlt className="text-primary shrink-0" />
                    <span className="font-bold text-sm uppercase">{item.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 opacity-60">
                  <FaCalendarCheck className="text-primary shrink-0" />
                  <span className="font-bold text-sm uppercase">Available Now</span>
                </div>
              </div>

              {item.description && (
                <div className="bg-base-200 p-5 rounded-2xl">
                  <label className="flex items-center gap-2 text-xs font-black opacity-40 uppercase tracking-widest mb-2">
                    <FaInfoCircle /> Description
                  </label>
                  <p className="text-sm leading-relaxed opacity-80">{item.description}</p>
                </div>
              )}

              {/* Actions — pinned to bottom on desktop, natural flow on mobile */}
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-base-300">
                <button onClick={handleFavorite}
                  className={`btn btn-outline flex items-center gap-2 ${isLiked ? "text-red-500 border-red-400 bg-red-50" : ""}`}>
                  {isLiked ? <FaHeart /> : <FaRegHeart />}
                  {fav > 0 && <span className="text-xs font-bold">{fav}</span>}
                </button>
                <button onClick={handleReserve} className="btn btn-primary flex-1 rounded-2xl">
                  Reserve This Item
                </button>
              </div>

            </div>
          </div>

          <div className="modal-backdrop bg-black/70 backdrop-blur-md" onClick={() => setIsDetailsOpen(false)} />
        </div>
      )}
    </>
  );
};

export default PostCard;