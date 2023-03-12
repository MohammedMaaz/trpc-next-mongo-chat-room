import { publicProcedure, router } from "~/server/trpc";
import { Msg, msgCollection, msgSchema } from "./msg.model";
import * as z from "zod";
import { deleteImg, getImgUrl, getPreSignedUrl } from "~/server/s3";
import { ObjectId } from "mongodb";

export const msgRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).optional(),
        page: z.number().int().min(1).positive().optional(),
      })
    )
    .query(async ({ input, ctx: { db } }) => {
      const limit = input?.limit ?? 10;
      const page = input?.page ?? 1;
      const skipCount = (page - 1) * limit;

      const collection = msgCollection(db);
      const msgs = await collection
        .find({})
        .sort({ createdAt: "desc" })
        .skip(skipCount)
        .limit(limit)
        .toArray();

      return msgs.map((msg) => ({
        ...msg,
        imgUrl: msg.hasImage ? getImgUrl(msg._id.toString()) : null,
      }));
    }),

  add: publicProcedure
    .input(
      z.object({
        ...msgSchema.shape,
        createdAt: z.NEVER,
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
        await deleteImg(value._id.toString());
      }
    }),
});
