import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-school-popup',
  templateUrl: './add-school-popup.component.html',
  styleUrls: ['./add-school-popup.component.css']
})
export class AddSchoolPopupComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddSchoolPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(schoolData: any): void {
    this.dialogRef.close(schoolData);
  }

}
