import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService, MarkdownEditorComponent, TagInputComponent, TcUser, StylesService } from '@tc/tc-ngx-general';
import { Subscription } from 'rxjs';
import { FalsehoodSeverity, FalsehoodSubmission } from '../../model/Falsehood';
import { BrandInfoImg, ResourceType } from '../../model/BrandInfo';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrandSearcherComponent } from '../brand-searcher/brand-searcher.component';
import { FalsehoodService } from '../../services/falsehood.service';
import ResponseObj from '../../model/ResponseObj';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-falsehood-submit',
  imports: [CommonModule, FormsModule, TagInputComponent, MarkdownEditorComponent, BrandSearcherComponent, TopBarComponent],
  templateUrl: './falsehood-submit.component.html',
  styleUrl: './falsehood-submit.component.css'
})
export class FalsehoodSubmitComponent implements OnDestroy {

  routeSubscription: Subscription;
  styleService: StylesService;


  newFalsehood: undefined | FalsehoodSubmission;

  publicFigure: undefined | BrandInfoImg;
  mediaOutlet: undefined | BrandInfoImg;
  institution: undefined | BrandInfoImg;

  severityObjective = FalsehoodSeverity.OBJECTIVE;
  severityOppWithheld = FalsehoodSeverity.OPPOSING_EVIDENCE_WITHHELD;
  severitySuppWithheld = FalsehoodSeverity.SUPPORTING_EVIDENCE_WITHHELD;
  severitySubjective = FalsehoodSeverity.SUBJECTIVE;
  severityNarrative = FalsehoodSeverity.NARRATIVE_ISSUE;
  severityLogic = FalsehoodSeverity.FAULTY_LOGIC;
  severitySlogan = FalsehoodSeverity.TITLE_OR_SLOGAN;

  tag: string = "";

  typePublicFigure = "PUBLIC_FIGURE";
  typeMediaOutlet = "MEDIA_OUTLET";
  typeInstitution = "INSTITUTION";

  checkTagAndContent(): string {
    if(!this.newFalsehood) return "";
    let content = this.newFalsehood?.content;
    if(content)
    content = content .replace("*", "")
      .replace("_", "")
      .replace("  ", " ")
      .toLowerCase();

      for(let tag of this.newFalsehood.tags){
        if(content.indexOf(tag.toLowerCase()) == -1){
          return tag;
        }
      }

    return "";
  }



  @ViewChild("tagComp")
  tagComp: TagInputComponent = new TagInputComponent();

  @ViewChild("fcMdEditor")
  fcMdEditor: MarkdownEditorComponent = new MarkdownEditorComponent();

  hasCredibility(user: TcUser | undefined): boolean {
    if(!user || !user.credibilityRating) return false;
    return user.credibilityRating >= 5;
  }

  constructor(private authService: AuthService, private router: Router, styleService: StylesService, private falsehoodService: FalsehoodService){
    this.styleService = styleService;


    this.routeSubscription = router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        let endEvent : NavigationEnd = event;

        if(endEvent.url == "/falsehood-submit"){
          // if not authenticated, redirect to Logon page
          if(!this.authService.hasActiveTokens() || !this.hasCredibility(this.authService.tcUser)){
            router.navigateByUrl("/Logon");
            return;
          }

          if(!this.newFalsehood){

            this.newFalsehood = {
              publicFigure: undefined,
              mediaOutlet: undefined,
              institution: undefined,
              dateMade: undefined,
              severity: FalsehoodSeverity.OBJECTIVE,
              factcheck: undefined,
              tags: [],
              content: "",
              notes: "",
              title: ""
            }
          }

        }
      }
    })

  }
  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  canSubmit(): boolean {
    let brandsProvided = this.publicFigure !== undefined && (
      this.mediaOutlet !== undefined || this.institution !== undefined
    );

    let fieldsProvided = Boolean(this.fcMdEditor.getContent().trim()) //&& Boolean(this.newFalsehood?.severity)
      && Boolean(this.newFalsehood?.title.trim().length);
      
    let remProvided = Boolean(this.newFalsehood?.dateMade) || this.newFalsehood?.severity == FalsehoodSeverity.TITLE_OR_SLOGAN;
    
    return (brandsProvided || (this.newFalsehood?.notes?.trim().length || 0) > 0) && fieldsProvided && remProvided && (this.checkTagAndContent().length == 0);
  }

  enableSelection: boolean = true;

  submitFalsehood(doSubmit: boolean){
    this.tag = this.checkTagAndContent();
    if(this.tag.length || !this.newFalsehood) return;

    this.newFalsehood.institution = this.institution?.brandInfo.id;
    this.newFalsehood.mediaOutlet = this.mediaOutlet?.brandInfo.id;
    this.newFalsehood.publicFigure = this.publicFigure?.brandInfo.id;

    this.newFalsehood.content = this.fcMdEditor.getContent().toString();

    this.newFalsehood.tags = this.tagComp.getTags();

    this.enableSelection = false;
    this.falsehoodService.submitFalsehood(this.newFalsehood, doSubmit).subscribe({
      next: (value: ResponseObj) => {
        setTimeout(() => {
          this.enableSelection = true;
          this.newFalsehood = undefined;

          this.router.navigate(["/falsehood"], {
            queryParams: {
              id: value.id
            }
          })
        })

      }, error: () => {
        this.enableSelection = true;
      }
    })

    
  }

}
