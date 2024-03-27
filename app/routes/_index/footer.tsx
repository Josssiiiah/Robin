import { FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="w-full py-24 text-center text-gray-600">
      <div className="flex justify-center space-x-6 mb-4">
        <a href="/contact" className="hover:text-blue-500">
          Contact Us
        </a>
        <a href="/pricing" className="hover:text-blue-500">
          Pricing
        </a>
      </div>
      <div className="flex justify-center space-x-4">
        <a
          href="https://twitter.com/your-twitter-handle"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-blue-400"
        >
          <FaTwitter size={24} />
        </a>
        <a
          href="https://instagram.com/your-instagram-handle"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-pink-500"
        >
          <FaInstagram size={24} />
        </a>
        <a
          href="mailto:your-email@example.com"
          className="text-gray-400 hover:text-blue-500"
        >
          <FaEnvelope size={24} />
        </a>
      </div>
    </footer>
  );
}