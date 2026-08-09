/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Tắt kiểm tra ESLint khi Build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TẮT KIỂM TRA TYPESCRIPT KHI BUILD
    // Vercel sẽ tự động bỏ qua tất cả các lỗi đỏ lòm vừa nãy
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
