export const role = ["contributor", "maintainer"] as const;

type Role = typeof role[number];

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

export interface IIssue {
    id: number;
    title: string;
    description: string;
    type: "bug" | "feature_request";
    status: "open" | "in_progress" | "resolved";
    reporter_id: number;
    created_at: Date;
    updated_at: Date;
}