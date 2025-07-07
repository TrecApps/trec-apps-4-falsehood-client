import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FalsehoodService } from '../../services/falsehood.service';
import { AuthService, MarkdownPipe, UpSliderComponent } from '@tc/tc-ngx-general';
import { CommonModule } from '@angular/common';
import { BrandInfo, BrandInfoImg, ResourceType } from '../../model/BrandInfo';
import { FormsModule } from '@angular/forms';
import { BrandSearcherComponent } from '../brand-searcher/brand-searcher.component';
import { FalsehoodFull, FalsehoodRet, FalsehoodSeverity, FalsehoodSeverityStr, getSeverityValue } from '../../model/Falsehood';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent, RouterLink } from '@angular/router';

import { TagInputComponent, MarkdownEditorComponent, StylesService } from "@tc/tc-ngx-general";
import { BriefComponent } from '../brief/brief.component';
import { Brief, BriefPurpose } from '../../model/Brief';
import { FalsehoodStage, FalsehoodStageStr } from '../../model/Factcheck';
import ResponseObj from '../../model/ResponseObj';
import { Subscription } from 'rxjs';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-falsehood',
  imports: [CommonModule, FormsModule, MarkdownPipe, 
    BrandSearcherComponent, TagInputComponent, UpSliderComponent, 
    MarkdownEditorComponent, BriefComponent, TopBarComponent],
  templateUrl: './falsehood.component.html',
  styleUrl: './falsehood.component.css'
})
export class FalsehoodComponent implements OnDestroy{

  falsehoodService: FalsehoodService;
  authService: AuthService;
  styleService: StylesService;

  routerSubscription: Subscription;

  @ViewChild("tagComp")
  tagComp: TagInputComponent = new TagInputComponent();

  @ViewChild("fcMdEditor")
  fcMdEditor: MarkdownEditorComponent = new MarkdownEditorComponent();

  @ViewChild("briefEditor")
  briefEditor: MarkdownEditorComponent = new MarkdownEditorComponent();

  typePublicFigure = "PUBLIC_FIGURE";
  typeMediaOutlet = "MEDIA_OUTLET";
  typeInstitution = "INSTITUTION";

  constructor(falsehoodService: FalsehoodService, authService: AuthService, router: Router,private route: ActivatedRoute, styleService: StylesService){
    this.falsehoodService = falsehoodService;
    this.authService = authService;
    this.styleService = styleService;


    this.routerSubscription = router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        let endEvent : NavigationEnd = event;

        if(endEvent.url == "/falsehood" || endEvent.url.startsWith("/falsehood?")){
          
          this.editingContent = this.editingDate = this.editingIN = this.editingNotes = 
            this.editingMO = this.editingPF = this.editingSeverity = this.editingTags = false;

          if(this.route.snapshot.queryParamMap.has("id")){
            let id = this.route.snapshot.queryParamMap.get("id");
            if(id){
              this.falsehoodService.searchFalsehood(id).subscribe({
                next: (value: FalsehoodFull) => {
                  this.severity = getSeverityValue(value.fullMetaData?.severity, FalsehoodSeverity.OBJECTIVE); 

                  this.severityChanged = false;

                  if(value.fullMetaData?.publicFigure){
                    this.publicFigure = {
                      imgData: "",
                      brandInfo:value.fullMetaData.publicFigure
                    }
                  }

                  if(value.fullMetaData?.mediaOutlet) {
                    this.mediaOutlet = {
                      imgData: "",
                      brandInfo:value.fullMetaData.mediaOutlet
                    }
                  }

                  if(value.fullMetaData?.institution) {
                    this.institution = {
                      imgData: "",
                      brandInfo:value.fullMetaData.institution
                    }
                  }

                  this.date = value.fullMetaData?.dateMade;
                  this.curTags = value.fullMetaData?.tags || [];
                  this.currentNotes = value.fullMetaData?.notes || "";

                  setTimeout(()=> this.content = this.getContent(), 50);
                }
              })
            }

          }
        }
      }
    })
  }
  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  convertSeverity(fs: FalsehoodSeverity): string {
    if(typeof fs == 'string') return fs;
    return FalsehoodSeverityStr(fs);
  }

  convertStatus(fs: FalsehoodStage): string {
    if(typeof fs == 'string') return fs;
    return FalsehoodStageStr(fs);
  }

  SAVED = FalsehoodStage.SAVED;
  OBJECTIVE = FalsehoodSeverity.OBJECTIVE;

  META = 1;
  CONTENT = 2;
  BRIEFS = 3;

  mode = 1;

  setMode(mode: number){
    this.mode = mode;
  }

  isSubmitting: boolean = false;

  makeSubmitted(){
    if(this.isSubmitting) return;
    let curFalsehood = this.falsehoodService.currentFalsehood;
    if(!curFalsehood?.fullMetaData?.id) return;

    this.isSubmitting = true;

    this.falsehoodService.submitSavedFalsehood(curFalsehood.fullMetaData.id).subscribe({
      next: (vale: ResponseObj) => {
        this.isSubmitting = false;
        if(!curFalsehood.fullMetaData) return;
          curFalsehood.fullMetaData.status = FalsehoodStage.SUBMITTED;
      
        // To-Do - toast notification
      },
      error: () => {
        this.isSubmitting = false;
      }
    })
  }

  canSubmit(): boolean {
    let curFalsehood = this.falsehoodService.currentFalsehood;
    if(!curFalsehood?.fullMetaData?.id) return false;

    return this.authService.getCurrentUserId() == `User-${curFalsehood.fullMetaData.userId}` && (
      curFalsehood.fullMetaData.status.toString() == "SAVED" || curFalsehood.fullMetaData.status == FalsehoodStage.SAVED
    );
  }

  editStatus = [
    FalsehoodStage.SAVED,
    FalsehoodStage.SUBMITTED,
    "SAVED",
    "SUBMITTED"
  ];

  // Whether we are the submitter and they can edit
  canSubEdit(): boolean {
    let curFalsehood = this.falsehoodService.currentFalsehood;

    let currentUser = this.authService.getCurrentUserId();
    if(!currentUser || !curFalsehood || !curFalsehood.fullMetaData ||
       currentUser != `User-${curFalsehood.fullMetaData?.userId}`)
      return false;
    
    return this.editStatus.includes(curFalsehood.fullMetaData.status);

  }

  canEmpEdit(): boolean {

    let curFalsehood = this.falsehoodService.currentFalsehood;

    if(!this.authService.hasPermission('') || !curFalsehood)
      return false;

    return curFalsehood.fullMetaData?.status == FalsehoodStage.ACCEPTED || curFalsehood.fullMetaData?.status.toString() == "ACCEPTED";
  }

  editingPF: boolean = false;
  publicFigure: BrandInfoImg | undefined;
  changedPf(): boolean {
    if(!this.falsehoodService.currentFalsehood) return false;

    let pf = this.falsehoodService.currentFalsehood.fullMetaData?.publicFigure;
    if(pf){
      return pf.id != this.publicFigure?.brandInfo.id;
    }
    return Boolean(this.publicFigure?.brandInfo);
  }
  updatePublicFigure(){
    this.falsehoodService.runPatch("publicFigure", this.publicFigure?.brandInfo.id || "", () => {
      if(this.falsehoodService.currentFalsehood?.fullMetaData?.publicFigure){
        this.falsehoodService.currentFalsehood.fullMetaData.publicFigure = this.publicFigure?.brandInfo;
      }

      this.editingPF = false;
    })
  }

  editingMO: boolean = false;
  mediaOutlet: BrandInfoImg | undefined;
  changedMo(): boolean {
    if(!this.falsehoodService.currentFalsehood) return false;

    let mo = this.falsehoodService.currentFalsehood.fullMetaData?.mediaOutlet;
    if(mo){
      return mo.id != this.mediaOutlet?.brandInfo.id;
    }
    return Boolean(this.mediaOutlet?.brandInfo);
  }
  updateMediaOutlet(){
    this.falsehoodService.runPatch("mediaOutlet", this.mediaOutlet?.brandInfo.id || "", () => {
      if(this.falsehoodService.currentFalsehood?.fullMetaData?.mediaOutlet){
        this.falsehoodService.currentFalsehood.fullMetaData.mediaOutlet = this.mediaOutlet?.brandInfo;
      }
      this.editingMO = false;
    })
  }

  editingIN: boolean = false;
  institution: BrandInfoImg | undefined;
  changedIn(): boolean {
    if(!this.falsehoodService.currentFalsehood) return false;

    let i = this.falsehoodService.currentFalsehood.fullMetaData?.institution;
    if(i){
      return i.id != this.institution?.brandInfo.id;
    }
    return Boolean(this.institution?.brandInfo);
  }
  updateInstitution(){
    this.falsehoodService.runPatch("institution", this.institution?.brandInfo.id || "", () => {
      if(this.falsehoodService.currentFalsehood?.fullMetaData?.institution){
        this.falsehoodService.currentFalsehood.fullMetaData.institution = this.institution?.brandInfo;
      }
      this.editingIN = false;
    })
  }

  editingDate: boolean = false;
  date: Date | undefined;
  useDate: boolean = true;
  changedDate(): boolean {
    if(!this.falsehoodService.currentFalsehood) return !this.date == false;
    let i = this.falsehoodService.currentFalsehood.fullMetaData?.dateMade;
    if(i){
      return i != this.date;
    }
    return this.useDate;
  }
  updateDate(){
    this.falsehoodService.runPatch("dateMade", this.useDate && this.date ? new Date(this.date.toString()).toUTCString() : undefined, () => {
      if(this.falsehoodService.currentFalsehood?.fullMetaData)
        this.falsehoodService.currentFalsehood.fullMetaData.dateMade = this.useDate ? this.date : undefined;

      this.editingDate = false;
    })
  }

  titleChanged: boolean = false;
  titleUpdating: boolean = false;
//  curTitle: string = "";
  onUpdateTitle(){
    if(this.titleUpdating) return;
    this.titleUpdating = true;
    this.falsehoodService.runPatch("title", this.falsehoodService.currentFalsehood?.fullMetaData?.title, (result: boolean) => {
      this.titleChanged = !result;
      this.titleUpdating = false;
      // if(this.falsehoodService.currentFalsehood?.fullMetaData?.title)
      //   this.curTitle = this.falsehoodService.currentFalsehood?.fullMetaData.title;
    })
  }



  severityObjective = FalsehoodSeverity.OBJECTIVE;
  severityOppWithheld = FalsehoodSeverity.OPPOSING_EVIDENCE_WITHHELD;
  severitySuppWithheld = FalsehoodSeverity.SUPPORTING_EVIDENCE_WITHHELD;
  severitySubjective = FalsehoodSeverity.SUBJECTIVE;
  severityNarrative = FalsehoodSeverity.NARRATIVE_ISSUE;
  severityLogic = FalsehoodSeverity.FAULTY_LOGIC;
  severitySlogan = FalsehoodSeverity.TITLE_OR_SLOGAN;

  editingSeverity: boolean = false;
  severity: FalsehoodSeverity = FalsehoodSeverity.OBJECTIVE;

  severityChanged: boolean = false;
  severityUpdating: boolean = false;
  updateSeverity(){
    if(this.severityUpdating) return;
    this.severityUpdating = true;
    let severityStr = this.convertSeverity(this.severity);
    this.falsehoodService.runPatch("severity", severityStr, (result: boolean) => {
      if(this.falsehoodService.currentFalsehood?.fullMetaData)
        this.falsehoodService.currentFalsehood.fullMetaData.severity = getSeverityValue(severityStr, this.severity);
      this.editingSeverity = false;
      this.severityUpdating = false;
      this.severityChanged = !result;
    })
  }

  content: string = "";

  getContent(): string {
    let contentDetails = this.falsehoodService.currentFalsehood?.content;
    let content = "";
    if(contentDetails && contentDetails.length){
      content = contentDetails[contentDetails.length - 1].contents;
    }
    return content;
  }

  checkTagsUpdate(tags: string[]) : string {

    let content = this.getContent();
    content = content .replace("*", "")
      .replace("_", "")
      .replace("  ", " ")
      .toLowerCase();

      for(let tag of tags){
        if(content.indexOf(tag.toLowerCase()) == -1){
          return tag;
        }
      }

    return "";
  }

  editingTags: boolean = false;
  tagsUpdating: boolean = false;
  cantUpdateTags: string = "";
  curTags: string[] = [];
  updateTags(){

    if(this.tagsUpdating) return;

    let tags = this.falsehoodService.currentFalsehood?.fullMetaData?.tags || [];
    this.cantUpdateTags = this.checkTagsUpdate(tags).trim();
    if(this.cantUpdateTags.length) return;
    this.tagsUpdating = true;
    this.falsehoodService.runPatch("tags", tags.join(';'), () => {
      if(this.falsehoodService.currentFalsehood?.fullMetaData)
        this.falsehoodService.currentFalsehood.fullMetaData.tags = tags;
      this.editingTags = false;
      this.curTags = tags;
      this.tagsUpdating = false;
    })
  }

  editingNotes: boolean = false;
  currentNotes: string = "";
  notesUpdating: boolean = false;
  updateNotes(){
    if(this.notesUpdating || !this.falsehoodService.currentFalsehood?.fullMetaData) return;
    this.notesUpdating = true;
    this.falsehoodService.runPatch("notes", this.falsehoodService.currentFalsehood.fullMetaData.notes, (worked: boolean) => {
      this.currentNotes = this.falsehoodService.currentFalsehood?.fullMetaData?.notes || "";

      this.notesUpdating = false;
      if(worked)
        this.editingNotes = false;
    })
  }

  checkContentUpdate(contentInput: string) : string {
    let tags = this.falsehoodService.currentFalsehood?.fullMetaData?.tags || [];

    let content  = contentInput .replace("*", "")
    .replace("_", "")
    .replace("  ", " ")
    .toLowerCase();

    for(let tag of tags){
      if(content.indexOf(tag.toLowerCase()) != -1){
        return tag;
      }
    }


    return "";
  }

  editingContent: boolean = false;
  updateContent() {
    this.cantUpdateTags = this.checkContentUpdate(this.content).trim();
    if(this.cantUpdateTags.length) return;

    this.falsehoodService.runPatch("content", this.content, () => {
      if(this.falsehoodService.currentFalsehood){
        this.falsehoodService.currentFalsehood.content.push({
          contents: this.content,
          made: new Date(),
          version: this.falsehoodService.currentFalsehood.content.length
        });
      }
      this.editingContent = false;
    })
  }


  isAccepted(): boolean {
    let status = this.falsehoodService.currentFalsehood?.fullMetaData?.status;
    if(!status) return false;
    return FalsehoodStage.ACCEPTED == status || "ACCEPTED" == status.toString();
  }

  addingBrief: boolean = false;
  canAddbrief(): boolean {
    if(!this.authService.hasActiveTokens() || !this.authService.tcUser?.credibilityRating) return false;

    // ToDo: handle additional authorization constraints
    return this.authService.tcUser.credibilityRating >= 55;
  }
  briefContents: string = "";
  purposeAffirm = BriefPurpose.AFFIRM;
  purposeOppose = BriefPurpose.OPPOSE;
  purposeSuggest = BriefPurpose.SUGGEST;
  purpose: BriefPurpose = this.purposeAffirm;

  briefContent: string = "";

  submitBrief() {
    let id = this.falsehoodService.currentFalsehood?.fullMetaData?.id;
    if(!id) return;
    this.falsehoodService.submitBrief(id, this.purpose, this.briefContent).subscribe({
      next: (value: ResponseObj) => {
        let brief: Brief = {
          id: value.id || '',
          falsehoodId: id,
          userId: '',
          brandId: '',
          version: 0,
          displayName: this.authService.getCurrentDisplayName()?.toString() || "",
          purpose: this.purpose,
          created: new Date(),
          content: [{
            contents: this.briefContent,
            version: 1,
            made: new Date()
          }]
        };

        this.falsehoodService.currentFalsehood?.briefs.push(brief);
        this.addingBrief = false;
      }
    })
  }


  // Review
  isReviewing: boolean = false;
  reviewOptions: string[] = [];
  reviewOption: string = "";
  reviewComent: string = "";
  reviewPoints: number = 0;
  canReview(): boolean {
    return this.falsehoodService.canReview();
  }
  prepReview(){
    this.reviewOptions = this.falsehoodService.getReviewOptions()
    this.isReviewing = this.reviewOptions.length > 0;
    this.reviewOption = "";
    this.reviewPoints = 0;
  }

  submitReview(){
    this.falsehoodService.submitReview(this.reviewComent, this.reviewOption, this.reviewPoints, () => {
      this.isReviewing = false;
      this.reviewOption = "";
      this.reviewComent = "";
      this.reviewPoints = 0;
      this.reviewOptions = [];
    })
  }

  // Appeal
  isAppealing: boolean = false;
  appealComment: string = "";
  canAppeal(): boolean {
    return this.falsehoodService.canAppeal();
  }
  submitAppeal(){
    this.falsehoodService.submitAppeal(this.appealComment, () => {
      this.appealComment = "";
      this.isAppealing = false;
    })
  }
}
