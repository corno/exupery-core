const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packagesDir = path.join(__dirname, 'packages');
if (!fs.existsSync(packagesDir)) {
  console.error('No packages directory found.');
  process.exit(1);
}

const dirs = fs.readdirSync(packagesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

dirs.forEach(pkg => {
  const pkgPath = path.join(packagesDir, pkg);
  const updateScript = path.join(pkgPath, 'build', 'scripts', 'update.sh');
  if (fs.existsSync(updateScript)) {
    console.log(`Updating package: ${pkg}`);
    execSync('./build/scripts/update.sh', { cwd: pkgPath, stdio: 'inherit' });
  } else {
    console.log(`No build/scripts/update.sh found for package: ${pkg}`);
  }
});
