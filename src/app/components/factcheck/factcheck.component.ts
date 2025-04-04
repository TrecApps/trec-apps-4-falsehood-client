import { Component, ViewChild } from '@angular/core';
import { FactcheckService } from '../../services/factcheck.service';
import { StylesService } from '../../services/styles.service';
import { FactcheckSubmission, FalsehoodStage } from '../../model/Factcheck';
import ResponseObj from '../../model/ResponseObj';
import { AuthService, MarkdownEditorComponent, MarkdownPipe, TagInputComponent, TcUser } from '@tc/tc-ngx-general';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-factcheck',
  imports: [CommonModule, FormsModule, TagInputComponent,MarkdownEditorComponent, MarkdownPipe, TopBarComponent],
  templateUrl: './factcheck.component.html',
  styleUrl: './factcheck.component.css'
})
export class FactcheckComponent {

  prepData(){
    this.factcheckService.currentFactcheck = {
      id: '3',
      name: 'Title3',
      userId: '1',
      brandId: undefined,
      authorDisplayName: 'Steve Rogers',
      created: new Date(),
      published: new Date(),
      status: FalsehoodStage.SAVED,
      records: [],
      tags: ["three", "triez", "trois"]
    }

    this.factcheckService.currentContents = "# Thanos is coming \n The avengers need to assemble";

    this.authService.loginToken = {
      access_token: "access",
      refresh_token: "refresh",
      token_type: "temp",
      id_token: "id",
      expires_in: 1000
    }
    let user = new TcUser();
    this.authService.tcUser = user;

    user.id = "1";
    user.displayName = "John";

  }

  factcheckService: FactcheckService;
  styleService: StylesService;
  constructor(factcheckService: FactcheckService,styleService: StylesService, private authService: AuthService) {
    this.factcheckService = factcheckService;
    this.styleService = styleService;
  }

  @ViewChild("subTagEditor")
  subTagEditor: TagInputComponent = new TagInputComponent();

  @ViewChild("subMarkdownEditor")
  subMarkdownEditor: MarkdownEditorComponent = new MarkdownEditorComponent();

  @ViewChild("editTagEditor")
  editTagEditor: TagInputComponent = new TagInputComponent();

  @ViewChild("editMardownEditor")
  editMardownEditor: MarkdownEditorComponent = new MarkdownEditorComponent();

  submission: FactcheckSubmission | undefined;

  isSubmitting: boolean = false;
  postFactcheck(doSubmit: boolean){
    if(!this.submission || this.isSubmitting) return;

    this.isSubmitting = true;

    this.factcheckService.postFactcheck(this.submission, doSubmit).subscribe({
      next: (value: ResponseObj) => {
        this.isSubmitting = false;
        if(!value.id) return;
        this.factcheckService.currentFactcheck = {
          id: value.id,
          name: this.submission?.title || "",
          userId: this.authService.getCurrentUserId() || "",
          brandId: "",
          authorDisplayName: this.authService.getCurrentDisplayName() || "",
          created: new Date(),
          published: new Date(),
          status: doSubmit ? FalsehoodStage.SUBMITTED : FalsehoodStage.SAVED,
          records: [],
          tags: this.submission?.tags || []
        }
        this.factcheckService.currentContents = this.submission?.content || "";
        this.submission = undefined;
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }

  //prepNew


  isEditing: boolean = false;

  canEdit(): boolean {
    if(!this.factcheckService.currentFactcheck || !this.factcheckService.currentContents) return false;

    let user = this.authService.tcUser;
    if(!user || user.id != this.factcheckService.currentFactcheck.userId) return false;
    let status = this.factcheckService.currentFactcheck.status;
    return status == FalsehoodStage.SAVED || status == FalsehoodStage.SUBMITTED;
  }

  titleChanged: boolean = false;
  contentChanged: boolean = false;

  patchedField(field: string){
    if("title" == field) this.titleChanged = false;
    if("content" == field) this.contentChanged = false;
  }

  tag: string = "";


  checkTagAndArticle(tags: string[], content: string): string{
    content  = content.replace("*", "")
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


  patchFactcheck(field: string){
    if(!this.factcheckService.currentFactcheck || this.isSubmitting) return;
    let value: string;
    switch(field){
      case "title":
        value = this.factcheckService.currentFactcheck.name;
        break;
      case "content":
        this.tag = this.checkTagAndArticle(this.editTagEditor.getTags(), this.editMardownEditor.getContent().toString());
        if(this.tag.length) return;
        value = this.editMardownEditor.getContent().toString();
        break;
      case "tags":
        this.tag = this.checkTagAndArticle(this.editTagEditor.getTags(), this.editMardownEditor.getContent().toString());
        if(this.tag.length) return;
        value = this.editTagEditor.getTags().join(";");
        break;
      default: return;
    }

    this.isSubmitting = true;

    this.factcheckService.patchFactcheck(field, value, this.factcheckService.currentFactcheck.id).subscribe({
      next: (obj: ResponseObj)=> {
        this.isSubmitting = false;
        this.patchedField(field);
      }, error: () => {
        this.isSubmitting = false;
      }
    })
  }

  isReviewing: boolean = false;
  canReview(): boolean {
    let user = this.authService.tcUser;
    if(!this.factcheckService.currentFactcheck || !user) return false;
    let status = this.factcheckService.currentFactcheck.status;
    return user.authRoles.includes("FALSEHOOD_EMPLOYEE") && (status == FalsehoodStage.SUBMITTED || status == FalsehoodStage.R_APPEALED);
  }

  reviewComment: string = "";
  reviewMode: string = "";
  reviewSubmitted: boolean = false;
  postReview(){
    if(!this.factcheckService.currentFactcheck || this.reviewSubmitted) return;

    this.reviewSubmitted = true;

    this.factcheckService.reviewFactcheck(this.factcheckService.currentFactcheck.id, this.reviewComment, this.reviewMode).subscribe({
      next: (value: ResponseObj) => {
        this.reviewSubmitted = false;
        this.isReviewing = false;
        this.reviewComment = "";
        this.reviewMode = "";
      },
      error: ()=> {
        this.reviewSubmitted = false;
      }
    })
  }



  isAppealing: boolean = false;
  canAppeal():boolean {
    let factcheck = this.factcheckService.currentFactcheck;
    if(!factcheck) return false;

    if(factcheck.status != FalsehoodStage.REJECTED && factcheck.status != FalsehoodStage.R_APPEALED) return false;

    if(factcheck.status == FalsehoodStage.REJECTED)
      return factcheck.userId == this.authService.getCurrentUserId();

    let user = this.authService.tcUser;
    return user != undefined && (user.authRoles.includes("FALSEHOOD_EMPLOYEE") || user.authRoles.includes("FALSEHOOD_JUROR"));
  }
  appealComment: string = "";
  appealSubmitted: boolean = false;
  postAppeal(){
    if(!this.factcheckService.currentFactcheck || this.appealSubmitted) return;

    this.appealSubmitted = true;

    this.factcheckService.appealFactcheck(this.factcheckService.currentFactcheck.id, this.reviewComment).subscribe({
      next: (value: ResponseObj) => {
        this.appealSubmitted = false;
        this.isAppealing = false;
        this.appealComment = "";
      },
      error: ()=> {
        this.appealSubmitted = false;
      }
    })
  }


}
