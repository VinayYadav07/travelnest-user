// Firebase config

const API_KEY = import.meta.env.VITE_FIREBASE_KEY;

const AUTH_URL = "https://identitytoolkit.googleapis.com/v1/accounts";

const DB_URL = "https://travel-project-2bce6-default-rtdb.firebaseio.com";

export async function firebaseSignUp(email, password, name) {
  const response = await fetch(`${AUTH_URL}:signUp?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Signup failed");
  }

  // Save the user's display name in Firebase Authentication
  const response2 = await fetch(`${AUTH_URL}:update?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idToken: data.idToken,
      displayName: name,
      returnSecureToken: true,
    }),
  });

  const data2 = await response2.json();

  if (!response2.ok) {
    throw new Error(data2.error?.message || "Name save nahi hua");
  }

  return {
    ...data,
    displayName: name,
  };
}

export async function firebaseSignIn(email, password) {
  const response = await fetch(
    `${AUTH_URL}:signInWithPassword?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Login failed");
  }

  return data;
}

export function saveSession(data) {
  localStorage.setItem("wn_token", data.idToken);
  localStorage.setItem("wn_uid", data.localId);
  localStorage.setItem("wn_email", data.email);

  localStorage.setItem(
    "wn_name",
    data.displayName || data.email?.split("@")[0] || "User",
  );
}

export function clearSession() {
  localStorage.removeItem("wn_token");
  localStorage.removeItem("wn_uid");
  localStorage.removeItem("wn_email");
  localStorage.removeItem("wn_name");
}

export function isLoggedIn() {
  return !!localStorage.getItem("wn_token");
}

export function getUid() {
  return localStorage.getItem("wn_uid") || "";
}

export function getUsername() {
  return localStorage.getItem("wn_name") || "User";
}

function getToken() {
  return localStorage.getItem("wn_token");
}

// Add the Firebase ID token to database requests for authentication
function getAuth() {
  const token = getToken();

  return token ? `?auth=${token}` : "";
}

export async function dbGet(path) {
  const response = await fetch(`${DB_URL}/${path}.json${getAuth()}`);

  if (!response.ok) {
    throw new Error("Data nahi mila");
  }

  return response.json();
}

export async function dbPush(path, data) {
  const response = await fetch(`${DB_URL}/${path}.json${getAuth()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Data add nahi hua");
  }

  return response.json();
}

export async function dbPatch(path, data) {
  const response = await fetch(`${DB_URL}/${path}.json${getAuth()}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Data update nahi hua");
  }

  return response.json();
}

export async function dbDelete(path) {
  const response = await fetch(`${DB_URL}/${path}.json${getAuth()}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Data delete nahi hua");
  }

  return response.json();
}

export async function fetchListings() {
  try {
    const data = await dbGet("listings");

    if (data) {
      const listings = Object.entries(data).map(([id, listing]) => ({
        id,
        ...listing,
      }));

      return listings.filter((listing) => listing.available !== false);
    }
  } catch (error) {
    console.log("Firebase se listings nahi mili");
  }

  // Use demo data if Firebase is unavailable
  return DEMO_LISTINGS;
}

export async function fetchCategories() {
  try {
    const data = await dbGet("categories");

    if (data) {
      return Object.entries(data).map(([id, category]) => ({
        id,
        ...category,
      }));
    }
  } catch (error) {
    console.log("Firebase se categories nahi mili");
  }

  // Use demo categories if Firebase is unavailable
  return DEMO_CATEGORIES;
}

export const DEMO_LISTINGS = [
  {
    id: "l1",
    name: "Azure Cliff Villa",
    category: "Villa",
    city: "Goa",
    pincode: "403004",
    price: 8500,
    available: true,
    description:
      "A beautiful beachside villa in Goa with a private pool and sea view.",
    images: [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=800",
      "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?w=800",
      "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?w=800",
    ],
  },

  {
    id: "l2",
    name: "Backwater Houseboat",
    category: "Houseboat",
    city: "Alleppey",
    pincode: "688001",
    price: 5200,
    available: true,
    description: "A traditional Kerala houseboat with AC bedrooms and meals.",
    images: [
      "https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?w=800",
      "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?w=800",
      "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?w=800",
    ],
  },

  {
    id: "l3",
    name: "Studio Loft Downtown",
    category: "Apartment",
    city: "Mumbai",
    pincode: "400001",
    price: 3200,
    available: true,
    description:
      "A modern studio apartment in Mumbai with a sea-facing balcony.",
    images: [
      "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?w=800",
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?w=800",
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?w=800",
    ],
  },

  {
    id: "l4",
    name: "Himalayan Cottage",
    category: "Cottage",
    city: "Manali",
    pincode: "175131",
    price: 4100,
    available: true,
    description: "A cosy wooden cottage in the Himalayas.",
    images: [
      "https://images.pexels.com/photos/803975/pexels-photo-803975.jpeg?w=800",
      "https://images.pexels.com/photos/2351649/pexels-photo-2351649.jpeg?w=800",
      "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?w=800",
    ],
  },

  {
    id: "l5",
    name: "Desert Camp Suite",
    category: "Camp",
    city: "Jaisalmer",
    pincode: "345001",
    price: 6800,
    available: true,
    description: "A luxury camp in the Thar Desert.",
    images: [
      "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?w=800",
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?w=800",
      "https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg?w=800",
    ],
  },

  {
    id: "l6",
    name: "Heritage Haveli Suite",
    category: "Villa",
    city: "Udaipur",
    pincode: "313001",
    price: 9200,
    available: true,
    description: "A royal haveli near Lake Pichola.",
    images: [
      "https://images.pexels.com/photos/3581916/pexels-photo-3581916.jpeg?w=800",
      "https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg?w=800",
      "https://images.pexels.com/photos/3225528/pexels-photo-3225528.jpeg?w=800",
    ],
  },
];

export const DEMO_CATEGORIES = [
  { id: "c1", name: "Villa" },
  { id: "c2", name: "Houseboat" },
  { id: "c3", name: "Apartment" },
  { id: "c4", name: "Cottage" },
  { id: "c5", name: "Camp" },
];
