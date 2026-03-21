import {modelOptions, prop, Ref, PropType} from '@typegoose/typegoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import mongoose from 'mongoose';
import {LanguageCode} from '../api/client/ApiTypes.js';
import {User} from './User.js';

@modelOptions({
  schemaOptions: {
    _id: false,
  },
})
class Segment {
  @prop({required: true, type: Number})
  public start: number;

  @prop({required: true, type: Number})
  public stop: number;

  @prop({default: false, type: Boolean})
  public autoplay: boolean;

  @prop({default: false, type: Boolean})
  public loop: boolean;

  @prop({default: false, type: Boolean})
  public showToolbar: boolean;
}

@modelOptions({
  schemaOptions: {
    _id: false,
  },
})
class Color {
  @prop({required: true, type: Number})
  public r: number;

  @prop({required: true, type: Number})
  public g: number;

  @prop({required: true, type: Number})
  public b: number;

  @prop({required: true, type: Number})
  public a: number;
}

enum AnimationAssetType {
  image = 'image',
  audio = 'audio',
}

enum ImageRenderType {
  textBanner = 'text-banner',
  introCard = 'intro-card',
  taskCard = 'task-card',
  challengeCard = 'challenge-card',
  fileUpload = 'fileupload',
  colorPicker = 'color-picker',
  button = 'button',
  hidden = 'hidden',
}

enum AudioRenderType {
  voiceover = 'voiceover',
  fileUpload = 'fileupload',
  hidden = 'hidden',
}

@modelOptions({
  schemaOptions: {
    discriminatorKey: 'assetType',
    _id: false,
  },
})
class AnimationAssetBase {
  @prop({
    required: true,
    type: String,
  })
  public assetId: string;

  @prop({required: true, enum: AnimationAssetType, type: String})
  public assetType: AnimationAssetType;

  @prop({required: true, type: String})
  public name: string;
}

class ImageAsset extends AnimationAssetBase {
  @prop({
    required: true,
    enum: ImageRenderType,
    type: String,
  })
  public renderType: ImageRenderType;

  @prop({type: Number})
  public width: number;

  @prop({type: Number})
  public height: number;

  @prop({_id: false, type: () => Color})
  public color: Color;

  @prop({type: Number})
  public fontSize?: number;

  @prop({required: true, type: () => String}, PropType.MAP)
  public translations: Map<LanguageCode, string>;
}

class AudioAsset extends AnimationAssetBase {
  @prop({
    required: true,
    enum: AudioRenderType,
    type: String,
  })
  public renderType: AudioRenderType;

  @prop({required: true, type: () => String}, PropType.MAP)
  public translations: Map<LanguageCode, string>;
}

@modelOptions({schemaOptions: {toJSON: {virtuals: true}}})
export class AnimationProject extends TimeStamps {
  @prop({required: true, trim: true, type: String})
  public name: string;

  @prop({type: String, required: true})
  public languages: mongoose.Types.Array<string>;

  @prop({type: String})
  public description: string;

  @prop({type: Boolean, required: true, default: false})
  public isChecked: boolean;

  @prop({ref: () => User, required: true})
  public createdBy: Ref<User>;

  @prop({ref: () => User})
  public updatedBy: Ref<User>;

  @prop({
    required: true,
    type: AnimationAssetBase,
    discriminators: () => [
      {type: AudioAsset, value: AnimationAssetType.audio},
      {type: ImageAsset, value: AnimationAssetType.image},
    ],
  })
  public assetSettings: AnimationAssetBase[];

  @prop({type: Boolean, required: true, default: false})
  public loop: boolean;

  @prop({type: Segment, default: []})
  public segments: Segment[];

  public id: string;
}
