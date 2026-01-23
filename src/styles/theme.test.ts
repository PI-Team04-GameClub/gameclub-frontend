import { describe, it, expect } from "vitest";
import theme from "./theme";

describe("theme", () => {
  it("should be defined", () => {
    // Arrange
    const themeConfig = theme;

    // Act & Assert
    expect(themeConfig).toBeDefined();
  });

  it("should have fonts defined", () => {
    // Arrange
    const { fonts } = theme;

    // Act & Assert
    expect(fonts).toBeDefined();
    expect(fonts.heading).toContain("Outfit");
    expect(fonts.body).toContain("Inter");
  });

  it("should have brand colors defined", () => {
    // Arrange
    const { colors } = theme;

    // Act & Assert
    expect(colors).toBeDefined();
    expect(colors.brand).toBeDefined();
    expect(colors.brand[500]).toBe("#6610f2");
  });

  it("should have all brand color shades", () => {
    // Arrange
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    const { colors } = theme;

    // Act & Assert
    shades.forEach((shade) => {
      expect(colors.brand[shade]).toBeDefined();
    });
  });

  it("should have component styles", () => {
    // Arrange
    const { components } = theme;

    // Act & Assert
    expect(components).toBeDefined();
    expect(components.Button).toBeDefined();
    expect(components.Card).toBeDefined();
  });

  it("should have global styles", () => {
    // Arrange
    const { styles } = theme;

    // Act & Assert
    expect(styles).toBeDefined();
    expect(styles.global).toBeDefined();
  });
});
