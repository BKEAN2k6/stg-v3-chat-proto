import mongoose, {
  type Schema,
  type Document,
  type Model,
  type Connection,
} from 'mongoose';

export type HistoryDocument = Document & {
  changeLog: string;
  timestamp: Date;
  documentId: mongoose.Types.ObjectId;
  data: unknown;
};

const historySchema = new mongoose.Schema<HistoryDocument>({
  changeLog: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

historySchema.index({documentId: 1, timestamp: -1});

let HistoryModel: Model<HistoryDocument>;

const historyPlugin = function <T extends Document>(schema: Schema<T>): void {
  schema.methods.saveHistory = async function (
    this: T & {
      _id: mongoose.Types.ObjectId;
      db: Connection;
      constructor: {modelName: string};
    },
    changeLog: string,
  ): Promise<void> {
    if (!HistoryModel) {
      const modelName = `${this.constructor.modelName}History`;
      HistoryModel = this.db.model<HistoryDocument>(modelName, historySchema);
    }

    await HistoryModel.create({
      changeLog,
      documentId: this._id,
      data: this.toObject(),
    });
  };

  schema.methods.getHistory = async function (
    this: T & {
      _id: mongoose.Types.ObjectId;
      db: Connection;
      constructor: {modelName: string};
    },
  ): Promise<HistoryDocument[]> {
    if (!HistoryModel) {
      const modelName = `${this.constructor.modelName}History`;
      HistoryModel = this.db.model<HistoryDocument>(modelName, historySchema);
    }

    return HistoryModel.find({documentId: this._id}).sort({timestamp: -1});
  };

  schema.statics.getHistoryById = async function (
    id: string,
  ): Promise<HistoryDocument | undefined> {
    if (!HistoryModel) {
      const modelName = `${this.modelName}History`;
      HistoryModel = this.db.model<HistoryDocument>(modelName, historySchema);
    }

    return (await HistoryModel.findById(id)) ?? undefined;
  };
};

export default historyPlugin;
