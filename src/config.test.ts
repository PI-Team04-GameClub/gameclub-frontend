import { describe, it, expect } from "vitest";
import { API_BASE_URL } from "./config";

describe("config", () => {
  it("should have a defined API_BASE_URL", () => {
    // Arrange
    const config = API_BASE_URL;

    // Act & Assert
    expect(config).toBeDefined();
  });

  it("should have a string API_BASE_URL", () => {
    // Arrange
    const config = API_BASE_URL;

    // Act
    const typeOfConfig = typeof config;

    // Assert
    expect(typeOfConfig).toBe("string");
  });

  it("should have a valid URL format or localhost default", () => {
    // Arrange
    const config = API_BASE_URL;
    const urlPattern = /^https?:\/\/.+|^http:\/\/localhost/;

    // Act & Assert
    expect(config).toMatch(urlPattern);
  });
});
