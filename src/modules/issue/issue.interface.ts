
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

export type CIssue = {
    title: string;
    description: string;
    type: "bug" | "feature_request";
}

export type UIssue = Partial<CIssue & {
    status?: "open" | "in_progress" | "resolved";
}>;

export interface IIssueWithReporter {
    id: number;
    title: string;
    description: string;
    type: "bug" | "feature_request";
    status: "open" | "in_progress" | "resolved";
    reporter: {
        id: number;
        name: string;
        email: string;
    };
    created_at: Date;
    updated_at: Date;
}

export interface IIssueQueryParams {
    sort?: "newest" | "oldest";
    type?: "bug" | "feature_request";
    status?: "open" | "in_progress" | "resolved";
}