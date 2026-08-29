import {
  BadgeCheck,
  HeartHandshake,
  Leaf,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  Users
} from 'lucide-react'

import {
  Link
} from 'react-router-dom'

export default function About() {
  return (
    <main className="ce-about-page">

      <section className="ce-about-hero">

        <div className="ce-about-hero-copy">

          <span className="ce-about-eyebrow">

            <Sparkles
              size={13}
            />

            About Cordial Express

          </span>

          <h1>
            Everyday essentials,
            <span>
              delivered with care.
            </span>
          </h1>

          <p>
            Cordial Express is built to
            make everyday grocery and
            essentials shopping simple,
            reliable and convenient.
            From pantry staples to
            snacks, beverages and daily
            essentials, our goal is to
            bring a clean and dependable
            shopping experience to every
            customer.
          </p>

          <div className="ce-about-hero-actions">

            <Link
              to="/products"
              className="ce-about-primary"
            >
              <ShoppingBag
                size={16}
              />

              Explore Products
            </Link>

            <Link
              to="/contact"
              className="ce-about-secondary"
            >
              Contact Us
            </Link>

          </div>

        </div>

        <div className="ce-about-hero-visual">

          <div className="ce-about-visual-card large">

            <div>

              <span>
                OUR PROMISE
              </span>

              <strong>
                Simple shopping.
                Thoughtful service.
              </strong>

            </div>

            <Leaf
              size={42}
            />

          </div>

          <div className="ce-about-visual-row">

            <div className="ce-about-visual-card">

              <PackageCheck
                size={26}
              />

              <div>

                <strong>
                  Quality Checked
                </strong>

                <span>
                  Products handled
                  with care
                </span>

              </div>

            </div>

            <div className="ce-about-visual-card">

              <Truck
                size={26}
              />

              <div>

                <strong>
                  Convenient Delivery
                </strong>

                <span>
                  Everyday essentials
                  made easier
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="ce-about-story">

        <div className="ce-about-story-heading">

          <span>
            OUR STORY
          </span>

          <h2>
            Built around everyday needs.
          </h2>

        </div>

        <div className="ce-about-story-grid">

          <div className="ce-about-story-copy">

            <p>
              Cordial Express was created
              around a simple idea:
              everyday shopping should
              feel easy, trustworthy and
              organised.
            </p>

            <p>
              Instead of making customers
              search through complicated
              pages, our focus is to keep
              the experience clean and
              direct — discover products,
              add them to your cart,
              checkout securely and track
              your order in one place.
            </p>

            <p>
              As the platform grows, the
              goal remains the same:
              provide useful essentials,
              clear information and a
              dependable shopping
              experience.
            </p>

          </div>

          <div className="ce-about-story-highlight">

            <HeartHandshake
              size={32}
            />

            <span>
              WHAT MATTERS TO US
            </span>

            <h3>
              Convenience without
              compromising trust.
            </h3>

            <p>
              We want every interaction
              with Cordial Express to feel
              straightforward, secure and
              customer-focused.
            </p>

          </div>

        </div>

      </section>

      <section className="ce-about-values">

        <div className="ce-about-section-heading">

          <span>
            OUR VALUES
          </span>

          <h2>
            What Cordial Express stands for
          </h2>

          <p>
            The principles behind the
            shopping experience we are
            building.
          </p>

        </div>

        <div className="ce-about-values-grid">

          <article>

            <div>
              <BadgeCheck
                size={23}
              />
            </div>

            <h3>
              Quality First
            </h3>

            <p>
              Products should be presented
              clearly, handled carefully
              and supported by accurate
              stock and pricing.
            </p>

          </article>

          <article>

            <div>
              <ShieldCheck
                size={23}
              />
            </div>

            <h3>
              Reliable Shopping
            </h3>

            <p>
              Customers deserve clear
              checkout information and
              server-verified order data.
            </p>

          </article>

          <article>

            <div>
              <Users
                size={23}
              />
            </div>

            <h3>
              Customer Focus
            </h3>

            <p>
              Every part of the experience
              should help customers shop
              with less confusion and more
              confidence.
            </p>

          </article>

          <article>

            <div>
              <Leaf
                size={23}
              />
            </div>

            <h3>
              Thoughtful Simplicity
            </h3>

            <p>
              Clean design, useful
              information and easy
              navigation are at the centre
              of the platform.
            </p>

          </article>

        </div>

      </section>

      <section className="ce-about-how">

        <div className="ce-about-section-heading">

          <span>
            HOW IT WORKS
          </span>

          <h2>
            A simple shopping journey
          </h2>

        </div>

        <div className="ce-about-how-grid">

          <div>

            <span>
              01
            </span>

            <ShoppingBag
              size={23}
            />

            <h3>
              Discover
            </h3>

            <p>
              Browse everyday essentials
              and search by product or
              category.
            </p>

          </div>

          <div>

            <span>
              02
            </span>

            <PackageCheck
              size={23}
            />

            <h3>
              Review
            </h3>

            <p>
              Add products to your cart and
              review live price and stock
              information.
            </p>

          </div>

          <div>

            <span>
              03
            </span>

            <ShieldCheck
              size={23}
            />

            <h3>
              Checkout
            </h3>

            <p>
              Enter delivery information
              and place your order through
              the secure checkout flow.
            </p>

          </div>

          <div>

            <span>
              04
            </span>

            <Truck
              size={23}
            />

            <h3>
              Track
            </h3>

            <p>
              Follow your order through
              Pending, Confirmed, Packed,
              Shipped and Delivered.
            </p>

          </div>

        </div>

      </section>

      <section className="ce-about-cta">

        <div>

          <span>
            READY TO SHOP?
          </span>

          <h2>
            Find your everyday
            essentials in one place.
          </h2>

          <p>
            Browse the Cordial Express
            store and start building your
            cart.
          </p>

        </div>

        <Link
          to="/products"
        >
          Shop Products
        </Link>

      </section>

    </main>
  )
}