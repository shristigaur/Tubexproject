const assert = require("assert");

const API_URL = "http://localhost:5000/api";
const TEST_EMAIL = `test_${Date.now()}@example.com`;
const TEST_PASS = "securePassword123";

async function request(method, path, body, cookie = "") {
  const headers = { "Content-Type": "application/json" };
  if (cookie) headers["Cookie"] = cookie;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    redirect: 'manual'
  });

  const setCookie = res.headers.get("set-cookie") || "";
  let json = {};
  try { json = await res.json(); } catch(e) {}
  
  return { status: res.status, json, cookie: setCookie };
}

async function runTests() {
  let sessionCookie = "";

  console.log("1. Testing New Signup...");
  let res = await request("POST", "/auth/signup", {
    name: "Test User", email: TEST_EMAIL, password: TEST_PASS, confirmPassword: TEST_PASS, acceptTerms: true
  });
  console.log("Signup Response:", res.status, res.json);
  assert.strictEqual(res.status, 201, "Signup should succeed");

  console.log("\n2. Testing Duplicate Signup...");
  res = await request("POST", "/auth/signup", {
    name: "Test User 2", email: TEST_EMAIL, password: TEST_PASS, confirmPassword: TEST_PASS, acceptTerms: true
  });
  console.log("Duplicate Signup Response:", res.status, res.json);
  assert.strictEqual(res.status, 409, "Duplicate signup should be rejected with 409");

  console.log("\n3. Testing Valid Login (Should fail with 403 because email not verified)...");
  res = await request("POST", "/auth/login", { email: TEST_EMAIL, password: TEST_PASS });
  console.log("Login Response:", res.status, res.json);
  assert.strictEqual(res.status, 403, "Login should fail with 403 because email is unverified");

  // Manually verify email in DB for testing
  console.log("\n[!] Manually verifying email in DB to test login...");
  const { PrismaClient } = require("./node_modules/@prisma/client");
  const prisma = new PrismaClient();
  await prisma.user.update({ where: { email: TEST_EMAIL }, data: { emailVerified: true } });
  
  console.log("\n4. Testing Valid Login (Should succeed now)...");
  res = await request("POST", "/auth/login", { email: TEST_EMAIL, password: TEST_PASS });
  console.log("Login Response:", res.status, res.json);
  assert.strictEqual(res.status, 200, "Login should succeed");
  sessionCookie = res.cookie;

  console.log("\n5. Testing Wrong Password...");
  res = await request("POST", "/auth/login", { email: TEST_EMAIL, password: "wrongpassword" });
  console.log("Wrong Password Response:", res.status, res.json);
  assert.strictEqual(res.status, 401, "Wrong password should be rejected with 401");

  console.log("\n6. Testing Unknown Email...");
  res = await request("POST", "/auth/login", { email: "nonexistent@example.com", password: TEST_PASS });
  console.log("Unknown Email Response:", res.status, res.json);
  assert.strictEqual(res.status, 401, "Unknown email should be rejected with 401");

  console.log("\n7. Testing /auth/me Unauthenticated...");
  res = await request("GET", "/auth/me");
  console.log("Auth Me Unauth Response:", res.status, res.json);
  assert.strictEqual(res.status, 401, "/auth/me should fail if not authenticated");

  console.log("\n8. Testing /auth/me Authenticated...");
  res = await request("GET", "/auth/me", null, sessionCookie);
  console.log("Auth Me Auth Response:", res.status, res.json);
  assert.strictEqual(res.status, 200, "/auth/me should succeed if authenticated");
  assert.strictEqual(res.json.user.email, TEST_EMAIL, "User email should match");

  console.log("\n9. Testing Logout...");
  res = await request("POST", "/auth/logout", null, sessionCookie);
  console.log("Logout Response:", res.status, res.json);
  assert.strictEqual(res.status, 200, "Logout should succeed");
  
  // Clean up
  await prisma.user.delete({ where: { email: TEST_EMAIL } });
  await prisma.$disconnect();
  console.log("\nAll Backend API Tests Passed!");
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
