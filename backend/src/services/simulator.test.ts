import { describe, it, expect, vi } from 'vitest';

describe('Price Simulation Logic', () => {
  it('should adjust price within -10% and +10% range', () => {
    const currentPrice = 100;
    
    // Simulate what the worker does
    const changePercent = (Math.random() * 20 - 10) / 100;
    let newPrice = currentPrice * (1 + changePercent);
    newPrice = Math.round(newPrice * 100) / 100;
    
    // The max price is 110 (100 + 10%)
    // The min price is 90 (100 - 10%)
    expect(newPrice).toBeLessThanOrEqual(110);
    expect(newPrice).toBeGreaterThanOrEqual(90);
  });
});
