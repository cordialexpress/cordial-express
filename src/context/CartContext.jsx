import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

const CartContext = createContext()

export function CartProvider({
  children
}) {
  const [cart, setCart] =
    useState(() => {
      try {
        const savedCart =
          localStorage.getItem(
            'cordialExpressCart'
          )

        return savedCart
          ? JSON.parse(savedCart)
          : []
      } catch {
        return []
      }
    })

  useEffect(() => {
    localStorage.setItem(
      'cordialExpressCart',
      JSON.stringify(cart)
    )
  }, [cart])

  /*
    Returns a valid stock limit.

    If an older saved cart item does
    not contain stock information,
    null is returned and the backend
    remains the final stock authority.
  */
  const getStockLimit = (
    product
  ) => {
    const stock =
      Number(product?.stock)

    if (
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      return null
    }

    return Math.floor(stock)
  }

  /*
    ADD PRODUCT TO CART

    If the product already exists,
    quantity is increased without
    going above available stock.
  */
  const addToCart = (
    product,
    quantity = 1
  ) => {
    const requestedQuantity =
      Math.max(
        1,
        Number(quantity) || 1
      )

    const stockLimit =
      getStockLimit(product)

    /*
      Do not add products that are
      explicitly out of stock.
    */
    if (
      stockLimit !== null &&
      stockLimit <= 0
    ) {
      return {
        success: false,
        message:
          `${product.name} is out of stock.`
      }
    }

    let result = {
      success: true,
      message:
        `${product.name} added to cart.`
    }

    setCart(
      (currentCart) => {
        const existingProduct =
          currentCart.find(
            (item) =>
              item.id ===
              product.id
          )

        if (
          existingProduct
        ) {
          /*
            Use the newest stock value
            received from the products API.
          */
          const latestStock =
            stockLimit !== null
              ? stockLimit
              : getStockLimit(
                  existingProduct
                )

          const desiredQuantity =
            Number(
              existingProduct.quantity
            ) +
            requestedQuantity

          const finalQuantity =
            latestStock !== null
              ? Math.min(
                  desiredQuantity,
                  latestStock
                )
              : desiredQuantity

          if (
            latestStock !== null &&
            Number(
              existingProduct.quantity
            ) >= latestStock
          ) {
            result = {
              success: false,
              message:
                `Only ${latestStock} units of ${product.name} are available.`
            }
          }

          return currentCart.map(
            (item) =>
              item.id ===
              product.id
                ? {
                    ...item,
                    ...product,
                    quantity:
                      finalQuantity
                  }
                : item
          )
        }

        const startingQuantity =
          stockLimit !== null
            ? Math.min(
                requestedQuantity,
                stockLimit
              )
            : requestedQuantity

        return [
          ...currentCart,
          {
            ...product,
            quantity:
              startingQuantity
          }
        ]
      }
    )

    return result
  }

  /*
    REMOVE PRODUCT
  */
  const removeFromCart = (
    productId
  ) => {
    setCart(
      (currentCart) =>
        currentCart.filter(
          (item) =>
            item.id !== productId
        )
    )
  }

  /*
    INCREASE QUANTITY

    Quantity can never exceed the
    known product stock.
  */
  const increaseQuantity = (
    productId
  ) => {
    let result = {
      success: true,
      message: ''
    }

    setCart(
      (currentCart) =>
        currentCart.map(
          (item) => {
            if (
              item.id !==
              productId
            ) {
              return item
            }

            const stockLimit =
              getStockLimit(item)

            const currentQuantity =
              Number(
                item.quantity
              ) || 1

            if (
              stockLimit !== null &&
              currentQuantity >=
                stockLimit
            ) {
              result = {
                success: false,
                message:
                  `Only ${stockLimit} units of ${item.name} are available.`
              }

              return item
            }

            return {
              ...item,
              quantity:
                currentQuantity + 1
            }
          }
        )
    )

    return result
  }

  /*
    DECREASE QUANTITY

    Minimum quantity remains 1.
  */
  const decreaseQuantity = (
    productId
  ) => {
    setCart(
      (currentCart) =>
        currentCart.map(
          (item) =>
            item.id ===
            productId
              ? {
                  ...item,
                  quantity:
                    Math.max(
                      1,
                      Number(
                        item.quantity
                      ) - 1
                    )
                }
              : item
        )
    )
  }

  /*
    SET A SPECIFIC QUANTITY

    Useful later if we add direct
    quantity input fields.
  */
  const setQuantity = (
    productId,
    quantity
  ) => {
    setCart(
      (currentCart) =>
        currentCart.map(
          (item) => {
            if (
              item.id !==
              productId
            ) {
              return item
            }

            const stockLimit =
              getStockLimit(item)

            let nextQuantity =
              Math.max(
                1,
                Math.floor(
                  Number(
                    quantity
                  ) || 1
                )
              )

            if (
              stockLimit !== null
            ) {
              nextQuantity =
                Math.min(
                  nextQuantity,
                  stockLimit
                )
            }

            return {
              ...item,
              quantity:
                nextQuantity
            }
          }
        )
    )
  }

  /*
    UPDATE CART USING CURRENT
    PRODUCT DATABASE INFORMATION.

    We will use this in the next
    stage when refreshing cart stock.
  */
  const syncCartProducts = (
    products
  ) => {
    if (
      !Array.isArray(products)
    ) {
      return
    }

    setCart(
      (currentCart) =>
        currentCart
          .map((item) => {
            const currentProduct =
              products.find(
                (product) =>
                  Number(
                    product.id
                  ) ===
                  Number(
                    item.id
                  )
              )

            /*
              Product no longer exists
              or is inactive.
            */
            if (
              !currentProduct
            ) {
              return {
                ...item,
                unavailable: true
              }
            }

            const stock =
              Number(
                currentProduct.stock
              )

            const normalizedStock =
              Number.isFinite(
                stock
              )
                ? Math.max(
                    0,
                    stock
                  )
                : 0

            const currentQuantity =
              Number(
                item.quantity
              ) || 1

            return {
              ...item,

              name:
                currentProduct.name ??
                item.name,

              price:
                Number(
                  currentProduct.price
                ),

              oldPrice:
                currentProduct.oldPrice ??
                currentProduct.old_price ??
                item.oldPrice,

              category:
                currentProduct.category ??
                item.category,

              image:
                currentProduct.image ??
                currentProduct.image_url ??
                item.image,

              stock:
                normalizedStock,

              unavailable:
                Number(
                  currentProduct.is_active
                ) === 0,

              quantity:
                normalizedStock > 0
                  ? Math.min(
                      currentQuantity,
                      normalizedStock
                    )
                  : currentQuantity
            }
          })
    )
  }

  /*
    CLEAR CART
  */
  const clearCart = () => {
    setCart([])
  }

  /*
    TOTAL QUANTITY
  */
  const cartCount =
    cart.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.quantity || 0
        ),
      0
    )

  /*
    CART SUBTOTAL

    This is only the UI estimate.

    The backend still calculates
    the authoritative checkout total.
  */
  const cartSubtotal =
    cart.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.price || 0
        ) *
          Number(
            item.quantity || 0
          ),
      0
    )

  const hasUnavailableItems =
    cart.some(
      (item) =>
        item.unavailable ||
        Number(
          item.stock
        ) === 0
    )

  return (
    <CartContext.Provider
      value={{
        cart,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        setQuantity,

        syncCartProducts,

        clearCart,

        cartCount,

        cartSubtotal,

        hasUnavailableItems
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context =
    useContext(
      CartContext
    )

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider.'
    )
  }

  return context
}