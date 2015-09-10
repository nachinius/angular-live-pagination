/**
 * Created by ignacio on 9/9/15.
 */

angular.module("myApp",["nachinius.live_pagination"]).
    controller('mainController',function($scope) {

        $scope.list = [];

        $scope.noOfPages = 3;
        $scope.currentPage = 1;

        var elementsPerPage = 10;
        var listCounter = 0; // counter that mimics different lists

        $scope.changeList = function(selectedPage, _maxPages, _elementsPerPage) {
            debugger;
            $scope.currentPage = selectedPage;
            $scope.noOfPages = _maxPages;
            elementsPerPage = _elementsPerPage;
            $scope.list.length = 0; // reset list
            listCounter++;
            loadPage(1);
        };


        function loadPage(which) {
            // initialize list
            $scope.list.length = 0;
            for(var i=0;i<elementsPerPage;i++) {
                $scope.list.push('element '+ (i + elementsPerPage*($scope.currentPage-1))+ ' of page '+$scope.currentPage + ' of list ['+listCounter+']');
            };
        }
        loadPage(1);

        /**
         * @param where 'next'|'prev'| or int indicating page number
         */
        $scope.goToPage = function(where) {
            if(where == 'next' && $scope.currentPage < $scope.noOfPages) {
                $scope.currentPage++;
                loadPage($scope.currentPage);
            } else if(where == 'prev' && $scope.currentPage > 1) {
                $scope.currentPage--;
                loadPage($scope.currentPage);
            } else {
                // make sure we're in range
                if(where <= $scope.noOfPages && where >= 1) {
                    $scope.currentPage = where;
                    loadPage($scope.currentPage);
                } else {
                    throw "bad page request";
                }
            }
        }

    });


