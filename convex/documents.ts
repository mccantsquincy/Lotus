import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

/* 
  this function is used to retrieve documents from the database 
  that match the provided parent document ID and are created by 
  the authenticated user. It only returns documents that are not archived, 
  and the documents are returned in descending order.
*/ 
export const getSidebar = query({
    args: {
        parentDocument: v.optional(v.id("documents")) // passing and optional parentDocument referencing the ID of document as argument
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity(); // awaiting to check if user is authenticated

        if(!identity) {
            throw new Error("Not authenticated"); // if no user, we will not allow query database
        }

        const userId = identity.subject; // otherwise grab users ID

        const documents = await ctx.db
            .query("documents") // initiating query for documents collection in database
            .withIndex("by_user_parent", (q) => // using index by_user_parent defined in schema
                q
                    .eq("userId", userId) // looking for documents with IDs that match autheticated users ID
                    .eq("parentDocument", args.parentDocument) // looking for parentDocuments in database that matches parentDocument passed through args
            )
            .filter((q) => 
                q.eq(q.field("isArchived"), false) // filtered to only include documents that are not archived
            
            )
            .order("desc") // ordering documents in descending order
            .collect(); // trigerring query to run

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


