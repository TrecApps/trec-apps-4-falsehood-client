import { Record } from "./Record";

export enum FalsehoodStage {
    SAVED,  // The owner is currently editing it, do not reveal in search results
    SUBMITTED,  // The owner has submitted it, awaiting the first round of review
    REJECTED,   // It has been rejected in the first round of review
    R_APPEALED, // It has been appealed after the rejection stage
    ACCEPTED,   // It has passed the first round of review
    DENIED,     // It has failed the second round of review
    CONFIRMED,  // It has passed the second round of review
    S_APPEALED,  // The previous Second review status is being appealed
    DELETED
}

export function FalsehoodStageStr(fs: FalsehoodStage): string {
    switch(fs){
        case FalsehoodStage.SAVED: return "Saved";
        case FalsehoodStage.SUBMITTED: return "Submitted";
        case FalsehoodStage.REJECTED: return "Rejected";
        case FalsehoodStage.R_APPEALED: return "Appealed (1st Stage)";
        case FalsehoodStage.ACCEPTED: return "Accepted";
        case FalsehoodStage.DENIED: return "Denied";
        case FalsehoodStage.CONFIRMED: return "Confirmed";
        case FalsehoodStage.S_APPEALED: return "Appealed (2nd Stage)";
        case FalsehoodStage.DELETED: return "Deleted";
    }
}

export interface Factcheck {

    
    id: string;

    name: string;
    userId: string;
    brandId: string | undefined;
    authorDisplayName: string;

    created: Date;
    published: Date;

    status: FalsehoodStage;
    records: Record[];
    tags: string[];
}

export interface FactcheckSubmission {
    content: string;
    title: string;
    tags: string[];
}