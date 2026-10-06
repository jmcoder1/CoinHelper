import {
  isPartnerPromoOnCooldown,
  PARTNER_PROMO_COOLDOWN_MS,
} from "./isPartnerPromoOnCooldown";

describe("isPartnerPromoOnCooldown", () => {
  it("is not on cooldown when the user has never been prompted", () => {
    expect(isPartnerPromoOnCooldown(undefined, 1_000)).toBe(false);
  });

  it("is on cooldown within 24 hours", () => {
    const now = 10_000_000;
    expect(isPartnerPromoOnCooldown(now - 1000, now)).toBe(true);
  });

  it("is not on cooldown after 24 hours", () => {
    const now = 10_000_000;
    expect(
      isPartnerPromoOnCooldown(now - PARTNER_PROMO_COOLDOWN_MS, now),
    ).toBe(false);
  });
});
