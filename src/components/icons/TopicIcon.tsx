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
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { Topic } from '@/lib/content/schema';

const TOPIC_ICONS: Record<Topic, React.FC<LucideProps>> = {
  basics: Bitcoin,
  security: Shield,
  mining: Pickaxe,
  lightning: Zap,
  economics: TrendingUp,
  criticism: CircleHelp,
  money: Coins,
  dev: Code,
};

interface TopicIconProps extends LucideProps {
  topic: Topic;
}

export function TopicIcon({ topic, ...props }: TopicIconProps) {
  const IconComponent = TOPIC_ICONS[topic] || Bitcoin;
  return <IconComponent {...props} />;
}

export { TOPIC_ICONS };
