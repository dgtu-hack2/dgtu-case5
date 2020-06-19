'use strict';
    /*
    To use this element:
    HTML:
    <div ng-dropdown-multiselect="" extra-settings="dropdownSetting"
        options="optionsArray" selected-model="modelWhereCheckedObjects" checkboxes="true"></div>
   </div>
   JS:
   $scope.dropdownSetting = {
        scrollable: true,
        enableSearch: true,
        scrollableHeight : '300px',
        closeOnBlur: true, //close dropdown when click mouse not at element
        showCheckAll: true,
        checkBoxes: true,
        elementIdToGetWidth: 'elemToGetWidth', //width dropdown will be width this element ID
        displayProp: 'projectName' //display property name (its mean that's in list will be this element name and etc)
    };
    LOOK MORE FOR HELP:
   */

var directiveModule = angular.module('angularjs-dropdown-multiselect', []);

directiveModule.directive('ngDropdownMultiselect', ['$filter', '$document', '$compile', '$parse',
    function ($filter, $document, $compile, $parse) {

        return {
            restrict: 'AE',
            scope: {
                selectedModel: '=',
                options: '=',
                extraSettings: '=',
                events: '=',
                searchFilter: '=?',
                translationTexts: '=',
                groupBy: '@'
            },
            template: function (element, attrs, $scope) {
                var checkboxes = attrs.checkboxes ? true : false;
                var groups = attrs.groupBy ? true : false;

                var template = '<div class="multiselect-parent btn-group dropdown-multiselect">';
                template += '<button style=" width: 200px;" type="button" class="dropdown-toggle" ng-class="settings.buttonClasses" ng-click="toggleDropdown()"><span style="float: left">{{getButtonText()}}</span>&nbsp;<span class="caret"></span></button>';
                template += '<ul style="left: -1px; overflow: auto" class="dropdown-menu dropdown-menu-form " id="multiselectId" ng-style="{display: open ? \'block\' : \'none\', \'max-height\' : settings.scrollable ? settings.scrollableHeight : \'auto\'  }"   >';
                template += '<li ng-hide="!settings.showCheckAll || settings.selectionLimit > 0"><a class="pointer" data-ng-click="selectAll()"><span class="fa fa-check "></span>  {{texts.checkAll}}</a>';
                template += '<li ng-show="settings.showUncheckAll"><a class="pointer" data-ng-click="deselectAll();"><span class="fas fa-times"></span>   {{texts.uncheckAll}}</a></li>';
                template += '<li ng-hide="(!settings.showCheckAll || settings.selectionLimit > 0) && !settings.showUncheckAll" class="divider"></li>';
                template += '<li ng-show="settings.enableSearch"><div class="dropdown-header"><input type="text" class="form-control" style="width: 100%;" ng-model="searchFilter" placeholder="{{texts.searchPlaceholder}}" /></li>';
                template += '<li ng-show="settings.enableSearch" class="divider"></li>';

                if (groups) {
                    template += '<li ng-repeat-start="option in orderedItems | filter: searchFilter" ng-show="getPropertyForObject(option, settings.groupBy) !== getPropertyForObject(orderedItems[$index - 1], settings.groupBy)" role="presentation" class="dropdown-header pointer">{{ getGroupTitle(getPropertyForObject(option, settings.groupBy)) }}</li>';
                    template += '<li ng-repeat-end role="presentation">';
                } else {
                    template += '<li class="pointer" role="presentation" ng-repeat="option in options | filter: searchFilter">';
                }

                template += '<a role="menuitem" tabindex="-1" ng-click="setSelectedItem(getPropertyForObject(option,settings.idProp))">';

                if (checkboxes) {
                    template += '<div class="checkbox" style="margin-top: 3px;margin-bottom: 3px; white-space: normal;"><label class="multiselect-label"><input class="checkboxInput" type="checkbox" ng-click="checkboxClick($event, getPropertyForObject(option,settings.idProp))" ng-checked="isChecked(getPropertyForObject(option,settings.idProp))" /> {{getPropertyForObject(option, settings.displayProp)+" "+getPropertyForObject(option, settings.displayProp2)}}</label></div></a>';
                } else {
                    template += '<span data-ng-class="{\'fa fa-check\': isChecked(getPropertyForObject(option,settings.idProp))}"></span> {{getPropertyForObject(option, settings.displayProp)}}</a>';
                }

                template += '</li>';

                template += '<li class="divider" ng-show="settings.selectionLimit > 1"></li>';

                template += '<li role="presentation" ng-show="settings.selectionLimit > 1"><a role="menuitem">{{selectedModel.length}} {{texts.selectionOf}} {{settings.selectionLimit}} {{texts.selectionCount}}</a></li>';

                template += '</ul>';
                template += '</div>';

                element.html(template);
            },
            link: function ($scope, $element, $attrs) {
                var $dropdownTrigger = $element.children()[0];

                $scope.toggleDropdown = function () {
                    $scope.open = !$scope.open;
                };

                $scope.checkboxClick = function ($event, id) {
                    $scope.setSelectedItem(id);
                    $event.stopImmediatePropagation();
                };

                $scope.externalEvents = {
                    onItemSelect: angular.noop,
                    onItemDeselect: angular.noop,
                    onSelectAll: angular.noop,
                    onDeselectAll: angular.noop,
                    onInitDone: angular.noop,
                    onMaxSelectionReached: angular.noop
                };

                $scope.settings = {
                    dynamicTitle: true,
                    scrollable: false,
                    scrollableHeight: '300px',
                    closeOnBlur: true,
                    displayProp: 'label',
                    displayProp2: 'label2',
                    idProp: 'id',
                    externalIdProp: 'id',
                    enableSearch: false,
                    selectionLimit: 0,
                    showCheckAll: true,
                    showUncheckAll: true,
                    closeOnSelect: false,
                    buttonClasses: 'btn btn-default',
                    closeOnDeselect: false,
                    groupBy: $attrs.groupBy || undefined,
                    groupByTextProvider: null,
                    smartButtonMaxItems: 0,
                    smartButtonTextConverter: angular.noop
                };

                $scope.texts = {
                    checkAll: 'Выбрать всё',
                    uncheckAll: 'Убрать всё',
                    selectionCount: 'Выбрано',
                    selectionCount1: 'элемент',
                    selectionCount2: 'элемента',
                    selectionCount3: 'элементов',
                    selectionOf: '/',
                    searchPlaceholder: 'Поиск...',
                    buttonDefaultText: 'Выбрать',
                    dynamicButtonTextSuffix: 'Выбрано'
                };

                $scope.searchFilter = $scope.searchFilter || '';

                if (angular.isDefined($scope.settings.groupBy)) {
                    $scope.$watch('options', function (newValue) {
                        if (angular.isDefined(newValue)) {
                            $scope.orderedItems = $filter('orderBy')(newValue, $scope.settings.groupBy);
                        }
                    });
                }

                angular.extend($scope.settings, $scope.extraSettings || []);
                angular.extend($scope.externalEvents, $scope.events || []);
                angular.extend($scope.texts, $scope.translationTexts);

                $scope.singleSelection = $scope.settings.selectionLimit === 1;

                function getFindObj(id) {
                    var findObj = {};

                    if ($scope.settings.externalIdProp === '') {
                        findObj[$scope.settings.idProp] = id;
                    } else {
                        findObj[$scope.settings.externalIdProp] = id;
                    }

                    return findObj;
                }

                function clearObject(object) {
                    for (var prop in object) {
                        delete object[prop];
                    }
                }

                if ($scope.singleSelection) {
                    if (angular.isArray($scope.selectedModel) && $scope.selectedModel.length === 0) {
                        clearObject($scope.selectedModel);
                    }
                }

                if ($scope.settings.closeOnBlur) {
                    $document.on('click', function (e) {
                        var target = e.target.parentElement;
                        var parentFound = false;

                        while (angular.isDefined(target) && target !== null && !parentFound) {
                            if (_.contains(target.className.split(' '), 'multiselect-parent') && !parentFound) {
                                if(target === $dropdownTrigger) {
                                    parentFound = true;
                                }
                            }
                            target = target.parentElement;
                        }

                        if (!parentFound) {
                            $scope.$apply(function () {
                                $scope.open = false;
                            });
                        }
                    });
                }
                if($scope.settings.elementIdToGetWidth){
                    setTimeout(function () {
                        // $('#multiselectId').css({"width":$('#'+$scope.settings.elementIdToGetWidth).width()+5});
                        $('#multiselectId').css({"width": "max-content", "min-width": "200px", "max-width": "400px"});
                    },500)

                }

                $scope.getGroupTitle = function (groupValue) {
                    if ($scope.settings.groupByTextProvider !== null) {
                        return $scope.settings.groupByTextProvider(groupValue);
                    }

                    return groupValue;
                };

                function getSelectedText(count) {
                    var selectedText = "";
                    if (count && count>0) {
                        var numText = count + "";
                        var lastNum = Number(numText.substring(numText.length-1, numText.length));
                        if (lastNum==1) {
                            selectedText = $scope.texts.selectionCount1;
                        } else if (lastNum>=2 && lastNum<=4) {
                            selectedText = $scope.texts.selectionCount2;
                        } else {
                            selectedText = $scope.texts.selectionCount3;
                        };
                    };
                    return selectedText;
                };

                $scope.getButtonText = function () {
                    if ($scope.settings.dynamicTitle && ($scope.selectedModel.length > 0 || (angular.isObject($scope.selectedModel) && _.keys($scope.selectedModel).length > 0))) {
                        if ($scope.settings.smartButtonMaxItems > 0) {
                            var itemsText = [];

                            angular.forEach($scope.options, function (optionItem) {
                                if ($scope.isChecked($scope.getPropertyForObject(optionItem, $scope.settings.idProp))) {
                                    var displayText = $scope.getPropertyForObject(optionItem, $scope.settings.displayProp) + " " + $scope.getPropertyForObject(optionItem, $scope.settings.displayProp2);

                                    var converterResponse = $scope.settings.smartButtonTextConverter(displayText, optionItem);

                                    itemsText.push(converterResponse ? converterResponse : displayText);
                                }
                            });

                            if ($scope.selectedModel.length > $scope.settings.smartButtonMaxItems) {
                                itemsText = itemsText.slice(0, $scope.settings.smartButtonMaxItems);
                                itemsText.push('...');
                            }

                            return itemsText.join(', ');
                        } else {
                            var totalSelected;

                            if ($scope.singleSelection) {
                                totalSelected = ($scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp])) ? 1 : 0;
                            } else {
                                totalSelected = angular.isDefined($scope.selectedModel) ? $scope.selectedModel.length : 0;
                            }

                            if (totalSelected === 0) {
                                return $scope.texts.buttonDefaultText;
                            } else {
                                //return totalSelected + ' ' + $scope.texts.dynamicButtonTextSuffix;.
                                var cases = [2, 0, 1, 1, 1, 2];
                                var titles = [ $scope.texts.selectionCount1, $scope.texts.selectionCount2, $scope.texts.selectionCount3 ];
                                return totalSelected + ' ' + titles[ (totalSelected%100>4 && totalSelected%100<20)? 2 : cases[(totalSelected%10<5)?totalSelected%10:5] ];
                            }
                        }
                    } else {
                        return $scope.texts.buttonDefaultText;
                    }
                };

                $scope.getPropertyForObject = function (object, property) {
                    if (angular.isDefined(object) && object.hasOwnProperty(property)) {
                        return object[property];
                    }

                    return '';
                };

                $scope.selectAll = function () {
                    $scope.deselectAll(false);
                    $scope.externalEvents.onSelectAll();

                    angular.forEach($scope.options, function (value) {
                        $scope.setSelectedItem(value[$scope.settings.idProp], true);
                    });
                };

                $scope.deselectAll = function (sendEvent) {
                    sendEvent = sendEvent || true;

                    if (sendEvent) {
                        $scope.externalEvents.onDeselectAll();
                    }

                    if ($scope.singleSelection) {
                        clearObject($scope.selectedModel);
                    } else {
                        $scope.selectedModel.splice(0, $scope.selectedModel.length);
                    }
                };

                $scope.setSelectedItem = function (id, dontRemove) {
                    var findObj = getFindObj(id);
                    var finalObj = null;

                    if ($scope.settings.externalIdProp === '') {
                        finalObj = _.find($scope.options, findObj);
                    } else {
                        finalObj = findObj;
                    }

                    if ($scope.singleSelection) {
                        clearObject($scope.selectedModel);
                        angular.extend($scope.selectedModel, finalObj);
                        $scope.externalEvents.onItemSelect(finalObj);
                        if ($scope.settings.closeOnSelect) $scope.open = false;

                        return;
                    }

                    dontRemove = dontRemove || false;

                    var exists = _.findIndex($scope.selectedModel, findObj) !== -1;

                    if (!dontRemove && exists) {
                        $scope.selectedModel.splice(_.findIndex($scope.selectedModel, findObj), 1);
                        $scope.externalEvents.onItemDeselect(findObj);
                    } else if (!exists && ($scope.settings.selectionLimit === 0 || $scope.selectedModel.length < $scope.settings.selectionLimit)) {
                        $scope.selectedModel.push(finalObj);
                        $scope.externalEvents.onItemSelect(finalObj);
                    }
                    if ($scope.settings.closeOnSelect) $scope.open = false;
                };

                $scope.isChecked = function (id) {
                    if ($scope.singleSelection) {
                        return $scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp]) && $scope.selectedModel[$scope.settings.idProp] === getFindObj(id)[$scope.settings.idProp];
                    }

                    return _.findIndex($scope.selectedModel, getFindObj(id)) !== -1;
                };

                $scope.externalEvents.onInitDone();
            }
        };
    }]);