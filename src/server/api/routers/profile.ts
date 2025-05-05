import { editProfileFormSchema } from "~/features/profile/forms/edit-profile";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { supabaseAdminClient } from "~/lib/supabase/server";
import { SUPABASE_BUCKET } from "~/lib/supabase/bucket";

export const profileRouter = createTRPCRouter({
  getProfile: privateProcedure.query(async ({ ctx }) => {
    const { db, user } = ctx;

    const profile = await db.profile.findUnique({
      where: {
        userId: user?.id,
      },
      select: {
        bio: true,
        profilePictureUrl: true,
        username: true,
      },
    });

    return profile;
  }),

  createProfile: privateProcedure
    .mutation( async ({ ctx }) => {
      const { db, user } = ctx;

      if (!user) return;

        const profileExists = await db.profile.findUnique({
          where: {
            userId: user?.id,
          },
          select: {
            bio: true,
            profilePictureUrl: true,
            username: true,
          },
        });

        if (profileExists) return;

        const profile = await db.profile.create({
          data: {
            userId: user.id,
            email: user.email!,
            username: user.user_metadata?.name as string,
            profilePictureUrl: user.user_metadata.avatar_url as string,
          }
        })
        return profile;
    }),

  updateProfile: privateProcedure
  .input(editProfileFormSchema)
  .mutation(async ({ ctx, input }) => {
    const { db, user } = ctx;
    const { username, bio } = input;

    if (username) {
      const usernameExists = await db.profile.findUnique({
        where: {
          username: username,
        },
        select: {
          userId: true,
        },
      });

      if (usernameExists) {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "USERNAME_USED",
        })
      }
    }

    const profile = await db.profile.update({
      where: {
        userId: user?.id,
      },
      data: {
        bio: bio,
        username: username,
      }
    });

    return profile;
  }),
  updateProfilePicture: privateProcedure
  .input(z.string().base64().optional())
  .mutation(async ({ ctx, input }) => {
    const { db, user } = ctx;

    const timeStamp = new Date().getTime().toString();
    const fileName = `avatar-${user?.id}.png`;

    if (input) {
      const imageBuffer = Buffer.from(input, "base64");

      const { error } = await supabaseAdminClient.storage
      .from(SUPABASE_BUCKET.AVATAR)
      .upload(fileName, imageBuffer, {
        contentType: "image/png",
        upsert: true,
      });

      if (error) throw error;

      const avatarUrl = supabaseAdminClient.storage
      .from(SUPABASE_BUCKET.AVATAR)
      .getPublicUrl(fileName);

      await db.profile.update({
        where: {
          userId: user?.id,
        },
        data: {
          profilePictureUrl: avatarUrl.data.publicUrl + `?t=${timeStamp}`,
        },
      });
    }
  }),
});
