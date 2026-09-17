import { Calendar, CheckCircle2, MapPin, MessageSquare, Music, Volume2 } from "lucide-react";
import { homepageContent } from "../../content/homepage";
import { categoryImages, creatorImages } from "../../content/images";

export function MarketplacePreviewSection() {
  const { marketplaceShowcase } = homepageContent;
  const { opportunity, artist, conversation } = marketplaceShowcase;

  return (
    <section className="section-container bg-neutral-canvas" aria-labelledby="marketplace-heading">
      <div className="section-header-centered">
        <span className="section-badge">{marketplaceShowcase.badge}</span>
        <h2 id="marketplace-heading" className="section-title">{marketplaceShowcase.heading}</h2>
        <p className="section-lead">{marketplaceShowcase.lead}</p>
      </div>

      <div className="marketplace-preview-flow">
        {/* Step 1: Illustrative Event Brief */}
        <div className="preview-card-wrapper">
          <div className="preview-card-header">
            <span className="card-badge">{opportunity.badge}</span>
            <span className="preview-category-tag">{opportunity.category}</span>
          </div>

          <h3 className="preview-card-title">{opportunity.title}</h3>
          
          <div className="preview-host-header">
            <img
              src={creatorImages.naina.src}
              alt={creatorImages.naina.alt}
              className="preview-host-avatar"
              loading="lazy"
            />
            <div className="preview-host-info">
              <span className="preview-host-name">{opportunity.hostName}</span>
              <span className="preview-host-role">{opportunity.hostRole}</span>
            </div>
          </div>

          <div className="preview-meta-list">
            <div className="preview-meta-row">
              <MapPin size={15} className="text-brand shrink-0" />
              <span>{opportunity.venue}</span>
            </div>
            <div className="preview-meta-row">
              <Calendar size={15} className="text-brand shrink-0" />
              <span>{opportunity.timing}</span>
            </div>
          </div>

          <p className="preview-card-scope">{opportunity.scope}</p>

          <div className="preview-checklist">
            {opportunity.statusList.map((item) => (
              <div key={item} className="preview-check-item">
                <CheckCircle2 size={15} className="text-semantic-success shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Illustrative Artist Profile */}
        <div className="preview-card-wrapper">
          <div className="preview-card-header">
            <span className="card-badge">{artist.badge}</span>
            <span className="preview-category-tag">{artist.craft}</span>
          </div>

          <div className="artist-preview-profile-header">
            <img
              src={creatorImages.rhea.src}
              alt={creatorImages.rhea.alt}
              className="artist-preview-avatar"
              loading="lazy"
            />
            <div>
              <h3 className="artist-preview-name">{artist.name}</h3>
              <p className="artist-preview-city">
                <MapPin size={13} className="inline mr-1 text-brand" />
                {artist.city}
              </p>
            </div>
          </div>

          <p className="artist-preview-bio">{artist.bio}</p>

          <div className="artist-tags-row">
            {artist.tags.map((tag) => (
              <span key={tag} className="artist-tag-pill">
                {tag}
              </span>
            ))}
          </div>

          <div className="artist-audio-sample-card">
            <img
              src={categoryImages.musicians.src}
              alt={categoryImages.musicians.alt}
              className="artist-sample-thumb"
              loading="lazy"
            />
            <div className="artist-sample-info">
              <div className="flex items-center gap-1.5 text-brand text-xs font-semibold">
                <Volume2 size={14} />
                <span>Portfolio recording</span>
              </div>
              <p className="text-xs text-neutral-textPrimary font-medium truncate">
                {artist.sampleTitle}
              </p>
            </div>
            <Music size={16} className="text-neutral-textMuted shrink-0 ml-auto" />
          </div>
        </div>

        {/* Step 3: Illustrative Conversation */}
        <div className="preview-card-wrapper">
          <div className="preview-card-header">
            <span className="card-badge">{conversation.badge}</span>
            <span className="preview-category-tag flex items-center gap-1">
              <MessageSquare size={12} className="text-brand" />
              Direct message
            </span>
          </div>

          <h3 className="preview-card-title">{conversation.title}</h3>
          
          <div className="conversation-thread">
            {conversation.messages.map((msg) => {
              const isHost = msg.role === "Venue Curator";
              const avatar = isHost ? creatorImages.naina.src : creatorImages.rhea.src;
              return (
                <div
                  key={msg.text}
                  className={`conversation-bubble-row ${isHost ? "host-message" : "artist-message"}`}
                >
                  <img
                    src={avatar}
                    alt={msg.sender}
                    className="conversation-avatar"
                    loading="lazy"
                  />
                  <div className="conversation-bubble">
                    <div className="conversation-bubble-meta">
                      <span className="conversation-sender">{msg.sender}</span>
                      <span className="conversation-time">{msg.time}</span>
                    </div>
                    <p className="conversation-text">{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="conversation-status-bar">
            <span className="conversation-status-dot" />
            <span className="text-xs text-neutral-textSecondary font-medium">
              Brief linked · Details agreed upfront · No hidden agency fee
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
