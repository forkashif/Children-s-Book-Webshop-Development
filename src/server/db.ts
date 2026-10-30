import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';
import { bookCovers } from './sampleCovers.js';
import type { 
  Book, 
  BookVariant, 
  Order, 
  OrderItem, 
  TrackingEvent, 
  AdminUser, 
  StoreSettings, 
  PODStatus, 
  PaymentStatus,
  PODLog
} from './types.js';

// Resolve SQLite database path
const dbPath = path.resolve(process.cwd(), 'store.sqlite');
export const db = new Database(dbPath);

// Enable WAL mode for high performance concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/**
 * Initialize all database tables matching the specification
 */
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT,
      author TEXT NOT NULL,
      illustrator TEXT NOT NULL,
      description TEXT NOT NULL,
      excerpt TEXT,
      age_range TEXT NOT NULL,
      category TEXT NOT NULL,
      page_count INTEGER NOT NULL,
      trim_size TEXT NOT NULL,
      cover_finish TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      gallery_images TEXT NOT NULL, -- JSON array
      featured INTEGER DEFAULT 0,
      bestseller INTEGER DEFAULT 0,
      rating REAL DEFAULT 5.0,
      review_count INTEGER DEFAULT 0,
      seo_title TEXT,
      seo_description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS variants (
      id TEXT PRIMARY KEY,
      book_id TEXT NOT NULL,
      format TEXT NOT NULL, -- 'hardcover' | 'paperback'
      title TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      price REAL NOT NULL,
      sale_price REAL,
      pod_product_code TEXT NOT NULL,
      print_file_url TEXT NOT NULL,
      weight_grams INTEGER DEFAULT 350,
      in_stock INTEGER DEFAULT 1,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_email TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT,
      subtotal REAL NOT NULL,
      shipping_cost REAL NOT NULL,
      shipping_method TEXT NOT NULL,
      tax_amount REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      currency TEXT DEFAULT 'EUR',
      payment_status TEXT NOT NULL, -- 'pending' | 'paid' | 'failed' | 'refunded'
      payment_method TEXT NOT NULL,
      stripe_payment_intent_id TEXT,
      pod_provider TEXT NOT NULL,
      pod_order_id TEXT,
      pod_status TEXT NOT NULL, -- 'pending_payment' | 'sent_to_printer' | 'in_production' | 'shipped' | 'delivered' | 'failed' | 'cancelled'
      pod_retry_count INTEGER DEFAULT 0,
      pod_last_error TEXT,
      tracking_number TEXT,
      tracking_url TEXT,
      carrier_name TEXT,
      shipping_address_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      book_id TEXT NOT NULL,
      variant_id TEXT NOT NULL,
      book_title TEXT NOT NULL,
      format TEXT NOT NULL,
      sku TEXT NOT NULL,
      pod_product_code TEXT NOT NULL,
      unit_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      total_price REAL NOT NULL,
      dedication_text TEXT,
      print_file_url TEXT NOT NULL,
      cover_image TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tracking_events (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      status TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'superadmin',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pod_logs (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      action TEXT NOT NULL,
      status TEXT NOT NULL,
      request_payload TEXT,
      response_payload TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  seedInitialData();
}

/**
 * Hash password securely using PBKDF2
 */
export function hashPassword(password: string): string {
  const salt = 'starlight_tales_static_salt_for_books_2026';
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

/**
 * Seed database with 4 enchanting children's books and admin account
 */
function seedInitialData() {
  // Check if books table is already seeded
  const count = db.prepare('SELECT COUNT(*) as cnt FROM books').get() as { cnt: number };
  if (count.cnt > 0) return;

  const now = new Date().toISOString();

  // 1. Seed Admin User
  const adminId = 'admin-' + crypto.randomUUID().slice(0, 8);
  const passwordHash = hashPassword('MagicalBooks2026!');
  db.prepare(`
    INSERT OR IGNORE INTO admin_users (id, email, password_hash, name, role, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(adminId, 'admin@magicalbooks.com', passwordHash, 'Head Storyteller', 'superadmin', now);

  // 2. Seed Settings
  const initialSettings: StoreSettings = {
    store_name: "Starlight Tales",
    currency: "EUR",
    supported_countries: ["IE", "GB", "US", "DE", "FR", "CA", "AU", "NL", "ES", "IT"],
    contact_email: "hello@starlighttales.com",
    tax_rate_percent: 0, // Children's books enjoy 0% VAT in Ireland/UK!
    prices_include_tax: true,
    pod_provider: "prodigi",
    pod_sandbox_mode: true,
    free_shipping_threshold: 45,
    notice_banner_text: "✨ Free Tracked Shipping on all orders over €45 · Crafted with FSC-Certified Papers",
    notice_banner_active: true
  };

  const insertSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  for (const [key, val] of Object.entries(initialSettings)) {
    insertSetting.run(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
  }

  // 3. Seed 4 enchanting children's books
  const sampleBooks = [
    {
      id: 'book-falling-star',
      slug: 'the-boy-who-caught-a-falling-star',
      title: 'The Boy Who Caught a Falling Star',
      subtitle: 'A bedtime journey of wonder, moonlight and kindness',
      author: 'Elena Woods',
      illustrator: 'Arthur Pendelton',
      description: 'One clear summer evening, young Oliver spots an extraordinary golden sparkle tumble from the constellation of Orion right onto his windowsill. Instead of keeping the star in a jar, Oliver embarks on a whimsical night-time quest through whispering meadows, accompanied by a sleepy hedgehog and a gentle barn owl, to return the glowing spark to the heart of the sky. A heart-warming bedtime tale reminding children that the greatest treasures are the ones we give away.',
      excerpt: 'Oliver held up his glass jar. The star flickered once, twice, and warmed his hands like a cup of hot cocoa...',
      age_range: '3–6 years',
      category: 'Bedtime Tales',
      page_count: 32,
      trim_size: '8.5 x 8.5 in (216 x 216 mm)',
      cover_finish: 'Matte Soft-Touch Hardcover or Satin Silk Paperback',
      cover_image: bookCovers.fallingStar,
      gallery_images: JSON.stringify([bookCovers.fallingStar, bookCovers.insideSpreadPage1, bookCovers.insideDedicationSpread]),
      featured: 1,
      bestseller: 1,
      rating: 4.9,
      review_count: 128,
      seo_title: 'The Boy Who Caught a Falling Star | Printed Children\'s Book',
      seo_description: 'An enchanting bedtime picture book for children aged 3-6. Printed in stunning full-color hardcover and paperback with personalized dedication.',
      variants: [
        {
          id: 'var-star-hc',
          format: 'hardcover' as const,
          title: 'Deluxe Keepsake Hardcover (Case Laminate)',
          sku: 'ST-STAR-HC-01',
          price: 24.95,
          sale_price: 21.95,
          pod_product_code: 'GLOBAL-CAN-8X8-HC',
          print_file_url: 'https://storage.googleapis.com/starlight-books-pod/print-files/falling-star-hardcover-cmyk-300dpi.pdf',
          weight_grams: 420,
          in_stock: 1
        },
        {
          id: 'var-star-pb',
          format: 'paperback' as const,
          title: 'Everyday Storybook Paperback',
          sku: 'ST-STAR-PB-01',
          price: 14.95,
          sale_price: null,
          pod_product_code: 'GLOBAL-CAN-8X8-PB',
          print_file_url: 'https://storage.googleapis.com/starlight-books-pod/print-files/falling-star-paperback-cmyk-300dpi.pdf',
          weight_grams: 220,
          in_stock: 1
        }
      ]
    },
    {
      id: 'book-secret-forest',
      slug: 'the-secret-forest-of-whispering-owls',
      title: 'The Secret Forest of Whispering Owls',
      subtitle: 'Where ancient branches hold the keys to forgotten mysteries',
      author: 'Rowan K. Merrick',
      illustrator: 'Clara S. Vane',
      description: 'Hidden deep within the silver-misted woods of Fernbarrow lies a grove where wise owls wear golden spectacles and catalog the world’s happiest dreams. When young Maeve loses her favorite compass, she is guided by Professor Barnaby Hoot into the hollow of the Great Oak. Together, they decode whimsical riddles and discover the value of courage, curiosity, and reading.',
      excerpt: 'The library branches swayed, and millions of glowing leaves whispered in chorus: every riddle has an answer if you listen closely.',
      age_range: '5–8 years',
      category: 'Magical Journeys',
      page_count: 36,
      trim_size: '8.5 x 11 in (216 x 280 mm)',
      cover_finish: 'Velvet Soft-Touch Hardcover or Satin Silk Paperback',
      cover_image: bookCovers.secretForest,
      gallery_images: JSON.stringify([bookCovers.secretForest, bookCovers.insideSpreadPage1, bookCovers.insideDedicationSpread]),
      featured: 1,
      bestseller: 1,
      rating: 5.0,
      review_count: 94,
      seo_title: 'The Secret Forest of Whispering Owls | Hardcover Children\'s Book',
      seo_description: 'A magical woodland adventure for curious minds aged 5-8. Premium printed picture book with rich illustrations and personalized opening dedication.',
      variants: [
        {
          id: 'var-forest-hc',
          format: 'hardcover' as const,
          title: 'Deluxe Keepsake Hardcover (Case Laminate)',
          sku: 'ST-FOREST-HC-01',
          price: 25.95,
          sale_price: null,
          pod_product_code: 'GLOBAL-CAN-8.5X11-HC',
          print_file_url: 'https://storage.googleapis.com/starlight-books-pod/print-files/secret-forest-hardcover-cmyk-300dpi.pdf',
          weight_grams: 480,
          in_stock: 1
        },
        {
          id: 'var-forest-pb',
          format: 'paperback' as const,
          title: 'Everyday Storybook Paperback',
          sku: 'ST-FOREST-PB-01',
          price: 15.95,
          sale_price: 13.95,
          pod_product_code: 'GLOBAL-CAN-8.5X11-PB',
          print_file_url: 'https://storage.googleapis.com/starlight-books-pod/print-files/secret-forest-paperback-cmyk-300dpi.pdf',
          weight_grams: 260,
          in_stock: 1
        }
      ]
    },
    {
      id: 'book-barnaby-bear',
      slug: 'barnaby-bear-and-the-moonlit-ocean',
      title: 'Barnaby Bear and the Moonlit Ocean',
      subtitle: 'A tender sea-voyage tale about brave little explorers',
      author: 'Maisie Callaghan',
      illustrator: 'Finnian O\'Shea',
      description: 'Barnaby is a gentle, inquisitive bear who has always wondered where the moon goes when it dips into the ocean at sunrise. Packing a thermos of warm blackberry tea and his hand-carved rowboat, Barnaby sets sail across a sea of bioluminescent ripples. Along the way, he befriends a cheerful pod of dolphins, a sleepy whale with a lullaby in her heart, and learns that home is always waiting at the end of the brightest beam of light.',
      excerpt: 'The water glowed like melted sapphires beneath his oars, lighting the path forward with quiet confidence.',
      age_range: '2–5 years',
      category: 'Animal Adventures',
      page_count: 28,
      trim_size: '8 x 8 in (203 x 203 mm)',
      cover_finish: 'Lustre Hardcover or Thick Glossy Paperback',
      cover_image: bookCovers.barnabyBear,
      gallery_images: JSON.stringify([bookCovers.barnabyBear, bookCovers.insideSpreadPage1, bookCovers.insideDedicationSpread]),
      featured: 1,
      bestseller: 0,
      rating: 4.8,
      review_count: 86,
      seo_title: 'Barnaby Bear and the Moonlit Ocean | Children\'s Storybook',
      seo_description: 'Follow Barnaby Bear on a soothing moonlit journey across glowing seas. Printed on eco-certified heavyweight paper for toddlers and young readers.',
      variants: [
        {
          id: 'var-bear-hc',
          format: 'hardcover' as const,
          title: 'Deluxe Keepsake Hardcover (Case Laminate)',
          sku: 'ST-BEAR-HC-01',
          price: 23.95,
          sale_price: 19.95,
          pod_product_code: 'GLOBAL-CAN-8X8-HC',
          print_file_url: 'https://storage.googleapis.com/starlight-books-pod/print-files/barnaby-bear-hardcover-cmyk-300dpi.pdf',
          weight_grams: 400,
          in_stock: 1
        },
        {
          id: 'var-bear-pb',
          format: 'paperback' as const,
          title: 'Everyday Storybook Paperback',
          sku: 'ST-BEAR-PB-01',
          price: 13.95,
          sale_price: null,
          pod_product_code: 'GLOBAL-CAN-8X8-PB',
          print_file_url: 'https://storage.googleapis.com/starlight-books-pod/print-files/barnaby-bear-paperback-cmyk-300dpi.pdf',
          weight_grams: 210,
          in_stock: 1
        }
      ]
    },
    {
      id: 'book-clockwork-dragon',
      slug: 'the-clockwork-dragon-of-clocktower-hill',
      title: 'The Clockwork Dragon of Clocktower Hill',
      subtitle: 'A story of clever gears, grand inventions and true friendship',
      author: 'Theodore Finch',
      illustrator: 'Beatrice Sterling',
      description: 'High above the bustling cobblestone village of Tick-Tock Hollow lives Cog, a tiny brass dragon whose heart ticks in perfect rhythm with the town clock. When the great grandfather chime falls silent right before the Annual Harvest Solstice, the villagers fear the festival is ruined. But Cog and a spunky apprentice clockmaker named Tilly show the town that every small gear matters.',
      excerpt: 'A tiny whir, a joyful click, and Cog flapped his copper wings as the giant hands struck twelve in celebration!',
      age_range: '6–10 years',
      category: 'Fairy Tales',
      page_count: 40,
      trim_size: '8.5 x 11 in (216 x 280 mm)',
      cover_finish: 'Linen Texture Hardcover or Heavy Silk Paperback',
      cover_image: bookCovers.clockworkDragon,
      gallery_images: JSON.stringify([bookCovers.clockworkDragon, bookCovers.insideSpreadPage1, bookCovers.insideDedicationSpread]),
      featured: 0,
      bestseller: 1,
      rating: 4.9,
      review_count: 67,
      seo_title: 'The Clockwork Dragon of Clocktower Hill | Printed Children\'s Book',
      seo_description: 'An imaginative steampunk fairy tale for children 6-10. Complete with full-page watercolor and ink illustrations and custom personalized dedication leaf.',
      variants: [
        {
          id: 'var-dragon-hc',
          format: 'hardcover' as const,
          title: 'Deluxe Keepsake Hardcover (Case Laminate)',
          sku: 'ST-DRAGON-HC-01',
          price: 26.95,
          sale_price: null,
          pod_product_code: 'GLOBAL-CAN-8.5X11-HC',
          print_file_url: 'https://storage.googleapis.com/starlight-books-pod/print-files/clockwork-dragon-hardcover-cmyk-300dpi.pdf',
          weight_grams: 510,
          in_stock: 1
        },
        {
          id: 'var-dragon-pb',
          format: 'paperback' as const,
          title: 'Everyday Storybook Paperback',
          sku: 'ST-DRAGON-PB-01',
          price: 16.95,
          sale_price: 14.50,
          pod_product_code: 'GLOBAL-CAN-8.5X11-PB',
          print_file_url: 'https://storage.googleapis.com/starlight-books-pod/print-files/clockwork-dragon-paperback-cmyk-300dpi.pdf',
          weight_grams: 270,
          in_stock: 1
        }
      ]
    }
  ];

  const insertBook = db.prepare(`
    INSERT OR REPLACE INTO books (
      id, slug, title, subtitle, author, illustrator, description, excerpt,
      age_range, category, page_count, trim_size, cover_finish, cover_image,
      gallery_images, featured, bestseller, rating, review_count, seo_title,
      seo_description, created_at, updated_at
    ) VALUES (
      @id, @slug, @title, @subtitle, @author, @illustrator, @description, @excerpt,
      @age_range, @category, @page_count, @trim_size, @cover_finish, @cover_image,
      @gallery_images, @featured, @bestseller, @rating, @review_count, @seo_title,
      @seo_description, @created_at, @updated_at
    )
  `);

  const insertVariant = db.prepare(`
    INSERT OR REPLACE INTO variants (
      id, book_id, format, title, sku, price, sale_price,
      pod_product_code, print_file_url, weight_grams, in_stock
    ) VALUES (
      @id, @book_id, @format, @title, @sku, @price, @sale_price,
      @pod_product_code, @print_file_url, @weight_grams, @in_stock
    )
  `);

  const seedTransaction = db.transaction(() => {
    for (const b of sampleBooks) {
      insertBook.run({
        id: b.id,
        slug: b.slug,
        title: b.title,
        subtitle: b.subtitle,
        author: b.author,
        illustrator: b.illustrator,
        description: b.description,
        excerpt: b.excerpt,
        age_range: b.age_range,
        category: b.category,
        page_count: b.page_count,
        trim_size: b.trim_size,
        cover_finish: b.cover_finish,
        cover_image: b.cover_image,
        gallery_images: b.gallery_images,
        featured: b.featured,
        bestseller: b.bestseller,
        rating: b.rating,
        review_count: b.review_count,
        seo_title: b.seo_title,
        seo_description: b.seo_description,
        created_at: now,
        updated_at: now
      });

      for (const v of b.variants) {
        insertVariant.run({
          ...v,
          book_id: b.id
        });
      }
    }

    // Also seed 1 completed sample order so the Admin Dashboard has immediate live metrics & tracking data
    const sampleOrderId = 'ST-2026-9042';
    db.prepare(`
      INSERT OR IGNORE INTO orders (
        id, customer_email, customer_name, customer_phone, subtotal, shipping_cost,
        shipping_method, tax_amount, total_amount, currency, payment_status,
        payment_method, stripe_payment_intent_id, pod_provider, pod_order_id,
        pod_status, pod_retry_count, tracking_number, tracking_url, carrier_name,
        shipping_address_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      sampleOrderId,
      'sarah.connolly@example.ie',
      'Sarah Connolly',
      '+353 87 123 4567',
      41.90,
      4.95,
      'Standard POD Tracked (Royal Mail / An Post)',
      0,
      46.85,
      'EUR',
      'paid',
      'stripe',
      'pi_3P_sample_1001',
      'prodigi',
      'prodigi_ord_774921',
      'in_production',
      0,
      'AP849204918IE',
      'https://www.anpost.com/Post-Parcels/Track/History?item=AP849204918IE',
      'An Post / Prodigi UK Print Lab',
      JSON.stringify({
        recipient_name: 'Sarah Connolly (for Liam Connolly)',
        address_line1: '14 Starlight Meadow',
        address_line2: 'Clontarf',
        city: 'Dublin',
        state_or_county: 'Co. Dublin',
        postal_code: 'D03 F8N2',
        country_code: 'IE'
      }),
      new Date(Date.now() - 3600000 * 26).toISOString(),
      now
    );

    db.prepare(`
      INSERT OR REPLACE INTO order_items (
        id, order_id, book_id, variant_id, book_title, format, sku,
        pod_product_code, unit_price, quantity, total_price, dedication_text,
        print_file_url, cover_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'item-seed-1',
      sampleOrderId,
      'book-falling-star',
      'var-star-hc',
      'The Boy Who Caught a Falling Star',
      'hardcover',
      'ST-STAR-HC-01',
      'GLOBAL-CAN-8X8-HC',
      21.95,
      1,
      21.95,
      'For our brave little Liam on his 4th Birthday. Never stop reaching for the stars! Love Mum & Dad xx',
      'https://storage.googleapis.com/starlight-books-pod/print-files/falling-star-hardcover-cmyk-300dpi.pdf',
      bookCovers.fallingStar
    );

    db.prepare(`
      INSERT OR REPLACE INTO order_items (
        id, order_id, book_id, variant_id, book_title, format, sku,
        pod_product_code, unit_price, quantity, total_price, dedication_text,
        print_file_url, cover_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'item-seed-2',
      sampleOrderId,
      'book-barnaby-bear',
      'var-bear-hc',
      'Barnaby Bear and the Moonlit Ocean',
      'hardcover',
      'ST-BEAR-HC-01',
      'GLOBAL-CAN-8X8-HC',
      19.95,
      1,
      19.95,
      'Sweet dreams on every moonlit sea, little Liam.',
      'https://storage.googleapis.com/starlight-books-pod/print-files/barnaby-bear-hardcover-cmyk-300dpi.pdf',
      bookCovers.barnabyBear
    );

    // Seed tracking events for sample order
    db.prepare(`
      INSERT OR REPLACE INTO tracking_events (id, order_id, status, description, location, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'evt-1',
      sampleOrderId,
      'paid',
      'Order paid and confirmed via Stripe Checkout.',
      'Starlight Tales Cloud',
      new Date(Date.now() - 3600000 * 26).toISOString()
    );

    db.prepare(`
      INSERT OR REPLACE INTO tracking_events (id, order_id, status, description, location, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'evt-2',
      sampleOrderId,
      'sent_to_printer',
      'Print files dispatched to Prodigi automated facility.',
      'Alton Print Facility, UK',
      new Date(Date.now() - 3600000 * 20).toISOString()
    );

    db.prepare(`
      INSERT OR REPLACE INTO tracking_events (id, order_id, status, description, location, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'evt-3',
      sampleOrderId,
      'in_production',
      'Case binding & 170gsm interior spread silk printing underway.',
      'Prodigi Book Bindery',
      new Date(Date.now() - 3600000 * 10).toISOString()
    );
  });

  seedTransaction();
}

/**
 * DB query helper functions
 */
export const dbQueries = {
  // Books
  getAllBooks(): Book[] {
    const rows = db.prepare('SELECT * FROM books ORDER BY featured DESC, created_at DESC').all() as any[];
    return rows.map(r => ({
      ...r,
      featured: Boolean(r.featured),
      bestseller: Boolean(r.bestseller),
      gallery_images: JSON.parse(r.gallery_images || '[]')
    }));
  },

  getBookBySlug(slug: string): Book | null {
    const book = db.prepare('SELECT * FROM books WHERE slug = ?').get(slug) as any;
    if (!book) return null;
    
    const variants = db.prepare('SELECT * FROM variants WHERE book_id = ? ORDER BY price DESC').all(book.id) as any[];
    return {
      ...book,
      featured: Boolean(book.featured),
      bestseller: Boolean(book.bestseller),
      gallery_images: JSON.parse(book.gallery_images || '[]'),
      variants: variants.map(v => ({
        ...v,
        in_stock: Boolean(v.in_stock)
      }))
    };
  },

  getBookById(id: string): Book | null {
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id) as any;
    if (!book) return null;
    
    const variants = db.prepare('SELECT * FROM variants WHERE book_id = ? ORDER BY price DESC').all(book.id) as any[];
    return {
      ...book,
      featured: Boolean(book.featured),
      bestseller: Boolean(book.bestseller),
      gallery_images: JSON.parse(book.gallery_images || '[]'),
      variants: variants.map(v => ({
        ...v,
        in_stock: Boolean(v.in_stock)
      }))
    };
  },

  getVariantById(variantId: string): BookVariant | null {
    const v = db.prepare('SELECT * FROM variants WHERE id = ?').get(variantId) as any;
    if (!v) return null;
    return {
      ...v,
      in_stock: Boolean(v.in_stock)
    };
  },

  createBook(bookData: Partial<Book>, variants: Partial<BookVariant>[]): Book {
    const id = bookData.id || 'book-' + crypto.randomUUID().slice(0, 8);
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO books (
        id, slug, title, subtitle, author, illustrator, description, excerpt,
        age_range, category, page_count, trim_size, cover_finish, cover_image,
        gallery_images, featured, bestseller, rating, review_count, seo_title,
        seo_description, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?
      )
    `).run(
      id,
      bookData.slug || id,
      bookData.title,
      bookData.subtitle || '',
      bookData.author || 'Starlight Author',
      bookData.illustrator || 'Starlight Artist',
      bookData.description || '',
      bookData.excerpt || '',
      bookData.age_range || '3-6 years',
      bookData.category || 'Bedtime Tales',
      bookData.page_count || 32,
      bookData.trim_size || '8 x 8 in',
      bookData.cover_finish || 'Matte Hardcover or Satin Paperback',
      bookData.cover_image || bookCovers.fallingStar,
      JSON.stringify(bookData.gallery_images || [bookCovers.fallingStar]),
      bookData.featured ? 1 : 0,
      bookData.bestseller ? 1 : 0,
      bookData.rating || 5.0,
      bookData.review_count || 0,
      bookData.seo_title || bookData.title,
      bookData.seo_description || bookData.description,
      now,
      now
    );

    for (const v of variants) {
      db.prepare(`
        INSERT INTO variants (
          id, book_id, format, title, sku, price, sale_price,
          pod_product_code, print_file_url, weight_grams, in_stock
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        v.id || 'var-' + crypto.randomUUID().slice(0, 8),
        id,
        v.format || 'hardcover',
        v.title || (v.format === 'hardcover' ? 'Hardcover Case Laminate' : 'Paperback'),
        v.sku || `ST-${id.toUpperCase()}-${(v.format || 'hc').toUpperCase()}`,
        v.price || 19.99,
        v.sale_price || null,
        v.pod_product_code || 'GLOBAL-CAN-8X8-HC',
        v.print_file_url || 'https://storage.googleapis.com/starlight-books-pod/sample.pdf',
        v.weight_grams || 350,
        v.in_stock ? 1 : 1
      );
    }

    return this.getBookById(id)!;
  },

  updateBook(id: string, bookData: Partial<Book>, variants?: Partial<BookVariant>[]): Book | null {
    const existing = this.getBookById(id);
    if (!existing) return null;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE books SET
        title = COALESCE(?, title),
        subtitle = COALESCE(?, subtitle),
        author = COALESCE(?, author),
        illustrator = COALESCE(?, illustrator),
        description = COALESCE(?, description),
        excerpt = COALESCE(?, excerpt),
        age_range = COALESCE(?, age_range),
        category = COALESCE(?, category),
        page_count = COALESCE(?, page_count),
        trim_size = COALESCE(?, trim_size),
        cover_finish = COALESCE(?, cover_finish),
        cover_image = COALESCE(?, cover_image),
        gallery_images = COALESCE(?, gallery_images),
        featured = COALESCE(?, featured),
        bestseller = COALESCE(?, bestseller),
        seo_title = COALESCE(?, seo_title),
        seo_description = COALESCE(?, seo_description),
        updated_at = ?
      WHERE id = ?
    `).run(
      bookData.title,
      bookData.subtitle,
      bookData.author,
      bookData.illustrator,
      bookData.description,
      bookData.excerpt,
      bookData.age_range,
      bookData.category,
      bookData.page_count,
      bookData.trim_size,
      bookData.cover_finish,
      bookData.cover_image,
      bookData.gallery_images ? JSON.stringify(bookData.gallery_images) : null,
      bookData.featured !== undefined ? (bookData.featured ? 1 : 0) : null,
      bookData.bestseller !== undefined ? (bookData.bestseller ? 1 : 0) : null,
      bookData.seo_title,
      bookData.seo_description,
      now,
      id
    );

    if (variants && variants.length > 0) {
      for (const v of variants) {
        if (v.id) {
          db.prepare(`
            UPDATE variants SET
              format = COALESCE(?, format),
              title = COALESCE(?, title),
              sku = COALESCE(?, sku),
              price = COALESCE(?, price),
              sale_price = ?,
              pod_product_code = COALESCE(?, pod_product_code),
              print_file_url = COALESCE(?, print_file_url),
              weight_grams = COALESCE(?, weight_grams),
              in_stock = COALESCE(?, in_stock)
            WHERE id = ?
          `).run(
            v.format,
            v.title,
            v.sku,
            v.price,
            v.sale_price !== undefined ? v.sale_price : null,
            v.pod_product_code,
            v.print_file_url,
            v.weight_grams,
            v.in_stock !== undefined ? (v.in_stock ? 1 : 0) : null,
            v.id
          );
        }
      }
    }

    return this.getBookById(id);
  },

  deleteBook(id: string): boolean {
    const res = db.prepare('DELETE FROM books WHERE id = ?').run(id);
    return res.changes > 0;
  },

  // Orders
  createOrder(order: Omit<Order, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string }): Order {
    const now = new Date().toISOString();
    const orderId = order.id;

    db.prepare(`
      INSERT INTO orders (
        id, customer_email, customer_name, customer_phone, subtotal, shipping_cost,
        shipping_method, tax_amount, total_amount, currency, payment_status,
        payment_method, stripe_payment_intent_id, pod_provider, pod_order_id,
        pod_status, pod_retry_count, pod_last_error, tracking_number, tracking_url,
        carrier_name, shipping_address_json, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?
      )
    `).run(
      orderId,
      order.customer_email,
      order.customer_name,
      order.customer_phone || '',
      order.subtotal,
      order.shipping_cost,
      order.shipping_method,
      order.tax_amount || 0,
      order.total_amount,
      order.currency || 'EUR',
      order.payment_status || 'pending',
      order.payment_method || 'stripe',
      order.stripe_payment_intent_id || '',
      order.pod_provider || 'prodigi',
      order.pod_order_id || null,
      order.pod_status || 'pending_payment',
      order.pod_retry_count || 0,
      order.pod_last_error || null,
      order.tracking_number || null,
      order.tracking_url || null,
      order.carrier_name || null,
      JSON.stringify(order.shipping_address),
      order.created_at || now,
      order.updated_at || now
    );

    if (order.items && order.items.length > 0) {
      const insertItem = db.prepare(`
        INSERT INTO order_items (
          id, order_id, book_id, variant_id, book_title, format, sku,
          pod_product_code, unit_price, quantity, total_price, dedication_text,
          print_file_url, cover_image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const item of order.items) {
        insertItem.run(
          item.id || crypto.randomUUID(),
          orderId,
          item.book_id,
          item.variant_id,
          item.book_title,
          item.format,
          item.sku,
          item.pod_product_code,
          item.unit_price,
          item.quantity,
          item.total_price,
          item.dedication_text || null,
          item.print_file_url,
          item.cover_image || null
        );
      }
    }

    // Add initial tracking event
    this.addTrackingEvent(orderId, order.payment_status === 'paid' ? 'paid' : 'pending_payment', 'Order created.');

    return this.getOrderById(orderId)!;
  },

  getOrderById(id: string): Order | null {
    const o = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as any;
    if (!o) return null;

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(id) as any[];
    const trackingEvents = db.prepare('SELECT * FROM tracking_events WHERE order_id = ? ORDER BY timestamp ASC').all(id) as any[];

    return {
      ...o,
      shipping_address: JSON.parse(o.shipping_address_json || '{}'),
      items,
      tracking_events: trackingEvents
    };
  },

  getOrderByTracking(orderId: string, email: string): Order | null {
    const o = db.prepare('SELECT * FROM orders WHERE LOWER(id) = LOWER(?) AND LOWER(customer_email) = LOWER(?)').get(orderId.trim(), email.trim()) as any;
    if (!o) return null;
    return this.getOrderById(o.id);
  },

  getAllOrders(search?: string, podStatus?: string): Order[] {
    let sql = 'SELECT * FROM orders';
    const params: any[] = [];
    const conditions: string[] = [];

    if (search) {
      conditions.push('(id LIKE ? OR customer_email LIKE ? OR customer_name LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s);
    }
    if (podStatus && podStatus !== 'all') {
      conditions.push('pod_status = ?');
      params.push(podStatus);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC';

    const rows = db.prepare(sql).all(...params) as any[];
    return rows.map(o => ({
      ...o,
      shipping_address: JSON.parse(o.shipping_address_json || '{}')
    }));
  },

  updateOrderStatus(orderId: string, updates: Partial<Order>): boolean {
    const now = new Date().toISOString();
    const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
    if (!existing) return false;

    db.prepare(`
      UPDATE orders SET
        payment_status = COALESCE(?, payment_status),
        pod_status = COALESCE(?, pod_status),
        pod_order_id = COALESCE(?, pod_order_id),
        pod_retry_count = COALESCE(?, pod_retry_count),
        pod_last_error = ?,
        tracking_number = COALESCE(?, tracking_number),
        tracking_url = COALESCE(?, tracking_url),
        carrier_name = COALESCE(?, carrier_name),
        updated_at = ?
      WHERE id = ?
    `).run(
      updates.payment_status,
      updates.pod_status,
      updates.pod_order_id,
      updates.pod_retry_count,
      updates.pod_last_error !== undefined ? updates.pod_last_error : existing.pod_last_error,
      updates.tracking_number,
      updates.tracking_url,
      updates.carrier_name,
      now,
      orderId
    );

    return true;
  },

  addTrackingEvent(orderId: string, status: string, description: string, location?: string): void {
    db.prepare(`
      INSERT INTO tracking_events (id, order_id, status, description, location, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      orderId,
      status,
      description,
      location || '',
      new Date().toISOString()
    );
  },

  // POD logs
  addPODLog(log: Omit<PODLog, 'id' | 'created_at'>): void {
    db.prepare(`
      INSERT INTO pod_logs (id, order_id, provider, action, status, request_payload, response_payload, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      log.order_id,
      log.provider,
      log.action,
      log.status,
      log.request_payload || '',
      log.response_payload || '',
      new Date().toISOString()
    );
  },

  getPODLogs(limit: number = 30): PODLog[] {
    return db.prepare('SELECT * FROM pod_logs ORDER BY created_at DESC LIMIT ?').all(limit) as PODLog[];
  },

  // Admin user auth
  getAdminByEmail(email: string): AdminUser | null {
    return (db.prepare('SELECT * FROM admin_users WHERE LOWER(email) = LOWER(?)').get(email) as AdminUser) || null;
  },

  // Store Settings
  getSettings(): StoreSettings {
    const rows = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[];
    const result: any = {};
    for (const r of rows) {
      try {
        result[r.key] = JSON.parse(r.value);
      } catch {
        if (r.value === 'true') result[r.key] = true;
        else if (r.value === 'false') result[r.key] = false;
        else if (!isNaN(Number(r.value)) && r.key !== 'store_name' && r.key !== 'notice_banner_text') {
          result[r.key] = Number(r.value);
        } else {
          result[r.key] = r.value;
        }
      }
    }
    return result as StoreSettings;
  },

  updateSettings(settings: Partial<StoreSettings>): void {
    const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    for (const [key, val] of Object.entries(settings)) {
      upsert.run(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
    }
  },

  // Dashboard Stats
  getDashboardStats() {
    const totalOrders = (db.prepare('SELECT COUNT(*) as c FROM orders WHERE payment_status = "paid"').get() as any)?.c || 0;
    const totalRevenue = (db.prepare('SELECT SUM(total_amount) as s FROM orders WHERE payment_status = "paid"').get() as any)?.s || 0;
    const inProduction = (db.prepare('SELECT COUNT(*) as c FROM orders WHERE pod_status IN ("sent_to_printer", "in_production")').get() as any)?.c || 0;
    const shippedOrders = (db.prepare('SELECT COUNT(*) as c FROM orders WHERE pod_status IN ("shipped", "delivered")').get() as any)?.c || 0;
    const failedOrders = (db.prepare('SELECT COUNT(*) as c FROM orders WHERE pod_status = "failed"').get() as any)?.c || 0;

    return {
      totalOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      inProduction,
      shippedOrders,
      failedOrders
    };
  }
};
