import { Camera, Mail, Play, Share2 } from "lucide-react";
import { Link } from "../../app/App";
import { siteConfig } from "../../config/site";
import { Button } from "../ui/Button";

type LeadRole = "artist" | "business";

export function Footer({ openLead }: { openLead: (role?: LeadRole) => void }) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="logo" to="/">
            Cultgig
          </Link>
          <p className="footer-tagline">Where creative talent meets opportunity.</p>
          <p className="footer-desc">
            Cultgig is building a clearer way for artists and businesses in India to find each other through the work itself.
          </p>
          <div className="footer-social-row">
            {siteConfig.socialLinks.instagram && (
              <a
                href={siteConfig.socialLinks.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <Camera size={17} />
              </a>
            )}
            {siteConfig.socialLinks.linkedin && (
              <a
                href={siteConfig.socialLinks.linkedin}
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer"
              >
                <Share2 size={17} />
              </a>
            )}
            {siteConfig.socialLinks.youtube && (
              <a
                href={siteConfig.socialLinks.youtube}
                aria-label="YouTube"
                target="_blank"
                rel="noreferrer"
              >
                <Play size={17} />
              </a>
            )}
            {siteConfig.supportEmail && (
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                aria-label="Email Cultgig"
              >
                <Mail size={17} />
              </a>
            )}
          </div>
        </div>

        <div className="footer-links">
          <div>
            <h4>Explore</h4>
            <Link to="/categories">Categories</Link>
            <Link to="/how-it-works">How it works</Link>
            <Link to="/for-artists">For artists</Link>
            <Link to="/for-businesses">For businesses</Link>
            <Link to="/faq">FAQ</Link>
          </div>

          <div>
            <h4>Early access</h4>
            <button type="button" onClick={() => openLead("artist")}>
              Join as an artist
            </button>
            <button type="button" onClick={() => openLead("business")}>
              For businesses
            </button>
          </div>

          <div>
            <h4>Company</h4>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy policy</Link>
            <Link to="/terms">Terms of service</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {siteConfig.legalEntityName}. All rights reserved.
        </span>
        <div className="footer-legal-links">
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/terms">Terms of service</Link>
        </div>
      </div>
    </footer>
  );
}

