import { ObjectId } from "mongodb";
import * as z from "zod";
import { publicProcedure, router } from "~/server/trpc";
import { deleteImg, getImgUrl, getPreSignedUrl } from "~/server/s3";
import { Msg, msgCollection, msgSchema } from "./msg.model";

export const msgRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).optional(),
        cursor: z.number().int().min(1).optional(),
      })
    )
    .query(async ({ input, ctx: { db } }) => {
      const limit = input?.limit ?? 20;
      const page = input?.cursor ?? 1;
      const skipCount = (page - 1) * limit;

      const collection = msgCollection(db);
      const msgs = await collection
        .find({})
        .sort({ createdAt: "desc" })
        .skip(skipCount)
        .limit(limit)
        .toArray();

      return {
        list: msgs.map((msg) => ({
          ...msg,
          imgUrl: msg.hasImage ? getImgUrl(msg._id.toString()) : null,
        })),
        nextCursor: msgs.length === limit ? page + 1 : undefined,
      };
    }),

  add: publicProcedure
    .input(
      z.object({
        ...msgSchema.shape,
        createdAt: z.undefined(), // createdAt not needed in input
      })
    )
    .mutation(async ({ input, ctx: { db } }) => {
      const collection = msgCollection(db);
      const doc: Msg = { ...input, createdAt: new Date() };

      let preSignedUrl: string | null = null;

      const res = await collection.insertOne(doc);
      if (input.hasImage) {
        preSignedUrl = await getPreSignedUrl(res.insertedId.toString());
      }

      return preSignedUrl;
    }),

  delete: publicProcedure
    .input(z.string().min(1))
    .mutation(async ({ input, ctx: { db } }) => {
      const collection = msgCollection(db);
      const { value } = await collection.findOneAndDelete({
        _id: new ObjectId(input),
      });

      if (value?.hasImage) {
        await deleteImg(value._id.toString()).catch((err) => {
          // don't propagate image deletion errors to client
          console.error("Error deleting image: ", err);
        });
      }
    }),
});
