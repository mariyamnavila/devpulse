export const role = ["contributor", "maintainer"] as const;

export type Role = typeof role[number];

export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    role: Role;
    created_at: Date;
    updated_at: Date;
}

export type RUser = Omit<IUser, "id" | "created_at" | "updated_at" | "password">;
