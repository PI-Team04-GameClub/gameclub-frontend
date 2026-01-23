import { describe, it, expect } from "vitest";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from "./index";

describe("Auth types", () => {
  it("should correctly type LoginRequest", () => {
    // Arrange
    const loginRequest: LoginRequest = {
      email: "test@example.com",
      password: "password123",
    };

    // Assert
    expect(loginRequest.email).toBe("test@example.com");
    expect(loginRequest.password).toBe("password123");
  });

  it("should correctly type RegisterRequest", () => {
    // Arrange
    const registerRequest: RegisterRequest = {
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      password: "securepass",
    };

    // Assert
    expect(registerRequest.first_name).toBe("John");
    expect(registerRequest.last_name).toBe("Doe");
    expect(registerRequest.email).toBe("john@example.com");
  });

  it("should correctly type AuthResponse", () => {
    // Arrange
    const authResponse: AuthResponse = {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      token: "jwt-token-here",
    };

    // Assert
    expect(authResponse.id).toBe(1);
    expect(authResponse.token).toBe("jwt-token-here");
  });

  it("should correctly type User", () => {
    // Arrange
    const user: User = {
      id: 1,
      first_name: "Jane",
      last_name: "Smith",
      email: "jane@example.com",
    };

    // Assert
    expect(user.id).toBe(1);
    expect(user.first_name).toBe("Jane");
  });
});
