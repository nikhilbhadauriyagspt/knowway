import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "knowway_db";
const DB_PORT = Number(process.env.DB_PORT) || 3306;

// Create connection pool
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to automatically create DB & tables if they don't exist
export const initDB = async () => {
  try {
    // 1. Connect to MySQL Server (without selecting database first)
    const serverConnection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      port: DB_PORT,
    });

    // 2. Auto-create database if not exists
    await serverConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await serverConnection.end();

    // 3. Connect via pool and auto-create tables
    const connection = await pool.getConnection();
    console.log(`✅ MySQL Connected Successfully: Database '${DB_NAME}' is ready!`);

    // Users table
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        phone VARCHAR(20) DEFAULT NULL,
        email VARCHAR(120) NOT NULL UNIQUE,
        address TEXT DEFAULT NULL,
        password VARCHAR(255) NOT NULL,
        referral_code VARCHAR(50) DEFAULT NULL,
        avatar_url VARCHAR(500) DEFAULT NULL,
        is_verified BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createUsersTableQuery);

    // Safe schema alterations for existing DBs
    try { await connection.query("ALTER TABLE users MODIFY COLUMN address TEXT DEFAULT NULL;"); } catch (_) {}
    try { await connection.query("ALTER TABLE users MODIFY COLUMN phone VARCHAR(20) DEFAULT NULL;"); } catch (_) {}
    try { await connection.query("ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500) DEFAULT NULL;"); } catch (_) {}
    try { await connection.query("ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT TRUE;"); } catch (_) {}

    // Email OTPs table for Signup and Forgot Password verification
    const createOtpsTableQuery = `
      CREATE TABLE IF NOT EXISTS email_otps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(120) NOT NULL,
        otp VARCHAR(10) NOT NULL,
        type VARCHAR(50) DEFAULT 'signup',
        is_verified BOOLEAN DEFAULT FALSE,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (email, type, is_verified)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createOtpsTableQuery);

    // Admins table for Super Admin
    const createAdminsTableQuery = `
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(120) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'superadmin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createAdminsTableQuery);

    // Platform Settings table (For Cloudinary, SMTP & platform configs)
    const createSettingsTableQuery = `
      CREATE TABLE IF NOT EXISTS system_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createSettingsTableQuery);

    // Mentors table
    const createMentorsTableQuery = `
      CREATE TABLE IF NOT EXISTS mentors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        role_title VARCHAR(150) NOT NULL,
        photo_url VARCHAR(500) DEFAULT NULL,
        bio TEXT DEFAULT NULL,
        experience_badge VARCHAR(100) DEFAULT NULL,
        expertise VARCHAR(255) DEFAULT NULL,
        social_linkedin VARCHAR(255) DEFAULT NULL,
        social_instagram VARCHAR(255) DEFAULT NULL,
        social_youtube VARCHAR(255) DEFAULT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createMentorsTableQuery);

    // Courses table (Linked with mentor_id)
    const createCoursesTableQuery = `
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        mentor_id INT DEFAULT NULL,
        mentor_name VARCHAR(150) DEFAULT NULL,
        category VARCHAR(100) NOT NULL,
        languages VARCHAR(255) NOT NULL,
        duration VARCHAR(50) DEFAULT '0 Hours',
        regular_price DECIMAL(10,2) DEFAULT 2999.00,
        promo_price DECIMAL(10,2) DEFAULT 499.00,
        promo_code VARCHAR(50) DEFAULT 'KNOWWAY50',
        thumbnail_url VARCHAR(500) DEFAULT NULL,
        description TEXT DEFAULT NULL,
        what_you_will_learn JSON DEFAULT NULL,
        software_required TEXT DEFAULT NULL,
        total_lectures INT DEFAULT 0,
        certificate_enabled BOOLEAN DEFAULT TRUE,
        is_published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createCoursesTableQuery);

    // Safe alterations for courses table
    try { await connection.query("ALTER TABLE courses ADD COLUMN regular_price DECIMAL(10,2) DEFAULT 2999.00;"); } catch (_) {}
    try { await connection.query("ALTER TABLE courses ADD COLUMN promo_price DECIMAL(10,2) DEFAULT 499.00;"); } catch (_) {}
    try { await connection.query("ALTER TABLE courses ADD COLUMN promo_code VARCHAR(50) DEFAULT 'KNOWWAY50';"); } catch (_) {}

    // Course Lectures table (Parts/Videos of course)
    const createLecturesTableQuery = `
      CREATE TABLE IF NOT EXISTS course_lectures (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT NOT NULL,
        section_name VARCHAR(150) DEFAULT 'Introduction',
        lecture_order INT DEFAULT 1,
        title VARCHAR(255) NOT NULL,
        duration VARCHAR(50) DEFAULT '5m',
        video_url VARCHAR(500) NOT NULL,
        is_free_preview BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createLecturesTableQuery);

    // Course Quizzes table (Assessment questions for certification)
    const createQuizzesTableQuery = `
      CREATE TABLE IF NOT EXISTS course_quizzes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT NOT NULL,
        question TEXT NOT NULL,
        option_a VARCHAR(255) NOT NULL,
        option_b VARCHAR(255) NOT NULL,
        option_c VARCHAR(255) NOT NULL,
        option_d VARCHAR(255) NOT NULL,
        correct_option CHAR(1) NOT NULL,
        explanation TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createQuizzesTableQuery);

    // Student Certificates table (Saved accredited certifications)
    const createCertificatesTableQuery = `
      CREATE TABLE IF NOT EXISTS student_certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        certificate_no VARCHAR(100) NOT NULL UNIQUE,
        student_name VARCHAR(150) NOT NULL,
        course_title VARCHAR(255) NOT NULL,
        score INT NOT NULL DEFAULT 100,
        total_questions INT NOT NULL DEFAULT 5,
        issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createCertificatesTableQuery);

    console.log("✅ MySQL Schema Ready: [users, admins, system_settings, mentors, courses, course_lectures, course_quizzes, student_certificates]");

    // Seed default Super Admin account if not present
    const [existingAdmins] = await connection.query("SELECT id FROM admins WHERE email = ? LIMIT 1", [
      "admin@knowway.com",
    ]);

    if (!existingAdmins || existingAdmins.length === 0) {
      const defaultPasswordHash = await bcrypt.hash("Admin@123", 10);
      await connection.query(
        "INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)",
        ["Super Admin", "admin@knowway.com", defaultPasswordHash, "superadmin"]
      );
      console.log("👑 Default Super Admin seeded: admin@knowway.com / Admin@123");
    }

    // Seed initial demo mentors if empty
    const [existingMentors] = await connection.query("SELECT id FROM mentors LIMIT 1");
    if (!existingMentors || existingMentors.length === 0) {
      await connection.query(`
        INSERT INTO mentors (name, role_title, photo_url, bio, experience_badge, expertise) VALUES 
        ('Yaswanth Sai Palaghat', 'Meta & Performance Ads Lead', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop', 'Hands-on performance marketer scaling campaigns across Meta, Google & TikTok ads.', '6+ Yrs Exp', 'Meta Ads, Google Ads, Tracking'),
        ('Rohan Verma', 'Full-Stack & AI Tech Lead', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', 'Senior software architect demystifying modern web development & AI prompts.', '8+ Yrs Exp', 'Fullstack, AI Tools, Prompt Engineering'),
        ('Priya Malhotra', 'Lead Video Editor & Designer', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop', 'Content creator with 500k+ reach across YouTube Shorts and Instagram Reels.', '5+ Yrs Exp', 'Premiere Pro, CapCut, Canva')
      `);
      console.log("🌱 Default Mentors seeded.");
    }

    // Seed initial demo courses if empty
    const [existingCourses] = await connection.query("SELECT id FROM courses LIMIT 1");
    if (!existingCourses || existingCourses.length === 0) {
      // Get mentor id
      const [mentorRows] = await connection.query("SELECT id, name FROM mentors LIMIT 3");
      const m1Id = mentorRows[0]?.id || null;
      const m1Name = mentorRows[0]?.name || "Yaswanth Sai Palaghat";
      const m2Id = mentorRows[1]?.id || null;
      const m2Name = mentorRows[1]?.name || "Rohan Verma";
      const m3Id = mentorRows[2]?.id || null;
      const m3Name = mentorRows[2]?.name || "Priya Malhotra";

      // Course 1: Meta Ads
      const [c1Result] = await connection.query(
        `INSERT INTO courses (title, slug, mentor_id, mentor_name, category, languages, duration, thumbnail_url, description, what_you_will_learn, software_required, total_lectures) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Meta Ads (Telugu)",
          "meta-ads-telugu",
          m1Id,
          m1Name,
          "Meta Ads",
          "Telugu",
          "1.53 Hours",
          "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop",
          "Learn Meta Ads practically with campaign setup, audience targeting, creatives, Pixel tracking, retargeting, A/B testing, and optimization.",
          JSON.stringify([
            "Meta Business Manager and Ads Manager structure",
            "Campaign, ad set, and ad-level setup",
            "Core, custom, and lookalike audience targeting",
            "Creative setup, ad copy, and mobile preview",
            "Meta Pixel installation and event tracking",
          ]),
          "Facebook Account, Ads Manager Access, Stable Internet Connection",
          7,
        ]
      );

      const c1Id = c1Result.insertId;
      await connection.query(
        `INSERT INTO course_lectures (course_id, section_name, lecture_order, title, duration, video_url, is_free_preview) VALUES
        (?, 'Introduction', 1, 'Introduction to Meta Ads', '1m', 'https://res.cloudinary.com/demo/video/upload/sample.mp4', TRUE),
        (?, 'Introduction', 2, 'Mindset & Structure of Business Manager', '8m', '', TRUE),
        (?, 'Introduction', 3, 'Audience Targeting & Strategy', '7m', '', FALSE),
        (?, 'Campaign Execution', 4, 'Creating Meta Ads Campaign Step-by-Step', '27m', '', FALSE),
        (?, 'Campaign Execution', 5, 'Meta Pixel Integration & Retargeting Campaigns', '19m', '', FALSE),
        (?, 'Optimization & Scaling', 6, 'Meta Ads Targeting & AB Testing', '19m', '', FALSE),
        (?, 'Optimization & Scaling', 7, 'Reporting, Freelancing & Final RoadMap', '11m', '', FALSE)`,
        [c1Id, c1Id, c1Id, c1Id, c1Id, c1Id, c1Id]
      );

      // Course 2: Freelance Course (English)
      const [c2Result] = await connection.query(
        `INSERT INTO courses (title, slug, mentor_id, mentor_name, category, languages, duration, thumbnail_url, description, what_you_will_learn, software_required, total_lectures) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Freelance Course (English)",
          "freelance-course-english",
          m2Id,
          m2Name,
          "Freelancing",
          "English",
          "6.66 Hours",
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
          "Master freelancing with proven strategies for client acquisition, portfolio building, pricing, sales calls, proposal writing, and business growth.",
          JSON.stringify([
            "Freelance portfolio creation & positioning",
            "Cold outreach & client closing scripts",
            "Pricing strategies & retainer contracts",
          ]),
          "Laptop or PC, Google Docs / Notion, Internet Connection",
          6,
        ]
      );
      const c2Id = c2Result.insertId;
      await connection.query(
        `INSERT INTO course_lectures (course_id, section_name, lecture_order, title, duration, video_url, is_free_preview) VALUES
        (?, 'Foundations', 1, 'Freelancing Mindset & Positioning', '12m', 'https://res.cloudinary.com/demo/video/upload/sample.mp4', TRUE),
        (?, 'Foundations', 2, 'Portfolio Building without Past Clients', '25m', '', FALSE),
        (?, 'Client Acquisition', 3, 'Inbound vs Outbound Prospecting', '30m', '', FALSE),
        (?, 'Client Acquisition', 4, 'Sales Calls & Closing Frameworks', '45m', '', FALSE),
        (?, 'Scale & Systems', 5, 'Pricing, Invoicing & Contracts', '20m', '', FALSE),
        (?, 'Scale & Systems', 6, 'Scaling to $5,000/month Retainers', '35m', '', FALSE)`,
        [c2Id, c2Id, c2Id, c2Id, c2Id, c2Id]
      );

      // Course 3: Adobe Premiere Pro Course (Tamil)
      const [c3Result] = await connection.query(
        `INSERT INTO courses (title, slug, mentor_id, mentor_name, category, languages, duration, thumbnail_url, description, what_you_will_learn, software_required, total_lectures) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Adobe Premiere Pro Course (Tamil)",
          "adobe-premiere-pro-tamil",
          m3Id,
          m3Name,
          "Video Editing",
          "Tamil",
          "8 Hours",
          "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop",
          "Master Adobe Premiere Pro with hands-on training in video editing, color grading, motion graphics, audio editing, and professional export workflows.",
          JSON.stringify([
            "Premiere Pro timeline & cutting techniques",
            "Keyframes, speed ramps & sound design",
            "LUTs, Lumetri color grading & export presets",
          ]),
          "Adobe Premiere Pro CC, Laptop with minimum 8GB RAM",
          5,
        ]
      );
      const c3Id = c3Result.insertId;
      await connection.query(
        `INSERT INTO course_lectures (course_id, section_name, lecture_order, title, duration, video_url, is_free_preview) VALUES
        (?, 'Getting Started', 1, 'Premiere Pro Interface & Workspace Setup', '15m', 'https://res.cloudinary.com/demo/video/upload/sample.mp4', TRUE),
        (?, 'Getting Started', 2, 'Cuts, Transitions & Rough Cut Assembly', '35m', '', FALSE),
        (?, 'Motion & Effects', 3, 'Keyframing & Seamless Transitions', '40m', '', FALSE),
        (?, 'Audio & Color', 4, 'Audio Cleaning & Sound Effects Layering', '30m', '', FALSE),
        (?, 'Audio & Color', 5, 'Color Correction & Lumetri Grading', '45m', '', FALSE)`,
        [c3Id, c3Id, c3Id, c3Id, c3Id]
      );

      // Course 4: Google Ads (Telugu)
      const [c4Result] = await connection.query(
        `INSERT INTO courses (title, slug, mentor_id, mentor_name, category, languages, duration, thumbnail_url, description, what_you_will_learn, software_required, total_lectures) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Google Ads (Telugu)",
          "google-ads-telugu",
          m1Id,
          m1Name,
          "Google Ads",
          "Telugu",
          "2.23 Hours",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
          "Learn Google Ads practically with campaign setup, keyword research, ad copywriting, conversion tracking, GA4, GTM, retargeting, and reporting.",
          JSON.stringify([
            "Google Search, Display & Performance Max campaigns",
            "Negative keywords & Quality Score mastery",
            "Google Tag Manager & GA4 conversion tracking",
          ]),
          "Google Ads Account, Browser, Internet Connection",
          4,
        ]
      );
      const c4Id = c4Result.insertId;
      await connection.query(
        `INSERT INTO course_lectures (course_id, section_name, lecture_order, title, duration, video_url, is_free_preview) VALUES
        (?, 'Fundamentals', 1, 'Google Ads Architecture & Search Auction', '10m', 'https://res.cloudinary.com/demo/video/upload/sample.mp4', TRUE),
        (?, 'Fundamentals', 2, 'Keyword Research with Planner', '25m', '', FALSE),
        (?, 'Execution', 3, 'Creating Search Campaigns & Extensions', '35m', '', FALSE),
        (?, 'Execution', 4, 'Conversion Tracking with GTM & GA4', '30m', '', FALSE)`,
        [c4Id, c4Id, c4Id, c4Id]
      );

      console.log("🌱 Default Courses & Lectures seeded into MySQL database.");
    }

    // Seed initial course quizzes if table is empty
    const [existingQuizzes] = await connection.query("SELECT id FROM course_quizzes LIMIT 1");
    if (!existingQuizzes || existingQuizzes.length === 0) {
      const [allCourses] = await connection.query("SELECT id, title, category FROM courses");
      for (const course of allCourses) {
        let sampleQuestions = [];
        const cat = (course.category || "").toLowerCase();

        if (cat.includes("meta") || cat.includes("ads") || cat.includes("marketing")) {
          sampleQuestions = [
            {
              q: "What is the primary function of Meta Pixel in advertising?",
              a: "To track user behavior & conversions on websites",
              b: "To increase organic Instagram followers",
              c: "To create video thumbnails automatically",
              d: "To edit image resolution",
              correct: "A",
              exp: "Meta Pixel tracks visitor actions on your site to optimize and measure ad performance.",
            },
            {
              q: "Which audience type uses your existing customer list to find similar prospects?",
              a: "Saved Audience",
              b: "Lookalike Audience",
              c: "Broad Audience",
              d: "Organic Audience",
              correct: "B",
              exp: "Lookalike audiences identify users with similar characteristics to your current buyers.",
            },
            {
              q: "What is A/B Testing (Split Testing) in Meta Ads?",
              a: "Comparing two ad variations to find the top performer",
              b: "Running ads only on weekends",
              c: "Translating ad text into two languages",
              d: "Billing with two credit cards",
              correct: "A",
              exp: "A/B testing evaluates creatives, headlines, or audiences to maximize ROI.",
            },
            {
              q: "At which level in Ads Manager do you configure budget and audience targeting?",
              a: "Campaign Level",
              b: "Ad Set Level",
              c: "Ad Creative Level",
              d: "Account Settings",
              correct: "B",
              exp: "Budgets, schedules, and audience demographics are defined at the Ad Set level.",
            },
            {
              q: "What is CTR (Click-Through Rate)?",
              a: "Cost per thousand impressions",
              b: "Percentage of people who clicked your ad after seeing it",
              c: "Conversion rate per sale",
              d: "Total views of a video",
              correct: "B",
              exp: "CTR measures ad engagement and audience relevance.",
            },
          ];
        } else if (cat.includes("video") || cat.includes("editing") || cat.includes("premiere")) {
          sampleQuestions = [
            {
              q: "What is the default shortcut key for the Razor (Cut) tool in Premiere Pro?",
              a: "V",
              b: "C",
              c: "B",
              d: "R",
              correct: "B",
              exp: "The 'C' key activates the Razor Tool in Adobe Premiere Pro.",
            },
            {
              q: "What panel in Premiere Pro is primarily used for Color Grading?",
              a: "Lumetri Color",
              b: "Essential Sound",
              c: "Effects Controls",
              d: "History Panel",
              correct: "A",
              exp: "Lumetri Color provides curves, wheels, and LUT controls for cinematic coloring.",
            },
            {
              q: "What is the industry standard frame rate for cinematic video content?",
              a: "60 FPS",
              b: "24 FPS",
              c: "120 FPS",
              d: "15 FPS",
              correct: "B",
              exp: "24 FPS (or 23.976) gives traditional cinematic motion blur.",
            },
            {
              q: "What tool is used to smoothly adjust audio gain and eliminate background noise?",
              a: "Essential Sound Panel / DeNoise",
              b: "Morph Cut",
              c: "Warp Stabilizer",
              d: "Rolling Edit",
              correct: "A",
              exp: "The Essential Sound panel features automated noise reduction and clarity tools.",
            },
            {
              q: "What format/codec is most widely recommended for YouTube & web uploads?",
              a: "AVI Uncompressed",
              b: "H.264 / MP4",
              c: "ProRes 4444 XQ",
              d: "GIF Animation",
              correct: "B",
              exp: "H.264 MP4 offers the ideal balance of high visual quality and compact file size.",
            },
          ];
        } else if (cat.includes("ai") || cat.includes("prompt")) {
          sampleQuestions = [
            {
              q: "What is 'Few-Shot Prompting' in AI models?",
              a: "Providing a few examples in the prompt to guide output style",
              b: "Writing short 5-word prompts only",
              c: "Prompting the AI only 3 times per day",
              d: "Asking the model to take screenshots",
              correct: "A",
              exp: "Few-shot prompting provides input-output examples to establish desired structure.",
            },
            {
              q: "What parameter controls creativity and randomness in Large Language Models?",
              a: "Context Window",
              b: "Temperature",
              c: "Token Rate",
              d: "Batch Size",
              correct: "B",
              exp: "Higher temperature increases randomness while lower values produce deterministic output.",
            },
            {
              q: "What is the best way to prevent AI hallucinations in critical factual tasks?",
              a: "Ask AI to roleplay as a fictional character",
              b: "Provide source context documents and instruct AI to cite strictly from them",
              c: "Set temperature to maximum 1.0",
              d: "Remove all constraints from prompt",
              correct: "B",
              exp: "Grounded context and Retrieval-Augmented Generation (RAG) anchor AI responses.",
            },
            {
              q: "What is a 'System Prompt' in modern conversational AI?",
              a: "The final answer generated by the model",
              b: "High-level instructions that define persona, rules, and boundaries",
              c: "The user's first search query",
              d: "The GPU cooling status",
              correct: "B",
              exp: "System prompts define permanent behavior, output formats, and safety rules.",
            },
            {
              q: "Which technique breaks complex problems into step-by-step reasoning?",
              a: "Chain of Thought (CoT) Prompting",
              b: "Zero-Shot Prompting",
              c: "Negative Prompting",
              d: "Greedy Decoding",
              correct: "A",
              exp: "Chain of Thought prompting instructs LLMs to show intermediate reasoning steps.",
            },
          ];
        } else {
          // Freelancing / General Career track
          sampleQuestions = [
            {
              q: "What is the most effective approach for cold outreach to potential freelance clients?",
              a: "Sending 100 copy-pasted generic templates daily",
              b: "Personalized video/audit showing a specific problem and your proposed solution",
              c: "Asking for advance payment in the very first message",
              d: "Claiming 20 years experience without proof",
              correct: "B",
              exp: "Personalized value-first audits build instant credibility and high reply rates.",
            },
            {
              q: "Why are Monthly Retainer contracts preferred over one-off gig projects?",
              a: "They provide predictable recurring revenue and higher client lifetime value",
              b: "They require zero communication",
              c: "They eliminate client invoices completely",
              d: "They allow unlimited revisions without payment",
              correct: "A",
              exp: "Retainers stabilize income and let freelancers act as long-term strategic partners.",
            },
            {
              q: "What is 'Value-Based Pricing' in freelancing?",
              a: "Charging strictly by the hour using a stopwatch",
              b: "Pricing based on the financial outcome/revenue generated for the client",
              c: "Offering the cheapest price on the marketplace",
              d: "Working for free in exchange for reviews only",
              correct: "B",
              exp: "Value pricing ties fees to business impact rather than time spent.",
            },
            {
              q: "What should every freelance proposal always include?",
              a: "Personal life story and vacation plans",
              b: "Project scope, deliverables, timeline, milestones, and payment terms",
              c: "Competitor passwords",
              d: "Source code of third party tools",
              correct: "B",
              exp: "Clear deliverables, scope, and milestone terms prevent scope creep.",
            },
            {
              q: "What is the best way to collect high-converting client testimonials?",
              a: "Ask for feedback right after delivering great results with guided questions",
              b: "Write fictional reviews yourself",
              c: "Wait 2 years before following up",
              d: "Send a 50-page survey form",
              correct: "A",
              exp: "Prompt, guided testimonial requests capture authentic metrics and enthusiasm.",
            },
          ];
        }

        for (const item of sampleQuestions) {
          await connection.query(
            `INSERT INTO course_quizzes (course_id, question, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [course.id, item.q, item.a, item.b, item.c, item.d, item.correct, item.exp]
          );
        }
      }
      console.log("📝 Comprehensive Quiz Questions seeded for all courses.");
    }

    // Seed Cloudinary Settings from environment
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "zy5uodka";
    const apiKey = process.env.CLOUDINARY_API_KEY || "692581658823166";
    const apiSecret = process.env.CLOUDINARY_API_SECRET || "LJL54yu4WaQr9PU2h_pdDwJXWv0";

    await connection.query(`
      INSERT INTO system_settings (setting_key, setting_value) VALUES 
      ('cloudinary_cloud_name', ?),
      ('cloudinary_api_key', ?),
      ('cloudinary_api_secret', ?)
      ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);
    `, [cloudName, apiKey, apiSecret]);
    console.log("☁️ Cloudinary credentials initialized in database.");

    // Seed default SMTP / Nodemailer Settings
    await connection.query(`
      INSERT IGNORE INTO system_settings (setting_key, setting_value) VALUES 
      ('smtp_host', ''),
      ('smtp_port', '587'),
      ('smtp_user', ''),
      ('smtp_pass', ''),
      ('smtp_from_name', 'KnowWay LearnSpace'),
      ('smtp_from_email', ''),
      ('smtp_is_active', 'false');
    `);
    console.log("✉️ SMTP / Mailer system settings initialized.");

    connection.release();
  } catch (err) {
    console.warn("⚠️ MySQL Schema Notice:", err.message);
  }
};

export default pool;
