/** @type {import("next").NextConfig} */
module.exports = {
  eslint: { ignoreDuringBuilds: !!process.env.CI },
};
