export const PARTNER_PROMO_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export const isPartnerPromoOnCooldown = (
  lastSentAt: number | undefined,
  now: number,
) => lastSentAt != null && now - lastSentAt < PARTNER_PROMO_COOLDOWN_MS;
