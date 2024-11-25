"use server";

import { SettingSchema } from "@/types/settings-schema";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const settings = action
  .schema(SettingSchema)
  .action(async ({ parsedInput: values }) => {
    // get the session user from next-auth
    const user = await auth();
    console.log("user her", user);

    // IF NOT USER RETURN ERROR
    if (!user) {
      return { error: "User not found" };
    }

    // IF SESSION: CHECK IF THE USER IS IN DB
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.user.id),
    });

    // IF THERE IS NOT USER IN DB, AS IT SHOULD BE WHICH IS DONE BY NEXT-AUTH WHILE DOING OAUTH LOGGED IN,
    // RETURN ERROR
    if (!dbUser) {
      return { error: "User not found" };
    }

    // CHECK IF SESSION USER IS OAUTH LOGGED IN VIA GOOGLE || GITHUB
    if (user.user.isOAuth) {
      // IF OAUTH USER THEN SET FORM EMAIL | PASSWORD | NEW PASSWORD | TWOFACTORAUTH TO UNDEFINED AS THESE ARE ALREADY DONE BY OAUTH PROVIDERS
      values.email = undefined;
      values.password = undefined;
      values.newPassword = undefined;
      values.isTwoFactorEnabled = undefined;
    }

    // IF NOT OAUTH USER
    // CHECK FOR CURRENT PASSWORD, NEW PASSWORD AND DBPASSWORD EXIST
    if (values.password && values.newPassword && dbUser.password) {
      // CHECK IF CURRENT PASSWORD MATCHED DBPASSWORD
      const passwordMatch = await bcrypt.compare(
        values.password,
        dbUser.password
      );
      // IF NOT MATCHED RETURN ERROR
      if (!passwordMatch) {
        return { error: "Current password does not match" };
      }

      // CHECK IF NEW PASSWORD IS SAME AS DB PASSWORD
      const samePassword = await bcrypt.compare(
        values.newPassword,
        dbUser.password
      );
      // IF SAME OLD PASSWORD RETURN ERROR
      if (samePassword) {
        return { error: "New password is the same as the old password" };
      }

      // IF NO ERROR IN PASSWORD SETTING THEN HASH THE INCOMING NEW PASSWORD
      const hashedPassword = await bcrypt.hash(values.newPassword, 10);
      // SET THE FORM PASSWORD TO HASHED PASSWORD AND NEW PASSWORD TO NULL|UNDEFINED
      values.password = hashedPassword;
      values.newPassword = undefined;
    }

    // UPDATE THE USER USING FORM VALUES WHERE USERS.ID IS FOUND DBUSER.ID
    const updatedUser = await db
      .update(users)
      .set({
        twoFactorEnabled: values.isTwoFactorEnabled,
        name: values.name,
        email: values.email,
        password: values.password,
        image: values.image,
      })
      .where(eq(users.id, dbUser.id));

    // REFRESH THE SETTING ROUTE IN FRONTEND WHEN ALL WORK DONE
    revalidatePath("/dashboard/settings");

    // RETURN SUCCESS MESSSAGE
    return { success: "Settings updated" };
  });

// export const settings = action
//   .schema(SettingSchema)
//   .action(async ({ parsedInput: values }) => {
//     const user = await auth();

//     if (!user) return { error: "User not found!" };

//     const dbUser = await db.query.users.findFirst({
//       where: eq(users.id, user.user.id),
//     });

//     // if oauth provider? : google | github
//     if (user.user.isOAuth) {
//       values.email = undefined;
//       values.password = undefined;
//       values.newPassword = undefined;
//       values.isTwoFactorEnabled = undefined;
//     }

//     // if no oauth then check password
//     if (values.password && values.newPassword && dbUser?.password) {
//       const passwordMatch = await bcrypt.compare(
//         values.password,
//         dbUser.password
//       );
//       if (!passwordMatch) {
//         return { error: "Password doesn't match!" };
//       }

//       const hashedPassword = await bcrypt.hash(values.newPassword, 10);

//       values.password = hashedPassword;
//       values.newPassword = undefined;
//     }
//     const updatedUser = await db
//       .update(users)
//       .set({
//         name: values.name,
//         password: values.password,
//         twoFactorEnabled: values.isTwoFactorEnabled,
//         image: values.image,
//       })
//       .where(eq(users.id, dbUser.id));
//     // once update revalidate the component | path
//     revalidatePath("/dashboard/settings");
//     return { success: " Setting updated!" };
//   });
