import {type Request, type Response} from 'express';
import {CoachPost} from '../../../models/index.js';

/**
 * Exports all coach posts as a text file, grouped by language.
 * Each language section contains all posts in that language.
 * Excludes proxy/reference posts - only exports source posts.
 */
export async function exportCoachPosts(
  _request: Request,
  response: Response,
): Promise<void> {
  // Only get source coach posts (not challenges, not proxy copies)
  const coachPosts = await CoachPost.find({
    community: null,
    postType: 'coach-post',
  })
    .sort({showDate: -1})
    .lean();

  const languages = ['fi', 'en', 'sv'] as const;
  const sections: string[] = [];

  for (const lang of languages) {
    const langName =
      lang === 'fi' ? 'Finnish' : lang === 'en' ? 'English' : 'Swedish';
    const header = `${'='.repeat(60)}\n${langName.toUpperCase()} (${lang})\n${'='.repeat(60)}\n`;

    const posts = coachPosts
      .map((post, index) => {
        const translation =
          post.translations[lang as keyof typeof post.translations];
        const showDate = new Date(post.showDate).toISOString().split('T')[0];
        const strengths = post.strengths?.join(', ') || 'none';

        return `Post #${index + 1}
ID: ${String(post._id)}
Show Date: ${showDate}
Strengths: ${strengths}

${translation}
`;
      })
      .join('\n' + '-'.repeat(40) + '\n\n');

    sections.push(header + '\n' + posts);
  }

  const content = sections.join('\n\n');
  const filename = `coach-posts-export-${new Date().toISOString().split('T')[0]}.txt`;

  response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  response.setHeader(
    'Content-Disposition',
    `attachment; filename="${filename}"`,
  );
  response.send(content);
}
