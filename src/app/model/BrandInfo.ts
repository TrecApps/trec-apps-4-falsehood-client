
export enum ResourceType {
    PUBLIC_FIGURE,
    ARTIST,
    MUSICIAN,
    ACTOR,
    POLITICIAN,
    MEDIA_OUTLET,
    STUDIO,
    SHOW,
    REGION,
    INSTITUTION,
    SCHOOL,
    COLLEGE,
    ORGANIZATION,
    CONCEPT,
    LITERATURE,
    BOOK,
    FILM,
    TAXONOMY,
    ART,
    BRAND,
    DRAWING,
    PAINTING,
    SCULPTURE,
    SONG,
    SPECIES,
    ANIMAL,
    PLANT,
    FOOD,
    CONTINENT,
    COUNTRY,
    BIOME,
    DEVICE,
    MACHINE,
    LANGUAGE,
    RESTAURANT,
    GAME,
    BOARD_GAME,
    SPORT,
    CARD_GAME,
    VIDEO_GAME,
    APP
}


export interface BrandInfo
{ 
    id: string;
    resourceTypePrimary: ResourceType;
    resourceTypeSecondary: ResourceType | undefined;
    resourceTypeTertiary: ResourceType | undefined;
    name: string;
    defaultLanguage: string;
    brandId: string | undefined;
}

export class BrandInfoImg {
    brandInfo: BrandInfo;
    imgData: string | undefined;
    constructor(brandInfo: BrandInfo){
        this.brandInfo = brandInfo;
    }
}

export interface ObjectMap {
    [key: string]: string;
}

export class ResourceMetadata {
    profileBase64: string | undefined;
    profileDesc: string | undefined;
    metadata: ObjectMap = {};
}