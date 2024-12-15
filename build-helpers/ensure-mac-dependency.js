const os = require('os');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Configuration: Array of packages to handle conditionally
const packages = [
  'node-mac-permissions',
  // Add more packages here if needed
];


exports.default = function () {
  console.log('Checking for macOS dependencies...');

  const isMac = os.platform() === 'darwin';

  packages.forEach((packageName) => {
    const packagePath = path.join(__dirname, '..', 'node_modules', packageName);

    if (isMac) {
    // On macOS, ensure that the package is installed
      if (!fs.existsSync(packagePath)) {
        console.log(`macOS detected and ${packageName} is not installed. Installing...`);
        try {
          execSync(`npm install ${packageName}`, { stdio: 'inherit' });
          console.log(`${packageName} installed successfully.`);
        } catch (error) {
          console.error(`Failed to install ${packageName} on macOS:`, error);
          process.exit(1);
        }
      } else {
        console.log(`macOS detected and ${packageName} is already installed. No action needed.`);
      }
    } else {
    // On non-macOS platforms, ensure that the package is not present
      if (fs.existsSync(packagePath)) {
        console.log(`Non-macOS platform detected and ${packageName} is present. Removing...`);
        try {
          execSync(`npm uninstall ${packageName}`, { stdio: 'inherit' });
          console.log(`${packageName} removed successfully.`);
        } catch (error) {
          console.error(`Failed to uninstall ${packageName} on non-mac platform:`, error);
          process.exit(1);
        }
      } else {
        console.log(`Non-macOS platform detected and ${packageName} is not installed. No action needed.`);
      }
    }
  });

  return true;
};
