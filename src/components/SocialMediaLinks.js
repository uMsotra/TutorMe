import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

function SocialMediaLinks() {
  return (
    <div className="flex gap-4">
      <a href="https://facebook.com/tutorme" target="_blank" rel="noopener noreferrer" className="text-tutorWhite hover:text-tutorTeal/80 transition-all duration-300">
        <FaFacebook size={24} />
      </a>
      <a href="https://twitter.com/tutorme" target="_blank" rel="noopener noreferrer" className="text-tutorWhite hover:text-tutorTeal/80 transition-all duration-300">
        <FaTwitter size={24} />
      </a>
      <a href="https://instagram.com/tutorme" target="_blank" rel="noopener noreferrer" className="text-tutorWhite hover:text-tutorTeal/80 transition-all duration-300">
        <FaInstagram size={24} />
      </a>
    </div>
  );
}

export default SocialMediaLinks;