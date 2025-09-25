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
  const buildScript = path.join(pkgPath, 'build', 'scripts', 'build.sh');
  if (fs.existsSync(buildScript)) {
    console.log(`Building package: ${pkg}`);
    execSync('./build/scripts/build.sh', { cwd: pkgPath, stdio: 'inherit' });
  } else {
    console.log(`No build/scripts/build.sh found for package: ${pkg}`);
  }
});
