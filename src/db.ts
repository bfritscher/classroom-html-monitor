import { SubmissionModelStatic } from "db";
import { DataTypes, Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  `postgres://${process.env.POSTGRES_USER}:${
    process.env.POSTGRES_PASSWORD
  }@db:5432/${process.env.POSTGRES_DB}`
);

export const Submission = sequelize.define(
  "submission",
  {
    assignment: { type: DataTypes.STRING, primaryKey: true },
    email: { type: DataTypes.STRING, primaryKey: true },
    url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    check_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    check_status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    check_content: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    }
  },
  {
    timestamps: true,
    underscored: true,
    indexes: [
      {
        // same url only allowed once by assignment
        unique: true,
        fields: ["assignment", "url"]
      }
    ]
  }
) as SubmissionModelStatic;

function ensureConnection():Promise<any> {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(resolve, ensureConnection)
  })
}

export const dbReady = ensureConnection();
