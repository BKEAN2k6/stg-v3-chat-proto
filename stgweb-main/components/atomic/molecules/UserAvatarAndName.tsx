import {Avatar} from '../organisms/Avatar';
import {type StrengthPieChartItem} from '../organisms/StrengthPieChart';
import {cn} from '@/lib/utils';

type Props = {
  readonly name: string;
  readonly size: 'sm' | 'md' | 'lg';
  readonly avatarFileId?: string;
  readonly avatarSlug?: string;
  readonly color?: string;
  readonly strengths?: StrengthPieChartItem[];
  readonly imageWrapperClassName?: string;
  readonly textWrapperClassName?: string;
};

export const UserAvatarAndName = (props: Props) => {
  const {
    name,
    size,
    imageWrapperClassName,
    textWrapperClassName,
    avatarFileId,
    avatarSlug,
    color,
    strengths,
  } = props;
  let sizes;
  switch (size) {
    case 'md': {
      sizes = [
        'h-[80px] w-[80px]',
        'md:h-[90px] md:w-[90px]',
        'lg:h-[100px] lg:w-[100px]',
      ];
      // sizes = [`h-[100px] w-[100px]`]
      break;
    }

    case 'lg': {
      sizes = [
        'h-[80px] w-[80px]',
        'md:h-[100px] md:w-[100px]',
        'lg:h-[120px] lg:w-[120px]',
      ];
      // sizes = [`h-[120px] w-[120px]`]
      break;
    }

    default: {
      // this get's applied to sm
      sizes = [
        'h-[60px] w-[60px]',
        'md:h-[70px] md:w-[70px]',
        'lg:h-[80px] lg:w-[80px]',
      ];
    }
    // sizes = [`h-[80px] w-[80px]`]
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'mb-4 flex cursor-pointer justify-center rounded-full',
          ...sizes,
          imageWrapperClassName,
        )}
      >
        <Avatar
          avatarFileId={avatarFileId}
          avatarSlug={avatarSlug}
          color={color}
          strengths={strengths}
          name={name}
        />
      </div>
      <div
        className={cn(
          'h-12 text-center text-sm md:text-md lg:text-lg',
          // NOTE: these need to match the image sizing above...
          size === 'sm' && 'max-w-[80px]',
          size === 'md' && 'max-w-[100px]',
          size === 'lg' && 'max-w-[120px]',
          textWrapperClassName,
        )}
      >
        {name}
      </div>
    </div>
  );
};
