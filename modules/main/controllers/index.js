const { handleServerError } = require("../../../helper/handleError");
const { crawl } = require("../../../helper/crawlerHelper");

const controllers = {};

controllers.crawl = async (req, res) => {
  try {
    const url = req.query.url;

    // ===== VALIDASI =====
    if (!url) {
      return res.status(400).json({
        error: true,
        message: "Parameter url wajib diisi",
      });
    }

    console.log("Crawling URL:", url);

    // validasi format URL
    try {
      new URL(url);
    } catch (err) {
      return res.status(400).json({
        error: true,
        message: "Format URL tidak valid",
      });
    }

    // ===== PROSES CRAWL =====
    const result = await crawl(url);

    console.log("Result:", result);

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // ===== RESPONSE =====
    return res.status(200).json({
      error: false,
      message: "Crawl berhasil dilakukan",
      data: {
        file: result.file,
        url: `${baseUrl}/${result.file}`, // ✅ FIX DI SINI
      },
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = controllers;
