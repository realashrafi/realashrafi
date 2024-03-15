/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
}


const withPWA = require('next-pwa')({
    dest: 'public'
})

module.exports = withPWA(nextConfig)
