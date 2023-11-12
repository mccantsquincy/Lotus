import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

/*
  The function defines a mutation operation called archive that is 
  used to archive a document and its child documents. 
  It first checks if the user is authenticated, retrieves the user's ID, 
  and verifies that the document exists and belongs to the authenticated user. 
  Then, it recursively archives all the child documents of the main document. 
  Finally, it archives the main document itself. 
  The code uses the ctx object to interact with the database and the args object to
  pass arguments to the mutation. The archived document is returned as the result of the mutation.
*/
export const archive = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            throw new Error("Not authenticated")
        }

        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if(!existingDocument) {
            throw new Error("Not found")
        }

        if(existingDocument.userId !== userId) {
            throw new Error("Unauthorized");
        }

        const recursiveArchive = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) => (
                    q
                        .eq("userId", userId)
                        .eq("parentDocument", documentId)
                ))
                .collect();

            for(const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: true,
                });

                await recursiveArchive(child._id);
            }
        }

        const document = await ctx.db.patch(args.id, {
            isArchived: true,
        });
        
        recursiveArchive(args.id);
        
        return document;
    }
})

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

 export const getTrash = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => 
                q.eq(q.field("isArchived"), true)
            )
            .order("desc")
            .collect();

        return documents;
    }
 })

 export const restore = mutation({
    args: { id: v.id("documents")},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;

        const existingDocuments = await ctx.db.get(args.id);

        if(!existingDocuments) {
            throw new Error("Not found");
        }

        if(existingDocuments.userId !== userId) {
            throw new Error("Unauthorized");
        }

        const recursiveRestore = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) => (
                    q
                        .eq("userId", userId)
                        .eq("parentDocument", documentId)
                ))
                .collect();

            for(const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: false,
                });

                await recursiveRestore(child._id);
            }
        }

        const options: Partial<Doc<"documents">> = {
            isArchived: false,
        }

        if(existingDocuments.parentDocument) {
            const parent = await ctx.db.get(existingDocuments.parentDocument);

            if(parent?.isArchived) {
                options.parentDocument = undefined;
            }
        }

        await ctx.db.patch(args.id, options);

        recursiveRestore(args.id);

        return existingDocuments;

    }
 })

 export const remove = mutation({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) {
            throw new Error("Not authenticated");
        }

        const userId = identity.subject;
    }
 })


