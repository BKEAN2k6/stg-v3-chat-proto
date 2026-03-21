import {
  modelOptions,
  prop,
  type Ref,
  PropType,
  plugin,
} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import {AgeGroup, LanguageCode} from '../api/client/ApiTypes.js';
import {Community} from './Community.js';
import {User} from './User.js';
import {Article} from './Article.js';
import {AclTreePlugin} from './plugins/acl/aclPlugin.js';

@modelOptions({schemaOptions: {_id: false}})
class ArticleProgress {
  @prop({ref: () => Article, required: true})
  public article: Ref<Article>;

  @prop({required: true, type: Date})
  public completionDate: Date;
}

@plugin(AclTreePlugin<Group>, {
  parent: 'community',
  roles: [{userPath: 'owner', role: 'group-owner'}],
})
@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class Group extends TimeStamps {
  @prop({required: true, type: String})
  public name: string;

  @prop({type: String})
  public description: string;

  @prop({ref: () => Community, required: true, index: true})
  public community: Ref<Community>;

  @prop({ref: () => User, required: true})
  public owner: Ref<User>;

  @prop({required: true, type: String})
  public ageGroup: AgeGroup;

  @prop({required: true, type: String})
  public language: LanguageCode;

  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;

  @prop({ref: () => User})
  public updatedBy: Ref<User>;

  @prop({type: () => ArticleProgress, default: []}, PropType.ARRAY)
  public articleProgress!: ArticleProgress[];

  id: string;
}
