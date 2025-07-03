import { BrandInfo } from "./BrandInfo";
import { Brief, ContentVersion } from "./Brief";
import { Factcheck, FalsehoodStage } from "./Factcheck";
import { Record } from "./Record";

export interface FalsehoodPatch {
    field: string;
    value: string;
}




export enum FalsehoodSeverity {
    OBJECTIVE = "OBJECTIVE",                          // The given claim is objectively false
    OPPOSING_EVIDENCE_WITHHELD = "OPPOSING_EVIDENCE_WITHHELD",         // The claim is undermined by evidence hidden from the audience/readers
    SUPPORTING_EVIDENCE_WITHHELD = "SUPPORTING_EVIDENCE_WITHHELD",       // There was supporting evidence, but it was withheld
                                                // (possibly to mislead the services contributors)
    SUBJECTIVE = "SUBJECTIVE",                         // The given claim uses a standard not consistently used by the person or organization served
    NARRATIVE_ISSUE = "NARRATIVE_ISSUE",                    // (MISC - avoid until clear guidance is set)
    FAULTY_LOGIC = "FAULTY_LOGIC",                       // The logic used to support a narrative is faulty and can be undermined with solid logic
    TITLE_OR_SLOGAN = "TITLE_OR_SLOGAN"                    // A chronic falsehood where an entity engages in false advertising or name
}

export function FalsehoodSeverityStr(fs: FalsehoodSeverity): string {
    switch(fs){
        case FalsehoodSeverity.OBJECTIVE: return "Objective";
        case FalsehoodSeverity.OPPOSING_EVIDENCE_WITHHELD: return "Withheld Opposing Evidence";
        case FalsehoodSeverity.SUPPORTING_EVIDENCE_WITHHELD: return "Withheld Supporting Evidence";
        case FalsehoodSeverity.SUBJECTIVE: return "Subjective";
        case FalsehoodSeverity.NARRATIVE_ISSUE: return "Issue with Narrative";
        case FalsehoodSeverity.FAULTY_LOGIC: return "Faulty Logic";
        case FalsehoodSeverity.TITLE_OR_SLOGAN: return "Title or Sloagan";
    }
}

export function getSeverityValue(input: FalsehoodSeverity | string | null | undefined, fallback: FalsehoodSeverity): FalsehoodSeverity {
    if(!input) return fallback;

    if(typeof input === "string"){
        switch(input.trim().replaceAll(" ", "_").toUpperCase()){
            case "OBJECTIVE": return FalsehoodSeverity.OBJECTIVE;
            case "OPPOSING_EVIDENCE_WITHHELD": 
            case "WITHHELD_OPPOSING_EVIDENCE":
                return FalsehoodSeverity.OPPOSING_EVIDENCE_WITHHELD;
            case "SUPPORTING_EVIDENCE_WITHHELD": 
            case "WITHHELD_SUPPORTING_EVIDENCE":
                return FalsehoodSeverity.SUPPORTING_EVIDENCE_WITHHELD;
            case "SUBJECTIVE": return FalsehoodSeverity.SUBJECTIVE;
            case "NARRATIVE_ISSUE": 
            case "ISSUE_WITH_NARRATIVE":
                return FalsehoodSeverity.NARRATIVE_ISSUE;
            case "FAULTY_LOGIC": return FalsehoodSeverity.FAULTY_LOGIC;
            case "TITLE_OR_SLOGAN": return FalsehoodSeverity.TITLE_OR_SLOGAN;
            default: return fallback;
        }
    }

    return input;
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
    title: string;
}



export interface FalsehoodRet {
    
    id: string;

    dateMade: Date | undefined;

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
    title: string;
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

    title: string;
}