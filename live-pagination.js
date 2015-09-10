/**
 * @author @nachinius
 */

/**
 * Usage
 * 
 * <live-pagination no-of-pages="noOfPages"
	current-page="currentPage"
	how-to-go-to-page="goToPage(where)"/>
 *	
 * Both noOfPages and currentPage are bidirectional bindings!!! This means
 * that you must put angular variable from your scope there.
 *  
 * This directive is listening to changes in this values, and re-renders itself if necessary. For
 * example, if the noOfPages has changed or the currentPage has moved
 * it will accommodates to the new values.
 * 
 *  The fantastic is the expression you set in the how-to-go-to-page attribute.
 *  That expression, (in this case `goToPage(where)` ), will be angular evaluated
 *  with `where` replaced by a number that indicated the page, or the string 'next' or 'prev'
 *  which indicates the request to 'next' page or 'prev' page. It's up to the function goToPage
 *  which must be implemented in the scope what to do with this values. 	
 */
angular.module('nachinius.live_pagination',[]).directive('livePagination', function() {
	
	return {
		restrict: 'E',
		replace: true,
		scope: {
			noOfPages: '=', // bidirectional binding
			currentPage: '=', // bidirectional binding
			howToGoToPage: '&howToGoToPage' // callback function that knows how to move to selected page
		},
		templateUrl: 'template/livePaginationTemplate.html',
		compile: function(tElement, tAttrs, transclude) {
			
			/**
			 * 
			 * @param scope
			 * @param element
			 * @param attr
			 * @returns
			 */
			return function link(scope, element, attr) {
				
				scope.show = {
						prevPageLink: false,
						first: false,
						dotsToFirst: false,
						displayPages: [],
						dotsToLast: false,
						last: false,
						nextPageLink: false
				};
				
				scope.goToPage = function(command) {
					scope.howToGoToPage({where: command});
				};

				
				function reactToPaginationChanges() {
					
					var pages = scope.noOfPages;
					var currentPage = scope.currentPage;
					
					if(!angular.isNumber(pages) ||
							!angular.isNumber(currentPage)) {
						return;
					}
						
											
						// show Next Link only if not in last page
						scope.show.nextPageLink = pages-currentPage > 0;
						
						// show Prev Link only if not in first page
						scope.show.prevPageLink = currentPage > 1;
						
						// clean the list of pages to show
						scope.show.displayPages.length = 0;
						
						// put currentPage on the list
						scope.show.displayPages.push(currentPage);
						
						// put numbers before.... but never the 1
						var page = -1 + currentPage; 
						while(page > 1 && currentPage - page < 3) {
							scope.show.displayPages.unshift(page);
							page--;
						}
						// if it ended before the 2... we are missing dots
						scope.show.dotsToFirst = page > 1;
						
						// put first page, b/c it was not included yet
						scope.show.first = (page > 0);
						
						// put numbers after
						var page = 1 + currentPage;
						while(page < pages && page - currentPage < 3) {
							scope.show.displayPages.push(page);
							page++;
						}
						
						page--;
						scope.show.dotsToLast = pages > page +1 ;
						scope.show.last = pages > page;
				}
				
				scope.$watch('noOfPages',reactToPaginationChanges);
				scope.$watch('currentPage',reactToPaginationChanges);
				
			}
			
		}
	}
}); // endirective and module

angular.module('nachinius.live_pagination').
	run(["$templateCache",function($templateCache) {
        $templateCache.put('template/livePaginationTemplate.html',
            "<div class=\"pagination_container top\">\n" +
            "    	<div class=\"pagination\">\n" +
            "	        <ul>\n" +
            "	        	<li class=\"prev\" ng-show=\"show.prevPageLink\"><a href=\"\" ng-click=\"goToPage('prev')\">Prev</a></li>\n" +
            "	        	<li class=\"first\" ng-show=\"show.first\" ng-class=\"{active: (page ==currentPage)}\"><a href=\"\" ng-click=\"goToPage(1)\">1</a></li>\n" +
            "	        	<li class=\"dots\" ng-show=\"show.dotsToFirst\">...</li>\n" +
            "	        	<li ng-repeat=\"page in show.displayPages\" ng-class=\"{active: (page == currentPage)}\">\n" +
            "	        		<a href=\"\" ng-click=\"goToPage(page)\" ng-bind=\"page\"></a>\n" +
            "	        	</li>\n" +
            "	        	<li class=\"dots\" ng-show=\"show.dotsToLast\">...</li>\n" +
            "	        	<li class=\"last\" ng-show=\"show.last\" ng-class=\"{active: (page == currentPage)}\"><a href=\"\" ng-click=\"goToPage(noOfPages)\" ng-bind=\"noOfPages\"></a></li>\n" +
            "	        	<li class=\"next\" ng-show=\"show.nextPageLink\"><a href=\"\" ng-click=\"goToPage('next')\">Next</a></li>\n" +
            "	        </ul>\n" +
            "    	</div>\n" +
            "</div>");
    }]);
