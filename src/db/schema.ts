import { pgTable,  boolean, index , foreignKey, unique,  bigint, text, timestamp, date, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

 

export const bussinesDo = pgEnum("bussines_do", ['Animation', 'Analytics', 'Mining', 'Other'])
export const capacity = pgEnum("capacity", ['full', 'available'])
export const gender = pgEnum("gender", ['male', 'female'])
export const messType = pgEnum("mess_type", ['male', 'female', 'mixture'])
export const role = pgEnum("role", ['supervisor', 'operator', 'engineer', 'mechanic', 'technician', 'driver',  'HRD' ,'other'])
export const status = pgEnum("status", ['active', 'not-active'])



export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
}, (table) => [
	unique("user_email_key").on(table.email),
 
]);

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);


export const mess = pgTable("mess", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "mess_id_seq", startWith: 1, increment: 1, minValue: 1,  cache: 1 }),
      userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
	name: text().notNull(),
	location: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	capacityRoom: bigint("capacity_room", { mode: "number" }).default(sql`'30'`),
type: messType().default('mixture').notNull(),
	deskripcion: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	status: status().default('active').notNull(),
	statusCapacity: capacity("status_capacity").default('available').notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	capacityEmploye: bigint("capacity_employe", { mode: "number" }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "mess_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("mess_name_key").on(table.name),
	 
]);

 




export const employes = pgTable("employes", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "employes_id_seq", startWith: 1, increment: 1, minValue: 1,  cache: 1 }),
      userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
	name: text().notNull(),
	birth: date(),
	phone: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	nik: bigint({ mode: "number" }),
	address: text(),
	email: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	gender: gender().default('male').notNull(),
	role: role().default('other').notNull(),
	status: status().default('active').notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roomId: bigint({ mode: "number" }),
}, (table) => [
	foreignKey({
			columns: [table.roomId],
			foreignColumns: [rooms.id],
			name: "employes_roomId_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "employes_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("employes_name_key").on(table.name),
	 
]);

export const rooms = pgTable("rooms", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "rooms_id_seq", startWith: 1, increment: 1, minValue: 1,   cache: 1 }),
      userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	meesId: bigint("mees_id", { mode: "number" }).notNull(),
	name: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	capacity: bigint({ mode: "number" }).default(sql`'6'`),
	deskripcion: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	status: status().default('active').notNull(),
	statusCapacity: capacity("status_capacity").default('available').notNull(),
	type: messType().default('mixture').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.meesId],
			foreignColumns: [mess.id],
			name: "rooms_mees_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "rooms_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("rooms_name_key").on(table.name),
	 
]);

export type Employes = typeof employes.$inferSelect ;
export type User = typeof user.$inferSelect ;
export type Rooms = typeof rooms.$inferSelect;
export type Mess = typeof mess.$inferSelect;