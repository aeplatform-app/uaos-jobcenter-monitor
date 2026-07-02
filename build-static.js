const fs = require("fs");
const path = require("path");

const root = __dirname;
const publicDir = path.join(root, "public");
const distDir = path.join(root, "dist");

const requiredBeforeBuild = [
  path.join(root, "jobcenter", "index.html"),
  path.join(publicDir, "jobcenter", "index.html"),
  path.join(publicDir, "status", "index.html"),
];

for (const file of requiredBeforeBuild) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing required file: ${path.relative(root, file)}`);
  }
}

function copyRecursive(source, target) {
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    let count = 0;
    for (const entry of fs.readdirSync(source)) {
      count += copyRecursive(path.join(source, entry), path.join(target, entry));
    }
    return count;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  return 1;
}

fs.mkdirSync(distDir, { recursive: true });
const copied = copyRecursive(publicDir, distDir);

const requiredAfterBuild = [
  path.join(root, "jobcenter", "index.html"),
  path.join(publicDir, "jobcenter", "index.html"),
  path.join(distDir, "jobcenter", "index.html"),
  path.join(distDir, "status", "index.html"),
];

for (const file of requiredAfterBuild) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing built file: ${path.relative(root, file)}`);
  }
}

console.log(`Copied ${copied} files from public to dist`);
console.log("BUILD STATIC OK");