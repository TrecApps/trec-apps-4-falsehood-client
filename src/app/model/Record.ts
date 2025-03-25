

export enum RecordEvent {
    CREATED,
    SUBMITTED,
    EDITED,
    REJECTED,
    ACCEPTED,
    APPEAL_1,

    REJECT,
    REJECT_OUT,
    PENALIZE,
    PENALIZE_OUT,
    ACCEPT,
    ACCEPT_OUT,
    SUGGEST,

    FIELD_CHANGED,
    CONFIRM,
    CONFIRM_OUT,
    DENY,
    DENY_OUT,
    CONFIRMED,
    DENIED,
    APPEAL_2,

    DELETED,
    DELETE_REV
}


export interface Record { 
    id: string;
    falsehoodId: string; // Used when stored as separate entities

    userId: string;
    brandId: string | undefined;
    displayName: string;
    date: Date;
    event: RecordEvent;

    comment: string;

    points: number;
}