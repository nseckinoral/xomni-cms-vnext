/// <amd-dependency path="text!./message-dialog.html" />

import ko = require("knockout");
import cms = require("app/infrastructure");
import dialog = require("models/dialog-content");

export var template: string = require("text!./message-dialog.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    constructor() {
        super();
        cms.infrastructure.shouter.subscribe<dialog.DialogContent>(content=> {
            switch (content.Type) {
                case dialog.ContentType.Success:
                    $('#header').addClass('successfull');
                    break;
                case dialog.ContentType.Warning:
                    $('#header').addClass('warning');
                    break;
                case dialog.ContentType.Error:
                    $('#header').addClass('error');
                    break;
            }
            $('#title').text(<string>content.Title);
            $('#dialogContent').html(<string>content.Body);
            $('#genericDialog').modal({ keyboard: false, show: true });
        }, this, "showDialog");
    }
}