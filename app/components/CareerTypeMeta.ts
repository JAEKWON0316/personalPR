import { Briefcase, GraduationCap, Award, Folder } from 'lucide-react';

export const careerTypeMeta = {
  work: {
    icon: Briefcase,
    color: '#10B981',
  },
  education: {
    icon: GraduationCap,
    color: '#6366F1',
  },
  project: {
    icon: Folder,
    color: '#F59E42',
  },
  achievement: {
    icon: Award,
    color: '#F43F5E',
  },
} as const;

export type CareerType = keyof typeof careerTypeMeta; 