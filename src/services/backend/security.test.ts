import { describe, expect, it } from "vitest";
import { createMemoryStore } from "../storage";
import { createDemoBackend } from "./demoBackend";
import type { ArtistProfile, EventGig } from "../../types/marketplace";

const NOW = new Date("2026-11-23T10:00:00.000Z");
const backend = () => createDemoBackend({ store: createMemoryStore(), clock: () => NOW });

describe("mass-assignment protection", () => {
  it("ignores protected fields when an artist edits their profile", async () => {
    const b = backend();
    await b.auth.signInAsDemoUser!("demo-artist-rhea");
    await b.market.updateArtistProfile({ ownerUserId: "attacker", id: "x", slug: "hijack", isSample: false, bio: "Updated bio that is long enough to be valid here." } as unknown as Partial<ArtistProfile>);
    const me = (await b.market.snapshot()).myArtistProfile!;
    expect(me.ownerUserId).toBe("demo-artist-rhea");
    expect(me.id).toBe("artist-rhea");
    expect(me.slug).toBe("rhea-kapoor-acoustic");
    expect(me.bio).toContain("Updated bio");
  });

  it("cannot take over another client's gig by editing with a forged clientId", async () => {
    const b = backend();
    await b.auth.signInAsDemoUser!("demo-client-aarav");
    const gig = (await b.market.snapshot()).gigs.find((g) => g.id === "gig-terrace-acoustic")!;
    await expect(b.market.saveGig({ ...gig, title: "Hijacked gig title" }, { gigId: gig.id, publish: false })).rejects.toMatchObject({ code: "not_found" });
    const own = await b.market.saveGig({ ...gig, clientId: "demo-client-zoe", id: "gig-terrace-acoustic", title: "My own new gig draft" } as unknown as EventGig, { publish: false });
    expect(own.clientId).toBe("demo-client-aarav");
    expect(own.id).not.toBe("gig-terrace-acoustic");
  });

  it("only applies allow-listed settings", async () => {
    const b = backend();
    await b.auth.signInAsDemoUser!("demo-client-zoe");
    await b.market.updateSettings({ userId: "demo-artist-rhea", blockedUserIds: ["x"], deactivationRequestedAt: "2020-01-01", profileVisibility: "hidden" } as never);
    const s = (await b.market.snapshot()).settings!;
    expect(s.userId).toBe("demo-client-zoe");
    expect(s.blockedUserIds).toEqual([]);
    expect(s.deactivationRequestedAt).toBeNull();
    expect(s.profileVisibility).toBe("hidden");
  });
});

describe("privacy", () => {
  it("never exposes other users' credentials, emails or notifications in the snapshot", async () => {
    const b = backend();
    await b.auth.signUp({ email: "private@example.com", password: "secret-pass", displayName: "Private", role: "client" });
    await b.auth.signInAsDemoUser!("demo-artist-rhea");
    const json = JSON.stringify(await b.market.snapshot());
    expect(json).not.toContain("private@example.com");
    expect(json).not.toContain("credentials");
    expect(json).not.toContain("zoe@demo.cultgig.local");
  });

  it("does not reveal whether an email is registered on password reset", async () => {
    const b = backend();
    await expect(b.auth.requestPasswordReset("nobody@example.com")).resolves.toEqual({});
  });

  it("blocked users cannot message or send inquiries", async () => {
    const b = backend();
    await b.auth.signInAsDemoUser!("demo-artist-rhea");
    await b.market.blockUser("demo-client-zoe");
    await b.auth.signInAsDemoUser!("demo-client-zoe");
    await expect(b.market.sendMessage("conv-zoe-rhea", "hello?")).rejects.toMatchObject({ code: "forbidden" });
  });

  it("strips oversized and null-byte input", async () => {
    const b = backend();
    await b.auth.signInAsDemoUser!("demo-client-zoe");
    await b.market.sendMessage("conv-zoe-rhea", `hi\u0000${"x".repeat(10_000)}`);
    const last = (await b.market.snapshot()).conversations.find((c) => c.id === "conv-zoe-rhea")!.messages.at(-1)!;
    expect(last.body.includes("\u0000")).toBe(false);
    expect(last.body.length).toBeLessThanOrEqual(4000);
  });
});
