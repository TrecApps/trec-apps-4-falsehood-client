import { BrandInfo } from "./BrandInfo";
import { Brief, ContentVersion } from "./Brief";
import { Factcheck, FalsehoodStage } from "./Factcheck";
import { Record } from "./Record";

export interface FalsehoodPatch {
    field: string;
    value: string;
}




export enum FalsehoodSeverity {
    OBJECTIVE,                          // The given claim is objectively false
    OPPOSING_EVIDENCE_WITHHELD,         // The claim is undermined by evidence hidden from the audience/readers
    SUPPORTING_EVIDENCE_WITHHELD,       // There was supporting evidence, but it was withheld
                                                // (possibly to mislead the services contributors)
    SUBJECTIVE,                         // The given claim uses a standard not consistently used by the person or organization served
    NARRATIVE_ISSUE,                    // (MISC - avoid until clear guidance is set)
    FAULTY_LOGIC,                       // The logic used to support a narrative is faulty and can be undermined with solid logic
    TITLE_OR_SLOGAN                     // A chronic falsehood where an entity engages in false advertising or name
}

export interface Falsehood {
    
    id: string;

    dateMade: Date;

    userId: string;
    brandId: string;
    authorDisplayName: string;

    publicFigure: string; // ID of the Public FIgure "Brand" object stored in a SQL DB
    mediaOutlet: string;
    institution: string;
    status: FalsehoodStage;
    severity: FalsehoodSeverity;

    factcheck: string;

    records: Record[];
    tags: string[];

    notes: string;
}



export interface FalsehoodRet {
    
    id: string;

    dateMade: Date;

    userId: string;
    brandId: string;
    authorDisplayName: string;

    publicFigure: BrandInfo | undefined; // ID of the Public FIgure "Brand" object stored in a SQL DB
    mediaOutlet: BrandInfo | undefined;
    institution: BrandInfo | undefined;
    status: FalsehoodStage;
    severity: FalsehoodSeverity;

    factcheck: Factcheck | undefined;

    records: Record[];
    tags: string[];

    notes: string;
}

export interface FalsehoodFull {
    metadata: Falsehood | undefined;
    fullMetaData: FalsehoodRet | undefined;
    content: ContentVersion[];
    initContent: string | undefined;

    briefs: Brief[];
}

export interface FalsehoodSubmission {
    publicFigure: string | undefined;
    mediaOutlet: string | undefined;
    institution: string | undefined;

    dateMade: Date | undefined;

    severity: FalsehoodSeverity;

    factcheck: string| undefined;
    tags: string[];
    content: string;

    notes: string | undefined;
}