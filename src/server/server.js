const express = require('express')
const cors = require('cors')
const Database = require('better-sqlite3')
const path = require('path')

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

const dbPath = path.join(__dirname, 'cordial-express.db')
const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    subtotal INTEGER NOT NULL,
    delivery_charge INTEGER NOT NULL,
    total INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    category TEXT,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  )
`)

app.get('/', (req, res) => {
  res.json({
    message: 'Cordial Express API is running',
    status: 'operational'
  })
})

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is healthy'
  })
})

app.post('/api/orders', (req, res) => {
  try {
    const {
      customer,
      items,
      subtotal,
      deliveryCharge,
      total
    } = req.body

    if (
      !customer ||
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.city ||
      !customer.state ||
      !customer.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing customer details'
      })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one product'
      })
    }

    const insertOrder = db.prepare(`
      INSERT INTO orders (
        customer_name,
        phone,
        email,
        address,
        city,
        state,
        pincode,
        payment_method,
        subtotal,
        delivery_charge,
        total
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const insertItem = db.prepare(`
      INSERT INTO order_items (
        order_id,
        product_id,
        product_name,
        category,
        price,
        quantity
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    const createOrder = db.transaction(() => {
      const result = insertOrder.run(
        customer.name,
        customer.phone,
        customer.email || '',
        customer.address,
        customer.city,
        customer.state,
        customer.pincode,
        customer.payment || 'cod',
        subtotal,
        deliveryCharge,
        total
      )

      const orderId = result.lastInsertRowid

      items.forEach((item) => {
        insertItem.run(
          orderId,
          item.id,
          item.name,
          item.category || '',
          item.price,
          item.quantity
        )
      })

      return orderId
    })

    const orderId = createOrder()

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId
    })
  } catch (error) {
    console.error('Order creation error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    })
  }
})

app.get('/api/orders', (req, res) => {
  try {
    const orders = db
      .prepare(`
        SELECT *
        FROM orders
        ORDER BY created_at DESC
      `)
      .all()

    res.json({
      success: true,
      count: orders.length,
      orders
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    })
  }
})

app.listen(PORT, () => {
  console.log(
    `Cordial Express backend running on http://127.0.0.1:${PORT}`
  )
})