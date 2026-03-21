import {createServerSideAdminDirectusClient} from '@/lib/directus';
import {respond} from '@/lib/server-only-utils';

const translationFilter = {
  language_code: {
    // i18n not enabled yet, when it is, replace this with user selected language
    _eq: 'fi-FI',
  },
};

export async function GET() {
  const directus = await createServerSideAdminDirectusClient();
  const query: any = await directus.items('strengths_valley_map').readByQuery({
    // NOTE: whenever we use "fields", directus can't automatically infer
    // the response type, so make sure that the response type is manually
    // set to be correct and match the fields provided here (like in
    // ResponseType above)
    fields: [
      'translation.tutorial_text',
      'strengths_valley_story.slug',
      'strengths_valley_story.sort',
      'strengths_valley_story.coordinates',
      'strengths_valley_story.translation.name',
      'strengths_valley_story.map',
      'strengths_valley_story.strengths_valley_round.background',
      'strengths_valley_story.strengths_valley_round.strengths_valley_slide_start.slug',
      'strengths_valley_story.strengths_valley_round.strengths_valley_slide_start.layout',
      'strengths_valley_story.strengths_valley_round.strengths_valley_slide_start.translation.header',
      'strengths_valley_story.strengths_valley_round.strengths_valley_slide_start.translation.body_text',
      'strengths_valley_story.strengths_valley_round.strengths_valley_slide_start.translation.media',
      'strengths_valley_story.strengths_valley_round.strengths_valley_slide_end.slug',
      'strengths_valley_story.strengths_valley_round.strengths_valley_slide_end.layout',
      'strengths_valley_story.strengths_valley_round.strengths_valley_slide_end.translation.header',
      'strengths_valley_story.strengths_valley_round.strengths_valley_slide_end.translation.body_text',
      'strengths_valley_story.strengths_valley_round.strengths_valley_slide_end.translation.media',
      'strengths_valley_story.strengths_valley_round.strengths_valley_level.slug',
      'strengths_valley_story.strengths_valley_round.strengths_valley_level.round_number',
      'strengths_valley_story.strengths_valley_round.strengths_valley_level.level_number',
      'strengths_valley_story.strengths_valley_round.strengths_valley_level.coordinates',
      'strengths_valley_story.strengths_valley_round.strengths_valley_level.strengths_valley_slide.slug',
      'strengths_valley_story.strengths_valley_round.strengths_valley_level.strengths_valley_slide.layout',
      'strengths_valley_story.strengths_valley_round.strengths_valley_level.strengths_valley_slide.translation.header',
      'strengths_valley_story.strengths_valley_round.strengths_valley_level.strengths_valley_slide.translation.body_text',
      'strengths_valley_story.strengths_valley_round.strengths_valley_level.strengths_valley_slide.translation.media',
    ],
    // NOTE: this seems to be a bug in Directus SDK that it doesn't detect
    // deep nested filters types correctly. Defining the deep query for each
    // relation as `never` makes the errors go away, and it still works as
    // expected.
    deep: {
      translation: {
        _filter: translationFilter,
      } as never,
      strengths_valley_story: {
        translation: {
          _filter: translationFilter,
        } as never,
        strengths_valley_round: {
          translation: {
            _filter: translationFilter,
          },
          strengths_valley_slide_start: {
            translation: {
              _filter: translationFilter,
            },
          } as never,
          strengths_valley_slide_end: {
            translation: {
              _filter: translationFilter,
            },
          } as never,
          strengths_valley_level: {
            translation: {
              _filter: translationFilter,
            } as never,
            strengths_valley_slide: {
              translation: {
                _filter: translationFilter,
              },
            } as never,
          },
        } as never,
      } as never,
    },
  });
  return respond(200, 'ok', {data: {map: query.data[0]}});
}
