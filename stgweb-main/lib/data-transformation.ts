import {type MomentCardData} from '@/components/atomic/molecules/MomentCard';

export function dbMomentToMomentCardData(dbMoment: any): MomentCardData {
  return {
    id: dbMoment.id,
    createdAt: dbMoment.date_created,
    content: dbMoment.markdown_content,
    creatorId: dbMoment.created_by?.id,
    creatorFirstName: dbMoment.created_by?.first_name,
    creatorLastName: dbMoment.created_by?.last_name,
    creatorAvatar: dbMoment.created_by?.avatar,
    creatorAvatarSlug: dbMoment.created_by?.avatar_slug,
    creatorColor: dbMoment.created_by?.color,
    creatorTopStrengths: dbMoment.created_by?.top_strengths,
    files: dbMoment.files.map((fileLink: any) => ({
      id: fileLink.directus_files.id,
      width: fileLink.directus_files.width,
      height: fileLink.directus_files.height,
    })),
    strengths: dbMoment.strengths.map(
      (strengthLink: any) => strengthLink.strength,
    ),
    fromStrengthsOnboarding: dbMoment.from_strengths_onboarding,
  };
}
