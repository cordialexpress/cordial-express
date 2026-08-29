require('dotenv').config()

const express = require('express')
const cors = require('cors')
const Database = require('better-sqlite3')
const path = require('path')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()

const PORT =
  process.env.PORT || 5000

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'cordial-express-development-secret'

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'https://cordialexpress.xo.je'
  ],

  methods: [
    'GET',
    'POST',
    'PATCH',
    'PUT',
    'DELETE',
    'OPTIONS'
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ]
})
)

app.use(express.json())

/* =========================================================
   DATABASE
========================================================= */

const dbPath =
  path.join(
    __dirname,
    'cordial-express.db'
  )

const db =
  new Database(dbPath)

db.pragma(
  'journal_mode = WAL'
)

db.pragma(
  'foreign_keys = ON'
)

/* =========================================================
   ORDERS TABLE
========================================================= */

db.prepare(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    customer_name TEXT NOT NULL,

    phone TEXT NOT NULL,

    email TEXT,

    address TEXT NOT NULL,

    city TEXT NOT NULL,

    state TEXT NOT NULL,

    pincode TEXT NOT NULL,

    subtotal INTEGER NOT NULL DEFAULT 0,

    delivery_charge INTEGER NOT NULL DEFAULT 0,

    total INTEGER NOT NULL DEFAULT 0,

    payment_method TEXT DEFAULT 'Cash on Delivery',

    status TEXT DEFAULT 'Pending',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run()

/* =========================================================
   ORDER ITEMS TABLE
========================================================= */

db.prepare(`
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    order_id INTEGER NOT NULL,

    product_id INTEGER,

    product_name TEXT NOT NULL,

    price INTEGER NOT NULL,

    quantity INTEGER NOT NULL,

    FOREIGN KEY (order_id)
      REFERENCES orders(id)
      ON DELETE CASCADE
  )
`).run()

/* =========================================================
   ADMINS TABLE
========================================================= */

db.prepare(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    email TEXT UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run()

/* =========================================================
   CUSTOMERS TABLE
========================================================= */

db.prepare(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    phone TEXT UNIQUE NOT NULL,

    name TEXT DEFAULT 'Customer',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run()

/* =========================================================
   PRODUCTS TABLE
========================================================= */

db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    category TEXT NOT NULL,

    price INTEGER NOT NULL,

    old_price INTEGER,

    stock INTEGER NOT NULL DEFAULT 0,

    badge TEXT,

    description TEXT,

    image_url TEXT,

    is_active INTEGER NOT NULL DEFAULT 1,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run()

/* =========================================================
   CONTACT MESSAGES TABLE
========================================================= */

db.prepare(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    email TEXT NOT NULL,

    phone TEXT,

    subject TEXT NOT NULL,

    message TEXT NOT NULL,

    status TEXT NOT NULL DEFAULT 'New',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run()

/* =========================================================
   DEFAULT ADMIN
========================================================= */

const defaultAdminEmail =
  'admin@cordialexpress.com'

const existingAdmin =
  db.prepare(`
    SELECT id
    FROM admins
    WHERE email = ?
  `).get(
    defaultAdminEmail
  )

if (!existingAdmin) {
  const passwordHash =
    bcrypt.hashSync(
      'Cordial@123',
      12
    )

  db.prepare(`
    INSERT INTO admins (
      name,
      email,
      password_hash
    )
    VALUES (?, ?, ?)
  `).run(
    'Cordial Express Admin',
    defaultAdminEmail,
    passwordHash
  )

  console.log(
    'Default admin created.'
  )
}

/* =========================================================
   DEFAULT PRODUCTS
========================================================= */

const productCount =
  db.prepare(`
    SELECT COUNT(*) AS count
    FROM products
  `).get()

if (
  productCount.count === 0
) {
  const insertProduct =
    db.prepare(`
      INSERT INTO products (
        name,
        category,
        price,
        old_price,
        stock,
        badge,
        description,
        image_url,
        is_active
      )
      VALUES (
        @name,
        @category,
        @price,
        @old_price,
        @stock,
        @badge,
        @description,
        @image_url,
        @is_active
      )
    `)

  const products = [
    {
      name:
        'Turmeric Powder',

      category:
        'Spices & Masalas',

      price: 149,

      old_price: 179,

      stock: 50,

      badge:
        'Bestseller',

      description:
        'Freshly packed turmeric powder for everyday cooking.',

      image_url: '',

      is_active: 1
    },

    {
      name:
        'Garam Masala',

      category:
        'Spices & Masalas',

      price: 129,

      old_price: 159,

      stock: 45,

      badge:
        'Popular',

      description:
        'Aromatic spice blend packed with care.',

      image_url: '',

      is_active: 1
    },

    {
      name:
        'Roasted Cashews',

      category:
        'Dry Fruits',

      price: 299,

      old_price: 349,

      stock: 30,

      badge:
        'Premium',

      description:
        'Crunchy roasted cashews for snacking and gifting.',

      image_url: '',

      is_active: 1
    },

    {
      name:
        'Multigrain Atta',

      category:
        'Flours & Grains',

      price: 249,

      old_price: 289,

      stock: 40,

      badge:
        'Everyday',

      description:
        'A wholesome multigrain flour blend for everyday meals.',

      image_url: '',

      is_active: 1
    },

    {
      name:
        'Salted Peanuts',

      category:
        'Snacks',

      price: 99,

      old_price: 119,

      stock: 60,

      badge:
        'Crunchy',

      description:
        'Crispy salted peanuts packed for fresh snacking.',

      image_url: '',

      is_active: 1
    },

    {
      name:
        'Instant Coffee',

      category:
        'Beverages',

      price: 199,

      old_price: 229,

      stock: 35,

      badge:
        'Popular',

      description:
        'Rich instant coffee for a satisfying cup.',

      image_url: '',

      is_active: 1
    },

    {
      name:
        'Basmati Rice',

      category:
        'Daily Essentials',

      price: 399,

      old_price: 449,

      stock: 55,

      badge:
        'Value Pack',

      description:
        'Long-grain basmati rice selected for everyday meals.',

      image_url: '',

      is_active: 1
    },

    {
      name:
        'Red Chilli Powder',

      category:
        'Spices & Masalas',

      price: 139,

      old_price: 169,

      stock: 50,

      badge:
        'Fresh',

      description:
        'Fresh red chilli powder with bold flavour.',

      image_url: '',

      is_active: 1
    }
  ]

  const seedProducts =
    db.transaction(
      (items) => {
        for (
          const product
          of items
        ) {
          insertProduct.run(
            product
          )
        }
      }
    )

  seedProducts(
    products
  )

  console.log(
    'Default products created.'
  )
}

/* =========================================================
   ADMIN AUTH MIDDLEWARE
========================================================= */

function adminAuth(
  req,
  res,
  next
) {
  try {
    const authorization =
      req.headers.authorization

    if (
      !authorization ||
      !authorization.startsWith(
        'Bearer '
      )
    ) {
      return res
        .status(401)
        .json({
          success: false,

          message:
            'Admin authentication required.'
        })
    }

    const token =
      authorization.substring(
        7
      )

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      )

    if (
      decoded.role !==
      'admin'
    ) {
      return res
        .status(403)
        .json({
          success: false,

          message:
            'Admin access required.'
        })
    }

    req.admin =
      decoded

    next()
  } catch {
    return res
      .status(401)
      .json({
        success: false,

        message:
          'Invalid or expired admin session.'
      })
  }
}

/* =========================================================
   CUSTOMER AUTH MIDDLEWARE
========================================================= */

function customerAuth(
  req,
  res,
  next
) {
  try {
    const authorization =
      req.headers.authorization

    if (
      !authorization ||
      !authorization.startsWith(
        'Bearer '
      )
    ) {
      return res
        .status(401)
        .json({
          success: false,

          message:
            'Customer authentication required.'
        })
    }

    const token =
      authorization.substring(
        7
      )

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      )

    if (
      decoded.role !==
      'customer'
    ) {
      return res
        .status(403)
        .json({
          success: false,

          message:
            'Customer access required.'
        })
    }

    req.customer =
      decoded

    next()
  } catch {
    return res
      .status(401)
      .json({
        success: false,

        message:
          'Invalid customer session.'
      })
  }
}

/* =========================================================
   BASIC ROUTES
========================================================= */

app.get(
  '/',
  (req, res) => {
    res.json({
      success: true,

      message:
        'Cordial Express API is running.',

      otpEnabled:
        false
    })
  }
)

app.get(
  '/api/health',
  (req, res) => {
    res.json({
      success: true,

      status:
        'operational',

      database:
        'connected',

      otpEnabled:
        false
    })
  }
)

/* =========================================================
   ADMIN LOGIN
========================================================= */

app.post(
  '/api/admin/login',
  (req, res) => {
    try {
      const {
        email,
        password
      } =
        req.body || {}

      if (
        !email ||
        !password
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Email and password are required.'
          })
      }

      const admin =
        db.prepare(`
          SELECT *
          FROM admins
          WHERE LOWER(email) =
                LOWER(?)
        `).get(
          String(
            email
          ).trim()
        )

      if (!admin) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              'Invalid email or password.'
          })
      }

      const validPassword =
        bcrypt.compareSync(
          password,
          admin.password_hash
        )

      if (
        !validPassword
      ) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              'Invalid email or password.'
          })
      }

      const token =
        jwt.sign(
          {
            id:
              admin.id,

            email:
              admin.email,

            role:
              'admin'
          },
          JWT_SECRET,
          {
            expiresIn:
              '7d'
          }
        )

      return res.json({
        success: true,

        token,

        admin: {
          id:
            admin.id,

          name:
            admin.name,

          email:
            admin.email
        }
      })
    } catch (
      error
    ) {
      console.error(
        'Admin login error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to login.'
        })
    }
  }
)

/* =========================================================
   ADMIN PROFILE
========================================================= */

app.get(
  '/api/admin/me',
  adminAuth,
  (req, res) => {
    try {
      const admin =
        db.prepare(`
          SELECT
            id,
            name,
            email,
            created_at
          FROM admins
          WHERE id = ?
        `).get(
          req.admin.id
        )

      if (!admin) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              'Admin not found.'
          })
      }

      return res.json({
        success: true,
        admin
      })
    } catch (
      error
    ) {
      console.error(
        'Admin profile error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to load admin.'
        })
    }
  }
)

/* =========================================================
   CUSTOMER AUTH STATUS
========================================================= */

app.get(
  '/api/customer/auth-status',
  (req, res) => {
    res.json({
      success: true,

      enabled: false,

      message:
        'Customer login is temporarily disabled.'
    })
  }
)

/* =========================================================
   CUSTOMER PROFILE
========================================================= */

app.get(
  '/api/customer/me',
  customerAuth,
  (req, res) => {
    try {
      const customer =
        db.prepare(`
          SELECT
            id,
            phone,
            name,
            created_at,
            updated_at
          FROM customers
          WHERE id = ?
        `).get(
          req.customer.id
        )

      if (!customer) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              'Customer not found.'
          })
      }

      return res.json({
        success: true,
        customer
      })
    } catch (
      error
    ) {
      console.error(
        'Customer profile error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to load customer.'
        })
    }
  }
)

/* =========================================================
   CUSTOMER ORDERS
========================================================= */

app.get(
  '/api/customer/orders',
  customerAuth,
  (req, res) => {
    try {
      const customer =
        db.prepare(`
          SELECT *
          FROM customers
          WHERE id = ?
        `).get(
          req.customer.id
        )

      if (!customer) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              'Customer not found.'
          })
      }

      const orders =
        db.prepare(`
          SELECT *
          FROM orders
          WHERE phone = ?
          ORDER BY created_at DESC
        `).all(
          customer.phone
        )

      const getItems =
        db.prepare(`
          SELECT *
          FROM order_items
          WHERE order_id = ?
          ORDER BY id ASC
        `)

      const finalOrders =
        orders.map(
          (order) => ({
            ...order,

            items:
              getItems.all(
                order.id
              )
          })
        )

      return res.json({
        success: true,

        orders:
          finalOrders
      })
    } catch (
      error
    ) {
      console.error(
        'Customer orders error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to load orders.'
        })
    }
  }
)

/* =========================================================
   PUBLIC PRODUCTS
========================================================= */

app.get(
  '/api/products',
  (req, res) => {
    try {
      const products =
        db.prepare(`
          SELECT *
          FROM products
          WHERE is_active = 1
          ORDER BY
            created_at DESC,
            id DESC
        `).all()

      return res.json({
        success: true,

        count:
          products.length,

        products
      })
    } catch (
      error
    ) {
      console.error(
        'Products error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to load products.'
        })
    }
  }
)

/* =========================================================
   ADMIN PRODUCTS
========================================================= */

app.get(
  '/api/admin/products',
  adminAuth,
  (req, res) => {
    try {
      const products =
        db.prepare(`
          SELECT *
          FROM products
          ORDER BY
            created_at DESC,
            id DESC
        `).all()

      return res.json({
        success: true,

        count:
          products.length,

        products
      })
    } catch (
      error
    ) {
      console.error(
        'Admin products error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to load products.'
        })
    }
  }
)

/* =========================================================
   CREATE PRODUCT
========================================================= */

app.post(
  '/api/admin/products',
  adminAuth,
  (req, res) => {
    try {
      const {
        name,
        category,
        price,
        old_price,
        oldPrice,
        stock,
        badge,
        description,
        image_url,
        imageUrl,
        is_active,
        isActive
      } =
        req.body || {}

      if (
        !name ||
        !category ||
        price === undefined ||
        price === null ||
        price === ''
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Name, category and price are required.'
          })
      }

      const cleanPrice =
        Number(
          price
        )

      const cleanStock =
        Number(
          stock || 0
        )

      if (
        !Number.isFinite(
          cleanPrice
        ) ||
        cleanPrice < 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Invalid price.'
          })
      }

      if (
        !Number.isInteger(
          cleanStock
        ) ||
        cleanStock < 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Invalid stock.'
          })
      }

      const oldPriceValue =
        old_price ??
        oldPrice ??
        null

      const activeValue =
        is_active ??
        isActive ??
        true

      const result =
        db.prepare(`
          INSERT INTO products (
            name,
            category,
            price,
            old_price,
            stock,
            badge,
            description,
            image_url,
            is_active
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          String(
            name
          ).trim(),

          String(
            category
          ).trim(),

          cleanPrice,

          oldPriceValue === '' ||
          oldPriceValue === null
            ? null
            : Number(
                oldPriceValue
              ),

          cleanStock,

          String(
            badge || ''
          ).trim(),

          String(
            description || ''
          ).trim(),

          String(
            image_url ??
            imageUrl ??
            ''
          ).trim(),

          activeValue === false ||
          activeValue === 0 ||
          activeValue === '0'
            ? 0
            : 1
        )

      const product =
        db.prepare(`
          SELECT *
          FROM products
          WHERE id = ?
        `).get(
          result.lastInsertRowid
        )

      return res
        .status(201)
        .json({
          success: true,

          message:
            'Product created successfully.',

          product
        })
    } catch (
      error
    ) {
      console.error(
        'Create product error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to create product.'
        })
    }
  }
)

/* =========================================================
   UPDATE PRODUCT
========================================================= */

app.patch(
  '/api/admin/products/:id',
  adminAuth,
  (req, res) => {
    try {
      const productId =
        Number(
          req.params.id
        )

      if (
        !Number.isInteger(
          productId
        ) ||
        productId <= 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Invalid product ID.'
          })
      }

      const existing =
        db.prepare(`
          SELECT *
          FROM products
          WHERE id = ?
        `).get(
          productId
        )

      if (!existing) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              'Product not found.'
          })
      }

      const {
        name,
        category,
        price,
        old_price,
        oldPrice,
        stock,
        badge,
        description,
        image_url,
        imageUrl,
        is_active,
        isActive
      } =
        req.body || {}

      const updatedName =
        name !== undefined
          ? String(
              name
            ).trim()
          : existing.name

      const updatedCategory =
        category !== undefined
          ? String(
              category
            ).trim()
          : existing.category

      const updatedPrice =
        price !== undefined
          ? Number(
              price
            )
          : existing.price

      const updatedStock =
        stock !== undefined
          ? Number(
              stock
            )
          : existing.stock

      const oldValue =
        old_price !== undefined
          ? old_price
          : oldPrice !== undefined
            ? oldPrice
            : existing.old_price

      const updatedOldPrice =
        oldValue === '' ||
        oldValue === null
          ? null
          : Number(
              oldValue
            )

      const activeValue =
        is_active !== undefined
          ? is_active
          : isActive !== undefined
            ? isActive
            : existing.is_active

      const updatedActive =
        activeValue === false ||
        activeValue === 0 ||
        activeValue === '0'
          ? 0
          : 1

      if (
        !updatedName ||
        !updatedCategory
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Name and category are required.'
          })
      }

      if (
        !Number.isFinite(
          updatedPrice
        ) ||
        updatedPrice < 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Invalid price.'
          })
      }

      if (
        !Number.isInteger(
          updatedStock
        ) ||
        updatedStock < 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Invalid stock.'
          })
      }

      db.prepare(`
        UPDATE products

        SET
          name = ?,
          category = ?,
          price = ?,
          old_price = ?,
          stock = ?,
          badge = ?,
          description = ?,
          image_url = ?,
          is_active = ?,
          updated_at =
            CURRENT_TIMESTAMP

        WHERE id = ?
      `).run(
        updatedName,

        updatedCategory,

        updatedPrice,

        updatedOldPrice,

        updatedStock,

        badge !== undefined
          ? String(
              badge
            ).trim()
          : existing.badge,

        description !== undefined
          ? String(
              description
            ).trim()
          : existing.description,

        image_url !== undefined
          ? String(
              image_url
            ).trim()
          : imageUrl !== undefined
            ? String(
                imageUrl
              ).trim()
            : existing.image_url,

        updatedActive,

        productId
      )

      const product =
        db.prepare(`
          SELECT *
          FROM products
          WHERE id = ?
        `).get(
          productId
        )

      return res.json({
        success: true,

        message:
          'Product updated successfully.',

        product
      })
    } catch (
      error
    ) {
      console.error(
        'Update product error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to update product.'
        })
    }
  }
)

/* =========================================================
   DELETE PRODUCT
========================================================= */

app.delete(
  '/api/admin/products/:id',
  adminAuth,
  (req, res) => {
    try {
      const productId =
        Number(
          req.params.id
        )

      const product =
        db.prepare(`
          SELECT *
          FROM products
          WHERE id = ?
        `).get(
          productId
        )

      if (!product) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              'Product not found.'
          })
      }

      db.prepare(`
        DELETE FROM products
        WHERE id = ?
      `).run(
        productId
      )

      return res.json({
        success: true,

        message:
          'Product deleted successfully.'
      })
    } catch (
      error
    ) {
      console.error(
        'Delete product error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to delete product.'
        })
    }
  }
)

/* =========================================================
   CREATE ORDER
   SERVER CONTROLS PRICES + STOCK
========================================================= */

app.post(
  '/api/orders',
  (req, res) => {
    try {
      const {
        customer,
        items,
        paymentMethod
      } =
        req.body || {}

      if (!customer) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Customer details are required.'
          })
      }

      const {
        name,
        phone,
        email,
        address,
        city,
        state,
        pincode
      } =
        customer

      if (
        !name ||
        !phone ||
        !address ||
        !city ||
        !state ||
        !pincode
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Please complete all required delivery details.'
          })
      }

      if (
        !Array.isArray(
          items
        ) ||
        items.length === 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Your cart is empty.'
          })
      }

      const cleanPhone =
        String(
          phone
        )
          .replace(
            /\D/g,
            ''
          )
          .slice(-10)

      if (
        !/^[6-9]\d{9}$/.test(
          cleanPhone
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Please enter a valid 10-digit Indian mobile number.'
          })
      }

      const cleanPincode =
        String(
          pincode
        ).replace(
          /\D/g,
          ''
        )

      if (
        !/^\d{6}$/.test(
          cleanPincode
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Please enter a valid 6-digit PIN code.'
          })
      }

      const createOrder =
        db.transaction(
          () => {
            const verifiedItems =
              []

            let subtotal =
              0

            for (
              const item
              of items
            ) {
              const productId =
                Number(
                  item.id
                )

              if (
                !Number.isInteger(
                  productId
                ) ||
                productId <= 0
              ) {
                throw new Error(
                  'One of the products in your cart is invalid.'
                )
              }

              const product =
                db.prepare(`
                  SELECT *
                  FROM products
                  WHERE id = ?
                  AND is_active = 1
                `).get(
                  productId
                )

              if (!product) {
                throw new Error(
                  `Product not available: ${
                    item.name ||
                    productId
                  }`
                )
              }

              const quantity =
                Number(
                  item.quantity
                )

              if (
                !Number.isInteger(
                  quantity
                ) ||
                quantity <= 0
              ) {
                throw new Error(
                  `Invalid quantity for ${product.name}`
                )
              }

              if (
                Number(
                  product.stock
                ) <
                quantity
              ) {
                throw new Error(
                  `Only ${product.stock} units available for ${product.name}`
                )
              }

              subtotal +=
                Number(
                  product.price
                ) *
                quantity

              verifiedItems.push({
                id:
                  product.id,

                name:
                  product.name,

                price:
                  Number(
                    product.price
                  ),

                quantity
              })
            }

            const deliveryCharge =
              subtotal >= 499
                ? 0
                : 49

            const total =
              subtotal +
              deliveryCharge

            const allowedPayments = [
              'Cash on Delivery',
              'COD',
              'Online Payment',
              'Online'
            ]

            const safePayment =
              allowedPayments.includes(
                paymentMethod
              )
                ? paymentMethod
                : 'Cash on Delivery'

            const orderResult =
              db.prepare(`
                INSERT INTO orders (
                  customer_name,
                  phone,
                  email,
                  address,
                  city,
                  state,
                  pincode,
                  subtotal,
                  delivery_charge,
                  total,
                  payment_method,
                  status
                )
                VALUES (
                  ?, ?, ?, ?, ?, ?, ?,
                  ?, ?, ?, ?, ?
                )
              `).run(
                String(
                  name
                ).trim(),

                cleanPhone,

                String(
                  email || ''
                ).trim(),

                String(
                  address
                ).trim(),

                String(
                  city
                ).trim(),

                String(
                  state
                ).trim(),

                cleanPincode,

                subtotal,

                deliveryCharge,

                total,

                safePayment,

                'Pending'
              )

            const orderId =
              Number(
                orderResult.lastInsertRowid
              )

            const insertItem =
              db.prepare(`
                INSERT INTO order_items (
                  order_id,
                  product_id,
                  product_name,
                  price,
                  quantity
                )
                VALUES (?, ?, ?, ?, ?)
              `)

            const reduceStock =
              db.prepare(`
                UPDATE products

                SET
                  stock = stock - ?,
                  updated_at =
                    CURRENT_TIMESTAMP

                WHERE id = ?
                AND stock >= ?
              `)

            for (
              const item
              of verifiedItems
            ) {
              insertItem.run(
                orderId,
                item.id,
                item.name,
                item.price,
                item.quantity
              )

              const stockResult =
                reduceStock.run(
                  item.quantity,
                  item.id,
                  item.quantity
                )

              if (
                stockResult.changes !==
                1
              ) {
                throw new Error(
                  `Unable to update stock for ${item.name}`
                )
              }
            }

            return orderId
          }
        )

      const orderId =
        createOrder()

      const order =
        db.prepare(`
          SELECT *
          FROM orders
          WHERE id = ?
        `).get(
          orderId
        )

      const orderItems =
        db.prepare(`
          SELECT *
          FROM order_items
          WHERE order_id = ?
          ORDER BY id ASC
        `).all(
          orderId
        )

      return res
        .status(201)
        .json({
          success: true,

          message:
            'Order placed successfully.',

          order: {
            ...order,

            items:
              orderItems
          }
        })
    } catch (
      error
    ) {
      console.error(
        'Create order error:',
        error
      )

      const message =
        error.message ||
        'Unable to place order.'

      const knownError =
        message.startsWith(
          'Product not available'
        ) ||
        message.startsWith(
          'Invalid quantity'
        ) ||
        message.startsWith(
          'Only '
        ) ||
        message.startsWith(
          'Unable to update stock'
        ) ||
        message.startsWith(
          'One of the products'
        )

      return res
        .status(
          knownError
            ? 400
            : 500
        )
        .json({
          success: false,

          message:
            knownError
              ? message
              : 'Unable to place order.'
        })
    }
  }
)

/* =========================================================
   PUBLIC ORDER TRACKING
========================================================= */

app.post(
  '/api/track-order',
  (req, res) => {
    try {
      const {
        orderId,
        phone
      } =
        req.body || {}

      const cleanOrderId =
        Number(
          orderId
        )

      if (
        !Number.isInteger(
          cleanOrderId
        ) ||
        cleanOrderId <= 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Please enter a valid order ID.'
          })
      }

      const cleanPhone =
        String(
          phone || ''
        )
          .replace(
            /\D/g,
            ''
          )
          .slice(-10)

      if (
        !/^[6-9]\d{9}$/.test(
          cleanPhone
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Please enter a valid 10-digit mobile number.'
          })
      }

      const order =
        db.prepare(`
          SELECT
            id,
            customer_name,
            city,
            state,
            pincode,
            subtotal,
            delivery_charge,
            total,
            payment_method,
            status,
            created_at,
            updated_at

          FROM orders

          WHERE id = ?
          AND phone = ?
        `).get(
          cleanOrderId,
          cleanPhone
        )

      if (!order) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              'No order was found with this order ID and mobile number.'
          })
      }

      const items =
        db.prepare(`
          SELECT
            product_id,
            product_name,
            price,
            quantity

          FROM order_items

          WHERE order_id = ?

          ORDER BY id ASC
        `).all(
          cleanOrderId
        )

      return res.json({
        success: true,

        order: {
          id:
            order.id,

          orderNumber:
            `CE-${String(
              order.id
            ).padStart(
              5,
              '0'
            )}`,

          customerName:
            order.customer_name,

          city:
            order.city,

          state:
            order.state,

          pincode:
            order.pincode,

          subtotal:
            order.subtotal,

          deliveryCharge:
            order.delivery_charge,

          total:
            order.total,

          paymentMethod:
            order.payment_method,

          status:
            order.status,

          createdAt:
            order.created_at,

          updatedAt:
            order.updated_at,

          items
        }
      })
    } catch (
      error
    ) {
      console.error(
        'Track order error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to track this order right now.'
        })
    }
  }
)

/* =========================================================
   ADMIN GET ALL ORDERS
========================================================= */

app.get(
  '/api/orders',
  adminAuth,
  (req, res) => {
    try {
      const orders =
        db.prepare(`
          SELECT *
          FROM orders
          ORDER BY
            created_at DESC,
            id DESC
        `).all()

      const getItems =
        db.prepare(`
          SELECT *
          FROM order_items
          WHERE order_id = ?
          ORDER BY id ASC
        `)

      const finalOrders =
        orders.map(
          (order) => ({
            ...order,

            items:
              getItems.all(
                order.id
              )
          })
        )

      return res.json({
        success: true,

        count:
          finalOrders.length,

        orders:
          finalOrders
      })
    } catch (
      error
    ) {
      console.error(
        'Admin orders error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to load orders.'
        })
    }
  }
)

/* =========================================================
   ADMIN SINGLE ORDER
========================================================= */

app.get(
  '/api/orders/:id',
  adminAuth,
  (req, res) => {
    try {
      const order =
        db.prepare(`
          SELECT *
          FROM orders
          WHERE id = ?
        `).get(
          req.params.id
        )

      if (!order) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              'Order not found.'
          })
      }

      const items =
        db.prepare(`
          SELECT *
          FROM order_items
          WHERE order_id = ?
          ORDER BY id ASC
        `).all(
          order.id
        )

      return res.json({
        success: true,

        order: {
          ...order,

          items
        }
      })
    } catch (
      error
    ) {
      console.error(
        'Single order error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to load order.'
        })
    }
  }
)

/* =========================================================
   UPDATE ORDER STATUS
   CANCEL = RESTORE STOCK
   REACTIVATE = RESERVE STOCK
========================================================= */

app.patch(
  '/api/orders/:id/status',
  adminAuth,
  (req, res) => {
    try {
      const {
        status
      } =
        req.body || {}

      const statuses = [
        'Pending',
        'Confirmed',
        'Packed',
        'Shipped',
        'Delivered',
        'Cancelled'
      ]

      if (
        !statuses.includes(
          status
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Invalid order status.'
          })
      }

      const orderId =
        Number(
          req.params.id
        )

      const existingOrder =
        db.prepare(`
          SELECT *
          FROM orders
          WHERE id = ?
        `).get(
          orderId
        )

      if (
        !existingOrder
      ) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              'Order not found.'
          })
      }

      if (
        existingOrder.status ===
        status
      ) {
        return res.json({
          success: true,

          message:
            'Order status is already up to date.',

          order:
            existingOrder
        })
      }

      const items =
        db.prepare(`
          SELECT *
          FROM order_items
          WHERE order_id = ?
        `).all(
          orderId
        )

      const transaction =
        db.transaction(
          () => {
            if (
              existingOrder.status !==
                'Cancelled' &&
              status ===
                'Cancelled'
            ) {
              const restore =
                db.prepare(`
                  UPDATE products

                  SET
                    stock = stock + ?,
                    updated_at =
                      CURRENT_TIMESTAMP

                  WHERE id = ?
                `)

              for (
                const item
                of items
              ) {
                if (
                  !item.product_id
                ) {
                  continue
                }

                restore.run(
                  Number(
                    item.quantity
                  ),

                  Number(
                    item.product_id
                  )
                )
              }
            }

            if (
              existingOrder.status ===
                'Cancelled' &&
              status !==
                'Cancelled'
            ) {
              for (
                const item
                of items
              ) {
                if (
                  !item.product_id
                ) {
                  throw new Error(
                    `Cannot reactivate order because product information is missing for ${item.product_name}.`
                  )
                }

                const product =
                  db.prepare(`
                    SELECT *
                    FROM products
                    WHERE id = ?
                  `).get(
                    item.product_id
                  )

                if (!product) {
                  throw new Error(
                    `Cannot reactivate order because ${item.product_name} no longer exists.`
                  )
                }

                if (
                  Number(
                    product.stock
                  ) <
                  Number(
                    item.quantity
                  )
                ) {
                  throw new Error(
                    `Not enough stock for ${product.name}. Available: ${product.stock}, required: ${item.quantity}.`
                  )
                }
              }

              const reduce =
                db.prepare(`
                  UPDATE products

                  SET
                    stock = stock - ?,
                    updated_at =
                      CURRENT_TIMESTAMP

                  WHERE id = ?
                  AND stock >= ?
                `)

              for (
                const item
                of items
              ) {
                const quantity =
                  Number(
                    item.quantity
                  )

                const result =
                  reduce.run(
                    quantity,
                    item.product_id,
                    quantity
                  )

                if (
                  result.changes !==
                  1
                ) {
                  throw new Error(
                    `Unable to reserve stock for ${item.product_name}.`
                  )
                }
              }
            }

            db.prepare(`
              UPDATE orders

              SET
                status = ?,
                updated_at =
                  CURRENT_TIMESTAMP

              WHERE id = ?
            `).run(
              status,
              orderId
            )
          }
        )

      transaction()

      const updated =
        db.prepare(`
          SELECT *
          FROM orders
          WHERE id = ?
        `).get(
          orderId
        )

      const updatedItems =
        db.prepare(`
          SELECT *
          FROM order_items
          WHERE order_id = ?
        `).all(
          orderId
        )

      return res.json({
        success: true,

        message:
          status ===
          'Cancelled'
            ? 'Order cancelled and product stock restored.'
            : existingOrder.status ===
                'Cancelled'
              ? 'Order reactivated and stock reserved.'
              : 'Order status updated successfully.',

        order: {
          ...updated,

          items:
            updatedItems
        }
      })
    } catch (
      error
    ) {
      console.error(
        'Order status error:',
        error
      )

      const message =
        error.message ||
        'Unable to update order.'

      const stockError =
        message.startsWith(
          'Not enough stock'
        ) ||
        message.startsWith(
          'Cannot reactivate'
        ) ||
        message.startsWith(
          'Unable to reserve'
        )

      return res
        .status(
          stockError
            ? 400
            : 500
        )
        .json({
          success: false,

          message:
            stockError
              ? message
              : 'Unable to update order status.'
        })
    }
  }
)

/* =========================================================
   DELETE ORDER
========================================================= */

app.delete(
  '/api/orders/:id',
  adminAuth,
  (req, res) => {
    try {
      const orderId =
        Number(
          req.params.id
        )

      const order =
        db.prepare(`
          SELECT *
          FROM orders
          WHERE id = ?
        `).get(
          orderId
        )

      if (!order) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              'Order not found.'
          })
      }

      const transaction =
        db.transaction(
          () => {
            if (
              order.status !==
              'Cancelled'
            ) {
              const items =
                db.prepare(`
                  SELECT *
                  FROM order_items
                  WHERE order_id = ?
                `).all(
                  orderId
                )

              const restore =
                db.prepare(`
                  UPDATE products

                  SET
                    stock = stock + ?,
                    updated_at =
                      CURRENT_TIMESTAMP

                  WHERE id = ?
                `)

              for (
                const item
                of items
              ) {
                if (
                  item.product_id
                ) {
                  restore.run(
                    Number(
                      item.quantity
                    ),

                    Number(
                      item.product_id
                    )
                  )
                }
              }
            }

            db.prepare(`
              DELETE FROM order_items
              WHERE order_id = ?
            `).run(
              orderId
            )

            db.prepare(`
              DELETE FROM orders
              WHERE id = ?
            `).run(
              orderId
            )
          }
        )

      transaction()

      return res.json({
        success: true,

        message:
          'Order deleted successfully.'
      })
    } catch (
      error
    ) {
      console.error(
        'Delete order error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to delete order.'
        })
    }
  }
)

/* =========================================================
   ADMIN STATS
========================================================= */

app.get(
  '/api/admin/stats',
  adminAuth,
  (req, res) => {
    try {
      const totalOrders =
        db.prepare(`
          SELECT COUNT(*) AS count
          FROM orders
        `).get().count

      const pendingOrders =
        db.prepare(`
          SELECT COUNT(*) AS count
          FROM orders
          WHERE status = 'Pending'
        `).get().count

      const deliveredOrders =
        db.prepare(`
          SELECT COUNT(*) AS count
          FROM orders
          WHERE status = 'Delivered'
        `).get().count

      const cancelledOrders =
        db.prepare(`
          SELECT COUNT(*) AS count
          FROM orders
          WHERE status = 'Cancelled'
        `).get().count

      const revenue =
        db.prepare(`
          SELECT
            COALESCE(
              SUM(total),
              0
            ) AS total

          FROM orders

          WHERE status != 'Cancelled'
        `).get().total

      const deliveredRevenue =
        db.prepare(`
          SELECT
            COALESCE(
              SUM(total),
              0
            ) AS total

          FROM orders

          WHERE status = 'Delivered'
        `).get().total

      const totalProducts =
        db.prepare(`
          SELECT COUNT(*) AS count
          FROM products
        `).get().count

      const activeProducts =
        db.prepare(`
          SELECT COUNT(*) AS count
          FROM products
          WHERE is_active = 1
        `).get().count

      const lowStockProducts =
        db.prepare(`
          SELECT COUNT(*) AS count
          FROM products
          WHERE stock <= 5
          AND is_active = 1
        `).get().count

      const outOfStockProducts =
        db.prepare(`
          SELECT COUNT(*) AS count
          FROM products
          WHERE stock = 0
          AND is_active = 1
        `).get().count

      return res.json({
        success: true,

        stats: {
          totalOrders,
          pendingOrders,
          deliveredOrders,
          cancelledOrders,
          revenue,
          deliveredRevenue,
          totalProducts,
          activeProducts,
          lowStockProducts,
          outOfStockProducts
        }
      })
    } catch (
      error
    ) {
      console.error(
        'Admin stats error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to load statistics.'
        })
    }
  }
)

/* =========================================================
   CONTACT FORM
========================================================= */

app.post(
  '/api/contact',
  (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        subject,
        message
      } =
        req.body || {}

      const cleanName =
        String(
          name || ''
        ).trim()

      const cleanEmail =
        String(
          email || ''
        )
          .trim()
          .toLowerCase()

      const cleanPhone =
        String(
          phone || ''
        )
          .replace(
            /\D/g,
            ''
          )
          .slice(-10)

      const cleanSubject =
        String(
          subject || ''
        ).trim()

      const cleanMessage =
        String(
          message || ''
        ).trim()

      if (
        !cleanName ||
        !cleanEmail ||
        !cleanSubject ||
        !cleanMessage
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Name, email, subject and message are required.'
          })
      }

      if (
        cleanName.length < 2 ||
        cleanName.length > 80
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Please enter a valid name.'
          })
      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (
        !emailPattern.test(
          cleanEmail
        ) ||
        cleanEmail.length > 120
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Please enter a valid email address.'
          })
      }

      if (
        cleanPhone &&
        !/^[6-9]\d{9}$/.test(
          cleanPhone
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Please enter a valid 10-digit Indian mobile number.'
          })
      }

      if (
        cleanSubject.length < 3 ||
        cleanSubject.length > 120
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Subject must be between 3 and 120 characters.'
          })
      }

      if (
        cleanMessage.length < 10 ||
        cleanMessage.length > 2000
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Message must be between 10 and 2000 characters.'
          })
      }

      const result =
        db.prepare(`
          INSERT INTO contact_messages (
            name,
            email,
            phone,
            subject,
            message,
            status
          )
          VALUES (
            ?, ?, ?, ?, ?, 'New'
          )
        `).run(
          cleanName,
          cleanEmail,
          cleanPhone || null,
          cleanSubject,
          cleanMessage
        )

      return res
        .status(201)
        .json({
          success: true,

          message:
            'Your message has been sent successfully. We will get back to you soon.',

          enquiryId:
            Number(
              result.lastInsertRowid
            )
        })
    } catch (
      error
    ) {
      console.error(
        'Contact form error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to send your message right now. Please try again.'
        })
    }
  }
)

/* =========================================================
   ADMIN ENQUIRIES
========================================================= */

app.get(
  '/api/admin/enquiries',
  adminAuth,
  (req, res) => {
    try {
      const enquiries =
        db.prepare(`
          SELECT
            id,
            name,
            email,
            phone,
            subject,
            message,
            status,
            created_at,
            updated_at

          FROM contact_messages

          ORDER BY
            CASE status
              WHEN 'New' THEN 0
              WHEN 'Read' THEN 1
              ELSE 2
            END,
            created_at DESC,
            id DESC
        `).all()

      const counts =
        db.prepare(`
          SELECT
            COUNT(*) AS total,

            SUM(
              CASE
                WHEN status = 'New'
                THEN 1
                ELSE 0
              END
            ) AS new_count,

            SUM(
              CASE
                WHEN status = 'Read'
                THEN 1
                ELSE 0
              END
            ) AS read_count,

            SUM(
              CASE
                WHEN status = 'Resolved'
                THEN 1
                ELSE 0
              END
            ) AS resolved_count

          FROM contact_messages
        `).get()

      return res.json({
        success: true,

        count:
          enquiries.length,

        counts: {
          total:
            Number(
              counts.total || 0
            ),

          new:
            Number(
              counts.new_count || 0
            ),

          read:
            Number(
              counts.read_count || 0
            ),

          resolved:
            Number(
              counts.resolved_count || 0
            )
        },

        enquiries
      })
    } catch (
      error
    ) {
      console.error(
        'Admin enquiries error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to load enquiries.'
        })
    }
  }
)

/* =========================================================
   ADMIN SINGLE ENQUIRY
========================================================= */

app.get(
  '/api/admin/enquiries/:id',
  adminAuth,
  (req, res) => {
    try {
      const enquiryId =
        Number(
          req.params.id
        )

      if (
        !Number.isInteger(
          enquiryId
        ) ||
        enquiryId <= 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Invalid enquiry ID.'
          })
      }

      const enquiry =
        db.prepare(`
          SELECT
            id,
            name,
            email,
            phone,
            subject,
            message,
            status,
            created_at,
            updated_at

          FROM contact_messages

          WHERE id = ?
        `).get(
          enquiryId
        )

      if (!enquiry) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              'Enquiry not found.'
          })
      }

      return res.json({
        success: true,
        enquiry
      })
    } catch (
      error
    ) {
      console.error(
        'Admin enquiry error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to load enquiry.'
        })
    }
  }
)

/* =========================================================
   UPDATE ENQUIRY STATUS
========================================================= */

app.patch(
  '/api/admin/enquiries/:id/status',
  adminAuth,
  (req, res) => {
    try {
      const enquiryId =
        Number(
          req.params.id
        )

      const {
        status
      } =
        req.body || {}

      const statuses = [
        'New',
        'Read',
        'Resolved'
      ]

      if (
        !Number.isInteger(
          enquiryId
        ) ||
        enquiryId <= 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Invalid enquiry ID.'
          })
      }

      if (
        !statuses.includes(
          status
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Invalid enquiry status.'
          })
      }

      const existing =
        db.prepare(`
          SELECT id
          FROM contact_messages
          WHERE id = ?
        `).get(
          enquiryId
        )

      if (!existing) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              'Enquiry not found.'
          })
      }

      db.prepare(`
        UPDATE contact_messages

        SET
          status = ?,
          updated_at =
            CURRENT_TIMESTAMP

        WHERE id = ?
      `).run(
        status,
        enquiryId
      )

      const enquiry =
        db.prepare(`
          SELECT
            id,
            name,
            email,
            phone,
            subject,
            message,
            status,
            created_at,
            updated_at

          FROM contact_messages

          WHERE id = ?
        `).get(
          enquiryId
        )

      return res.json({
        success: true,

        message:
          'Enquiry status updated successfully.',

        enquiry
      })
    } catch (
      error
    ) {
      console.error(
        'Enquiry status error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to update enquiry status.'
        })
    }
  }
)

/* =========================================================
   DELETE ENQUIRY
========================================================= */

app.delete(
  '/api/admin/enquiries/:id',
  adminAuth,
  (req, res) => {
    try {
      const enquiryId =
        Number(
          req.params.id
        )

      if (
        !Number.isInteger(
          enquiryId
        ) ||
        enquiryId <= 0
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Invalid enquiry ID.'
          })
      }

      const enquiry =
        db.prepare(`
          SELECT id
          FROM contact_messages
          WHERE id = ?
        `).get(
          enquiryId
        )

      if (!enquiry) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              'Enquiry not found.'
          })
      }

      db.prepare(`
        DELETE FROM contact_messages
        WHERE id = ?
      `).run(
        enquiryId
      )

      return res.json({
        success: true,

        message:
          'Enquiry deleted successfully.'
      })
    } catch (
      error
    ) {
      console.error(
        'Delete enquiry error:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Unable to delete enquiry.'
        })
    }
  }
)

/* =========================================================
   404
========================================================= */

app.use(
  (req, res) => {
    return res
      .status(404)
      .json({
        success: false,

        message:
          `Route not found: ${req.method} ${req.originalUrl}`
      })
  }
)

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      'Unhandled server error:',
      error
    )

    return res
      .status(500)
      .json({
        success: false,

        message:
          'Internal server error.'
      })
  }
)

/* =========================================================
   START SERVER
========================================================= */

app.listen(
  PORT,
  '127.0.0.1',
  () => {
    console.log('')

    console.log(
      '======================================'
    )

    console.log(
      '   Cordial Express Backend Started'
    )

    console.log(
      '======================================'
    )

    console.log(
      `API: http://127.0.0.1:${PORT}`
    )

    console.log(
      `Health: http://127.0.0.1:${PORT}/api/health`
    )

    console.log(
      'Customer OTP: Disabled'
    )

    console.log(
      'Secure Checkout: Enabled'
    )

    console.log(
      'Inventory Control: Enabled'
    )

    console.log(
      'Order Tracking: Enabled'
    )

    console.log(
      'Contact System: Enabled'
    )

    console.log(
      'Admin Enquiries: Enabled'
    )

    console.log(
      'Cancellation Stock Restore: Enabled'
    )

    console.log(
      '======================================'
    )

    console.log('')
  }
)