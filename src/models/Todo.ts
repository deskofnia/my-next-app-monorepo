import mongoose from "mongoose";

// Define the schema options
const todoSchemaOptions = {
  timestamps: true,
  collection: "todos",
};

// Define the Todo schema
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  todoSchemaOptions
);

// Adding indexing
todoSchema.index({ title: 1 });

// // Post middleware to handle 'save' event
// todoSchema.post("save", function (doc) {
//   if (doc) {
//     doc.id = doc._id.toString();
//     doc._id = doc.id;
//   }
// });

// // Post middleware to handle 'find' queries
// todoSchema.post(/^find/, function (docs) {
//   if (this.op === "find") {
//     docs.forEach((doc) => {
//       doc.id = doc._id.toString();
//       doc._id = doc.id;
//     });
//   }
// });

// Post middleware to handle 'find' queries
// todoSchema.post(/^find/, function (docs) {
//   // 'docs' is an array of documents returned by the 'find' query
//   docs.forEach((doc) => {
//     doc.id = doc._id.toString(); // Convert _id to string and assign to 'id'
//     doc._id = doc.id; // Assign the converted string back to '_id'
//   });
// });

const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export { Todo, todoSchema };

// import {
//   ModelOptions,
//   Severity,
//   getModelForClass,
//   index,
//   post,
//   prop,
// } from "@typegoose/typegoose";
// import mongoose from "mongoose";

// @post<TodoClass>("save", function (doc) {
//   if (doc) {
//     doc.id = doc._id.toString();
//     doc._id = doc.id;
//   }
// })
// @post<TodoClass[]>(/^find/, function (docs) {
//   if (this.op === "find") {
//     docs.forEach((doc) => {
//       doc.id = doc._id.toString();
//       doc._id = doc.id;
//     });
//   }
// })
// @ModelOptions({
//   schemaOptions: {
//     timestamps: true,
//     collection: "todos",
//   },
//   options: {
//     allowMixed: Severity.ALLOW,
//   },
// })
// @index({ title: 1 })
// class TodoClass {
//   @prop({ required: true, unique: true })
//   title: string;

//   @prop({ default: false })
//   completed: boolean;

//   _id: mongoose.Types.ObjectId | string;

//   id: string;
// }

// const Todo = getModelForClass(TodoClass);
// export { Todo, TodoClass };
