import React from 'react';
import {
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Send,
  Palette,
  Dribbble,
  Youtube,
  Globe
} from 'lucide-react';
import { SocialLinkItem } from '../types';

interface SocialIconProps {
  platform: SocialLinkItem['platform'] | string;
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ platform, className = 'w-4 h-4' }) => {
  switch (platform.toLowerCase()) {
    case 'github':
      return <Github className={className} />;
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'facebook':
      return <Facebook className={className} />;
    case 'instagram':
      return <Instagram className={className} />;
    case 'twitter':
      return <Twitter className={className} />;
    case 'telegram':
      return <Send className={className} />;
    case 'behance':
      return <Palette className={className} />;
    case 'dribbble':
      return <Dribbble className={className} />;
    case 'youtube':
      return <Youtube className={className} />;
    default:
      return <Globe className={className} />;
  }
};
