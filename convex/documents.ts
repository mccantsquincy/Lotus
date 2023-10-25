import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

/* 
  This is a `get` request function that first checks to see if its an authenticated user
  once user is verified it will query the database for the documents and return the documents.
*/ 
export const get = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new Error("Not authenticated");
        }

        const documents = await ctx.db.query("documents").collect();

        return documents;
    }
})

/*
  This function creates documents in convex
  In summary, this code defines a function `create` that expects a title and an optional parent document ID. 
  It chcks if a user is authenticated, gets the users ID, and then inserts a new document into a database. 
  The newly created document is then returned
*/ 

export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents"))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const document = await ctx.db.insert("documents", {
            title: args.title,
            parentDocument: args.parentDocument,
            userId,
            isArchived: false,
            isPublished: false,
        });

        return document;
    }
})


