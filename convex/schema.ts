import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/*
  defineSchema is creating a schema object. it takes an argument which is
  an object containing one table "documents". 
  defineTable is used to define the properties of a table.
  We are also adding two indexes to the table for userId column and 
  efficient quering based on userId and a combination of parent document. 
  Indexes help in optimizing queries
*/

export default defineSchema({
    documents: defineTable({
        title: v.string(),
        userId: v.string(),
        isArchived: v.boolean(),
        parentDocument: v.optional(v.id("documents")),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.boolean()
    })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId","parentDocument"])
});