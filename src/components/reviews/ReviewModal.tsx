"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Star, X, CheckCircle2, Sparkles } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
  hostId: string;
  hostName?: string;
}

export function ReviewModal({
  isOpen,
  onClose,
  listingId,
  listingTitle,
  hostId,
  hostName = "Host"
}: ReviewModalProps) {
  const { currentUser, openAuthModal, addReview } = useApp();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [cleanliness, setCleanliness] = useState(5);
  const [accuracy, setAccuracy] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [value, setValue] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openAuthModal("Sign in to submit your verified review");
      return;
    }

    addReview({
      listingId,
      listingTitle,
      hostId,
      rating,
      cleanliness,
      accuracy,
      communication,
      value,
      comment
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Review Submitted!</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Thank you for sharing your experience! Your review has been published and verified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Guest Review</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Rate your stay with {hostName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                {listingTitle}
              </p>
            </div>

            {/* Overall Star Picker */}
            <div className="bg-slate-50 p-4 rounded-2xl text-center space-y-2">
              <span className="text-xs font-bold text-slate-600 block">Overall Experience Rating</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          isFilled ? "text-amber-500 fill-amber-500" : "text-slate-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-indigo-600 block">
                {rating === 5 && "Outstanding (5/5)"}
                {rating === 4 && "Very Good (4/5)"}
                {rating === 3 && "Average (3/5)"}
                {rating === 2 && "Below Expectations (2/5)"}
                {rating === 1 && "Poor Experience (1/5)"}
              </span>
            </div>

            {/* Category Ratings */}
            <div className="space-y-2.5 text-xs">
              <span className="font-bold text-slate-700 block">Category Ratings:</span>

              {[
                { label: "Cleanliness", val: cleanliness, setVal: setCleanliness },
                { label: "Accuracy of listing", val: accuracy, setVal: setAccuracy },
                { label: "Host Communication", val: communication, setVal: setCommunication },
                { label: "Value for money", val: value, setVal: setValue }
              ].map(cat => (
                <div key={cat.label} className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">{cat.label}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => cat.setVal(s)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            cat.val >= s ? "text-amber-500 fill-amber-500" : "text-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Written Review */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Your Review & Feedback:
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you love about this stay or experience? How was the host, amenities, and location?"
                className="w-full border border-slate-300 rounded-xl p-3 text-xs text-slate-900 bg-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
              >
                Post Verified Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
