import pool from "../config/db.js";

// Helper to parse JSON safely
const parseJsonSafe = (val, defaultVal = []) => {
  if (!val) return defaultVal;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return defaultVal;
  }
};

// ==========================================
// GET /api/packages (Get All Packages)
// ==========================================
export const getAllPackages = async (req, res) => {
  try {
    const [packages] = await pool.query(`
      SELECT p.*, COUNT(pc.course_id) AS total_courses
      FROM packages p
      LEFT JOIN package_courses pc ON p.id = pc.package_id
      GROUP BY p.id
      ORDER BY p.id ASC
    `);

    const formatted = packages.map((pkg) => ({
      ...pkg,
      what_you_will_learn: parseJsonSafe(pkg.what_you_will_learn, []),
      faqs: parseJsonSafe(pkg.faqs, []),
    }));

    return res.status(200).json({ success: true, packages: formatted });
  } catch (err) {
    console.error("Get All Packages Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// GET /api/packages/:slugOrId (Get Single Package + Linked Courses)
// ==========================================
export const getPackageBySlugOrId = async (req, res) => {
  try {
    const { slugOrId } = req.params;

    const [packages] = await pool.query(
      `SELECT * FROM packages WHERE slug = ? OR id = ? LIMIT 1`,
      [slugOrId, isNaN(slugOrId) ? -1 : Number(slugOrId)]
    );

    if (!packages || packages.length === 0) {
      return res.status(404).json({ success: false, message: "Package not found." });
    }

    const pkg = packages[0];
    pkg.what_you_will_learn = parseJsonSafe(pkg.what_you_will_learn, []);
    pkg.faqs = parseJsonSafe(pkg.faqs, []);

    // Fetch linked courses
    const [courses] = await pool.query(
      `SELECT c.id, c.title, c.slug, c.mentor_name, c.category, c.languages, c.duration,
              c.thumbnail_url, c.description, c.total_lectures,
              m.photo_url AS mentor_photo
       FROM package_courses pc
       JOIN courses c ON pc.course_id = c.id
       LEFT JOIN mentors m ON c.mentor_id = m.id
       WHERE pc.package_id = ?
       ORDER BY c.id ASC`,
      [pkg.id]
    );

    pkg.courses = (courses || []).map((c) => ({
      ...c,
      image: c.thumbnail_url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
      instructor: c.mentor_name || "KnowWay Instructor",
      duration: `${c.duration || "2 Hours"}, ${c.languages || "English"}`,
    }));

    return res.status(200).json({ success: true, package: pkg });
  } catch (err) {
    console.error("Get Package Detail Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// POST /api/admin/packages (Create New Package)
// ==========================================
export const createPackage = async (req, res) => {
  const {
    name,
    slug,
    tagline,
    image_url,
    mrp_price,
    promo_price,
    mrp_note,
    promo_note,
    total_hours,
    enrolled_students,
    overview_heading,
    overview_desc,
    what_you_will_learn = [],
    faqs = [],
    course_ids = [],
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: "Package name is required." });
  }

  const generatedSlug = (slug || name)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-");

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [pkgRes] = await connection.query(
      `INSERT INTO packages (name, slug, tagline, image_url, mrp_price, promo_price, mrp_note, promo_note, total_hours, enrolled_students, overview_heading, overview_desc, what_you_will_learn, faqs)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        generatedSlug,
        tagline || "",
        image_url || "/images/packages/pro.png",
        mrp_price ? Number(mrp_price) : 11800.0,
        promo_price ? Number(promo_price) : 7999.0,
        mrp_note || "Full access to value-packed courses",
        promo_note || "Launch your career with high-value courses + lifetime access",
        total_hours || "25+ Hours",
        enrolled_students || "45K+ Students Enrolled",
        overview_heading || "Unlock lifetime access, certification, and community support",
        overview_desc || "A complete ecosystem designed for individuals who are serious about building their career",
        JSON.stringify(what_you_will_learn || []),
        JSON.stringify(faqs || []),
      ]
    );

    const packageId = pkgRes.insertId;

    // Link courses
    if (Array.isArray(course_ids) && course_ids.length > 0) {
      for (const courseId of course_ids) {
        await connection.query(
          `INSERT IGNORE INTO package_courses (package_id, course_id) VALUES (?, ?)`,
          [packageId, Number(courseId)]
        );
      }
    }

    await connection.commit();
    return res.status(201).json({
      success: true,
      message: "Package created successfully!",
      packageId,
      slug: generatedSlug,
    });
  } catch (err) {
    await connection.rollback();
    console.error("Create Package Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    connection.release();
  }
};

// ==========================================
// PUT /api/admin/packages/:id (Update Package)
// ==========================================
export const updatePackage = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    slug,
    tagline,
    image_url,
    mrp_price,
    promo_price,
    mrp_note,
    promo_note,
    total_hours,
    enrolled_students,
    overview_heading,
    overview_desc,
    what_you_will_learn = [],
    faqs = [],
    course_ids = [],
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: "Package name is required." });
  }

  const generatedSlug = (slug || name)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-");

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    let targetId = !isNaN(id) && Number(id) > 0 ? Number(id) : null;
    if (!targetId) {
      const [existing] = await connection.query(`SELECT id FROM packages WHERE slug = ? LIMIT 1`, [id]);
      if (!existing || existing.length === 0) {
        await connection.rollback();
        return res.status(404).json({ success: false, message: "Package not found." });
      }
      targetId = existing[0].id;
    }

    await connection.query(
      `UPDATE packages 
       SET name = ?, slug = ?, tagline = ?, image_url = ?, mrp_price = ?, promo_price = ?, 
           mrp_note = ?, promo_note = ?, total_hours = ?, enrolled_students = ?, 
           overview_heading = ?, overview_desc = ?, what_you_will_learn = ?, faqs = ?
       WHERE id = ?`,
      [
        name.trim(),
        generatedSlug,
        tagline || "",
        image_url || "/images/packages/pro.png",
        mrp_price ? Number(mrp_price) : 11800.0,
        promo_price ? Number(promo_price) : 7999.0,
        mrp_note || "Full access to value-packed courses",
        promo_note || "Launch your career with high-value courses + lifetime access",
        total_hours || "25+ Hours",
        enrolled_students || "45K+ Students Enrolled",
        overview_heading || "Unlock lifetime access, certification, and community support",
        overview_desc || "A complete ecosystem designed for individuals who are serious about building their career",
        JSON.stringify(what_you_will_learn || []),
        JSON.stringify(faqs || []),
        targetId,
      ]
    );

    // Sync linked courses: delete existing and insert new
    await connection.query(`DELETE FROM package_courses WHERE package_id = ?`, [targetId]);

    if (Array.isArray(course_ids) && course_ids.length > 0) {
      for (const courseId of course_ids) {
        await connection.query(
          `INSERT IGNORE INTO package_courses (package_id, course_id) VALUES (?, ?)`,
          [targetId, Number(courseId)]
        );
      }
    }

    await connection.commit();
    return res.status(200).json({
      success: true,
      message: "Package updated successfully!",
      packageId: targetId,
      slug: generatedSlug,
    });
  } catch (err) {
    await connection.rollback();
    console.error("Update Package Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    connection.release();
  }
};

// ==========================================
// DELETE /api/admin/packages/:id (Delete Package)
// ==========================================
export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    let targetId = !isNaN(id) && Number(id) > 0 ? Number(id) : null;
    if (!targetId) {
      const [existing] = await pool.query(`SELECT id FROM packages WHERE slug = ? LIMIT 1`, [id]);
      if (existing && existing.length > 0) {
        targetId = existing[0].id;
      }
    }
    if (targetId) {
      await pool.query(`DELETE FROM packages WHERE id = ?`, [targetId]);
    }
    return res.status(200).json({ success: true, message: "Package deleted successfully!" });
  } catch (err) {
    console.error("Delete Package Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
