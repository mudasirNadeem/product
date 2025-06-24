import { Database } from "bun:sqlite";

const db = new Database("product");

db.query(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )
`
).run();

db.query(
  `
  CREATE TABLE IF NOT EXISTS productItems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId text
    productImage TEXT,
    productName TEXT
    price TEXT,

    )`
).run();

Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    
    // ✅ Handle CORS preflight - UPDATED to include PUT
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS, DELETE, GET, PUT",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // ✅ Handle Login
    if (url.pathname === "/api/login" && req.method === "POST") {
      try {
        const { username, password } = await req.json();

        const user = db
          .query(
            `SELECT username, id, password FROM users WHERE username = ? AND password = ?`
          )
          .get(username, password);

        return new Response(
          JSON.stringify(user ? { ok: true, user } : { ok: false }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ ok: false, error: error.message }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
    }

    if (url.pathname === "/api/signUp" && req.method === "POST") {
      try {
        const { username, password } = await req.json();

        const user = db
          .query(`SELECT username  FROM users WHERE username = ?`)
          .get(username);

        if (user) {
          return new Response(JSON.stringify({ ok: false, user }), {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
        } else {
          db.query(`INSERT INTO users (username, password) VALUES (?, ?)`).run(
            username,
            password
          );
          const signUpUser = db
            .query(`SELECT username, id FROM users WHERE username = ?`)
            .get(username);
          return new Response(JSON.stringify({ ok: true, signUpUser }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
      } catch (error) {
        return new Response(
          JSON.stringify({ ok: false, error: error.message }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
    }
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
});