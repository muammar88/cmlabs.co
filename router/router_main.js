const express = require("express");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const controllers = require("../modules/main/controllers/index");

// ROUTER
const router = express.Router();

/**
 * @openapi
 * /crawl:
 *   get:
 *     summary: Crawl website
 *     description: Menjalankan crawler untuk mengambil HTML + assets dari website target
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *           example: https://cmlabs.co
 *         description: URL website yang akan di-crawl
 *     responses:
 *       200:
 *         description: Success crawling
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 folder:
 *                   type: string
 *                   example: results
 *                 file:
 *                   type: string
 *                   example: index.html
 *       500:
 *         description: Server error
 */
router.get(
  "/crawl",

  controllers.crawl,
);

/**
 * @openapi
 * /_next/image:
 *   get:
 *     summary: Proxy image Next.js + resize
 *     description: Mengambil gambar lokal hasil crawl dan optional resize
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: URL gambar (encoded atau full URL)
 *       - in: query
 *         name: w
 *         required: false
 *         schema:
 *           type: integer
 *         description: Width resize gambar
 *     responses:
 *       200:
 *         description: Image processed successfully
 *         content:
 *           image/webp:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Image not found
 *       500:
 *         description: Processing error
 */
router.get("/_next/image", async (req, res) => {
  try {
    const imageUrl = req.query.url;
    const width = parseInt(req.query.w);
    const decodedUrl = decodeURIComponent(imageUrl);

    let pathname;

    try {
      const urlObj = new URL(decodedUrl);
      pathname = urlObj.pathname;
    } catch {
      pathname = decodedUrl;
    }

    const filePath = path.join(__dirname, "..", "results", pathname);

    console.log("Requested image path:", filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Image not found");
    }

    let image = sharp(filePath);

    if (width) {
      image = image.resize({ width });
    }

    const buffer = await image.toBuffer();

    res.set("Content-Type", "image/webp");
    res.send(buffer);
  } catch (err) {
    console.log("Error processing image:", err);
    res.status(500).send("Error processing image");
  }
});

module.exports = router;
