/* eslint-disable @typescript-eslint/naming-convention */
import {type LanguageCode} from '@/i18n';
import {type StrengthSlug} from '@/api/ApiTypes';

export const strengthSlugs = [
  'carefulness',
  'compassion',
  'courage',
  'creativity',
  'curiosity',
  'enthusiasm',
  'fairness',
  'forgiveness',
  'gratitude',
  'grit',
  'honesty',
  'hope',
  'humour',
  'judgement',
  'kindness',
  'leadership',
  'love',
  'loveOfBeauty',
  'loveOfLearning',
  'modesty',
  'perseverance',
  'perspective',
  'selfRegulation',
  'socialIntelligence',
  'spirituality',
  'teamwork',
] as const;

export const simpleStrengthSlugs = [
  'kindness',
  'creativity',
  'humour',
  'courage',
  'gratitude',
  'honesty',
  'hope',
  'love',
  'modesty',
] as const;

export type StrengthColors = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
};

export type StrengthListItem = {
  slug: StrengthSlug;
  title: string;
  description: string;
  imageUrl: string;
  color: string;
};

export const slugToListItem = (
  slug: StrengthSlug,
  language: string,
): StrengthListItem => ({
  slug,
  title: strengthTranslationMap[slug][language as LanguageCode],
  description: strengthExamplesMap[slug][language as LanguageCode],
  imageUrl: `/images/strengths/${slug}.png`,
  color: strengthColorMap[slug][300],
});

export const strengthName = (slug: string, language: string) => {
  return strengthTranslationMap[slug as StrengthSlug][language as LanguageCode];
};

export const strengthColorMap = {
  carefulness: {
    50: '#F9FCF8',
    100: '#F2F8F1',
    200: '#ebf5ea',
    300: '#d7ebd6',
    400: '#A1D09F',
    500: '#468A42',
  },
  compassion: {
    50: '#F4F3F7',
    100: '#E9E7EF',
    200: '#DEDAE6',
    300: '#D0CBDC',
    400: '#B2AAC6',
    500: '#5E5379',
  },
  courage: {
    50: '#FFFBEB',
    100: '#FFF7D6',
    200: '#FFF3C2',
    300: '#FFE88A',
    400: '#FFDB47',
    500: '#F5C500',
  },
  creativity: {
    50: '#F1F7F9',
    100: '#E2EEF3',
    200: '#D4E6ED',
    300: '#4D97B5',
    400: '#3C7890',
    500: '#306073',
  },
  curiosity: {
    50: '#FDF2EC',
    100: '#FCE6D9',
    200: '#FAD9C7',
    300: '#F3A275',
    400: '#F08D56',
    500: '#ED7431',
  },
  enthusiasm: {
    50: '#FEF9F6',
    100: '#FDF2EC',
    200: '#FDEFE8',
    300: '#FCEAE0',
    400: '#F2A77D',
    500: '#EF8E58',
  },
  fairness: {
    50: '#F8FCF9',
    100: '#F1F8F2',
    200: '#EBF5EC',
    300: '#DDEEDF',
    400: '#A0CFA5',
    500: '#69B472',
  },
  forgiveness: {
    50: '#F0F9F8',
    100: '#B5E3DC',
    200: '#97D8CE',
    300: '#61C4B4',
    400: '#43B2A0',
    500: '#379585',
  },
  gratitude: {
    50: '#F1F8F2',
    100: '#D6EAD9',
    200: '#BBDDBF',
    300: '#ACD5B1',
    400: '#85C18C',
    500: '#6AB473',
  },
  grit: {
    50: '#FEF6F6',
    100: '#FEF2F1',
    200: '#FDEDED',
    300: '#FCE3E2',
    400: '#F5A6A3',
    500: '#F2827E',
  },
  honesty: {
    50: '#F0F9F8',
    100: '#E1F4F1',
    200: '#D3EEEA',
    300: '#B0E1D9',
    400: '#98D8CD',
    500: '#5CC1B1',
  },
  hope: {
    50: '#F0FAF8',
    100: '#B2E6DE',
    200: '#93DCD0',
    300: '#3AB5A1',
    400: '#329A89',
    500: '#287C6E',
  },
  humour: {
    50: '#F4F5F6',
    100: '#DDE0E4',
    200: '#AFB6C0',
    300: '#9DA5B2',
    400: '#818C9C',
    500: '#6C7789',
  },
  judgement: {
    50: '#FDEDED',
    100: '#F5A6A3',
    200: '#F1837F',
    300: '#EB524C',
    400: '#E83C35',
    500: '#DC2019',
  },
  kindness: {
    50: '#FFDBD9',
    100: '#FEC0BD',
    200: '#F5A6A3',
    300: '#EF7570',
    400: '#E72F27',
    500: '#AA1913',
  },
  leadership: {
    50: '#EFF4FA',
    100: '#D0DEF1',
    200: '#B1C8E7',
    300: '#8EAFDC',
    400: '#739CD4',
    500: '#5486CA',
  },
  love: {
    50: '#FDF2EC',
    100: '#F7C0A1',
    200: '#F4A77B',
    300: '#EF7F40',
    400: '#E25D13',
    500: '#BC4E10',
  },
  loveOfBeauty: {
    50: '#FEF2EC',
    100: '#FDECE3',
    200: '#FCE6D9',
    300: '#F9CCB3',
    400: '#F5A67B',
    500: '#EF732F',
  },
  loveOfLearning: {
    50: '#F1F7F9',
    100: '#E2EEF3',
    200: '#B7D5E1',
    300: '#9BC5D5',
    400: '#7EB4C9',
    500: '#61A3BD',
  },
  modesty: {
    50: '#FFFAEB',
    100: '#FFF7E1',
    200: '#FEF1CD',
    300: '#FEECB9',
    400: '#FDD972',
    500: '#FCC322',
  },
  perseverance: {
    50: '#EEFCFB',
    100: '#DDF1F0',
    200: '#D5ECEB',
    300: '#A5D7D5',
    400: '#6EBFBB',
    500: '#439894',
  },
  perspective: {
    50: '#FDEDEE',
    100: '#FBE4E6',
    200: '#FADBDE',
    300: '#F8C9CD',
    400: '#F3A5AB',
    500: '#EF818A',
  },
  selfRegulation: {
    50: '#FFF4D1',
    100: '#FFEFBE',
    200: '#FEE59A',
    300: '#FDD662',
    400: '#FCC112',
    500: '#BA8C02',
  },
  socialIntelligence: {
    50: '#F4F3F7',
    100: '#E9E7EF',
    200: '#C8C2D6',
    300: '#ABA2C1',
    400: '#9C91B6',
    500: '#8578A5',
  },
  spirituality: {
    50: '#F1F8F2',
    100: '#D6EBD9',
    200: '#BBDDBF',
    300: '#97CB9D',
    400: '#69B472',
    500: '#52A35B',
  },
  teamwork: {
    50: '#FFFAEB',
    100: '#FEE49A',
    200: '#FEDA72',
    300: '#FDC626',
    400: '#F3B502',
    500: '#CA9702',
  },
};

export const strengthTranslationMap = {
  like: {
    en: 'Like',
    fi: 'Tykkää',
    sv: 'Gilla',
  },
  creativity: {
    en: 'Creativity',
    fi: 'Luovuus',
    sv: 'Kreativitet',
  },
  enthusiasm: {
    en: 'Enthusiasm',
    fi: 'Innostus',
    sv: 'Entusiasm',
  },
  hope: {
    en: 'Hope',
    fi: 'Toiveikkuus',
    sv: 'Hopp',
  },
  grit: {
    en: 'Grit',
    fi: 'Sisukkuus',
    sv: 'Sisu',
  },
  spirituality: {
    en: 'Spirituality',
    fi: 'Hengellisyys',
    sv: 'Andlighet',
  },
  loveOfLearning: {
    en: 'Love of Learning',
    fi: 'Oppimisen ilo',
    sv: 'Lärandets glädje',
  },
  selfRegulation: {
    en: 'Self-regulation',
    fi: 'Itsesäätely',
    sv: 'Självreglering',
  },
  leadership: {
    en: 'Leadership',
    fi: 'Johtajuus',
    sv: 'Ledarskap',
  },
  judgement: {
    en: 'Judgement',
    fi: 'Arviointikyky',
    sv: 'Omdöme',
  },
  gratitude: {
    en: 'Gratitude',
    fi: 'Kiitollisuus',
    sv: 'Tacksamhet',
  },
  modesty: {
    en: 'Modesty',
    fi: 'Vaatimat­tomuus',
    sv: 'Anspråks­löshet',
  },
  fairness: {
    en: 'Fairness',
    fi: 'Reiluus',
    sv: 'Rättvisa',
  },
  carefulness: {
    en: 'Carefulness',
    fi: 'Harkitse­vaisuus',
    sv: 'Efter­tänksamhet',
  },
  socialIntelligence: {
    en: 'Social Intelligence',
    fi: 'Sosiaalinen älykkyys',
    sv: 'Social intelligens',
  },
  honesty: {
    en: 'Honesty',
    fi: 'Rehellisyys',
    sv: 'Ärlighet',
  },
  courage: {
    en: 'Courage',
    fi: 'Rohkeus',
    sv: 'Mod',
  },
  love: {
    en: 'Love',
    fi: 'Rakkaus',
    sv: 'Kärlek',
  },
  loveOfBeauty: {
    en: 'Love of Beauty',
    fi: 'Kauneuden arvostus',
    sv: 'Uppskatta skönhet',
  },
  perspective: {
    en: 'Perspective',
    fi: 'Näkökulman­ottokyky',
    sv: 'Perspektiv­förmåga',
  },
  compassion: {
    en: 'Compassion',
    fi: 'Myötätunto',
    sv: 'Medkänsla',
  },
  teamwork: {
    en: 'Teamwork',
    fi: 'Ryhmätyö­taidot',
    sv: 'Samarbets­förmåga',
  },
  kindness: {
    en: 'Kindness',
    fi: 'Ystävällisyys',
    sv: 'Vänlighet',
  },
  perseverance: {
    en: 'Perseverance',
    fi: 'Sinnikkyys',
    sv: 'Uthållighet',
  },
  humour: {
    en: 'Humour',
    fi: 'Huumorintaju',
    sv: 'Humor',
  },
  curiosity: {
    en: 'Curiosity',
    fi: 'Uteliaisuus',
    sv: 'Nyfikenhet',
  },
  forgiveness: {
    en: 'Forgiveness',
    fi: 'Anteeksi­antavuus',
    sv: 'Förlåtelse',
  },
};

export const strengthFinnishCasesMap = {
  creativity: {
    partitive: 'Luovuutta',
  },
  enthusiasm: {
    partitive: 'Innostusta',
  },
  hope: {
    partitive: 'Toiveikkuutta',
  },
  grit: {
    partitive: 'Sisukkuutta',
  },
  spirituality: {
    partitive: 'Hengellisyyttä',
  },
  loveOfLearning: {
    partitive: 'Oppimisen iloa',
  },
  selfRegulation: {
    partitive: 'Itsesäätelyä',
  },
  leadership: {
    partitive: 'Johtajuutta',
  },
  judgement: {
    partitive: 'Arviointikykyä',
  },
  gratitude: {
    partitive: 'Kiitollisuutta',
  },
  modesty: {
    partitive: 'Vaatimattomuutta',
  },
  fairness: {
    partitive: 'Reiluutta',
  },
  carefulness: {
    partitive: 'Harkitsevaisuutta',
  },
  socialIntelligence: {
    partitive: 'Sosiaalista älykkyyttä',
  },
  honesty: {
    partitive: 'Rehellisyyttä',
  },
  courage: {
    partitive: 'Rohkeutta',
  },
  love: {
    partitive: 'Rakkautta',
  },
  loveOfBeauty: {
    partitive: 'Kauneuden arvostusta',
  },
  perspective: {
    partitive: 'Näkökulmanottokykyä',
  },
  compassion: {
    partitive: 'Myötätuntoa',
  },
  teamwork: {
    partitive: 'Ryhmätyötaitoja',
  },
  kindness: {
    partitive: 'Ystävällisyyttä',
  },
  perseverance: {
    partitive: 'Sinnikkyyttä',
  },
  humour: {
    partitive: 'Huumorintajua',
  },
  curiosity: {
    partitive: 'Uteliaisuutta',
  },
  forgiveness: {
    partitive: 'Anteeksiantavuutta',
  },
};

export const strengthFactsMap = {
  carefulness: {
    en: 'Carefulness shows in cautiousness while making decisions. A careful person considers matters from many angles and takes time to make her mind. Patience and immersing in details go hand-in-hand with carefulness.',
    fi: 'Harkitsevaisuuteen liittyy huolellisuus ja varovaisuus päätöksissä. Harkitsevainen ihminen tarkastelee asioita monelta suunnalta ja antaa aikaa pohdinnoilleen. Maltti ja yksityiskohtiin perehtyminen kulkevat harkitsevuuden kumppaneina.',
    sv: 'Eftertänksamhet betyder att man är omsorgsfull och försiktig i sina beslut. En eftertänksam person funderar noggrant på saker och ser dem ur flera vinklar. Tålamod och ett öga för detaljer går hand i hand med eftertänksamhet.',
  },
  compassion: {
    en: "Compassion is the ability to recognize others' feelings. It means comforting another person in sorrow but also co-celebrating when things go fine. A compassionate person can put herself in the shoes of another person and understand diversity.",
    fi: 'Myötätunto on kykyä havaita toisen tunnetiloja. Se on halua lohduttaa surussa mutta myös riemuita yhdessä ilon hetkellä. Myötätuntoinen ihminen osaa ajatella asioita toisten näkökulmasta ja ymmärtää erilaisuutta.',
    sv: 'Medkänsla är förmågan att uppfatta en annans känslomässiga tillstånd. En person med medkänsla tröstar den som är ledsen och gläds tillsammans med den som är glad. En person med medkänsla kan tänka på saker ur andras perspektiv och förstår andras olikheter.',
  },
  courage: {
    en: 'Courage is the ability to act despite fear and insecurity. Courage opens up opportunities to experience and learn new things. Courage makes it easier to use other strengths.',
    fi: 'Rohkeus on kykyä toimia pelosta ja epävarmuudesta huolimatta. Rohkeus avaa mahdollisuuksia kokea ja oppia uutta. Rohkeuden avulla muiden vahvuuksien käyttö helpottuu.',
    sv: 'Mod är förmågan att handla trots att man är rädd eller osäker. Mod öppnar möjligheter till att uppleva och lära sig något nytt. Med mod blir det lättare att använda de andra styrkorna.',
  },
  creativity: {
    en: 'Creativity involves having the courage to experiment and do things in your own way, being rich in ideas and artistic expression. Creativity is reflected in everyday life as inventiveness and a desire to do things in your own way.',
    fi: 'Luovuus on uskallusta kokeilla ja tehdä asioita omaperäisellä tavalla. Se on ideointia ja taiteellista ilmaisuvoimaa. Luovuus näkyy kekseliäisyytenä ja ongelmanratkaisukykynä monilla elämänalueilla.',
    sv: 'Kreativitet är mod att experimentera och göra saker på ett sitt eget sätt, men också idérikedom och konstnärlig uttrycksförmåga. En kreativ person är uppfinningsrik och bra på att lösa problem i många områden i livet.',
  },
  curiosity: {
    en: 'Curiosity means willingness to seek and try, to see and learn a variety of things.Curiosity is natural in children leading them to explore their surroundings. A curious person asks a lot, finds out about many kind of matters and looks for new experiences.',
    fi: 'Uteliaisuus on halua etsiä ja kokeilla uutta, nähdä ja oppia erilaisia asioita. Uteliaisuus on lapsissa luontaista ja johtaa tutkimiseen.Utelias ihminen kyselee paljon, ottaa asioista selvää ja hakee elämyksiä.',
    sv: 'Nyfikenhet är lusten att söka och testa nytt, att se och lära sig olika saker. Nyfikenhet är en medfödd egenskap hos barn och leder till utforskning av världen. En nyfiken person frågar mycket, tar reda på saker och söker upplevelser.',
  },
  enthusiasm: {
    en: 'An enthusiastic person is energetic and works towards the desired goal. He/she accomplishes a lot and is generally happy with his life. He can infect enthusiasm with others.',
    fi: 'Innostuneena ihminen on tarmokas ja toimii kohti haluamaansa päämäärää. Hän saa paljon aikaiseksi ja on yleensä tyytyväinen elämäänsä. Hän voi tartuttaa intoa toisiinkin.',
    sv: 'En entusiastisk person är driftig och arbetar hårt för att uppnå det uppsatta målet. Hen får mycket gjort och är oftast nöjd med sitt liv. Hen kan också smitta andra med sin entusiasm.',
  },
  fairness: {
    en: 'A fair person treats everyone equal. Fairness means flexibility and justice. A fair person ignores unnecessary minor issues. She can help and forgive others.',
    fi: 'Reilu henkilö kohtelee kaikkia tasapuolisesti. Reiluus on joustavuutta ja oikeudenmukaisuutta ja turhien pikkuseikkojen ohittamista. Reilu tyyppi auttaa muita ja osaa antaa anteeksi.',
    sv: 'En rättvis person behandlar alla lika. Rättvisa handlar om att vara flexibel och opartisk och att kunna förbise onödiga småsaker. En rättvis typ hjälper andra och har förmågan att förlåta.',
  },
  forgiveness: {
    en: 'A person with the strength of forgiveness is ready to forget the wrong doings she has faced. She respects peaceful living and looks for a chance to reconciliation. She can also forgive to herself.',
    fi: 'Anteksiantavava ihminen on valmis unohtamaan kokemansa vääryydet. Hän arvostaa rauhallista yhdessäoloa ja hakee tilaisuutta sovinnolle. Anteeksiantavuuteen kuuluu myös kyky antaa itselleen anteeks ja uusi mahdollisuus.',
    sv: 'En förlåtande person har förmågan att glömma orättvisor. Hen uppskattar fridfull samvaro och söker sämja och samförstånd. Att kunna förlåta sig själv och ge sig själv en ny chans hör också till förmågan att förlåta.',
  },
  gratitude: {
    en: 'Gratitude bears the ability to admire small things and pay attention to the good. A grateful person often thinks how happy she is. She can feel comfortable in many places.',
    fi: 'Kiitollisuuteen kuuluu kyky ihastella pieniä asioita ja huomion kiinnittäminen hyvään. Kiitollinen ihminen pysähtyy usein miettimään, miten onnekas hän on. Kiitollisen ihmisen on helppo viihtyä monessa paikassa.',
    sv: 'Tacksamhet betyder att man ser det fina i små saker och uppmärksammar det goda. En tacksam person stannar ofta upp för att tänka på hur lycklig hen har. Den som är tacksam brukar trivas nästan överallt.',
  },
  grit: {
    en: 'Grit (or the Finnish Sisu) is characterized by endurance in the face of obstacles, striving to reach a goal that may be far away. A gritty person has integrity to pursuit the destinations she finds right. She increases gas when headwind gets stronger.',
    fi: 'Sisukkuus on matkan jatkamista esteistä huolimatta, ponnistelua kohti loitontuvaakin määränpäätä. Sisukas ihminen toimii lahjomattomasti oikeina pitämiensä tavoitteiden eteen ja lsää kierroksia, kun vastatuuli yltyy.',
    sv: 'Ihärdighet betyder att man fortsätter resan trots mödor och strävar efter målet trots att det kan verka avlägset. En ihärdig person är orubblig och bara eggas av motstånd.',
  },
  honesty: {
    en: 'Honesty means having a strong sense of justice and defending the truth. An honest person says how the things really are even though it might cause her troubles. It goes with honesty to admit being wrong sometimes.',
    fi: 'Rehellisyyttä kuvaa voimakas oikeudentunto ja totuuden puolustaminen. Rehellinen ihminen kertoo asiat kuten ne ovat, vaikka hän itse joutuisi ongelmiin. Rehellisyyteen kuuluu myös kyky myöntää olevansa joskus väärässä.',
    sv: 'Att vara ärlig innebär att man har en stark känsla för rättvisa och försvarar sanningen. En ärlig person berättar sanningen, även om hen själv skulle råka illa ut. Ärlighet betyder också förmågan att erkänna att man själv ibland har fel.',
  },
  hope: {
    en: 'Hope means having a positive attitude to life and seeing opportunities in the future. A hopeful person can spark optimism in other people helping them find light even in dark times. Having hope and seeing good go together.',
    fi: 'Toiveikkuus tarkoittaa positiivista suhtautumista elämään ja mahdollisuuksien näkemistä tulevaisuudessa. Toiveikkuuden avulla voi valaa uskoa toisiin ihmisiin ja auttaa näkemään valoa myös synkkinä hetkinä. Toiveikas ihminen huomaa hyvää.',
    sv: 'Hoppfullhet betyder att man har en positiv inställning till livet och ser möjligheter i framtiden. Hoppfullhet kan ingjuta hopp i andra människor och hjälper att se ljuset även i mörka stunder. En hoppfull person ser det goda.',
  },
  humour: {
    en: 'Humour means a tendency to bring playfulness and fun to everyday events. Humorous person sees often comical side of the matter and is able to lighten the mood.',
    fi: 'Huumorintaju tarkoittaa taipumusta tuoda leikillisyyttä ja hassuttelua arjen tapahtumiin. Huumorintajuinen ihminen näkee asioissa usein koomisenkin puolen ja osaa keventää tunnelmaa.',
    sv: 'Att ha ett sinne för humor betyder att man tillför lekfullhet och skoj i vardagen. En person med ett sinne för humor ser ofta det komiska i tillvaron och vet hur man lättar upp stämningen.',
  },
  judgement: {
    en: 'Judgement means being able to find solutions based on the heaviest evidence. A person with judgement sees the forest for the trees and she can tell right from wrong.She can be critical to her own actions as well.',
    fi: 'Arviointikyky on päätösten tekemistä painavimpien seikkojen pohjalta. Arviointikykyinen henkilö näkee metsän puilta ja erottaa oikean väärästä. Hän osaa tarkastella kriittisesti myös omaa toimintaansa.',
    sv: 'Bedömningsförmåga betyder att man kan fatta beslut utifrån viktig information. En person med bedömningsförmåga ser skogen för träden och kan skilja gott från ont. Hen kan också granska sig själv kritiskt.',
  },
  kindness: {
    en: 'Kindness reflects the will to act for the benefit of others. It is ability to see others in positive ways, speak nicely and help others. Kindness is the foundation of successful relationships.',
    fi: 'Ystävällisyys kuvastaa halua toimia toisten hyväksi. Se on kykyä katsoa toisia myönteisessä valossa, puhua kauniisti ja auttaa. Ystävällisyys on onnistuneiden ihmissuhteiden lähtökohta.',
    sv: 'Vänlighet betyder att man handlar för andras bästa. Det är förmågan att se andra i ett positivt ljus, att tala vackert och att hjälpa andra. Vänlighet är utgångspunkten i alla lyckade relationer.',
  },
  leadership: {
    en: 'Leadership means responsibility for the task and the group. A leader takes care of others and shares the work based on strengths in others. A leader makes decisions which affect the success of the whole team.',
    fi: 'Johtajuuteen kuuluu vastuu tehtävästä ja ryhmästä. Johtaja huolehtii muista ja jakaa työt kunkin osaamiseen perustuen. Johtaja tekee päätöksiä, joista koko porukan menestyminen riippuu.',
    sv: 'Ledarskap innebär att ta ansvar för uppgiften och gruppen. En ledare tar hand om de andra och fördelar arbetet enligt var och ens kompetens. Ledaren fattar besluten som hela gruppens framgång hänger på.',
  },
  love: {
    en: 'Love means deep, warm connection to other people, animals, nature or even a hobby. There are several types of love. A loving person expresses her positive feelings easily and often.',
    fi: 'Rakkaudella tarkoitetaan syvää lämmintä suhtautumista toisiin ihmisiin, eläimiin, luontoon tai vaikkapa harrastukseen. Rakkaudessa on monia lajeja Rakkaudellinen ihminen ilmaisee positiivisia tunteitaan helposti ja usein.',
    sv: 'Kärleksfullhet betyder att man har en djupt och varm inställning till andra människor, djur, naturen eller till och med en hobby. Det finns många olika typer av kärleksfullhet. En kärleksfull person ger uttryck för sina positiva känslor lätt och ofta.',
  },
  loveOfBeauty: {
    en: 'Love of beauty describes the ability to recognize excellence in many places. Soap bubbles, roar of thunder, or lyrics of a song can inspire a lover of beauty. Love of beauty entails the skill to respect capabilities that one does not find interesting herself.',
    fi: 'Kauneuden arvostus on kykyä havaita upeutta monissa paikoissa. Saippuakuplat, ukkosen jylinä tai laulunsanat voivat sytyttää kauneuden arvostajan. Kauneuden arvostukseen kuuluu myös kyky kunnioittaa osaamista, joka itseä ei kiinnosta.',
    sv: 'Att ha ett sinne för estetik betyder att man kan finna skönhet överallt. Såpbubblor, åskdunder eller orden i en låt kan få en person med sinne för estetik att fatta lågor. Den som uppskattar skönhet har också respekt för färdigheter som hen inte själv nödvändigtvis är intresserad av.',
  },
  loveOfLearning: {
    en: 'Love of learning is described by willingness to get knowledge and experience of something new. This strength inspires constant exploration and discovery. A person with love of learning does not necessarily ask what for the learning is but enjoys the learning itself.',
    fi: 'Oppimisen iloa kuvaa halu saada tietoa ja kokea uutta. Tämä vahvuus inspiroi jatkuvaan tutkimiseen ja löytämiseen Oppimisestaan iloinen ihminen ei välttämättä kysy, mihin oppimaansa tarvitsee vaan iloitsee itse oppimisesta.',
    sv: 'Lärlust är viljan att veta och uppleva nytt. Det är en styrka som inspirerar till utforskning och upptäckter. En person med lärlust frågar inte nödvändigtvis varför hen lär sig, utan blir glad av att bara lära sig något nytt.',
  },
  modesty: {
    en: "Modesty shows in letting others shine and staying silent about one's own achievements. A modest person lets the facts speak for themselves. She underlines co-operation instead of highlighting her own share.",
    fi: 'Vaatimattomuus näkyy taipumuksena antaa toisille tilaa ja vaieta omista saavutuksista. Vaatimaton ihminen antaa tekojen puhua puolestaan. Hän korostaa yhdessä tekemistä oman osuutensa asemesta.',
    sv: 'Anspråkslöshet betyder att man ger plats åt andra och inte skryter med sina egna prestationer. En anspråkslös person låter sina handlingar tala för sig själva. För hen är det viktigare att göra saker tillsammans än att framhäva sin egen roll.',
  },
  perseverance: {
    en: 'Perseverance is determination to hold on to the task. It is to continue in face of a seemingly impossible challenge. It is ability to recover after adversities (= resilience).',
    fi: 'Sinnikkyys on päättäväisyyttä saavuttaa pitkäkestoisia tavoitteita. Se on jatkamista mahdottomaltakin tuntuvan haasteen edessä. Se on toipumiskykyä hankaluuksien jälkeen ja itsensä ylittämistä.',
    sv: 'Uthållighet betyder att man är beslutsam och strävar efter långsiktiga mål. Det betyder att man fortsätter trots svåra utmaningar och har förmågan att återhämta sig efteråt.',
  },
  perspective: {
    en: 'Perspective is the ability to perceive entities. It is judgment, wisdom, and often also knowledge and life experience. Perspective includes the ability to put oneself to another person’s shoes.',
    fi: 'Näkökulmanottokyky on taitoa tarkastella asioita monelta kannalta. Se on arviointia, viisautta ja usein myös tietoa sekä elämänkokemusta. Näkökulmanottokykyinen ihminen osaa asettua toisen asemaan ja vaihtaa tarvittaessa mielipidettä.',
    sv: 'Perspektivförmåga är förmågan att se saker ur många perspektiv. Det betyder bedömningsförmåga, visdom och ofta även kunskap och livserfarenhet. En person med perspektivförmåga kan sätta sig in i en annans situation och byta sin åsikt om det behövs.',
  },
  selfRegulation: {
    en: "selfRegulation is the ability to consciously control one's own actions. It is power to regulate behavior and emotions to suit the situation. Related concepts are willpower, executive functions and self-discipline.",
    fi: 'Itsesäätely on kykyä ohjata tietoisesti omaa toimintaa. Se on käyttäytymisen ja tunteiden säätelyä tilanteeseen sopivaksi. Itsesäätelyyn liittyy kyky torjua houkutuksia, pysyä annetussa tehtävässä ja saattaa asioita valmiiksi.',
    sv: 'Självreglering betyder att medvetet kontrollera sina egna handlingar och känslor enligt situationen. Självreglering innebär också förmågan att motstå frestelser, hålla sig till den givna uppgiften och att få saker gjorda.',
  },
  socialIntelligence: {
    en: "Social intelligence is the ability to understand one's own and others' feelings, thoughts, and behaviors. It is ability to work well with different people. Empathy, situational awareness and friendship are important.",
    fi: 'Sosiaalinen älykkyys on kykyä ymmärtää toisten tunteita ja tulkita tilanteita hienovaraisesti. Se on taitoa tulla toimeen erilaisten ihmisen kanssa ja saada toiset viihtymään. Sosiaalista älykkyyttä on myös kyky suostutella ja kääntää toiset puolelleen.',
    sv: 'Social intelligens handlar om att förstå andras känslor och att tolka sociala situationer. En socialt intelligent person kommer överens med olika människor och får andra att känna sig bekväma, men kan också övertyga andra och få dem på sin sida.',
  },
  spirituality: {
    en: 'Spirituality means believing in something bigger and having a sense of purpose in life. A spiritual person feels joy and comfort while holding a belief of belonging to a greater plan. Spirituality is often connected to hope.',
    fi: 'Hengellisyys tarkoittaa uskoa korkeampaan ja kokemusta elämän tarkoituksellisuudesta. Hengellinen ihminen kokee riemua ja lohtua tuntiessaan olevansa osa suurempaa suunnitelmaa. Hengellisyys on usein yhteydessä toiveikkuuteen.',
    sv: 'Andlighet betyder att man tror på en högre makt och upplever att det finns en mening med livet. En andlig person känner glädje och tröst av att vara en del av en större plan. Andlighet kopplas ofta till hoppfullhet.',
  },
  teamwork: {
    en: 'Teamwork skills are reflected in active participation in the group. It is encouragement, enthusiasm and being active. It is also to give room, share tasks and working for common goals.',
    fi: 'Ryhmätyötaidoilla tarkoitetaan joustavaa osallistumista ryhmän toimintaan. Se on kannustamista, innostumista ja aktiivisuutta. Se on myös tilan antamista, töiden jakamista ja työskentelyä tavoitteiden eteen.',
    sv: 'Samarbetsförmåga innebär att man deltar i en grupp på ett mångsidigt sätt. Det handlar om att uppmuntra, entusiasmera och att vara aktiv, men också om att ge utrymme, dela arbete och arbeta mot ett gemensamt mål.',
  },
};

export const strengthExamplesMap = {
  carefulness: {
    en: 'Being cautious and paying close attention',
    fi: 'Huolellisuutta ja varovaisuutta toimissa ',
    sv: 'Att vara försiktig och uppmärksam',
  },
  compassion: {
    en: "Understanding someone who's having a hard time",
    fi: 'Myötäelämistä toisen surussa ja ilossa',
    sv: 'Att förstå någon som har det svårt',
  },
  courage: {
    en: 'Being brave and strong even in a scary situation',
    fi: 'Urhoollisuutta haasteiden edessä',
    sv: 'Att vara modig och stark även i en skrämmande situation',
  },
  creativity: {
    en: 'Coming up with new and interesting ideas',
    fi: 'Uskallusta kokeilla ja tehdä asioita omaperäisesti',
    sv: 'Att komma med nya och intressanta idéer',
  },
  curiosity: {
    en: 'Having a desire to explore new things',
    fi: 'Halua etsiä ja kokeilla uutta, nähdä ja oppia',
    sv: 'Att ha en önskan att utforska nya saker',
  },
  enthusiasm: {
    en: 'Feeling super excited about something',
    fi: 'Energisyyttä, avoimuutta ja uteliaisuutta eri tilanteissa',
    sv: 'Att känna sig mycket entusiastisk över något',
  },
  fairness: {
    en: 'Treating everyone equally',
    fi: 'Kaikkien tasapuolista kohtelua',
    sv: 'Att behandla alla lika',
  },
  forgiveness: {
    en: 'Giving a second chance and moving on without a grudge',
    fi: 'Valmiutta antaa uusi mahdollisuus ja etsiä sovintoa',
    sv: 'Att ge en andra chans och gå vidare utan agg',
  },
  gratitude: {
    en: 'Feeling thankful and appreciative',
    fi: 'Huomion kiinnittämistä hyvään ja sen arvostamista mitä on',
    sv: 'Att känna sig tacksam och uppskattande',
  },
  grit: {
    en: 'Having a strong determination to not give up',
    fi: 'Vahvaa periksiantamattomuutta ',
    sv: 'Att ha en stark beslutsamhet att inte ge upp',
  },
  honesty: {
    en: 'Telling the truth and being sincere',
    fi: 'Totuuteen pyrkimistä ja avoimuutta',
    sv: 'Att tala sanning och vara uppriktig',
  },
  hope: {
    en: 'Believing good things can happen',
    fi: 'Positiivista suhtautumista elämään ja tulevaisuuteen ',
    sv: 'Att tro att goda saker kan hända',
  },
  humour: {
    en: 'Spreading joy and happiness',
    fi: 'Ilon ja leikillisyyden levittämistä ympäristöön',
    sv: 'Att sprida glädje och lycka',
  },
  judgement: {
    en: "Thinking what's right or wrong before making a decision",
    fi: 'Vaihtoehtojen pohtimista ennen päätöksentekoa',
    sv: 'Att fundera på vad som är rätt eller fel innan ett beslut fattas',
  },
  kindness: {
    en: 'Being nice and helpful to others',
    fi: 'Ystävällisyyttä ja auttavaisuutta toisia kohtaan',
    sv: 'Att vara trevlig och hjälpsam mot andra',
  },
  leadership: {
    en: 'Helping a team work together to reach their goals',
    fi: 'Toisten johtamista tavoitteen suunnassa',
    sv: 'Att hjälpa ett team att arbeta tillsammans för att nå sina mål',
  },
  love: {
    en: 'Caring deeply for someone or something',
    fi: 'Syvää kiintymystä ja välittämistä',
    sv: 'Att bry sig mycket om någon eller något',
  },
  loveOfBeauty: {
    en: 'Finding joy in the wonderful and pleasing things around',
    fi: 'Kykyä havaita kauneutta ympärillään',
    sv: 'Att finna glädje i de underbara och behagliga sakerna runt omkring',
  },
  loveOfLearning: {
    en: 'Being excited about gaining new knowledge and skills',
    fi: 'Halua saada tietoa ja oppia uutta ',
    sv: 'Att vara entusiastisk över att öka sina kunskaper och färdigheter',
  },
  modesty: {
    en: 'Being humble and not showing off',
    fi: 'Vaikenemista omista saavutuksista ',
    sv: 'Att vara ödmjuk och inte skryta',
  },
  perseverance: {
    en: 'Having a strong willpower that helps to keep going',
    fi: 'Päättäväisyyttä saavuttaa päämääriä',
    sv: 'Att ha en stark viljestyrka som hjälper en att fortsätta',
  },
  perspective: {
    en: 'Seeing and understanding  in different ways',
    fi: 'Taitoa tarkastella asioita monelta kannalta',
    sv: 'Att se och förstå på olika sätt',
  },
  selfRegulation: {
    en: 'Controlling your emotions and actions',
    fi: 'Kykyä ohjata tietoisesti omaa toimintaa',
    sv: 'Att ha kontroll över sina känslor och handlingar',
  },
  socialIntelligence: {
    en: 'Understanding and getting along with others',
    fi: 'Kykyä ymmärtää tulla toimeen toisten kanssa',
    sv: 'Att förstå och komma överens med andra',
  },
  spirituality: {
    en: 'Connecting with deeper meanings and beliefs',
    fi: 'Uskoa korkeampaan ja kokemusta elämän tarkoituksellisuudesta',
    sv: 'Att få kontakt med djupare innebörder och övertygelser',
  },
  teamwork: {
    en: 'Working together with others towards a goal',
    fi: 'Osallistumista ryhmän toimintaan yhteisen tavoitteen suunnassa',
    sv: 'Sammarbeta mot et gemensamt mål',
  },
};

export const strengthAdjectivesMap = {
  carefulness: {
    en: 'gentle, careful, watchful',
    fi: 'tarkka, varovainen, järjestelmällinen',
    sv: 'varsam, försiktig, vaksam',
  },
  compassion: {
    en: 'caring, kind, understanding',
    fi: 'huolehtiva, ystävällinen, ymmärtäväinen',
    sv: 'omtänksam, vänlig, förstående',
  },
  courage: {
    en: 'brave, strong, fearless',
    fi: 'rohkea, urhea, uskaltava',
    sv: 'modig, stark, orädd',
  },
  creativity: {
    en: 'imaginative, inventive, artistic',
    fi: 'idearikas, ilmaisuvoimainen, taiteellinen',
    sv: 'fantasifull, uppfinningsrik, konstnärlig',
  },
  curiosity: {
    en: 'questioning, eager, exploring',
    fi: 'tutkiva, etsivä, avoin',
    sv: 'frågvis, ivrig, utforskande',
  },
  enthusiasm: {
    en: 'excited, energetic, passionate',
    fi: 'energinen, tarmokas, intohimoinen',
    sv: 'upprymd, energisk, passionerad',
  },
  fairness: {
    en: 'equal, just, honest',
    fi: 'tasapuolinen, oikeudenmukainen, rehellinen',
    sv: 'jämlik, rättvis, ärlig',
  },
  forgiveness: {
    en: 'understanding, kind, letting go',
    fi: 'ymmärtäväinen, ystävällinen, sovinnollinen',
    sv: 'förstående, vänlig, försonlig',
  },
  gratitude: {
    en: 'thankful, appreciative, happy',
    fi: 'kiitollinen, arvostava, tyytyväinen',
    sv: 'tacksam, uppskattande, glad',
  },
  grit: {
    en: 'persistent, determined, strong',
    fi: 'määrätietoinen, sinnikäs, vahva',
    sv: 'ihärdig, beslutsam, stark',
  },
  honesty: {
    en: 'truthful, sincere, straightforward',
    fi: 'totuudenmukainen, suora, avoin',
    sv: 'sanningsenlig, uppriktig, rättfram',
  },
  hope: {
    en: 'positive, optimistic, looking forward',
    fi: 'optimistinen, myönteinen, eteenpäin katsova',
    sv: 'positiv, optimistisk, framåtblickande',
  },
  humour: {
    en: 'funny, playful, lighthearted',
    fi: 'hauska, leikkisä, hyväntuulinen',
    sv: 'rolig, lekfull, lättsinnig',
  },
  judgement: {
    en: 'deciding, choosing, thinking',
    fi: 'ajatteleva, valikoiva, kriittinen',
    sv: 'beslutande, väljande, funderande',
  },
  kindness: {
    en: 'caring, friendly, helpful',
    fi: 'huolehtiva, ystävällinen, auttavainen',
    sv: 'omtänksam, vänlig, hjälpsam',
  },
  leadership: {
    en: 'guiding, helping, leading',
    fi: 'ohjaava, auttavainen, määrätietoinen',
    sv: 'vägledande, hjälpande, ledande',
  },
  love: {
    en: 'caring, warm, affectionate',
    fi: 'välittävä, lämmin, huolehtiva',
    sv: 'omtänksam, varm, kärleksfull',
  },
  loveOfBeauty: {
    en: 'appreciation, admiration, fascination',
    fi: 'arvostava, ihaileva, kiinnostunut',
    sv: 'uppskattning, beundran, fascination',
  },
  loveOfLearning: {
    en: 'excitement, curiosity, exploration',
    fi: 'innostunut, kiinnostunut, utelias',
    sv: 'spänning, nyfikenhet, utforskning',
  },
  modesty: {
    en: 'humble, simple, unpretentious',
    fi: 'nöyrä, yksinkertainen, aito',
    sv: 'ödmjuk, enkel, anspråkslös',
  },
  perseverance: {
    en: 'determination, persistent, resilience',
    fi: 'määrätietoinen, päättäväinen, palautumiskykyinen',
    sv: 'beslutsam, uthållig, motståndskraftig',
  },
  perspective: {
    en: 'viewpoint, understanding, openminded',
    fi: 'pohdiskeleva, avarakatseinen, ymmärtäväinen',
    sv: 'synvinkel, förstående, öppensinnad',
  },
  selfRegulation: {
    en: 'control, emotions, balance',
    fi: 'tasapainoinen, hallittu, sopeutuva',
    sv: 'kontroll, känslor, balans',
  },
  socialIntelligence: {
    en: 'understanding, empathy, relationships',
    fi: 'ymmärtäväinen, huomaavainen, myötätuntoinen',
    sv: 'förståelse, medkänsla, relationer',
  },
  spirituality: {
    en: 'wonder, connection, meaning',
    fi: 'merkitystä etsivä, ihmettelevä, toiveikas',
    sv: 'förundran, samhörighet, mening',
  },
  teamwork: {
    en: 'together, cooperation, collaboration',
    fi: 'osallistuva, yhteistyökykyinen, joustava',
    sv: 'tillsammans, samarbete, samverkan',
  },
};
