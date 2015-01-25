var bundle = {};

// bundle.config = 'app/js/config.js';

//Services
// bundle.dataService = 'app/js/services/dataService.js';
// bundle.searchService = 'app/js/services/searchService.js';
bundle.accountService = 'services/accountService.js';
bundle.googleMapService = 'services/googleMapService.js'
// //Controllers
bundle.placeFinderCtrl = 'js/placeFinderCtrl.js';
// bundle.frontPageController = 'app/js/controllers/frontPageController.js';
// bundle.homeController = 'app/js/controllers/homeController.js';
// bundle.headerController = 'app/js/controllers/headerController.js';
// bundle.footerController = 'app/js/controllers/footerController.js';
// bundle.signupController = 'app/js/controllers/signupController.js';
// bundle.signinController = 'app/js/controllers/signinController.js';
// bundle.tileListController = 'app/js/controllers/tileListController.js';
// bundle.userhomeController = 'app/js/controllers/userhomeController.js';
// bundle.newsFeedController = 'app/js/controllers/newsFeedController.js';
// bundle.sidePanelController = 'app/js/controllers/sidePanelController.js';
// bundle.fourOfourController = 'app/js/controllers/fourOfourController.js';

// //Services
// bundle.dataService = 'app/js/services/dataService.js';
// bundle.searchService = 'app/js/services/searchService.js';
// bundle.accountService = 'app/js/services/accountService.js';

// //Directives
// bundle.header = 'app/js/directives/headerDirective.js';
// bundle.footer = 'app/js/directives/footerDirective.js';
// bundle.tile = 'app/js/directives/tileDirective.js';
// bundle.signin = 'app/js/directives/signinDirective.js';
// bundle.tileList = 'app/js/directives/tileListDirective.js';
// bundle.homeNews = 'app/js/directives/homeNewsDirective.js';


// //Angular Module
// bundle.ngcookies = 'http://code.angularjs.org/1.2.25/angular-cookies.js'

for(var i in bundle){
	var obj = bundle[i];
   	document.write('<script type="text/javascript" src="' + obj + '"></script>');
}

