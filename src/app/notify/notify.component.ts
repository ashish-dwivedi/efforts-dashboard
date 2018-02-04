import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent {
  @Input() modalData: any;

  constructor(private _NgbActiveModal: NgbActiveModal) {}

  dismiss() {
    this._NgbActiveModal.dismiss('Done');
  }
}