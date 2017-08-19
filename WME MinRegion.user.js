// ==UserScript==
// @name         WME MinRegion
// @namespace    madnut.ua@gmail.com
// @version      0.1.0
// @description  Retrieves and display city information from MinRegion (Ukraine)
// @author       madnut
// @include      https://*waze.com/*editor*
// @exclude      https://*waze.com/*user/editor*
// @connect      atu.minregion.gov.ua
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @updateURL    https://github.com/madnut-ua/wme_minregion/raw/master/WME%20MinRegion.user.js
// @downloadURL  https://github.com/madnut-ua/wme_minregion/raw/master/WME%20MinRegion.user.js
// @supportURL   https://github.com/madnut-ua/wme_minregion/issues
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    var mrStyle = [
        '.icon-globe:before { content: "\\f0ac"; font-family: FontAwesome; font-style: normal; }',
        '.map-obj-info-wrap { background: #fff; }',
        '.map-obj-info-wrap .label-title { color: #fff; padding: 10px 10px; background: #00A6F2; top: 0; left: 0; width: 100%; }',
        '.map-obj-info-wrap .label-title .close { display: none; }',
        '.map-obj-info-wrap>.content { height: 100%; overflow-y: auto; }',
        '.map-obj-info-wrap .obj-info-caption { color: #4075a9; font-size: 1.0625em; position: relative; }',
        '.map-obj-info-wrap .obj-info-caption .more-info { color: #4075a9; position: absolute; font-size: 10px; text-decoration: none; border-bottom: 1px dashed; line-height: 1; top: 6px; right: 6px; }',
        '.map-obj-info-wrap .obj-info-caption>.accordion-toggle { padding: 4px 65px 6px 35px; line-height: 1; text-decoration: none; font-weight: bold; }',
        '.map-obj-info-wrap .obj-info-caption>.accordion-toggle:after { content: "-"; top: 3px; right: 15px; right: auto; left: 10px; height: 15px; width: 15px; border: 1px solid #99B5D1; text-align: center; color: #99B5D1; line-height: 15px; }',
        '.map-obj-info-wrap .obj-info-caption>.accordion-toggle.collapsed:after { content: "+"; }',
        '.region-accordion-wrap { margin-top: 5px; border: 1px solid #99b5d1; }',

        '.map-obj-info-wrap .info-panel { border-bottom: 1px solid #C3C3C3; }',
        '.map-obj-info-wrap .info-panel.panel-bg1 .info-header a { background: #AB1818; color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg1 .info-header a:after { color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg2 .info-header a { background: #CC631C; color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg2 .info-header a:after { color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg3 .info-header a { background: #84A913; color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg3 .info-header a:after { color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg4 .info-header a { background: #005F00; color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg4 .info-header a:after { color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg5 .info-header a { background: #00A0A0; color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg5 .info-header a:after { color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg6 .info-header a { background: #006486; color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg6 .info-header a:after { color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg7 .info-header a { background: #2489A0; color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg7 .info-header a:after { color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg8 .info-header a { background: #6333AF; color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg8 .info-header a:after { color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg9 .info-header a { background: #03A9F4; color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg9 .info-header a:after { color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg10 .info-header a { background: #009688; color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg10 .info-header a:after { color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg11 .info-header a { background: #FFC107; color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg11 .info-header a:after { color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg11 .info-header a { background: #75A53E; color: #fff; }',
        '.map-obj-info-wrap .info-panel.panel-bg11 .info-header a:after { color: #fff; }',
        '.map-obj-info-wrap .info-panel .info-header a { display: block; text-decoration: none; padding: 0 12px 2px; line-height: 18px; background: #E6E6E6; font-size: 12px; color: #4a4a4a; margin-right: -1px; }',
        '.map-obj-info-wrap .info-panel .accordion-toggle { font-weight: bold; }',
        '.map-obj-info-wrap .info-panel .info-header>.accordion-toggle:after { content: "\\f0d8"; line-height: 20px; top: 0; color: #4a4a4a; }',
        '.map-obj-info-wrap .info-panel .info-header>.accordion-toggle.collapsed:after { content: "\\f0d7"; }',
        '.map-obj-info-wrap .info-panel .info-body { padding: 10px; overflow-y: auto; }',
        '.map-obj-info-wrap .info-panel .info-body.block-max-h { max-height: 200px; }',
        '.map-obj-info-wrap .info-panel .info-body.block-max-h>ul { padding: 0; margin: 0; }',
        '.map-obj-info-wrap .info-panel .info-body.block-max-h>ul>li { list-style: none; }',
        '.map-obj-info-wrap .info-panel .body-gray { background: #f1f1f1; }',
        '.map-obj-info-wrap .info-panel .table>tbody>tr>td { word-break: break-word; }',
        '.map-obj-info-wrap .info-panel .table>tbody>tr>td>a { cursor: pointer; }',
        '.map-obj-info-wrap .info-panel .features { font-size: 11px; }',
        '.map-obj-info-wrap .info-panel .features>tbody>tr>td { padding: 3px 8px; border-color: #b3b3b3; }',
        '.map-obj-info-wrap .info-panel .info-symbols { text-align: center; }',
        '.map-obj-info-wrap .info-panel .info-symbols>div { display: inline-block; width: 50px; }',
        '.map-obj-info-wrap .info-panel .info-symbols>div .img-wrap { line-height: 64px; }',
        '.map-obj-info-wrap .info-panel .info-symbols>div img { margin-bottom: 5px; max-width: 100%; vertical-align: middle; }',
        '.map-obj-info-wrap .info-panel .info-symbols>div div { font-size: 10px; }',
        '.map-obj-info-wrap .info-panel .info-symbols .region-flag { margin-left: 10px; }',

        '.accordion-toggle { color: #555; display: block; line-height: 22px; padding: 9px 35px 9px 20px; position: relative; }',
        '.accordion-toggle:hover,.accordion-toggle.collapsed:hover { background: rgba(0,0,0,0.015); color: #555; text-decoration: none; }',
        '.accordion-toggle:hover:after,.accordion-toggle.collapsed:hover:after { color: #888; }',
        '.accordion-toggle:after { color: #aaa; content: "\\f146"; display: block; font-family: FontAwesome; font-size: 10px; line-height: 36px; position: absolute; top: 3px; right: 15px; }',
        '.accordion-toggle.collapsed { color: #777; }',
        '.accordion-toggle.collapsed:after { content: "\\f0fe"; }',
        '.table { width: 100%; margin-bottom: 18px; }',
        '.table>thead>tr>th,.table>tbody>tr>th,.table>tfoot>tr>th,.table>thead>tr>td,.table>tbody>tr>td,.table>tfoot>tr>td { padding: 8px; line-height: 1.42857143; vertical-align: top; border-top: 1px solid #e4e4e4; }',
        '.table>thead>tr>th { vertical-align: bottom; border-bottom: 2px solid #e4e4e4; }',
        '.table>caption+thead>tr:first-child>th,.table>colgroup+thead>tr:first-child>th,.table>thead:first-child>tr:first-child>th,.table>caption+thead>tr:first-child>td,.table>colgroup+thead>tr:first-child>td,.table>thead:first-child>tr:first-child>td { border-top: 0; }',
        '.table>tbody+tbody { border-top: 2px solid #e4e4e4; }',
        '.table .table { background-color: #fff; }',
        '.table-condensed>thead>tr>th,.table-condensed>tbody>tr>th,.table-condensed>tfoot>tr>th,.table-condensed>thead>tr>td,.table-condensed>tbody>tr>td,.table-condensed>tfoot>tr>td { padding: 5px; }',
        '.table-bordered { border: 1px solid #e4e4e4; }',
        '.table-bordered>thead>tr>th,.table-bordered>tbody>tr>th,.table-bordered>tfoot>tr>th,.table-bordered>thead>tr>td,.table-bordered>tbody>tr>td,.table-bordered>tfoot>tr>td { border: 1px solid #e4e4e4; }',
        '.table-bordered>thead>tr>th,.table-bordered>thead>tr>td { border-bottom-width: 2px; }',
        '.table-striped>tbody>tr:nth-child(odd)>td,.table-striped>tbody>tr:nth-child(odd)>th { background-color: #f9f9f9; }',
        '.table-hover>tbody>tr:hover>td,.table-hover>tbody>tr:hover>th { background-color: #f5f5f5; }',

        '.map-r-objects-list .title { font-size: 1.0625em; margin-bottom: 12px; }',
        '.map-r-objects-list li { list-style: none; }',
        '.map-r-objects-list li>a { display: inline-block; font-size: 11px; color: #2b2b2b; text-decoration: none; line-height: 1; margin-bottom: 4px; cursor: pointer; }',
        '.map-r-objects-list li>a:hover { text-decoration: none; color: #0162a9; }',
        ''];
    GM_addStyle(mrStyle.join('\n'));

    var requestsTimeout = 20000; // in ms
    var mrUrl = "http://atu.minregion.gov.ua";

    function log(message) {
        if (typeof message === 'string') {
            console.log('MinRegion: ' + message);
        } else {
            console.log('MinRegion: ', message);
        }
    }

    function MinRegion_bootstrap() {
        if (typeof Waze === "undefined" ||
            typeof Waze.map === "undefined" ||
            typeof Waze.selectionManager === "undefined" ||
            typeof Waze.model.countries === "undefined" ||
            typeof I18n === "undefined" ||
            typeof I18n.translations === "undefined") {
            setTimeout(MinRegion_bootstrap, 700);
            return;
        }
        MinRegion_init();

        log("started");
    }

    function MinRegion_init() {

        var editPanel = $("#edit-panel");
        if (!editPanel) {
            setTimeout(MinRegion_init, 800);
            return;
        }

        var bordersLayer = new OpenLayers.Layer.Vector("MinRegion City Borders", {
            displayInLayerSwitcher: true,
            uniqueName: "MinRegionBorders"
        });

        Waze.map.addLayer(bordersLayer);

        function drawCityBorder(cityname, gm) {
            bordersLayer.destroyFeatures();
            if (gm) {
                gm.coordinates.forEach(function (itemsA, i, arr) {
                    itemsA.forEach(function (itemsB, j, arr) {
                        var polyPoints = new Array(itemsB.length);
                        itemsB.forEach(function (itemsC, k, arr) {

                            polyPoints[k] = new OpenLayers.Geometry.Point(itemsC[0], itemsC[1]).transform(
                                new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                                Waze.map.getProjectionObject() // to Spherical Mercator Projection
                            );
                        });
                        var polygon = new OpenLayers.Geometry.Polygon(new OpenLayers.Geometry.LinearRing(polyPoints));
                        var site_style = new borderStyle('#FFFF00', cityname);

                        var poly = new OpenLayers.Feature.Vector(polygon, null, site_style);
                        bordersLayer.addFeatures(poly);
                    });
                });
            }
        }

        function borderStyle(color, label) {
            this.fill = false;
            this.stroke = true;
            this.strokeColor = color;
            this.strokeWidth = 3;
            this.label = label;
            this.fontSize = 20;
            this.fontColor = color;
            this.fontWeight = "bold";
        }

        function drawTab() {
            var panelID = "WME-MinRegion";
            var sItems = Waze.selectionManager.selectedItems;

            if (!document.getElementById(panelID) && sItems.length > 0 && sItems[0].model.type === 'segment') {
                var panelElement = document.createElement('div');
                panelElement.id = panelID;

                var userTabs = document.getElementById('edit-panel');
                if (!userTabs) {
                    return;
                }

                var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
                if (typeof navTabs !== "undefined") {
                    var tabContent = getElementsByClassName('tab-content', userTabs)[0];

                    if (typeof tabContent !== "undefined") {
                        var newtab = document.createElement('li');
                        newtab.innerHTML = '<a href="#' + panelID + '" id="minregionTab" data-toggle="tab">MinRegion</a>';
                        navTabs.appendChild(newtab);

                        var html =
                            '<h4>MinRegion <sup>' + GM_info.script.version + '</sup></h4>' +
                            '</br>' +
                            '<div class="form-group">' +
                            // check name in MinRegion
                            '<div class="controls">' +
                            '<button id="minregionCheckInMinRegion" class="action-button btn btn-lightning btn-positive" type="button" title="Перевіртити інформацію на сайті МінРегіону">' +
                            '<i class="fa fa-map-o"></i>&nbsp;Отримати інформацію' +
                            '</button>' +
                            '</div>' +
                            '</div>' +
                            // info
                            '<div class="form-group">' +
                            '<div style="float:right; z-index:100; cursor:pointer; top:0; right:0;" id="minregionClearInfo" title="Очистити дані"><i class="fa fa-times-circle fa-lg" aria-hidden="true"></i></div>' +
                            '<label class="control-label">Об\'єкт</label>' +
                            '<div class="controls input-group">' +
                            '<input class="form-control" autocomplete="off" id="minregionFoundCity" name="" title="Знайдений об\'єкт" type="text" value="N/A" readonly="readonly" />' +
                            '<span class="input-group-btn">' +
                            '<button id="minregionCopyFoundCity" class="btn btn-primary" type="button" data-original-title="" title="Скопіювати у буфер обміну" style="padding: 0 8px; border-bottom-left-radius: 0; border-top-left-radius: 0; font-size: 16px">' +
                            '<i class="fa fa-clipboard"></i>' +
                            '</button>' +
                            '</span>' +
                            '</div>' +
                            '</div>' +
                            '<div id="minregionInfo" class="map-obj-info-wrap">' +
                            '</div>';

                        panelElement.innerHTML = html;
                        panelElement.className = "tab-pane";
                        tabContent.appendChild(panelElement);
                    } else {
                        panelElement.id = '';
                    }
                } else {
                    panelElement.id = '';
                }

                if (panelElement.id !== '') {
                    document.getElementById('minregionCheckInMinRegion').onclick = onCheckMinRegion;
                    document.getElementById('minregionCopyFoundCity').onclick = function () {
                        var cityName = document.getElementById('minregionFoundCity').value;
                        if (cityName !== '' && cityName !== 'N/A') {
                            GM_setClipboard(cityName);
                        }
                        return false;
                    };

                    document.getElementById('minregionClearInfo').onclick = function () {
                        updateMinRegionInfo();
                        return false;
                    };
                }
            }
        }

        function setButtonClass(id, className) {
            if (id) {
                var iButton = document.getElementById(id).firstChild;
                if (iButton && iButton.className !== className) {
                    iButton.className = className;
                }
            }
        }

        function getSelectedSegmentLink() {
            var lnk;
            var selectedItem = Waze.selectionManager.selectedItems[0];
            if (selectedItem) {
                log("MinRegion check by object Centroid");

                var centroid = selectedItem.geometry.getCentroid(true); // without "true" it will return start point as a centroid
                lnk = OpenLayers.Layer.SphericalMercator.inverseMercator(centroid.x, centroid.y);
            } else {
                log("no selected item found");
            }
            return lnk;
        }

        function getIdIntersectCallback(res) {
            var url;
            if (res.status == 200) {
                //TODO validation for dead MinRegion
                var isCityFound = res.responseText.match(/#regionInfo(\d+)/);
                if (isCityFound) {
                    url = mrUrl + "/api/format/settlement_template/ato.ato_all_city/atoid/" + isCityFound[1] + "/obl_name,ray_name,nameua,name_fullua,wkb_geometry,atoid,parent_level1,parent_level2,parent_level3,info_json";
                    sendHTTPRequest(url, 'minregionCheckInMinRegion', 'fa fa-map-o', getInfoCallback);
                }
                else {
                    log("No city ID found");
                    log(res.responseText);
                }
            }
            else if (res.status == 500) {
                log(res.responseText);
                var lnk = getSelectedSegmentLink();
                if (lnk) {
                    log("No intersection found, trying 'contains' method...");
                    url = mrUrl + "/api/format/list_ato_template/ato.ato_all_city/wkb_geometry~'POINT(" + lnk.lon + "%20" + lnk.lat + ")'";
                    sendHTTPRequest(url, 'minregionCheckInMinRegion', 'fa fa-map-o', getIdContainsCallback);
                }
            }
            else {
                log(res.responseText);
            }
        }

        function getIdContainsCallback(res) {
            if (res.status == 200) {
                //TODO validation for dead MinRegion
                var isCityFound = res.responseText.match(/#regionInfo(\d+)/);
                if (isCityFound) {
                    var url = mrUrl + "/api/format/settlement_template/ato.ato_all_city/atoid/" + isCityFound[1] + "/obl_name,ray_name,nameua,name_fullua,wkb_geometry,atoid,parent_level1,parent_level2,parent_level3,info_json";
                    sendHTTPRequest(url, 'minregionCheckInMinRegion', 'fa fa-map-o', getInfoCallback);
                }
            }
            else if (res.status == 500) {
                log(res.responseText);
                if (res.responseText == 'undefined object not found') {
                    var html = "<span style='color: orangered; font-weight: bold;'>Жодного населеного пункта не знайдено.</span>";
                    document.getElementById('minregionInfo').innerHTML = html;
                }
            }
            else {
                log(res.responseText);
            }
        }

        function getInfoCallback(res) {
            if (validateHTTPResponse(res)) {
                var text = JSON.parse(res.responseText);

                updateMinRegionInfo(text);
            }
        }

        function onCheckMinRegion() {
            var emptyResponse = {};
            var lnk = getSelectedSegmentLink();

            if (lnk) {
                updateMinRegionInfo(emptyResponse);

                var url = mrUrl + "/api/format/list_ato_template/ato.ato_all_city/wkb_geometry&&&&'POINT(" + lnk.lon + "%20" + lnk.lat + ")'";
                sendHTTPRequest(url, 'minregionCheckInMinRegion', 'fa fa-map-o', getIdIntersectCallback);
            }
        }

        function sendHTTPRequest(url, buttonID, btnClass, callback) {
            setButtonClass(buttonID, 'fa fa-spinner fa-pulse'); // to make ViolentMonkey happy
            GM_xmlhttpRequest({
                url: url,
                method: 'GET',
                timeout: requestsTimeout,
                onload: function (res) {
                    setButtonClass(buttonID, btnClass);
                    if (callback) {
                        callback(res);
                    }
                },
                onreadystatechange: function (res) {
                    setButtonClass(buttonID, 'fa fa-spinner fa-pulse');
                },
                ontimeout: function (res) {
                    setButtonClass(buttonID, btnClass);
                    alert("Sorry, request timeout!");
                },
                onerror: function (res) {
                    setButtonClass(buttonID, btnClass);
                    alert("Sorry, request error!");
                }
            });
        }

        function validateHTTPResponse(res) {
            var result = false,
                displayError = true,
                errorMsg;
            if (res) {
                switch (res.status) {
                    case 200:
                        displayError = false;
                        if (res.responseHeaders.match(/content-type: application\/json/i)) {
                            result = true;
                        } else if (res.responseHeaders.match(/content-type: text\/html/i)) {
                            displayHtmlPage(res);
                        }
                        break;
                    case 404:
                        errorMsg = "Інформацію не знайдено!";
                        break;
                    default:
                        errorMsg = "Error: unsupported status code - " + res.status;
                        log(res.responseHeaders);
                        log(res.responseText);
                        break;
                }
            } else {
                errorMsg = "Error: Response is empty!";
            }

            if (displayError) {
                if (!errorMsg) {
                    errorMsg = "Error processing request. Response: " + res.responseText;
                }
                alert(errorMsg);
            }
            return result;
        }

        function updateMinRegionInfo(rs) {
            if (rs && rs.data) {
                document.getElementById('minregionFoundCity').value = rs.data.name_fullua;

                var fixedContent = rs.html.replace("<a/>", "</a>"); // bug in MinRegion
                fixedContent = fixedContent.replace(/<\/td>[\n\r\s]*<\/td>/g, "</td>"); // bug in MinRegion
                fixedContent = fixedContent.replace(/icon-globe('|")\/>/g, "icon-globe$1></i>"); // bug in MinRegion
                fixedContent = fixedContent.replace(/(href|src)="\//g, "$1=\"" + mrUrl + "/"); // relative links to absolute

                document.getElementById('minregionInfo').innerHTML = fixedContent;

                var as = document.querySelectorAll("a[map-action=getInfo]");
                as.forEach(function (elem) {
                    var obj = elem.attributes.obj;
                    if (obj && obj.value) {
                        elem.onclick = function () {
                            var url = mrUrl + obj.value.replace("doc=", "");
                            sendHTTPRequest(url, 'minregionCheckInMinRegion', 'fa fa-map-o', getInfoCallback);
                        };
                    }
                });

                // draw border
                drawCityBorder(rs.data.name_fullua, rs.data.wkb_geometry);
            } else {
                document.getElementById('minregionFoundCity').value = 'N/A';
                document.getElementById('minregionInfo').innerHTML = '';

                drawCityBorder(null, null);
            }
        }

        function displayHtmlPage(res) {
            var w = window.open();
            w.document.open();
            w.document.write(res.responseText);
            w.document.close();
            //if (res.responseText.match(/ServiceLogin/)) {
            //    w.location = res.finalUrl;
            //}
        }

        function getElementsByClassName(classname, node) {
            if (!node)
                node = document.getElementsByTagName("body")[0];
            var a = [];
            var re = new RegExp('\\b' + classname + '\\b');
            var els = node.getElementsByTagName("*");
            for (var i = 0, j = els.length; i < j; i++)
                if (re.test(els[i].className))
                    a.push(els[i]);
            return a;
        }

        // add listener for tab changes
        var panelObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var addedNode = mutation.addedNodes[i];

                    if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.querySelector('div.selection')) {
                        drawTab();
                    }
                }
            });
        });
        panelObserver.observe(document.getElementById('edit-panel'), {
            childList: true,
            subtree: true
        });

        // need to call in case if it's permalink
        drawTab();
    }
    setTimeout(MinRegion_bootstrap, 3000);
})();
