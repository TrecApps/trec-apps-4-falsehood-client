import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Brief, BriefPurpose } from '../../model/Brief';
import { AuthService, MarkdownEditorComponent, MarkdownPipe, StylesService } from '@tc/tc-ngx-general';
import { CommonModule } from '@angular/common';
import { FalsehoodService } from '../../services/falsehood.service';
import ResponseObj from '../../model/ResponseObj';

@Component({
  selector: 'app-brief',
  imports: [CommonModule, MarkdownPipe, MarkdownEditorComponent],
  templateUrl: './brief.component.html',
  styleUrl: './brief.component.css'
})
export class BriefComponent implements OnInit {

  @Input()
  brief: Brief = {
    id: "",
    falsehoodId: '',
    userId: '',
    brandId: '',
    version: 0,
    displayName: '',
    purpose: BriefPurpose.AFFIRM,
    created: new Date(),
    content: []
  }

  @Input()
  falsehoodId: string = "";

  @ViewChild('editBriefEditor')
  editBriefEditor: MarkdownEditorComponent = new MarkdownEditorComponent();

  styleService: StylesService;

  constructor(private authService: AuthService,styleService: StylesService, private falsehoodService: FalsehoodService){
    this.styleService = styleService;
  }
  ngOnInit(): void {
    this.content = this.getContent();
  }

  canEdit(): boolean {
    if(!this.authService.hasActiveTokens()) return false;

    let user = this.authService.tcUser;
    if(!user) return false;

    return this.brief.userId == user.id && user.authRoles.includes("FALSEHOOD_SUBSCRIPTION");
  }

  editing: boolean = false;

  content: string = "";

  getContent(): string {
    return this.brief.content.length > 0 ? (
      this.brief.content[this.brief.content.length - 1].contents
    ) : "";
  }


  updateContent( ) {
    
    this.falsehoodService.editBrief(this.falsehoodId, this.brief.id, this.content).subscribe({
      next: (value: ResponseObj) => {
        this.brief.content.push({
          contents: this.content,
          made: new Date(),
          version: this.brief.content.length + 1
        });
      }
    })

    this.editing = false;
  }

}
