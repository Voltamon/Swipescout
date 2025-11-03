import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/UI/button.jsx";
import { Share2, ExternalLink } from "lucide-react";
import { getHomeGradient } from "@/config/theme-colors-home";

const PLATFORM = {
  facebook: { color: "#1877F2", url: (l) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(l)}` },
  twitter: { color: "#1DA1F2", url: (l) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(l)}` },
  linkedin: { color: "#0A66C2", url: (l) => `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(l)}` },
  whatsapp: { color: "#25D366", url: (l) => `https://api.whatsapp.com/send?text=${encodeURIComponent(l)}` }
};

const SharePage = () => {
  const [searchParams] = useSearchParams();
  const [shareableLink, setShareableLink] = useState("");

  useEffect(() => {
    const link = searchParams.get("link");
    if (link) {
      try { setShareableLink(decodeURIComponent(link)); }
      catch { setShareableLink(link); }
    } else {
      toast.error("No shareable link provided.");
    }
  }, [searchParams]);

  const handleCopyLink = async () => {
    if (!shareableLink) return toast.error("No link to copy");
    try {
      await navigator.clipboard.writeText(shareableLink);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link.");
    }
  };

  const openSocialMedia = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer,width=800,height=600");
  };

  const closeWindow = () => {
    try { window.close(); } catch (e) { /* ignore */ }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 relative">
        <button
          onClick={closeWindow}
          aria-label="close"
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-700"
        >
          <ExternalLink className="h-5 w-5" />
        </button>

        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold">Share</h2>
          <p className="text-sm text-slate-500">Share this item using your preferred app or copy the link.</p>
        </div>

        <div className="flex gap-2 items-center mb-4">
          <input
            readOnly
            value={shareableLink}
            placeholder="Shareable link"
            className="flex-1 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-sm"
          />
          <Button variant="outline" size="icon" onClick={handleCopyLink} aria-label="Copy link">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-3 justify-center flex-wrap mb-4">
          <button
            aria-label="facebook"
            onClick={() => openSocialMedia(PLATFORM.facebook.url(shareableLink))}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-white"
            style={{ backgroundColor: PLATFORM.facebook.color }}
          >
            Facebook
          </button>

          <button
            aria-label="twitter"
            onClick={() => openSocialMedia(PLATFORM.twitter.url(shareableLink))}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-white"
            style={{ backgroundColor: PLATFORM.twitter.color }}
          >
            Twitter
          </button>

          <button
            aria-label="linkedin"
            onClick={() => openSocialMedia(PLATFORM.linkedin.url(shareableLink))}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-white"
            style={{ backgroundColor: PLATFORM.linkedin.color }}
          >
            LinkedIn
          </button>

          <button
            aria-label="whatsapp"
            onClick={() => openSocialMedia(PLATFORM.whatsapp.url(shareableLink))}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-white"
            style={{ backgroundColor: PLATFORM.whatsapp.color }}
          >
            WhatsApp
          </button>
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="default" onClick={handleCopyLink}>Copy Link</Button>
          <Button variant="ghost" onClick={closeWindow}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default SharePage;
