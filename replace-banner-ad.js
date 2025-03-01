const fs = require("fs");
const path = require("path");

const directories = ["go", "category", "."];
const oldAdCode = `<script type="text/javascript">
	atOptions = {
		'key' : '3d0a0c94fc64997283ffa1dd180e70a5',
		'format' : 'iframe',
		'height' : 90,
		'width' : 728,
		'params' : {}
	};
</script>
<script type="text/javascript" src="//capabletonight.com/3d0a0c94fc64997283ffa1dd180e70a5/invoke.js"></script>`;

const newAdCode = `<script type="text/javascript">
	atOptions = {
		'key' : 'ed31381c7e2533fbc515facaa5f969b4',
		'format' : 'iframe',
		'height' : 90,
		'width' : 728,
		'params' : {}
	};
</script>
<script type="text/javascript" src="//capabletonight.com/ed31381c7e2533fbc515facaa5f969b4/invoke.js"></script>`;

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    
    // Check if content contains the old ad code
    if (content.includes("3d0a0c94fc64997283ffa1dd180e70a5")) {
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

console.log("Starting banner ad code replacement process...");
let totalChanged = 0;

for (const dir of directories) {
  console.log(`\nScanning directory: ${dir}`);
  totalChanged += walkDirectory(dir);
}

console.log(`\nCompleted! Total files changed: ${totalChanged}`);