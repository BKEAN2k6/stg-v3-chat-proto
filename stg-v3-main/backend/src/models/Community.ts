import mongoose from 'mongoose';
import {
  modelOptions,
  prop,
  post,
  pre,
  index,
  type DocumentType,
  plugin,
  type Ref,
} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import convertToTimeZone from '../api/controllers/convertToTimeZone.js';
import {LanguageCode, type SubscriptionStatus} from '../api/client/ApiTypes.js';
import {SubscriptionStatus as SubscriptionStatusDefinition} from '../api/schemas/definitions/SubscriptionStatus.js';
import {
  toGenitiveGroupName,
  toGenitiveGroupDescription,
} from '../api/controllers/toGenitive.js';
import {AclTreePlugin} from './plugins/acl/aclPlugin.js';
import {BillingGroup} from './BillingGroup.js';
import {User} from './User.js';
import {ProxyPost, Post, CoachPost, Group, User as UserModel} from './index.js';

const aclRoles = {
  member: 'community-member',
  admin: 'community-admin',
  owner: 'community-owner',
};

const subscriptionStatuses =
  SubscriptionStatusDefinition.enum satisfies readonly SubscriptionStatus[];

@modelOptions({schemaOptions: {_id: false}})
class Subscription {
  @prop({required: true, type: Date})
  public statusValidUntil: Date;

  @prop({type: Date})
  public updatedAt?: Date;

  @prop({ref: () => User, type: mongoose.Schema.Types.ObjectId})
  public updatedBy?: Ref<User>;

  @prop({
    type: String,
    enum: subscriptionStatuses,
    default: 'free-trial',
  })
  public status: SubscriptionStatus;

  @prop({required: true, default: false, type: Boolean})
  public subscriptionEnds: boolean;
}

@modelOptions({schemaOptions: {_id: false}})
class SubscriptionHistoryEntry {
  @prop({type: Date})
  public statusValidUntil?: Date;

  @prop({type: Date})
  public updatedAt?: Date;

  @prop({ref: () => User, type: mongoose.Schema.Types.ObjectId})
  public updatedBy?: Ref<User>;

  @prop({type: String, enum: subscriptionStatuses})
  public status?: SubscriptionStatus;

  @prop({type: Boolean})
  public subscriptionEnds?: boolean;
}

@plugin(AclTreePlugin<Community>, {})
@pre<Community>('save', async function (this: DocumentType<Community>) {
  if (this.isNew) {
    return;
  }

  const subscriptionPaths = [
    'subscription',
    'subscription.statusValidUntil',
    'subscription.status',
    'subscription.subscriptionEnds',
    'subscription.updatedAt',
    'subscription.updatedBy',
  ];

  const hasSubscriptionChange = subscriptionPaths.some((path) =>
    this.isModified(path),
  );

  if (!hasSubscriptionChange) {
    return;
  }

  const existing = await (
    this.constructor as mongoose.Model<DocumentType<Community>>
  )
    .findById(this._id)
    .select('subscription');

  const previousSubscription = existing?.subscription;
  if (!previousSubscription) {
    return;
  }

  const historyEntry = new SubscriptionHistoryEntry();
  historyEntry.statusValidUntil = previousSubscription.statusValidUntil;
  historyEntry.status = previousSubscription.status;
  historyEntry.subscriptionEnds = previousSubscription.subscriptionEnds;
  historyEntry.updatedAt = previousSubscription.updatedAt;
  historyEntry.updatedBy = previousSubscription.updatedBy;

  const history =
    this.subscriptionHistory ?? existing.subscriptionHistory ?? [];
  this.subscriptionHistory = history;
  history.push(historyEntry);
})
@post<Community>('validate', async function () {
  if (!this.isNew) {
    return;
  }

  await CoachPost.create({
    translations: {
      fi: '![Tervetuloa matkalle vahvuudesta vahvuuteen!](https://new.seethegood.app/images/welcome/fi-welcometo.jpg)\n**Tervetuloa matkalle vahvuudesta vahvuuteen!**\n\nTutkimukseen perustuva Huomaa hyvä! -digipalvelu tarjoaa helppokäyttöisen ratkaisun tunne- ja vuorovaikutustaitojen opettamiseen!\n\nHuomaa hyvä! tuo kaikkien vahvuudet esille. Kun huomaamme hyvää toisissamme,  puhumme siitä ja opetamme tunne- ja vuorovaikutustaitoja, näemme tulokset luokkahuoneessa ja arjessa. Hyvinvoivat lapset ja nuoret, joilla on vahvat kognitiiviset- ja sosioemotionaaliset taidot oppivat parhaiten ja kasvavat hyvinvoiviksi ja onnellisiksi aikuisiksi. Matka vahvuudesta vahvuuteen antaa tukevat eväät ihmisenä olemiseen ja kasvamiseen. Tämä ei ole vain oikea tapa elää vaan myös oikea tapa oppia!\n\nOta heti tällä viikolla käyttöösi Huomaa hyvä! -palvelu ja kokeile innostavia oppimateriaaleja, esimerkiksi:\n* [Vahvuusvariksen oppituokiot](/article-categories/6673e91beb3b6fe4f7358876)  - tutkitusti toimivaa materiaalia tunne- ja vuorovaikutustaitoihin\n* [Vahvuusvariksen tanssit](/article-categories/66d014e06a2375334d8ceb8a) - oppilaat rakastavat näitä\n* [Vahvuustuokio](/games/sprint) - jokainen tarvitsee positiivista palautetta\n\nHappy kids learn best!\nKaisa Koutsi\n',
      en: "![Welcome on a journey from strength to strength!](https://new.seethegood.app/images/welcome/en-welcometo.jpg)\n**Welcome on a journey from strength to strength!**\n\nSee the Good! is a science-based solution to teach about social and emotional skills!\n\nOur guiding principle is simple: when you see the good in people, speak about it and teach socio-emotional skills, you see the results in the classroom and beyond. Happy children with strong cognitive, social and emotional skills become happier adults later in life. Going from strength to strength to take on any future challenge that lies ahead. It’s not just the right thing to do. It’s the right way to learn. \n\nThis week, we recommend trying some of our See the Good! resources, such as:\n* [Strength Crow's lessons](/article-categories/6673e91beb3b6fe4f7358876) - focusing on socio-emotional skills\n* [Strength Crow's dances](/article-categories/66d014e06a2375334d8ceb8a) - the students love them!\n* [Strength Sprint](/games/sprint) - positive feedback for everyone\n\nHappy kids learn best!\nKaisa Coach",
      sv: '![Välkommen på resan från styrka till styrka!](https://new.seethegood.app/images/welcome/sv-welcometo.jpg)\n**Välkommen på resan från styrka till styrka!**\n\nDen evidensbaserade lösningen för att undervisa om sociala och emotionella färdigheter!\nSee the Good! lyfter fram allas styrkor. När vi ser det goda i varandra, pratar om det och lär ut socioemotionella färdigheter, ser vi resultaten både i klassrummet och i vardagen.\n\nVälmående barn och unga med starka kognitiva och socioemotionella färdigheter lär sig bäst och utvecklas till välmående och lyckliga vuxna. Resan från styrka till styrka ger en stabil grund för att växa och utvecklas som människa. Det här är inte bara det rätta sättet att leva – det är också det rätta sättet att lära!\n\nPassa på att upptäcka den nya tjänsten och prova See the Good!-materialet med din grupp redan denna vecka. Här är några populära exempel:\n* [Styrkekråkans lektioner](/article-categories/6673e91beb3b6fe4f7358876) - evidensbaserat material för att träna på socioemotionella färdigheter\n* [Styrkekråkans danser](/article-categories/66d014e06a2375334d8ceb8a) - en riktig favorit bland eleverna! (linkki puuttuu)\n* [Styrkesprinten](/games/sprint) - ett utmärkt sätt att sprida positiv feedback till alla i gruppen.\n\nHappy kids learn best! \nKaisa Coach\n',
    },
    community: this._id,
    showDate: new Date(),
  });

  const begiginingOfToday = new Date();
  begiginingOfToday.setHours(0, 0, 0, 0);
  const timedPosts = await Post.find({
    $or: [{postType: 'coach-post'}, {postType: 'challenge'}],
    showDate: {$gte: begiginingOfToday},
    community: null,
  });

  const proxyPosts = timedPosts.map(async (post) => {
    if (!Post.isChallenge(post) && !Post.isCoachPost(post)) {
      return;
    }

    const proxyPost = new ProxyPost(
      {
        community: this._id,
        postReference: post._id,
        createdAt: convertToTimeZone(new Date(post.showDate), this.timezone),
      },
      {
        timestamps: false,
        strict: false,
      },
    );

    return proxyPost.save();
  });

  await Promise.all(proxyPosts);
})
@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
@index({name: 1})
@index({'subscription.status': 1, 'subscription.statusValidUntil': 1})
export class Community extends TimeStamps {
  @prop({required: true, type: String})
  public name: string;

  @prop({default: '', type: String})
  public description: string;

  @prop({default: '', type: String})
  public avatar: string;

  @prop({required: true, default: 'en', type: String})
  public language: LanguageCode;

  @prop({required: true, default: 'Etc/GMT', type: String})
  public timezone: string;

  @prop({type: () => Subscription})
  public subscription?: Subscription;

  @prop({ref: () => BillingGroup, type: String})
  public billingGroup?: Ref<BillingGroup>;

  @prop({type: () => [SubscriptionHistoryEntry], default: []})
  public subscriptionHistory?: SubscriptionHistoryEntry[];

  id: string;

  // Injected by plugin:
  public aclSetUserRole!: (
    user: mongoose.Types.ObjectId | string,
    role: string,
  ) => Promise<void>;

  public aclRemoveUser!: (
    user: mongoose.Types.ObjectId | string,
  ) => Promise<void>;

  public async upsertMemberAndSave(
    this: DocumentType<Community>,
    user: mongoose.Types.ObjectId,
    role: keyof typeof aclRoles,
  ) {
    const databaseUser = await UserModel.findById(user);
    if (!databaseUser) throw new Error('User not found');

    await mongoose
      .model('CommunityMembership')
      .findOneAndUpdate({community: this._id, user}, {role}, {upsert: true});

    await this.aclSetUserRole(user, aclRoles[role]);

    if (databaseUser.lastActiveGroups?.get(this._id.toJSON())) {
      return;
    }

    const group = await Group.create({
      name: toGenitiveGroupName(databaseUser.language, databaseUser.firstName),
      description: toGenitiveGroupDescription(
        databaseUser.language,
        databaseUser.firstName,
        databaseUser.lastName,
      ),
      ageGroup: 'preschool',
      language: databaseUser.language,
      community: this._id,
      owner: user._id,
      createdBy: user._id,
      updatedBy: user._id,
    });

    await UserModel.updateOne(
      {_id: user},
      {
        $set: {
          [`lastActiveGroups.${this._id.toJSON()}`]: group._id.toJSON(),
        },
      },
    );
  }

  public async removeMemberAndSave(
    this: DocumentType<Community>,
    user: mongoose.Types.ObjectId,
  ) {
    await this.aclRemoveUser(user);

    await mongoose
      .model('CommunityMembership')
      .deleteOne({community: this._id, user});
    await this.save();
  }

  public async isMember(
    this: DocumentType<Community>,
    user: mongoose.Types.ObjectId,
  ) {
    return Boolean(
      await mongoose
        .model('CommunityMembership')
        .findOne({community: this._id, user}),
    );
  }
}
