import { relations } from "drizzle-orm/relations";
import { user, mess, rooms, employes  , session, account} from "./schema";

export const messRelations = relations(mess, ({one, many}) => ({
	profile: one(user, {
		fields: [mess.userId],
		references: [user.id]
	}),
	rooms: many(rooms),
}));

 
export const employesRelations = relations(employes, ({one}) => ({
	room: one(rooms, {
		fields: [employes.roomId],
		references: [rooms.id]
	}),
	profile: one(user, {
		fields: [employes.userId],
		references: [user.id]
	}),
}));

export const roomsRelations = relations(rooms, ({one, many}) => ({
	employes: many(employes),
	mess: one(mess, {
		fields: [rooms.meesId],
		references: [mess.id]
	}),
	profile: one(user, {
		fields: [rooms.userId],
		references: [user.id]
	}),
}));



export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
		messes: many(mess),
	employes: many(employes),
	rooms: many(rooms),
	accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));
