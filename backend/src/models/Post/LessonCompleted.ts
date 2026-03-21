import {prop, Ref, plugin} from '@typegoose/typegoose';
import {
  type StrengthSlug,
  type ArticleChapter,
  type AgeGroup,
} from '../../api/client/ApiTypes.js';
import {User} from '../User.js';
import {AclTreePlugin} from '../plugins/acl/aclPlugin.js';
import {Group} from '../Group.js';
import {Post} from './Post.js';

@plugin(AclTreePlugin<LessonCompleted>, {
  parent: 'community',
  roles: [{userPath: 'createdBy', role: 'post-owner'}],
})
export class LessonCompleted extends Post {
  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;

  @prop({ref: () => Group, required: true})
  public group: Ref<Group>;

  @prop({type: String, required: true})
  public strength: StrengthSlug;

  @prop({type: String, required: true})
  public chapter: ArticleChapter;

  @prop({type: String, required: true})
  public ageGroup: AgeGroup;
}
