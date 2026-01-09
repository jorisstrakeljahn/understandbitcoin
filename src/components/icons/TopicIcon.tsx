import React from 'react';
import {
  Bitcoin,
  Shield,
  Pickaxe,
  Zap,
  TrendingUp,
  CircleHelp,
  Coins,
  Code,
  BookOpen,
  Lock,
  Scale,
  Globe,
  Layers,
  Lightbulb,
  FileText,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

// Map of icon names to components
// Add new icons here as needed
const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  Bitcoin,
  Shield,
  Pickaxe,
  Zap,
  TrendingUp,
  CircleHelp,
  Coins,
  Code,
  BookOpen,
  Lock,
  Scale,
  Globe,
  Layers,
  Lightbulb,
  FileText,
};

interface TopicIconProps extends LucideProps {
  topic: string;
  iconName?: string;
}

export function TopicIcon({ topic, iconName, ...props }: TopicIconProps) {
  // If iconName is provided, use it directly
  if (iconName && ICON_MAP[iconName]) {
    const IconComponent = ICON_MAP[iconName];
    return <IconComponent {...props} />;
  }
  
  // Fallback to legacy topic-based mapping for backwards compatibility
  const LEGACY_TOPIC_ICONS: Record<string, React.FC<LucideProps>> = {
    basics: Bitcoin,
    security: Shield,
    mining: Pickaxe,
    lightning: Zap,
    economics: TrendingUp,
    criticism: CircleHelp,
    money: Coins,
    dev: Code,
  };
  
  const IconComponent = LEGACY_TOPIC_ICONS[topic] || Bitcoin;
  return <IconComponent {...props} />;
}

export { ICON_MAP };
