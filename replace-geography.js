
const fs = require("fs");
const path = require("path");

const directories = ["go", "category", "."];
const oldText = "Unblocked Games G +";
const newText = "Geography Lessons";

// Additional replacements to ensure all variations are caught
const additionalReplacements = [
  { from: "Geography Lessons +", to: "Geography Lessons" },
  { from: "Geography Lessons+", to: "Geography Lessons" },
  { from: "Unblocked Games G+", to: "Geography Lessons" },
  { from: "<strong>Geography Lessons+</strong>", to: "<strong>Geography Lessons</strong>" },
  { from: "<h1 class=\"single-title\">Geography Lessons+</h1>", to: "<h1 class=\"single-title\">Geography Lessons</h1>" }
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let changed = false;
    
    // Handle main replacement
    if (content.includes(oldText)) {
      content = content.replace(new RegExp(oldText, "g"), newText);
      changed = true;
    }
    
    // Handle additional variations
    for (const replacement of additionalReplacements) {
      if (content.includes(replacement.from)) {
        content = content.replace(new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "g"), replacement.to);
        changed = true;
      }
    }
    
    // Fix title tags
    if (content.includes("<title>")) {
      // Replace any title containing Geography Lessons+ or Unblocked Games G+
      const titleRegex = /<title>(.*?)(Geography Lessons\+|Unblocked Games G\+)(.*?)<\/title>/g;
      const newContent = content.replace(titleRegex, "<title>$1Geography Lessons$3</title>");
      
      if (newContent !== content) {
        content = newContent;
        changed = true;
      }
    }
    
    // Replace in footer and other places
    content = content.replace(/Geography Lessons\+/g, "Geography Lessons");
    
    if (changed) {
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
