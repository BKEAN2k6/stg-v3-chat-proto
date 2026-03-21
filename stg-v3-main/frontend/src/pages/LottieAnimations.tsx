import {SimpleLottiePlayer} from '@/components/ui/SimpleLottiePlayer.js';

const animations = [
  '/animations/other/celebration.json',
  '/animations/other/loadingBalls.json',
  '/animations/other/unLoveIt.json',
  '/animations/other/pikkunaakka.json',
  '/animations/other/humpaa.json',
  '/animations/other/korintti.json',
  '/animations/other/karmiiniDances.json',
  '/animations/other/pomppo.json',
  '/animations/other/karmiiniFlies.json',
  '/animations/other/varisRocks.json',
  '/animations/other/loveIt.json',
  '/animations/strengths/forgiveness.json',
  '/animations/strengths/socialIntelligence.json',
  '/animations/strengths/love.json',
  '/animations/strengths/curiosity.json',
  '/animations/strengths/spirituality.json',
  '/animations/strengths/courage.json',
  '/animations/strengths/creativity.json',
  '/animations/strengths/selfRegulation.json',
  '/animations/strengths/grit.json',
  '/animations/strengths/leadership.json',
  '/animations/strengths/perspective.json',
  '/animations/strengths/humour.json',
  '/animations/strengths/honesty.json',
  '/animations/strengths/judgement.json',
  '/animations/strengths/loveOfLearning.json',
  '/animations/strengths/modesty.json',
  '/animations/strengths/gratitude.json',
  '/animations/strengths/loveOfBeauty.json',
  '/animations/strengths/enthusiasm.json',
  '/animations/strengths/perseverance.json',
  '/animations/strengths/teamwork.json',
  '/animations/strengths/fairness.json',
  '/animations/strengths/carefulness.json',
  '/animations/strengths/kindness.json',
  '/animations/strengths/hope.json',
  '/animations/strengths/compassion.json',
  '/animations/avatars/repovesi.json',
  '/animations/avatars/mconni.json',
  '/animations/avatars/peloton.json',
  '/animations/avatars/inarijarvi.json',
  '/animations/avatars/urho.json',
  '/animations/avatars/lemmenjoki.json',
  '/animations/avatars/keekutti.json',
  '/animations/avatars/levi.json',
  '/animations/avatars/pallas.json',
  '/animations/avatars/pikkunaakka.json',
  '/animations/avatars/yllas.json',
  '/animations/avatars/kaldoaivi.json',
  '/animations/avatars/karmiini.json',
  '/animations/avatars/korintti.json',
  '/animations/avatars/tilulilu.json',
  '/animations/avatars/pomppo.json',
  '/animations/avatars/kevo.json',
  '/animations/avatars/kilpisjarvi.json',
  '/animations/avatars/wadus.json',
  '/animations/avatars/nuorgam.json',
  '/animations/avatars/utsjoki.json',
  '/animations/avatars/humppa.json',
  '/animations/avatars/melikes.json',
  '/animations/avatars/pyha.json',
  '/animations/avatars/teijo.json',
];

export default function LottieAnimations() {
  return (
    <div>
      {animations.map((animation) => (
        <div key={animation} className="mb-3">
          <h2>{animation}</h2>
          <SimpleLottiePlayer
            autoplay
            loop
            src={animation}
            style={{width: '50%', height: 'auto'}}
          />
        </div>
      ))}
    </div>
  );
}
