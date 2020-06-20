var services = angular.module('myApp.services', ['ngRoute']);

services.factory('infoService', function ($uibModal, $sce) {
    var service = {};

    service.infoFunction = function (text, title) {
        var modalInstance = $uibModal.open({
            templateUrl: 'modalWindows/InfoModal/infoModal.html',
            controller: 'InfoModalWindowCtrl',
            windowClass: 'info-window-modal',
            size: 'size',
            resolve: {
                element: function () {
                    return text;
                },
                title: function () {
                    return title;
                }
            }
        });
    };

    service.openConfirmationModal = function (title, text) {
        var props = {
            animation: true,
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'modalWindows/ConfirmationModal/confirmationModal.html',
            controller: 'ConfirmationModalCtrl',
            resolve: {
                title: function () {
                    return title;
                },
                text: function () {
                    return text;
                }
            }
        };

        return $uibModal.open(props);
    };

    service.getComment = function (comment) {
        if (comment) {
            comment = $sce.trustAsHtml(findAndReplaceLink(comment.replace(/\r\n|\r|\n/g, " <br /> ")));
            return comment;
        }
    }

    return service;
});

services.factory('datesService', function () {
    var service = {};

    service.getSmallMonth = function (date) {
        switch (date.getMonth()) {
            case 0:
                return "янв";
            case 1:
                return "фев";
            case 2:
                return "мар";
            case 3:
                return "апр";
            case 4:
                return "май";
            case 5:
                return "июн";
            case 6:
                return "июл";
            case 7:
                return "авг";
            case 8:
                return "сен";
            case 9:
                return "окт";
            case 10:
                return "ноя";
            case 11:
                return "дек";
        };
    };

    service.getShortDayOfWeekName = function (dayNumber) {
        switch (dayNumber) {
            case 0:
                return "Вскр";
            case 1:
                return "Пн";
            case 2:
                return "Вт";
            case 3:
                return "Ср";
            case 4:
                return "Чт";
            case 5:
                return "Пт";
            case 6:
                return "Сб";
        };
    };

    service.parseDateToStringSmall = function (date) {
        var date = new Date(date);
        var month = date.getMonth() + 1;
        month < 10 ? month = "0" + month : "";
        var day = date.getDate();
        day < 10 ? day = "0" + day : "";
        return day + '.' + month;
    };

    service.parseDateToStringRussian = function (date) {
        var date = new Date(date);
        var month = date.getMonth() + 1;
        month < 10 ? month = "0" + month : "";
        var day = date.getDate();
        day < 10 ? day = "0" + day : "";
        return day + '.' + month + '.' + date.getFullYear();
    };

    service.parseDateToString = function (date) {
        var date = new Date(date);
        var month = date.getMonth() + 1;
        month < 10 ? month = "0" + month : "";
        var day = date.getDate();
        day < 10 ? day = "0" + day : "";
        return date.getFullYear() + '-' + month + '-' + day;
    };

    service.getTimeStringByDate = function (date) {
        if (date) {
            var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
            var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
            var seconds = "00";
            return hours + ":" + minutes;
        };
        return null;
    };

    service.isEqualDates = function (date1, date2) {
        if (date1, date2) {
            var d1 = new Date(date1);
            var d2 = new Date(date2);
            if (d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate()) {
                return true;
            };
        };
        return false;
    };

    service.isFirstDateBeforeSecondDate = function (date1, date2) {
        if (date1, date2) {
            var d1 = new Date(date1);
            d1.setHours(0);
            d1.setMinutes(0);
            d1.setSeconds(0);
            d1.setMilliseconds(0);
            var d2 = new Date(date2);
            d2.setHours(0);
            d2.setMinutes(0);
            d2.setSeconds(0);
            d2.setMilliseconds(0);
            if (d1.getTime() < d2.getTime()) {
                return true;
            };
        };
        return false;
    };

    service.getDateWithoutTime = function (date) {
        var d = new Date(date);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d;
    };

    service.getPrettyRussianDateStringByDate = function (date) {
        switch (date.getMonth()) {
            case 0:
                return date.getDate() + " января " + date.getFullYear();
            case 1:
                return date.getDate() + " февраля " + date.getFullYear();
            case 2:
                return date.getDate() + " марта " + date.getFullYear();
            case 3:
                return date.getDate() + " апреля " + date.getFullYear();
            case 4:
                return date.getDate() + " мая " + date.getFullYear();
            case 5:
                return date.getDate() + " июня " + date.getFullYear();
            case 6:
                return date.getDate() + " июля " + date.getFullYear();
            case 7:
                return date.getDate() + " августа " + date.getFullYear();
            case 8:
                return date.getDate() + " сентября " + date.getFullYear();
            case 9:
                return date.getDate() + " октября " + date.getFullYear();
            case 10:
                return date.getDate() + " ноября " + date.getFullYear();
            case 11:
                return date.getDate() + " декабря " + date.getFullYear();
        };
    };

    return service;
});

services.filter('orderObjectBy', function () {
    return function (items, field, reverse) {
        var filtered = [];
        var nullObjects = [];

        angular.forEach(items, function (item) {
            if (item[field]) filtered.push(item);
            else nullObjects.push(item);
        });

        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });

        if (reverse) filtered.reverse();

        angular.forEach(nullObjects, function (item) {
            filtered.push(item);
        });

        return filtered;
    };
});

myApp.factory('diagramService', function ($http, $window, $q, $location, $rootScope, $sce, infoService) {

    var service = {};

    service.getDiagram = function () {
        var deferred = $q.defer();
        $http.get(ipAdress + '/api/getDiagram').success(function (response) {
            deferred.resolve(response);
        }).error(function () {
            deferred.reject('Error in getDiagramm in diagramService function');
        });
        return deferred.promise;
    };

    return service;
});

myApp.factory('competitionsService', function ($http, $window, $q, $location, $rootScope, $sce, infoService) {

    var service = {};

    service.getAllCompetitions = function () {
        var deferred = $q.defer();
        $http.get(ipAdress + '/api/getAllCompetitions').success(function (response) {
            deferred.resolve(response);
        }).error(function () {
            deferred.reject('Error in getAllCompetitions in competitionsService function');
        });
        return deferred.promise;
    };

    return service;
});


myApp.factory('hhService', function ($http, $window, $q, $location, $rootScope, $sce, infoService) {

    var service = {};



    service.getVacancies = function (search, page) {
        var deferred = $q.defer();
        $http.get('https://api.hh.ru/vacancies?page=' + page + '&per_page=100&text=' + search).success(function (response) {
            deferred.resolve(response);
        }).error(function () {
            deferred.reject('Error in getDiagramm in hhService function');
        });
        return deferred.promise;
    };


    service.hhSearch = "";
    service.searchList = [];
    service.middleSalary = 0;
    service.countVacancies = 0;
    service.dispersion = 0;
    service.params = [];
    service.getHhParamsByVacancyName = function (vacancyName, program) {
        var deferred = $q.defer();
        service.params = [];
        service.middleSalary = 0;
        service.countVacancies = 0;
        service.dispersion = 0;
        service.searchList = [];
        
        if (vacancyName) {
            service.getHhVacancions(vacancyName, 0, program);
             
                deferred.resolve(service.params)
             
        } else {
            alert("Bad search value")
            deferred.reject('Error in  function');
        }
        return deferred.promise;
    }

    service.calcValues = function (program) {
        service.countVacancies = service.searchList.length;
        service.middleSalary = 0;
        service.salaryCount = 0;
        service.salaryes = [];
        angular.forEach(service.searchList, function (item) {
            if (item.salary) {
                if (item.salary.from && item.salary.to) {
                    service.salaryCount++;
                    var salary = (item.salary.to - item.salary.from) / 2;
                    service.middleSalary += salary;
                    service.salaryes.push(salary)
                } else {
                    if (item.salary.from && !item.salary.to) {
                        service.salaryCount++;
                        service.middleSalary += item.salary.from;
                        service.salaryes.push(item.salary.from);
                    }
                }
            }
        });

        service.middleSalary = service.middleSalary / service.salaryCount;
        var sSquare = 0;
        angular.forEach(service.salaryes, function (salary) {
            sSquare += ((salary - service.middleSalary) * (salary - service.middleSalary));
        });

        service.dispersion = Math.sqrt(sSquare / (service.salaryCount - 1));


        var param1 = {
                key: 'Дисперсия',
                value: service.dispersion.toFixed(2)
            };
          var param2 =  {
                key: 'Средняя зарплата',
                value: service.middleSalary.toFixed(2)
            }; 
              var param3 ={
                key: 'Количество вакансий',
                value: service.countVacancies
            };
        program.params.push(param1)
        program.params.push(param2)
        program.params.push(param3)
        
         
    }
    var maxPageValue = 0;
    service.getHhVacancions = function (search, page, program) {
        service.getVacancies(search, page).then(function (data) {
            if (data && data.items) {
                service.searchList.push.apply(service.searchList, data.items);
                var maxPageValue = 3; //data.pages
                if (data.pages && data.pages > 3) {
                    maxPageValue = 3;
                }
                if (maxPageValue - 1 > page) {
                    page++;
                    service.getHhVacancions(search, page, program);
                } else {
                    service.calcValues(program);
                }
            }
        }, function () {
            service.calcValues(program);
        });
    }

    return service;
});

myApp.factory('grapthService', function ($http, $window, $q, $location, $rootScope, $sce, infoService) {

    var service = {};

    service.getGraphsFunctions = function (search, page) {
        var deferred = $q.defer();
        $http.get(ipAdress + '/api/getGraphsFunctions').success(function (response) {
            deferred.resolve(response);
        }).error(function () {
            deferred.reject('Error in getGraphsFunctions in grapthService function');
        });
        return deferred.promise;
    };

    return service;
});

myApp.factory('programService', function ($http, $window, $q, $location, $rootScope, $sce, infoService) {

    var service = {};


    service.getPrograms = function (search, page) {
        var deferred = $q.defer();
        $http.get(ipAdress + '/api/getPrograms').success(function (response) {
            deferred.resolve(response);
        }).error(function () {
            deferred.reject('Error in getDiagramm in diagramService function');
        });
        return deferred.promise;
    };

    service.getCompetitionList = function () {
        var deferred = $q.defer();
        $http.get(ipAdress + '/api/getCompetitionList').success(function (response) {
            deferred.resolve(response);
        }).error(function () {
            deferred.reject('Error in getCompetitionList in diagramService function');
        });
        return deferred.promise;
    };

    return service;
});

myApp.factory('analyseService', function ($http, $window, $q, $location, $rootScope, $sce, infoService) {

    var service = {};

    service.compareTo = function (url) {
        var deferred = $q.defer();
        $http.post(ipAdress + '/api/executePython', url).success(function (response) {
            deferred.resolve(response);
        }).error(function () {
            deferred.reject('Error in getDiagramm in diagramService function');
        });
        return deferred.promise;
    };

    return service;
});

myApp.factory('userService', function ($http, $window, $q, $location, $rootScope, $sce, infoService) {
    var service = {};

    service.getStudents = function (url) {
        var deferred = $q.defer();
        $http.get(ipAdress + '/api/getStudents').success(function (response) {
            deferred.resolve(response);
        }).error(function () {
            deferred.reject('Error in getStudents in diagramService function');
        });
        return deferred.promise;
    };

    return service;
});


/*

{
  "/posts": {
    "target": "https://example.com",
    "secure": true,
    "pathRewrite": {
    "^/posts": ""
  },
    "changeOrigin": true
  }
}
*/



function findAndReplaceLink(inputText) {
    function indexOf(arr, value, from) {
        for (var i = from || 0, l = (arr || []).length; i < l; i++) {
            if (arr[i] == value) return i;
        }
        return -1;
    }

    function clean(str) {
        return str ? str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;') : '';
    }

    function replaceEntities(str) {
        return se('<textarea>' + ((str || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')) + '</textarea>').value;
    }

    function se(html) {
        return ce('div', {
            innerHTML: html
        }).firstChild;
    }

    function ce(tagName, attr, style) {
        var el = document.createElement(tagName);
        if (attr) extend(el, attr);
        if (style) setStyle(el, style);
        return el;
    }

    function setStyle(elem, name, value) {
        elem = ge(elem);
        if (!elem) return;
        if (typeof name == 'object') return each(name, function (k, v) {
            setStyle(elem, k, v);
        });
        if (name == 'opacity') {
            if (browser.msie) {
                if ((value + '').length) {
                    if (value !== 1) {
                        elem.style.filter = 'alpha(opacity=' + value * 100 + ')';
                    } else {
                        elem.style.filter = '';
                    }
                } else {
                    elem.style.cssText = elem.style.cssText.replace(/filter\s*:[^;]*/gi, '');
                }
                elem.style.zoom = 1;
            };
            elem.style.opacity = value;
        } else {
            try {
                var isN = typeof (value) == 'number';
                if (isN && (/height|width/i).test(name)) value = Math.abs(value);
                elem.style[name] = isN && !(/z-?index|font-?weight|opacity|zoom|line-?height/i).test(name) ? value + 'px' : value;
            } catch (e) {
                debugLog('setStyle error: ', [name, value], e);
            }
        }
    }

    function extend() {
        var a = arguments,
            target = a[0] || {},
            i = 1,
            l = a.length,
            deep = false,
            options;

        if (typeof target === 'boolean') {
            deep = target;
            target = a[1] || {};
            i = 2;
        }

        if (typeof target !== 'object' && !isFunction(target)) target = {};

        for (; i < l; ++i) {
            if ((options = a[i]) != null) {
                for (var name in options) {
                    var src = target[name],
                        copy = options[name];

                    if (target === copy) continue;

                    if (deep && copy && typeof copy === 'object' && !copy.nodeType) {
                        target[name] = extend(deep, src || (copy.length != null ? [] : {}), copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    }
    var replacedText = (inputText || '').replace(/(^|[^A-Za-z0-9А-Яа-яёЁ\-\_])(https?:\/\/)?((?:[A-Za-z\$0-9А-Яа-яёЁ](?:[A-Za-z\$0-9\-\_А-Яа-яёЁ]*[A-Za-z\$0-9А-Яа-яёЁ])?\.){1,5}[A-Za-z\$рфуконлайнстРФУКОНЛАЙНСТ\-\d]{2,22}(?::\d{2,5})?|localhost:[0-9]{1,6}|[A-Za-z0-9]{1,10}:[0-9]{1,6})((?:\/(?:(?:\&amp;|\&#33;|,[_%]|[A-Za-z0-9А-Яа-яёЁ\-\_#%?+\/\$.~=;:]+|\[[A-Za-z0-9А-Яа-яёЁ\-\_#%?+\/\$.,~=;:]*\]|\([A-Za-z0-9А-Яа-яёЁ\-\_#%?+\/\$.,~=;:]*\))*(?:,[_%]|[A-Za-z0-9А-Яа-яёЁ\-\_#%?+\/\$.~=;:]*[A-Za-z0-9А-Яа-яёЁ\_#%?+\/\$~=]|\[[A-Za-z0-9А-Яа-яёЁ\-\_#%?+\/\$.,~=;:]*\]|\([A-Za-z0-9А-Яа-яёЁ\-\_#%?+\/\$.,~=;:]*\)))?)?)/ig,
        function () { // copied to notifier.js:3401
            var matches = Array.prototype.slice.apply(arguments),
                prefix = matches[1] || '',
                protocol = matches[2] || 'http://',
                domain = matches[3] || '',
                url = domain + (matches[4] || ''),
                full = (matches[2] || '') + matches[3] + matches[4];

            if (domain.indexOf('.') == -1 && domain.indexOf(':') == -1 || domain.indexOf('..') != -1 && domain.indexOf(':') == -1) return matches[0];
            var topDomain = domain.split('.').pop();
            if (topDomain.length > 6 || indexOf('info,name,aero,arpa,coop,museum,mobi,travel,xxx,asia,biz,com,net,org,gov,mil,edu,int,tel,ac,ad,ae,af,ag,ai,al,am,an,ao,aq,ar,as,at,au,aw,ax,az,ba,bb,bd,be,bf,bg,bh,bi,bj,bm,bn,bo,br,bs,bt,bv,bw,by,bz,ca,cc,cd,cf,cg,ch,ci,ck,cl,cm,cn,co,cr,cu,cv,cx,cy,cz,de,dj,dk,dm,do,dz,ec,ee,eg,eh,er,es,et,eu,fi,fj,fk,fm,fo,fr,ga,gd,ge,gf,gg,gh,gi,gl,gm,gn,gp,gq,gr,gs,gt,gu,gw,gy,hk,hm,hn,hr,ht,hu,id,ie,il,im,in,io,iq,ir,is,it,je,jm,jo,jp,ke,kg,kh,ki,km,kn,kp,kr,kw,ky,kz,la,lb,lc,li,lk,lr,ls,lt,lu,lv,ly,ma,mc,md,me,mg,mh,mk,ml,mm,mn,mo,mp,mq,mr,ms,mt,mu,mv,mw,mx,my,mz,na,nc,ne,nf,ng,ni,nl,no,np,nr,nu,nz,om,pa,pe,pf,pg,ph,pk,pl,pm,pn,pr,ps,pt,pw,py,qa,re,ro,ru,rs,rw,sa,sb,sc,sd,se,sg,sh,si,sj,sk,sl,sm,sn,so,sr,ss,st,su,sv,sx,sy,sz,tc,td,tf,tg,th,tj,tk,tl,tm,tn,to,tp,tr,tt,tv,tw,tz,ua,ug,uk,um,us,uy,uz,va,vc,ve,vg,vi,vn,vu,wf,ws,ye,yt,yu,za,zm,zw,рф,укр,сайт,онлайн,срб,cat,pro,local'.split(','), topDomain) == -1) {
                if (!/^[a-zA-Z]+$/.test(topDomain) && domain.indexOf(':') == -1 || !matches[2]) {
                    return matches[0];
                }
            }
            if (matches[0].indexOf('@') != -1) {
                return matches[0];
            }
            try {
                full = decodeURIComponent(full);
            } catch (e) {}
            if (full.length > 55) {
                full = full.substr(0, 53) + '..';
            }
            full = clean(full).replace(/&amp;/g, '&');

            url = replaceEntities(url).replace(/([^a-zA-Z0-9#%;:_\-.\/?&=\[\]])/g, encodeURIComponent);
            var tryUrl = url,
                hashPos = url.indexOf('#/');
            if (hashPos >= 0) {
                tryUrl = url.substr(hashPos + 1);
            } else {
                hashPos = url.indexOf('#!');
                if (hashPos >= 0) {
                    tryUrl = '/' + url.substr(hashPos + 2).replace(/^\//, '');
                }
            }
            return prefix + '<a href="' + (protocol + url).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '" target="_blank">' + full + '</a>';
        });
    return replacedText;
};