import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FalsehoodService } from '../../services/falsehood.service';
import { AuthService, MarkdownPipe } from '@tc/tc-ngx-general';
import { CommonModule } from '@angular/common';
import { BrandInfo, BrandInfoImg } from '../../model/BrandInfo';
import { FormsModule } from '@angular/forms';
import { BrandSearcherComponent } from '../brand-searcher/brand-searcher.component';
import { FalsehoodFull, FalsehoodSeverity } from '../../model/Falsehood';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent, RouterLink } from '@angular/router';

import { TagInputComponent, MarkdownEditorComponent } from "@tc/tc-ngx-general";
import { StylesService } from '../../services/styles.service';
import { BriefComponent } from '../brief/brief.component';
import { Brief, BriefPurpose } from '../../model/Brief';
import { FalsehoodStage } from '../../model/Factcheck';
import ResponseObj from '../../model/ResponseObj';
import { Subscription } from 'rxjs';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-falsehood',
  imports: [CommonModule, FormsModule, BrandSearcherComponent, TagInputComponent, MarkdownPipe, MarkdownEditorComponent, BriefComponent, TopBarComponent],
  templateUrl: './falsehood.component.html',
  styleUrl: './falsehood.component.css'
})
export class FalsehoodComponent implements OnDestroy{

  prepData(){

  }


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

  constructor(falsehoodService: FalsehoodService, authService: AuthService, router: Router,private route: ActivatedRoute, styleService: StylesService){
    this.falsehoodService = falsehoodService;
    this.authService = authService;
    this.styleService = styleService;


    this.routerSubscription = router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        let endEvent : NavigationEnd = event;

        if(endEvent.url == "/Falsehood"){
          
          if(this.route.snapshot.queryParamMap.has("id")){
            let id = this.route.snapshot.queryParamMap.get("id");
            if(id){
              this.falsehoodService.searchFalsehood(id).subscribe({
                next: (value: FalsehoodFull) => {
                  this.severity = value.fullMetaData?.severity || FalsehoodSeverity.OBJECTIVE; 
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

  META = 1;
  CONTENT = 2;
  BRIEFS = 3;

  mode = 1;

  setMode(mode: number){
    this.mode = mode;
  }

  canSubEdit(): boolean {
    return false;
  }

  canEmpEdit(): boolean {
    return false;
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
      if(this.falsehoodService.currentFalsehood?.fullMetaData)
        this.falsehoodService.currentFalsehood.fullMetaData.publicFigure = this.publicFigure?.brandInfo;
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
      if(this.falsehoodService.currentFalsehood?.fullMetaData)
        this.falsehoodService.currentFalsehood.fullMetaData.mediaOutlet = this.mediaOutlet?.brandInfo;
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
      if(this.falsehoodService.currentFalsehood?.fullMetaData)
        this.falsehoodService.currentFalsehood.fullMetaData.institution = this.institution?.brandInfo;
    })
  }

  editingDate: boolean = false;
  date: Date = new Date();
  useDate: boolean = true;
  changedDate(): boolean {
    if(!this.falsehoodService.currentFalsehood) return false;
    let i = this.falsehoodService.currentFalsehood.fullMetaData?.dateMade;
    if(i){
      return i != this.date;
    }
    return this.useDate;
  }
  updateDate(){
    this.falsehoodService.runPatch("dateMade", this.useDate ? this.date.toUTCString() : undefined, () => {
      if(this.falsehoodService.currentFalsehood?.fullMetaData)
        this.falsehoodService.currentFalsehood.fullMetaData.dateMade = this.useDate ? this.date : undefined;
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
  updateSeverity(){
    this.falsehoodService.runPatch("severity", this.severity.toString(), () => {
      if(this.falsehoodService.currentFalsehood?.fullMetaData)
        this.falsehoodService.currentFalsehood.fullMetaData.severity = this.severity;
    })
  }

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
        if(content.indexOf(tag.toLowerCase()) != -1){
          return tag;
        }
      }

    return "";
  }

  editingTags: boolean = false;
  cantUpdateTags: string = "";
  updateTags(){
    let tags = this.tagComp.getTags();
    this.cantUpdateTags = this.checkTagsUpdate(tags).trim();
    if(this.cantUpdateTags.length) return;

    this.falsehoodService.runPatch("tags", tags.join(';'), () => {
      if(this.falsehoodService.currentFalsehood?.fullMetaData)
        this.falsehoodService.currentFalsehood.fullMetaData.tags = tags;
      this.editingTags = false;
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
    let content = this.fcMdEditor.getContent().toString();
    this.cantUpdateTags = this.checkContentUpdate(content).trim();
    if(this.cantUpdateTags.length) return;

    this.falsehoodService.runPatch("content", content, () => {
      if(this.falsehoodService.currentFalsehood){
        this.falsehoodService.currentFalsehood.content.push({
          contents: content,
          made: new Date(),
          version: this.falsehoodService.currentFalsehood.content.length
        });
      }
      this.editingContent = false;
    })
  }


  isAccepted(): boolean {
    return FalsehoodStage.ACCEPTED == this.falsehoodService.currentFalsehood?.fullMetaData?.status;
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

  submitBrief() {
    let id = this.falsehoodService.currentFalsehood?.fullMetaData?.id;
    if(!id) return;
    let content = this.briefEditor.getContent().toString();
    this.falsehoodService.submitBrief(id, this.purpose, content).subscribe({
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
            contents: content,
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
