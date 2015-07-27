/// <amd-dependency path="text!./loading-modal.html" />

import ko = require("knockout");
import cms = require("app/infrastructure");

export var template: string = require("text!./loading-modal.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    constructor() {
        super();
        cms.infrastructure.shouter.subscribe(isLoading=> {
            if (isLoading === true) {
                this.showLoadingDialog();
            }
            else {
                this.hideLoadingDialog();
            }
        }, this, "showLoading");
    }

    showLoadingDialog() {
        if ($("BODY").hasClass("modal-open") == false) {
            $('#pleaseWaitDialog').modal({ keyboard: false, show: true });
        }
    }

    hideLoadingDialog() {
        $('#pleaseWaitDialog').modal('hide');
    }
}