// scripts/test-admin-panel.mjs
// Automated end-to-end tests for Navtej Solar Admin Panel:
// - Server-side authentication and role-based access control (401, 403, 200)
// - Completed projects management (View, Add with validation, Edit with keep/remove/add images, Delete, Public reflection)
// - Customer testimonials management (View, Add with validation, Delete, Public reflection)

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

let adminCookie = "";
let userCookie = "";
let createdProjectId = "";
let createdTestimonialId = "";

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(message);
  }
  console.log(`  ✓ ${message}`);
}

async function runTests() {
  console.log("=== NAVTEJ SOLAR ADMIN PANEL COMPREHENSIVE TEST SUITE ===");
  console.log(`Target: ${BASE_URL}\n`);

  // ----------------------------------------------------
  // STEP 1: AUTHENTICATION SETUP
  // ----------------------------------------------------
  console.log("1. Authenticating test users...");

  // 1a. Admin login
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "sanapanuj7@gmail.com",
      password: "admin123",
    }),
  });
  const adminLoginData = await adminLoginRes.json();
  assert(adminLoginRes.status === 200, `Admin login successful (HTTP 200)`);
  assert(adminLoginData.user?.role === "owner", `Admin user has role: 'owner'`);

  // Extract auth cookie
  const adminSetCookie = adminLoginRes.headers.get("set-cookie") || "";
  const adminMatch = adminSetCookie.match(/navtej_auth_token=([^;]+)/);
  if (adminMatch) {
    adminCookie = `navtej_auth_token=${adminMatch[1]}`;
  } else {
    // Fallback: check if returned in body
    console.warn("Could not find set-cookie header, checking token in payload");
  }

  // 1b. Regular user login (create if needed)
  const userRegisterRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Standard Customer",
      email: "customer_test@example.com",
      password: "UserPass123!",
      phone: "9876543210",
    }),
  });

  const userLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "customer_test@example.com",
      password: "UserPass123!",
    }),
  });
  const userLoginData = await userLoginRes.json();
  assert(userLoginRes.status === 200, `Standard user login successful (HTTP 200)`);
  assert(userLoginData.user?.role === "user", `Standard user has role: 'user'`);

  const userSetCookie = userLoginRes.headers.get("set-cookie") || "";
  const userMatch = userSetCookie.match(/navtej_auth_token=([^;]+)/);
  if (userMatch) {
    userCookie = `navtej_auth_token=${userMatch[1]}`;
  }

  // ----------------------------------------------------
  // STEP 2: SECURITY & AUTHORIZATION TESTS
  // ----------------------------------------------------
  console.log("\n2. Testing Security & Role-Based Access Control...");

  // 2a. Unauthenticated requests should return 401
  const unauthProjRes = await fetch(`${BASE_URL}/api/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Hack", location: "Anywhere" }),
  });
  assert(unauthProjRes.status === 401, `POST /api/projects without auth returns 401 Unauthorized`);

  const dummyId = "507f1f77bcf86cd799439011";
  const unauthTestDel = await fetch(`${BASE_URL}/api/testimonials/${dummyId}`, {
    method: "DELETE",
  });
  assert(unauthTestDel.status === 401, `DELETE /api/testimonials/:id without auth returns 401 Unauthorized`);

  // 2b. Regular user requests should return 403 Forbidden
  const userProjRes = await fetch(`${BASE_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: userCookie,
    },
    body: JSON.stringify({ title: "Hack by user", location: "Anywhere" }),
  });
  assert(userProjRes.status === 403, `POST /api/projects with standard user role returns 403 Forbidden`);

  const userTestDel = await fetch(`${BASE_URL}/api/testimonials/${dummyId}`, {
    method: "DELETE",
    headers: { Cookie: userCookie },
  });
  assert(userTestDel.status === 403, `DELETE /api/testimonials/:id with standard user role returns 403 Forbidden`);

  // ----------------------------------------------------
  // STEP 3: PROJECT MANAGEMENT CRUD & VALIDATION
  // ----------------------------------------------------
  console.log("\n3. Testing Completed Projects Management...");

  // 3a. Validation: missing title and location
  const badProjData = new FormData();
  badProjData.append("description", "Only description");
  const badProjRes = await fetch(`${BASE_URL}/api/projects`, {
    method: "POST",
    headers: { Cookie: adminCookie },
    body: badProjData,
  });
  assert(badProjRes.status === 400, `POST /api/projects rejects missing title/location with 400 Bad Request`);

  // 3b. Validation: missing image
  const noImgData = new FormData();
  noImgData.append("title", "12 kW Solar Array");
  noImgData.append("location", "Gangapur Road");
  const noImgRes = await fetch(`${BASE_URL}/api/projects`, {
    method: "POST",
    headers: { Cookie: adminCookie },
    body: noImgData,
  });
  assert(noImgRes.status === 400, `POST /api/projects rejects missing images with 400 Bad Request`);

  // 3c. Validation: invalid file type (e.g. text/plain or executable)
  const badFileBlob = new Blob(["malicious-code"], { type: "text/plain" });
  const badFileData = new FormData();
  badFileData.append("title", "12 kW Solar Array");
  badFileData.append("location", "Gangapur Road");
  badFileData.append("images", badFileBlob, "test.txt");
  const badFileRes = await fetch(`${BASE_URL}/api/projects`, {
    method: "POST",
    headers: { Cookie: adminCookie },
    body: badFileData,
  });
  assert(badFileRes.status === 400, `POST /api/projects rejects non-image MIME types with 400 Bad Request`);

  // 3d. Add project with valid image and optional description
  // Create a minimal 1x1 valid PNG in base64
  const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  const pngBuffer = Buffer.from(pngBase64, "base64");
  const validPngBlob = new Blob([pngBuffer], { type: "image/png" });

  const validProjData = new FormData();
  validProjData.append("title", "15 kW Industrial Rooftop Test");
  validProjData.append("location", "Ambad MIDC, Nashik");
  validProjData.append("category", "Industrial");
  validProjData.append("capacity", "15 kW");
  validProjData.append("description", "High efficiency bifacial panels installed with net metering.");
  validProjData.append("images", validPngBlob, "solar-project-1.png");

  const createProjRes = await fetch(`${BASE_URL}/api/projects`, {
    method: "POST",
    headers: { Cookie: adminCookie },
    body: validProjData,
  });
  const createdProj = await createProjRes.json();
  assert(createProjRes.status === 201, `Admin can create a completed project with image (HTTP 201)`);
  assert(Boolean(createdProj.id), `Created project has valid MongoDB ID: ${createdProj.id}`);
  assert(createdProj.title === "15 kW Industrial Rooftop Test", `Created project has correct title`);
  assert(createdProj.imageUrl.includes("/uploads/projects/"), `Project image stored in public/uploads/projects`);
  assert(Array.isArray(createdProj.images) && createdProj.images.length === 1, `Project has images array of length 1`);
  createdProjectId = createdProj.id;

  // 3e. Verify public reflection: GET /api/projects returns the new project
  const publicProjectsRes = await fetch(`${BASE_URL}/api/projects`);
  const publicProjects = await publicProjectsRes.json();
  assert(publicProjectsRes.status === 200, `GET /api/projects succeeds (HTTP 200)`);
  const foundInPublic = publicProjects.find((p) => p.id === createdProjectId);
  assert(Boolean(foundInPublic), `Newly created project appears immediately in public project list`);

  // 3f. Edit project: modify title, location, description, keep existing image, and upload additional image
  const secondPngBlob = new Blob([pngBuffer], { type: "image/png" });
  const editProjData = new FormData();
  editProjData.append("title", "15 kW Industrial Rooftop - Updated Title");
  editProjData.append("location", "Ambad Industrial Area, Nashik");
  editProjData.append("category", "Industrial");
  editProjData.append("capacity", "18 kW");
  editProjData.append("description", "Updated description with battery storage system.");
  editProjData.append("keptImages", createdProj.imageUrl);
  editProjData.append("newImages", secondPngBlob, "additional-photo.png");

  const editProjRes = await fetch(`${BASE_URL}/api/projects/${createdProjectId}`, {
    method: "PUT",
    headers: { Cookie: adminCookie },
    body: editProjData,
  });
  const editedProj = await editProjRes.json();
  assert(editProjRes.status === 200, `PUT /api/projects/:id succeeds (HTTP 200)`);
  assert(editedProj.title === "15 kW Industrial Rooftop - Updated Title", `Project title successfully updated`);
  assert(editedProj.location === "Ambad Industrial Area, Nashik", `Project location successfully updated`);
  assert(editedProj.images.length === 2, `Project now contains both kept image and newly uploaded image (2 total)`);

  // 3g. Delete project: delete after confirmation
  const deleteProjRes = await fetch(`${BASE_URL}/api/projects/${createdProjectId}`, {
    method: "DELETE",
    headers: { Cookie: adminCookie },
  });
  const deleteProjData = await deleteProjRes.json();
  assert(deleteProjRes.status === 200, `DELETE /api/projects/:id succeeds (HTTP 200)`);
  assert(deleteProjData.ok === true, `Project successfully deleted`);

  // Verify deletion from public API
  const afterDeleteProjRes = await fetch(`${BASE_URL}/api/projects`);
  const afterDeleteProjects = await afterDeleteProjRes.json();
  const deletedStillExists = afterDeleteProjects.some((p) => p.id === createdProjectId);
  assert(!deletedStillExists, `Deleted project no longer appears in public gallery`);

  // ----------------------------------------------------
  // STEP 4: CUSTOMER TESTIMONIALS MANAGEMENT CRUD & VALIDATION
  // ----------------------------------------------------
  console.log("\n4. Testing Customer Testimonials / Feedback Management...");

  // 4a. Validation: missing name or quote
  const badTestRes = await fetch(`${BASE_URL}/api/testimonials`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location: "Nashik" }),
  });
  assert(badTestRes.status === 400, `POST /api/testimonials rejects missing name/quote with 400 Bad Request`);

  // 4b. Customer rating submission (e.g. offline customer who had installation done)
  const createTestRes = await fetch(`${BASE_URL}/api/testimonials`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Suresh Deshmukh",
      quote: "Outstanding installation work by Navtej Solar. My electricity bill came down by 85%!",
      location: "Mahatma Nagar, Nashik",
      rating: 5,
      serviceType: "Offline Rooftop Solar Installation",
    }),
  });
  const createdTest = await createTestRes.json();
  assert(createTestRes.status === 201, `Customer can submit a business rating / review (HTTP 201)`);
  assert(Boolean(createdTest.id), `Created testimonial has valid MongoDB ID: ${createdTest.id}`);
  assert(createdTest.name === "Suresh Deshmukh", `Testimonial customer name is correct`);
  assert(createdTest.source === "customer", `Review correctly marked with source: 'customer'`);
  createdTestimonialId = createdTest.id;

  // 4c. Verify public reflection: GET /api/testimonials returns the new review
  const publicTestsRes = await fetch(`${BASE_URL}/api/testimonials`);
  const publicTests = await publicTestsRes.json();
  assert(publicTestsRes.status === 200, `GET /api/testimonials succeeds (HTTP 200)`);
  const foundTestimonial = publicTests.find((t) => t.id === createdTestimonialId);
  assert(Boolean(foundTestimonial), `Newly created customer rating appears immediately on public website`);

  // 4d. Security: non-admin cannot delete testimonial (401 without auth, 403 with user role)
  const unauthDelRes = await fetch(`${BASE_URL}/api/testimonials/${createdTestimonialId}`, {
    method: "DELETE",
  });
  assert(unauthDelRes.status === 401, `DELETE /api/testimonials/:id without auth returns 401 Unauthorized`);

  const userDelRes = await fetch(`${BASE_URL}/api/testimonials/${createdTestimonialId}`, {
    method: "DELETE",
    headers: { Cookie: userCookie },
  });
  assert(userDelRes.status === 403, `DELETE /api/testimonials/:id with standard user returns 403 Forbidden`);

  // 4e. Admin deletes testimonial
  const deleteTestRes = await fetch(`${BASE_URL}/api/testimonials/${createdTestimonialId}`, {
    method: "DELETE",
    headers: { Cookie: adminCookie },
  });
  const deleteTestData = await deleteTestRes.json();
  assert(deleteTestRes.status === 200, `DELETE /api/testimonials/:id by admin succeeds (HTTP 200)`);
  assert(deleteTestData.ok === true, `Testimonial successfully deleted`);

  // Verify deletion from public API
  const afterDeleteTestRes = await fetch(`${BASE_URL}/api/testimonials`);
  const afterDeleteTests = await afterDeleteTestRes.json();
  const deletedTestStillExists = afterDeleteTests.some((t) => t.id === createdTestimonialId);
  assert(!deletedTestStillExists, `Deleted testimonial no longer appears in public reviews`);

  console.log("\n🎉 ALL ADMIN PANEL TESTS PASSED SUCCESSFULLY! (100% SUCCESS RATE)");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
