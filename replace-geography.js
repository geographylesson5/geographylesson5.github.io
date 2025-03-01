
const fs = require("fs");
const path = require("path");

const directories = ["go", "category", "."];
const oldText = "Unblocked Games G +";
const newText = "Geography Lessons";

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    if (content.includes(oldText)) {
      content = content.replace(new RegExp(oldText, "g"), newText);
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  let changedFiles = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      changedFiles += walkDirectory(filePath);
    } else if (file.endsWith(".html")) {
      if (processFile(filePath)) {
        changedFiles++;
      }
    }
  }

  return changedFiles;
}

console.log("Starting text replacement process...");
let totalChanged = 0;

for (const dir of directories) {
  console.log(`\nScanning directory: ${dir}`);
  totalChanged += walkDirectory(dir);
}

console.log(`\nCompleted! Total files changed: ${totalChanged}`);
