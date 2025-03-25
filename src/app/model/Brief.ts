export interface ContentVersion {
    version: number;
    made: Date;
    contents: string;
}

export enum BriefPurpose {
    AFFIRM,
    OPPOSE,
    SUGGEST
}

export interface Brief {
    id: string;
    falsehoodId: string;


    userId: string;
    brandId: string;
    version: number;
    displayName: string;
    purpose: BriefPurpose;
    created: Date;

    content: ContentVersion[];
}