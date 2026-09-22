import { describe, expect, it } from "vitest";
import { citySchema, documentSchema, faqSchema } from "./schemas";
describe("admin validation", () => {
  it("normalizes optional city numbers and validates slugs", () => {
    const city = citySchema.parse({ cityname: "Vitória", slug: "vitoria", state: "ES", longitude: "", latitude: "-20.3", jobsdone: "2", trashrecycledkg: "0", description: "Atuação local", images: null });
    expect(city.latitude).toBe(-20.3); expect(city.longitude).toBeNull();
  });
  it("rejects unsafe document URLs", () => expect(() => documentSchema.parse({ title: "Relatório", category: "Anual", year: 2026, file_url: "javascript:alert(1)", published_at: null })).toThrow());
  it("requires useful FAQ content", () => expect(() => faqSchema.parse({ title: "?", answer: "x", sort_order: 0 })).toThrow());
});
