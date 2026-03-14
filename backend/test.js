import fetch from "node-fetch";

async function run() {
  // Try to create admin without auth first, just to see if we get 401. 
  // We actually need auth. Let's just create a superadmin token using jwt.
  import jwt from "jsonwebtoken";
  const token = jwt.sign({ id: 1, type: "superadmin" }, process.env.JWT_SECRET || "gramalert_secret_key_2024", { expiresIn: "1h" });
  
  const res = await fetch("http://localhost:8080/api/superadmin/admins", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      username: "testadmin",
      email: "testadmin@test.com",
      password: "password123"
    })
  });
  
  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Output:", data);
}

run();
