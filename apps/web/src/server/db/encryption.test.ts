import { beforeAll, describe, expect, it } from "vitest";
import { decrypt, decryptJSON, encrypt, encryptJSON } from "./encryption";

beforeAll(() => {
  // 32 bytes (44-char base64) — predictable test key.
  process.env.SERENE_ENCRYPTION_KEY = Buffer.alloc(32, 0x5a).toString("base64");
});

describe("encryption", () => {
  it("round-trips arbitrary strings", () => {
    const plain = "any string with unicode ☕ and newlines\n…";
    const ct = encrypt(plain);
    expect(decrypt(ct)).toBe(plain);
  });

  it("round-trips JSON values", () => {
    const obj = { email: "user@example.com", token: "secret", expires: 12345 };
    const ct = encryptJSON(obj);
    expect(decryptJSON(ct)).toEqual(obj);
  });

  it("does not include plaintext substrings in the ciphertext envelope", () => {
    // R2 (constraints): no PII / tokens in storage. The base64 envelope
    // must not contain the email, password, or token in readable form.
    const sensitive = {
      email: "real-user@fastmail.com",
      password: "TopSecret123!",
      authToken: "abcdef1234567890",
    };
    const ct = encryptJSON(sensitive);
    expect(ct).not.toContain("real-user");
    expect(ct).not.toContain("fastmail.com");
    expect(ct).not.toContain("TopSecret");
    expect(ct).not.toContain("abcdef1234567890");
  });

  it("produces a different ciphertext on each call (random IV)", () => {
    const a = encrypt("same plaintext");
    const b = encrypt("same plaintext");
    expect(a).not.toBe(b);
    expect(decrypt(a)).toBe(decrypt(b));
  });

  it("rejects ciphertext tampered after the auth tag", () => {
    const ct = encrypt("hello");
    // Decode → flip the last byte of ciphertext → re-encode.
    const buf = Buffer.from(ct, "base64");
    buf[buf.length - 1] = (buf[buf.length - 1] ?? 0) ^ 0xff;
    const tampered = buf.toString("base64");
    expect(() => decrypt(tampered)).toThrow();
  });
});
