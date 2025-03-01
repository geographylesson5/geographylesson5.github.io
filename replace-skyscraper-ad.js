
const fs = require("fs");
const path = require("path");

const directories = ["go", "category", "."];
const oldAdCode = `<script type="text/javascript">
	atOptions = {
		'key' : 'bbe32c6d967339e2421bf8f9253076c9',
		'format' : 'iframe',
		'height' : 600,
		'width' : 160,
		'params' : {}
	};
</script>
<script type="text/javascript" src="//capabletonight.com/bbe32c6d967339e2421bf8f9253076c9/invoke.js"></script>`;

const newAdCode = `<script type="text/javascript">
	atOptions = {
		'key' : '04fc42c948dc0699907058238e726a98',
		'format' : 'iframe',
		'height' : 600,
		'width' : 160,
		'params' : {}
	};
</script>
<script type="text/javascript" src="//capabletonight.com/04fc42c948dc0699907058238e726a98/invoke.js"></script>`;

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    
    // Check if content contains the old ad code
    if (content.includes("bbe32c6d967339e2421bf8f9253076c9")) {
      // Create escaped version of the old code for regex safety
      const escapedOldAdCode = oldAdCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Replace all instances of the old ad code with the new one
      const newContent = content.replace(new RegExp(escapedOldAdCode, "g"), newAdCode);
      
      // If changes were made, write the file
      if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, "utf8");
        console.log(`Updated: ${filePath}`);
        return true;
      }
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

console.log("Starting skyscraper ad code replacement process...");
let totalChanged = 0;

for (const dir of directories) {
  console.log(`\nScanning directory: ${dir}`);
  totalChanged += walkDirectory(dir);
}

console.log(`\nCompleted! Total files changed: ${totalChanged}`);
