const fs = require("fs");
const path = require("path");

// Define the ad patterns more precisely by checking parts of the URL
const oldAdPatterns = ['src="https://snow-rider-3d.github.io/ads-728x90.html"'];

const newAd = `<script type="text/javascript">
	atOptions = {
		'key' : 'aaa35f653b043793cfc1c8fa0d8a1e39',
		'format' : 'iframe',
		'height' : 90,
		'width' : 728,
		'params' : {}
	};
</script>
<script type="text/javascript" src="//capabletonight.com/aaa35f653b043793cfc1c8fa0d8a1e39/invoke.js"></script>`;

function processFile(filePath) {
  try {
    console.log(`Processing: ${filePath}`);
    const content = fs.readFileSync(filePath, "utf8");
    let modified = false;
    let newContent = content;

    for (const pattern of oldAdPatterns) {
      if (newContent.includes(pattern)) {
        console.log(`Found ad in: ${filePath}`);
        // Find the complete iframe tag containing this pattern
        const regex = new RegExp(
          `<iframe[^>]*${pattern}[^>]*>\\s*</iframe>`,
          "g",
        );
        newContent = newContent.replace(regex, newAd);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error with ${filePath}:`, error.message);
    return false;
  }
}

function walkDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return 0;
  }

  let changed = 0;
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      changed += walkDirectory(fullPath);
    } else if (item.endsWith(".html")) {
      if (processFile(fullPath)) {
        changed++;
      }
    }
  }
  return changed;
}

// Process both root directory and subdirectories
let totalChanged = 0;
const directories = ["go", "category", "."];

console.log("Starting ad replacement process...");
for (const dir of directories) {
  console.log(`\nScanning directory: ${dir}`);
  totalChanged += walkDirectory(dir);
}
console.log(`\nCompleted! Total files changed: ${totalChanged}`);
