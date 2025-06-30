import { Database } from "bun:sqlite";
import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import path from "path";

const db = new Database("product.db");

// Create images directory if it doesn't exist
const imagesDir = path.join(process.cwd(), "images");
if (!existsSync(imagesDir)) {
  mkdirSync(imagesDir, { recursive: true });
  console.log("Created images directory");
}

// Helper function to generate unique filename
function generateUniqueFilename(originalName) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = path.extname(originalName);
  return `${timestamp}_${random}${extension}`;
}

db.query(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT)
`
).run();

db.query(
  `
  CREATE TABLE IF NOT EXISTS productItems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId text,
    productImage TEXT,
    productName TEXT,
    price TEXT,
    description TEXT,
    category TEXT
    )`
).run();
db.query(
  `
  CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId text,
  customerId INTIGER,
    productImage TEXT,
    productName TEXT,
    price TEXT,
    description TEXT,
    category TEXT,
  quantity  INTEGER
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

    // ✅ Serve static images
    if (url.pathname.startsWith("/images/")) {
      try {
        const filename = url.pathname.replace("/images/", "");
        const filePath = path.join(imagesDir, filename);

        if (existsSync(filePath)) {
          const file = Bun.file(filePath);
          return new Response(file, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": file.type || "image/jpeg",
            },
          });
        } else {
          return new Response("Image not found", {
            status: 404,
            headers: { "Access-Control-Allow-Origin": "*" },
          });
        }
      } catch (error) {
        return new Response("Error serving image", {
          status: 500,
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    // ✅ Handle image upload
    if (url.pathname === "/api/uploadImage" && req.method === "POST") {
      try {
        const formData = await req.formData();
        const imageFile = formData.get("image");

        if (!imageFile || !imageFile.name) {
          return new Response(
            JSON.stringify({ ok: false, error: "No image file provided" }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            }
          );
        }

        // Generate unique filename
        const uniqueFilename = generateUniqueFilename(imageFile.name);
        const filePath = path.join(imagesDir, uniqueFilename);

        // Save file to disk
        const arrayBuffer = await imageFile.arrayBuffer();
        await writeFile(filePath, new Uint8Array(arrayBuffer));

        // Return the image URL
        const imageUrl = `http://localhost:3000/images/${uniqueFilename}`;

        return new Response(
          JSON.stringify({
            ok: true,
            imageUrl: imageUrl,
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      } catch (error) {
        console.error("Upload error:", error);
        return new Response(
          JSON.stringify({ ok: false, error: error.message }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
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

    if (url.pathname === "/api/assignProduct" && req.method === "POST") {
      try {
        const { userId, image, productName, category, price, description } =
          await req.json();
        db.query(
          "INSERT INTO productItems (userId, productImage, productName, price, category, description) VALUES (?, ?, ?, ?, ?, ?)"
        ).run(userId, image, productName, price, category, description);

        return new Response(JSON.stringify({ ok: true }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
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

    // if (url.pathname === "/api/showAllProduct" && req.method === "POST") {
    //   try {
    //     const { userId } = await req.json();
    //     var product = db
    //       .query(`SELECT * FROM productItems WHERE userId = ?`)
    //       .all([userId]);

    //     return new Response(JSON.stringify({ ok: true, product }), {
    //       headers: {
    //         "Content-Type": "application/json",
    //         "Access-Control-Allow-Origin": "*",
    //       },
    //     });
    //   } catch (error) {
    //     return new Response(
    //       JSON.stringify({ ok: false, error: error.message }),
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //           "Access-Control-Allow-Origin": "*",
    //         },
    //       }
    //     );
    //   }
    // }

    if (url.pathname === "/api/viewProduct" && req.method === "POST") {
      try {
        const { id } = await req.json();
        var product = db
          .query(`SELECT * FROM productItems WHERE id = ?`)
          .all([id]);

        return new Response(JSON.stringify({ ok: true, product }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
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

    if (url.pathname === "/api/showAllProduct" && req.method === "POST") {
      try {
        const { category, userId } = await req.json();
        var product = [];
        // if (category == "All" || category == undefined) {
        
        if (category == "All") {
          product = db
            .query(`SELECT * FROM productItems WHERE userId = ?`)
            .all([userId]);
        } else {
          product = db
            .query(
              `SELECT * FROM productItems WHERE category = ? AND userId = ?`
            )
            .all([category, userId]);
        }
        return new Response(JSON.stringify({ ok: true, product }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
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

     if (url.pathname === "/api/cartItemsLength" && req.method === "POST") {
      try {
        const {userId } = await req.json();
          let cartProduct = db
          .query(`SELECT * FROM cart WHERE userId = ?`)
          .all([userId]);
        return new Response(JSON.stringify({ ok: true, cartProduct }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
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

    if (url.pathname === "/api/addToCart" && req.method === "POST") {
      try {
        const { userId, id, quantity } = await req.json();

        let cartProduct = db
          .query(`SELECT * FROM cart WHERE userId = ? AND customerId = ?`)
          .all([userId, id]);
        

        if (cartProduct.length > 0) {
          const currentQuantity = parseInt(cartProduct[0].quantity);
          db.query(
            `UPDATE cart SET quantity = ? WHERE userId = ? AND customerId = ?`
          ).run([currentQuantity + 1, userId, id]);
        } else {
          const product = db
            .query(`SELECT * FROM productItems WHERE userId = ? AND id = ?`)
            .get([userId, id]);

          if (product) {
            db.query(
              `
  INSERT INTO cart (userId, customerId, productImage, productName, price, description, category, quantity)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`
            ).run([
              userId,
              id,
              product.productImage,
              product.productName,
              product.price,
              product.description,
              product.category,
              quantity,
            ]);
          }
        }

        return new Response(JSON.stringify({ ok: true }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ ok: false, error: error.message }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            status: 500,
          }
        );
      }
    }

     if (url.pathname === "/api/loadCartItems" && req.method === "POST") {
      try {
        const { userId } = await req.json();
        var product = db
          .query(`SELECT * FROM cart WHERE userId = ?`)
          .all([userId]);

        return new Response(JSON.stringify({ ok: true, product }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
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
