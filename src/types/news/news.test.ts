import { describe, it, expect } from "vitest";
import type { NewsItem, NewsFormData } from "./index";

describe("News types", () => {
  it("should correctly type a NewsItem object", () => {
    // Arrange
    const news: NewsItem = {
      id: 1,
      title: "Breaking News",
      description: "Something happened",
      author: "John Doe",
      date: "2024-01-15",
    };

    // Assert
    expect(news.id).toBe(1);
    expect(news.title).toBe("Breaking News");
    expect(news.author).toBe("John Doe");
  });

  it("should correctly type NewsFormData", () => {
    // Arrange
    const formData: NewsFormData = {
      title: "New Article",
      description: "Article content",
      authorId: 1,
    };

    // Assert
    expect(formData.title).toBe("New Article");
    expect(formData.authorId).toBe(1);
  });
});
