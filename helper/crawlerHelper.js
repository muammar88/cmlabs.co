const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const helper = {};

helper.crawl = async (url) => {
  let browser;

  try {
    console.log("🚀 Start crawling:", url);

    // ===== INIT FOLDER =====
    const baseResultDir = path.join(__dirname, "../results");

    if (fs.existsSync(baseResultDir)) {
      fs.rmSync(baseResultDir, { recursive: true, force: true });
    }
    fs.mkdirSync(baseResultDir, { recursive: true });

    console.log("🧹 Results folder cleaned");

    // ===== LAUNCH =====
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    console.log("✅ Page loaded");

    await new Promise((r) => setTimeout(r, 3000));

    // ===== GET HTML =====
    let html = await page.content();

    html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");

    console.log("✅ HTML captured");

    // ===== COLLECT ASSETS =====
    const rawAssets = [...html.matchAll(/(src|href)=["']([^"']+)["']/g)].map(
      (m) => m[2],
    );

    const uniqueAssets = [...new Set(rawAssets)];

    console.log("📦 Total assets:", uniqueAssets.length);

    // ===== DOWNLOAD NORMAL ASSETS =====
    for (let asset of uniqueAssets) {
      try {
        // skip data URL
        if (asset.startsWith("data:")) continue;

        const fullUrl = new URL(asset, url).href;

        await downloadAndSave(fullUrl, baseResultDir);
      } catch (err) {
        console.warn("⚠️ Asset fail:", asset);
      }
    }

    console.log("✅ Standard assets downloaded");

    // ===== HANDLE NEXT IMAGE =====
    const imageMatches = [...html.matchAll(/\/_next\/image\?url=([^&]+)/g)];

    for (let match of imageMatches) {
      try {
        const encoded = match[1];
        const decodedPath = decodeURIComponent(encoded);

        let realUrl;

        // kalau sudah absolute URL
        if (decodedPath.startsWith("http")) {
          realUrl = decodedPath;
        } else {
          realUrl = new URL(decodedPath, url).href;
        }

        console.log("🖼️ Next real image:", realUrl);

        await downloadAndSave(realUrl, baseResultDir);
      } catch (err) {
        console.warn("⚠️ Next image fail");
      }
    }

    console.log("✅ Next.js images handled");

    // ===== SAVE HTML =====
    fs.writeFileSync(path.join(baseResultDir, "index.html"), html);

    console.log("✅ HTML saved");

    await browser.close();

    console.log("🎉 Crawling finished");

    return {
      folder: "results",
      file: "index.html",
    };
  } catch (error) {
    console.error("🔥 FATAL ERROR:", error);

    if (browser) await browser.close();

    throw error;
  }
};

// ===== DOWNLOAD FUNCTION =====
function downloadAndSave(url, baseFolder) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);

      let filePath = urlObj.pathname;

      if (!filePath || filePath === "/") {
        filePath = "/index.html";
      }

      filePath = filePath.split("?")[0];

      // 🔥 FIX EISDIR
      if (!path.extname(filePath)) {
        if (!filePath.endsWith("/")) filePath += "/";
        filePath += "index.html";
      }

      const fullPath = path.join(baseFolder, filePath);
      const dir = path.dirname(fullPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const client = url.startsWith("https") ? https : http;

      client
        .get(url, (res) => {
          if (res.statusCode !== 200) {
            console.warn("⚠️ Skip:", url);
            return resolve();
          }

          const stream = fs.createWriteStream(fullPath);

          res.pipe(stream);

          stream.on("finish", () => {
            stream.close(resolve);
          });

          stream.on("error", () => resolve());
        })
        .on("error", () => resolve());
    } catch (err) {
      resolve();
    }
  });
}

module.exports = helper;
