/// <amd-dependency path="xomni" />
/// <amd-dependency path="text!./tenant-settings.html" />

import $ = require("jquery");
import ko = require("knockout");
import cms = require("app/infrastructure");

export var template: string = require("text!./tenant-settings.html");

export class viewModel extends cms.infrastructure.baseViewModel {

}