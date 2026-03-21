import carefulness from '@/public/images/strengths/carefulness.png';
import compassion from '@/public/images/strengths/compassion.png';
import courage from '@/public/images/strengths/courage.png';
import creativity from '@/public/images/strengths/creativity.png';
import curiosity from '@/public/images/strengths/curiosity.png';
import enthusiasm from '@/public/images/strengths/enthusiasm.png';
import fairness from '@/public/images/strengths/fairness.png';
import forgiveness from '@/public/images/strengths/forgiveness.png';
import gratitude from '@/public/images/strengths/gratitude.png';
import grit from '@/public/images/strengths/grit.png';
import honesty from '@/public/images/strengths/honesty.png';
import hope from '@/public/images/strengths/hope.png';
import humour from '@/public/images/strengths/humour.png';
import judgement from '@/public/images/strengths/judgement.png';
import kindness from '@/public/images/strengths/kindness.png';
import leadership from '@/public/images/strengths/leadership.png';
import loveOfBeauty from '@/public/images/strengths/love-of-beauty.png';
import loveOfLearning from '@/public/images/strengths/love-of-learning.png';
import love from '@/public/images/strengths/love.png';
import modesty from '@/public/images/strengths/modesty.png';
import perseverance from '@/public/images/strengths/perseverance.png';
import perspective from '@/public/images/strengths/perspective.png';
import selfRegulation from '@/public/images/strengths/self-regulation.png';
import socialIntelligence from '@/public/images/strengths/social-intelligence.png';
import spirituality from '@/public/images/strengths/spirituality.png';
import teamwork from '@/public/images/strengths/teamwork.png';

function kebabToCamel(string_: string): string {
  return string_.replaceAll(/-([a-z])/g, (g) => g[1].toUpperCase());
}

export const strengthImageBySlug = (slug: string) =>
  (
    ({
      carefulness,
      compassion,
      courage,
      creativity,
      curiosity,
      enthusiasm,
      fairness,
      forgiveness,
      gratitude,
      grit,
      honesty,
      hope,
      humour,
      judgement,
      kindness,
      leadership,
      love,
      loveOfBeauty,
      loveOfLearning,
      modesty,
      perseverance,
      perspective,
      selfRegulation,
      socialIntelligence,
      spirituality,
      teamwork,
    }) as any
  )[kebabToCamel(slug)];
